const messages = [
  '運命を読み取っています…',
  'あなたの内面を解析中…',
  '診断結果を整えています…',
];

type LoadingMessageProps = {
  step: number;
};

export function LoadingMessage({ step }: LoadingMessageProps) {
  return (
    <section className="panel loading-panel">
      <div className="constellation constellation-a" />
      <div className="constellation constellation-b" />
      <div className="loading-glitch" />
      <div className="orbital">
        <div className="sigil-ring sigil-ring-a" />
        <div className="sigil-ring sigil-ring-b" />
        <div className="orbital-ring orbital-ring-a" />
        <div className="orbital-ring orbital-ring-b" />
        <div className="orbital-core" />
      </div>
      <p className="loading-kicker">FORTUNE READING</p>
      <h2 className="section-title">{messages[step]}</h2>
      <p className="loading-note">回答内容から、現在の運勢バランスと傾向をまとめています。</p>
    </section>
  );
}
