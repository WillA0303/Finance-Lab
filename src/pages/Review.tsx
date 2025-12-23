import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAppContext } from '../App';
import { findQuestion } from '../lib/content';

export default function Review() {
  const { state, content } = useAppContext();
  const session = state.lastSession;

  if (!session) {
    return (
      <div className="stack">
        <h2>Review</h2>
        <p>No recent session to review yet.</p>
        <Link to="/mode">
          <Button>Start a session</Button>
        </Link>
      </div>
    );
  }

  const missed = session.questionResults.filter((result) => !result.correct);

  return (
    <div className="stack">
      <h2>Last session review</h2>
      <p className="muted">
        {missed.length === 0
          ? 'Perfect score!'
          : `You missed ${missed.length} question${missed.length === 1 ? '' : 's'}.`}
      </p>
      {missed.length === 0 && (
        <Link to="/mode">
          <Button>Start another session</Button>
        </Link>
      )}
      <div className="stack">
        {missed.map((result) => {
          const question = findQuestion(content, result.questionId);
          if (!question) return null;
          return (
            <Card key={result.questionId} title={question.prompt}>
              {question.scenarioContext && <p className="pill pill--soft">{question.scenarioContext}</p>}
              <p className="muted">Your answer: {String(result.userAnswer)}</p>
              <p className="muted">Correct answer: {String(result.correctAnswer)}</p>
              <p>{question.explanation}</p>
              {question.inPractice && <p className="note">In practice: {question.inPractice}</p>}
              {question.examTip && <p className="note">Exam tip: {question.examTip}</p>}
            </Card>
          );
        })}
      </div>
      <div className="hero__actions">
        <Link to="/mode">
          <Button>Start new session</Button>
        </Link>
        <Link to="/progress">
          <Button variant="secondary">View progress</Button>
        </Link>
      </div>
    </div>
  );
}