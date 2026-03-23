type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-shell" aria-label={`進捗 ${current}/${total}`}>
      <div className="progress-meta">
        <span>{`Q${current} / ${total}`}</span>
        <span>{`${Math.round(percentage)}%`}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
