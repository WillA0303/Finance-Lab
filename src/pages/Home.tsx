import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAppContext } from '../App';

export default function Home() {
  const { state } = useAppContext();
  const continuePath = state.lastSession ? '/review' : '/mode';

  return (
    <div className="stack">
      <section className="hero">
        <h1>Build finance & accounting confidence.</h1>
        <p>
          Short, focused sessions aligned with ACA fundamentals. Learn core concepts, then apply them
          in practice.
        </p>
        <div className="hero__stats">
          <Card title="Total XP">
            <p className="stat">{state.xpTotal}</p>
          </Card>
          <Card title="Current Streak">
            <p className="stat">{state.streakCount} days</p>
          </Card>
        </div>
        <div className="hero__actions">
          <Link to={continuePath}>
            <Button>Continue</Button>
          </Link>
          <Link to="/mode">
            <Button variant="secondary">Start new session</Button>
          </Link>
        </div>
      </section>

      <section className="grid">
        <Card title="Progress">
          <p>Track stars, weak areas, and your study streak.</p>
          <Link to="/progress">
            <Button variant="ghost">View dashboard</Button>
          </Link>
        </Card>
        <Card title="How it works">
          <p>Two modes, bite-size sessions, and instant explanations.</p>
          <Link to="/about">
            <Button variant="ghost">About Finance Lab</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}