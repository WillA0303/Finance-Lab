import Card from '../components/Card';

interface ErrorPageProps {
  message: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
  return (
    <Card title="Content error">
      <p>{message}</p>
      <p>Please check content.json for formatting issues.</p>
    </Card>
  );
}