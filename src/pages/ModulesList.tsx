import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAppContext } from '../App';
import { Mode } from '../types/state';

export default function ModulesList() {
  const { mode } = useParams();
  const { content } = useAppContext();

  if (mode !== 'learn' && mode !== 'practice') {
    return <p>Mode not found.</p>;
  }

  return (
    <div className="stack">
      <h2>{mode === 'learn' ? 'Learn modules' : 'In Practice modules'}</h2>
      <div className="stack">
        {content.modules.map((module) => (
          <Card key={module.id} title={module.title}>
            <p>{module.description}</p>
            <Link to={`/module/${mode}/${module.id}`}>
              <Button>View skills</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}