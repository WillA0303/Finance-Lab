import Card from '../components/Card';
import { useAppContext } from '../App';

function Stars({ count }: { count: number }) {
  return (
    <div className="stars" aria-label={`${count} stars`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <span key={index} className={index < count ? 'star star--filled' : 'star'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Progress() {
  const { content, state } = useAppContext();

  return (
    <div className="stack">
      <h2>Progress dashboard</h2>
      <div className="grid">
        <Card title="Total XP">
          <p className="stat">{state.xpTotal}</p>
        </Card>
        <Card title="Current streak">
          <p className="stat">{state.streakCount} days</p>
        </Card>
        <Card title="Weak questions">
          <p className="stat">{state.weakQuestionIds.length}</p>
        </Card>
      </div>

      <div className="stack">
        {content.modules.map((module) => (
          <Card key={module.id} title={module.title}>
            <div className="stack">
              {module.skills.map((skill) => {
                const progress = state.modules[module.id]?.skills[skill.id];
                const learnStars = progress?.learn.stars ?? 0;
                const practiceStars = progress?.practice.stars ?? 0;
                return (
                  <div key={skill.id} className="progress-row">
                    <div>
                      <p className="progress-row__title">{skill.title}</p>
                      <p className="muted">Sessions: {progress?.learn.sessionsCompleted ?? 0} learn · {progress?.practice.sessionsCompleted ?? 0} practice</p>
                    </div>
                    <div className="progress-row__stars">
                      <div>
                        <span className="muted">Learn</span>
                        <Stars count={learnStars} />
                      </div>
                      <div>
                        <span className="muted">Practice</span>
                        <Stars count={practiceStars} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}