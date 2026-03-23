import { typeLabels } from '../data/resultTemplates';
import type { FortuneResult } from '../types/result';

type ResultCardProps = {
  result: FortuneResult;
  storageMessage: string | null;
  onCopy: () => void;
  onRestart: () => void;
};

export function ResultCard({ result, storageMessage, onCopy, onRestart }: ResultCardProps) {
  return (
    <section className="panel result-panel">
      <div className="result-halo result-halo-a" />
      <div className="result-halo result-halo-b" />
      <div className="result-head">
        <div className="eyebrow">{`${typeLabels[result.primaryType]} × ${typeLabels[result.secondaryType]}`}</div>
        <h2 className="result-title">{result.title}</h2>
        <p className="result-summary">{result.summary}</p>
      </div>

      <div className="result-grid">
        <article className="result-section reveal reveal-1">
          <h3>恋愛運</h3>
          <p>{result.love}</p>
        </article>
        <article className="result-section reveal reveal-2">
          <h3>仕事運</h3>
          <p>{result.work}</p>
        </article>
        <article className="result-section reveal reveal-3">
          <h3>金運</h3>
          <p>{result.money}</p>
        </article>
        <article className="result-section reveal reveal-4">
          <h3>人間関係運</h3>
          <p>{result.relationship}</p>
        </article>
      </div>

      <article className="result-section final-section reveal reveal-5">
        <h3>明日への一言</h3>
        <p>{result.finalMessage}</p>
      </article>

      <article className="result-section extra-section reveal reveal-6">
        <h3>補足メッセージ</h3>
        <p>{result.extraComment}</p>
      </article>

      {storageMessage ? <p className="warning-text">{storageMessage}</p> : null}

      <div className="action-row">
        <button className="ghost-button" onClick={onCopy}>
          結果をコピーする
        </button>
        <button className="primary-button" onClick={onRestart}>
          もう一度診断する
        </button>
      </div>
    </section>
  );
}
