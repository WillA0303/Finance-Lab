import Card from '../components/Card';

export default function About() {
  return (
    <div className="stack">
      <h2>About Finance Lab</h2>
      <Card>
        <p>
          Finance Lab is a lightweight learning app focused on finance and accounting fundamentals
          with an ACA-relevant framing. It is designed for short, repeatable sessions that build
          confidence with concepts, then apply them to realistic mini-scenarios.
        </p>
        <p>
          The content is original and does not use proprietary question banks. It is intended as a
          learning aid, not as a substitute for official study materials.
        </p>
      </Card>
    </div>
  );
}