import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="stack">
      <h2>Page not found</h2>
      <p>We couldn't find that page.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}