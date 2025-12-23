import { Link } from 'react-router-dom';

interface TopBarProps {
  xpTotal: number;
  streakCount: number;
}

export default function TopBar({ xpTotal, streakCount }: TopBarProps) {
  return (
    <header className="top-bar">
      <Link to="/" className="brand">
        Finance Lab
      </Link>
      <div className="top-bar__stats" aria-label="XP and streak">
        <span className="pill">XP {xpTotal}</span>
        <span className="pill">🔥 {streakCount}</span>
      </div>
    </header>
  );
}