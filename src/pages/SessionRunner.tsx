import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';
import { findModule, findSkill } from '../lib/content';
import { selectSessionQuestions } from '../lib/selection';
import { computeStars, computeStreak, computeXp } from '../lib/scoring';
import { updateSkillProgress, updateWeakQuestions } from '../lib/storage';
import { Question } from '../types/content';
import { Mode, QuestionResult } from '../types/state';

function isCorrectNumeric(userInput: number, answer: number, tolerance?: number): boolean {
  const diff = Math.abs(userInput - answer);
  if (typeof tolerance === 'number') {
    return diff <= tolerance;
  }
  return diff === 0;
}

export default function SessionRunner() {
  const { mode, moduleId, skillId } = useParams();
  const navigate = useNavigate();
  const { content, state, setState } = useAppContext();
  const startedAt = useRef(new Date());

  if (mode !== 'learn' && mode !== 'practice') {
    return <p>Mode not found.</p>;
  }

  const module = moduleId ? findModule(content, moduleId) : undefined;
  const skill = module && skillId ? findSkill(module, skillId) : undefined;

  if (!module || !skill) {
    return <p>Session not found.</p>;
  }

  const sessionLength = useMemo(() => (Math.random() < 0.5 ? 7 : 8), []);

  const questionPool = useMemo(() => {
    return skill.questions.filter((question) =>
      mode === 'learn'
        ? question.mode === 'learn' || question.mode === 'both'
        : question.mode === 'practice' || question.mode === 'both',
    );
  }, [mode, skill.questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerValue, setAnswerValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);

  const sessionKey = `${mode}:${module.id}:${skill.id}`;
  const sessionKeyRef = useRef(sessionKey);

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() =>
    selectSessionQuestions(questionPool, state.weakQuestionIds, sessionLength),
  );

  useEffect(() => {
    if (sessionKeyRef.current !== sessionKey) {
      sessionKeyRef.current = sessionKey;
      startedAt.current = new Date();

      setCurrentIndex(0);
      setAnswerValue('');
      setSelectedOption('');
      setResults([]);
      setShowFeedback(false);
      setError('');
      setSessionComplete(false);

      setSessionQuestions(selectSessionQuestions(questionPool, state.weakQuestionIds, sessionLength));
    }
  }, [sessionKey, questionPool, sessionLength, state.weakQuestionIds]);

  const question = sessionQuestions[currentIndex];

  const shuffledOptions = useMemo(() => {
    if (!question || question.type !== 'mcq' || !question.options) return [];
    const copy = [...question.options];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }, [question?.id]);

  const handleExit = () => {
    const confirmExit = window.confirm('Exit the session? Your progress in this session will be lost.');
    if (confirmExit) {
      navigate(`/module/${mode}/${module.id}`);
    }
  };

  if (!question) {
    return <p>No questions available for this skill and mode.</p>;
  }

  const handleSubmit = () => {
    setError('');
    let correct = false;
    let userAnswer: string | number = '';

    if (question.type === 'mcq') {
      if (!selectedOption) {
        setError('Select an option to continue.');
        return;
      }
      userAnswer = selectedOption;
      correct = selectedOption === question.answer;
    } else {
      const numeric = Number(answerValue);
      if (Number.isNaN(numeric)) {
        setError('Enter a valid number.');
        return;
      }
      userAnswer = numeric;
      correct = isCorrectNumeric(numeric, Number(question.answer), question.numericTolerance);
    }

    const result: QuestionResult = {
      questionId: question.id,
      correct,
      userAnswer,
      correctAnswer: question.answer,
    };

    setResults((prev) => [...prev, result]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setAnswerValue('');
    setSelectedOption('');

    if (currentIndex + 1 >= sessionQuestions.length) {
      const completedAt = new Date();

      const score = results.length > 0 ? results.filter((r) => r.correct).length / results.length : 0;
      const xpGained = computeXp(results);

      const { streakCount, lastCompletedDate } = computeStreak(
        state.streakCount,
        state.lastCompletedDate,
        completedAt,
      );

      const wrongIds = results.filter((r) => !r.correct).map((r) => r.questionId);
      const correctIds = results.filter((r) => r.correct).map((r) => r.questionId);

      let updatedState = updateSkillProgress(state, module.id, skill.id, mode as Mode, score);
      updatedState = updateWeakQuestions(updatedState, wrongIds, correctIds);

      updatedState = {
        ...updatedState,
        xpTotal: updatedState.xpTotal + xpGained,
        streakCount,
        lastCompletedDate,
        lastSession: {
          mode: mode as Mode,
          moduleId: module.id,
          skillId: skill.id,
          startedAtISO: startedAt.current.toISOString(),
          completedAtISO: completedAt.toISOString(),
          questionResults: results,
        },
      };

      setState(updatedState);
      setSessionComplete(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  if (sessionComplete) {
    const correctCount = results.filter((r) => r.correct).length;
    const scorePercent = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
    const stars = results.length > 0 ? computeStars(correctCount / results.length) : 0;

    return (
      <div className="stack">
        <h2>Session complete!</h2>
        <Card>
          <p className="stat">
            Score: {correctCount} / {results.length} ({scorePercent}%)
          </p>
          <p className="stat">Stars earned: {stars} ★</p>
          <p className="stat">XP gained: {computeXp(results)}</p>
        </Card>
        <Card title="Review missed questions">
          {results.filter((r) => !r.correct).length === 0 ? (
            <p>Perfect score! No missed questions.</p>
          ) : (
            <p>Review your missed questions to strengthen weak areas.</p>
          )}
          <div className="hero__actions">
            <Link to="/review">
              <Button>View review</Button>
            </Link>
            <Link to={`/module/${mode}/${module.id}`}>
              <Button variant="secondary">Back to skills</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const progressPercent = Math.round(
    ((currentIndex + (showFeedback ? 1 : 0)) / sessionQuestions.length) * 100,
  );

  return (
    <div className="stack">
      <div className="session-header">
        <div>
          <h2>{skill.title}</h2>
          <p className="muted">{mode === 'learn' ? 'Learn mode' : 'In Practice mode'}</p>
        </div>
        <Button variant="ghost" onClick={handleExit} aria-label="Exit session">
          Exit session
        </Button>
      </div>

      <ProgressBar value={progressPercent} />

      <Card>
        {question.scenarioContext && <p className="pill pill--soft">{question.scenarioContext}</p>}
        <h3>{question.prompt}</h3>

        {question.type === 'mcq' ? (
          <div className="option-group" role="radiogroup" aria-label="Answer options">
            {shuffledOptions.map((option) => (
              <label
                key={option.id}
                className={`option ${selectedOption === option.id ? 'option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                />
                {option.text}
              </label>
            ))}
          </div>
        ) : (
          <div className="input-group">
            <label htmlFor="numeric-answer">Your answer</label>
            <input
              id="numeric-answer"
              type="number"
              inputMode="decimal"
              value={answerValue}
              onChange={(event) => setAnswerValue(event.target.value)}
            />
          </div>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {!showFeedback && <Button onClick={handleSubmit}>Check answer</Button>}
      </Card>

      {showFeedback && (
        <Card className="feedback">
          <p
            className={`feedback__result ${
              results[results.length - 1]?.correct ? 'correct' : 'incorrect'
            }`}
          >
            {results[results.length - 1]?.correct ? 'Correct!' : 'Not quite'}
          </p>

          <p className="muted">
            Correct answer:{' '}
            {question.type === 'mcq'
              ? shuffledOptions.find((option) => option.id === question.answer)?.text ??
                question.options?.find((option) => option.id === question.answer)?.text
              : question.answer}
          </p>

          <p>{question.explanation}</p>
          {question.inPractice && <p className="note">In practice: {question.inPractice}</p>}
          {question.examTip && <p className="note">Exam tip: {question.examTip}</p>}

          <Button onClick={handleNext}>Next</Button>
        </Card>
      )}
    </div>
  );
}
