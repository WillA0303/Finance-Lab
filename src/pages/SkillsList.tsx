import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAppContext } from '../App';
import { findModule } from '../lib/content';
import { Mode } from '../types/state';

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

export default function SkillsList() {
  const { mode, moduleId } = useParams();
  const { content, state } = useAppContext();

  if (mode !== 'learn' && mode !== 'practice') {
    return <p>Mode not found.</p>;
  }

  const module = moduleId ? findModule(content, moduleId) : undefined;
  if (!module) {
    return <p>Module not found.</p>;
  }

  return (
    <div className="stack">
      <h2>{module.title}</h2>
      <p>{module.description}</p>
      <div className="stack">
        {module.skills.map((skill) => {
          const progress = state.modules[module.id]?.skills[skill.id]?.[mode as Mode];
          return (
            <Card key={skill.id} title={skill.title}>
              <p>{skill.description}</p>
              <div className="skill-meta">
                <Stars count={progress?.stars ?? 0} />
                <span>{progress?.sessionsCompleted ?? 0} sessions</span>
              </div>
              <Link to={`/session/${mode}/${module.id}/${skill.id}`}>
                <Button>Start session</Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}