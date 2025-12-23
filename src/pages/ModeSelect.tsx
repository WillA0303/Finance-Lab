import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

export default function ModeSelect() {
  return (
    <div className="stack">
      <h2>Select a mode</h2>
      <div className="grid">
        <Card title="Learn">
          <p>Definitions and focused questions to build foundation knowledge.</p>
          <Link to="/modules/learn">
            <Button>Choose Learn</Button>
          </Link>
        </Card>
        <Card title="In Practice">
          <p>Mini-scenarios that map concepts to realistic decisions.</p>
          <Link to="/modules/practice">
            <Button>Choose In Practice</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}