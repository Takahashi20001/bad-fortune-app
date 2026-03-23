import { useState } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { LoadingMessage } from './components/LoadingMessage';
import { ResultCard } from './components/ResultCard';
import { useAppAudio } from './hooks/useAppAudio';
import { useQuiz } from './hooks/useQuiz';

const shareCopy = (text: string) => {
  return navigator.clipboard.writeText(text);
};

function App() {
  const {
    phase,
    currentIndex,
    currentQuestion,
    questions,
    answers,
    result,
    history,
    loadingStep,
    storageMessage,
    startQuiz,
    goHome,
    goToHistory,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    restartQuiz,
  } = useQuiz();
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const { unlockAudio, playClick } = useAppAudio(phase);

  const handleCopy = async () => {
    if (!result) {
      return;
    }

    const text = [
      '【運勢診断結果】',
      result.title,
      result.summary,
      `恋愛運: ${result.love}`,
      `仕事運: ${result.work}`,
      `金運: ${result.money}`,
      `人間関係運: ${result.relationship}`,
      `明日への一言: ${result.finalMessage}`,
      `追い打ちコメント: ${result.extraComment}`,
    ].join('\n');

    try {
      playClick();
      await shareCopy(text);
      setCopyMessage('結果テキストをコピーしました。');
    } catch {
      setCopyMessage('コピーに失敗しました。ブラウザ設定を確認してください。');
    }

    window.setTimeout(() => setCopyMessage(null), 2400);
  };

  return (
    <div className="app-shell">
      <div className="background-aurora background-aurora-a" />
      <div className="background-aurora background-aurora-b" />
      <div className="background-stars" />
      <div className="background-noise" />
      <main className="app-frame">
        <header className="hero-card">
          <div className="hero-sigil hero-sigil-a" />
          <div className="hero-sigil hero-sigil-b" />
          <p className="hero-badge">FORTUNE READING / PERSONAL INSIGHT</p>
          <h1>Luna Fortune</h1>
          <p className="hero-copy">10の質問から、今の運勢と傾向を読み解きます。</p>
          <p className="hero-note">
            日常の感覚や考え方をもとに、恋愛運・仕事運・金運・人間関係運を診断できます。
          </p>
        </header>

        {phase === 'home' ? (
          <section className="panel home-panel">
            <div className="home-copy">
              <p>
                直感で答えながら、今のあなたに近い運勢傾向をチェックできます。
                質問は全10問、1問ずつテンポよく進められるシンプルな診断です。
              </p>
            </div>
            <div className="feature-grid">
              <div className="feature-card">
                <span>10 Questions</span>
                <p>性格・人間関係・決断傾向をもとに今の状態を読み解きます。</p>
              </div>
              <div className="feature-card">
                <span>4 Reading Types</span>
                <p>回答傾向から、今の運気バランスを4つの軸で分析します。</p>
              </div>
              <div className="feature-card">
                <span>Share Ready</span>
                <p>結果文はコピーでき、診断内容も毎回少しずつ表現が変わります。</p>
              </div>
            </div>
            <div className="action-row">
              <button
                className="ghost-button"
                onClick={() => {
                  playClick();
                  unlockAudio();
                  goToHistory();
                }}
              >
                履歴を見る
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  playClick();
                  unlockAudio();
                  startQuiz();
                }}
              >
                診断を始める
              </button>
            </div>
          </section>
        ) : null}

        {phase === 'quiz' && currentQuestion ? (
          <>
            <ProgressBar current={currentIndex + 1} total={questions.length} />
            <QuestionCard
              question={currentQuestion}
              selectedOptionId={answers[currentQuestion.id]}
              animationKey={currentQuestion.id}
              onSelect={(optionId) => {
                playClick();
                unlockAudio();
                selectAnswer(currentQuestion.id, optionId);
              }}
            />
            <div className="action-row quiz-actions">
              <button
                className="ghost-button"
                onClick={() => {
                  playClick();
                  previousQuestion();
                }}
                disabled={currentIndex === 0}
              >
                前へ
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  playClick();
                  nextQuestion();
                }}
                disabled={!answers[currentQuestion.id]}
              >
                {currentIndex === questions.length - 1 ? '診断結果を見る' : '次へ'}
              </button>
            </div>
          </>
        ) : null}

        {phase === 'loading' ? <LoadingMessage step={loadingStep} /> : null}

        {phase === 'result' && result ? (
          <>
            <ResultCard
              result={result}
              storageMessage={storageMessage}
              onCopy={handleCopy}
              onRestart={() => {
                playClick();
                restartQuiz();
              }}
            />
            {copyMessage ? <p className="copy-toast">{copyMessage}</p> : null}
          </>
        ) : null}

        {phase === 'history' ? (
          <section className="panel history-panel">
            <div className="history-head">
              <div>
                <div className="eyebrow">HISTORY</div>
                <h2 className="section-title">過去の診断履歴</h2>
              </div>
              <button
                className="ghost-button"
                onClick={() => {
                  playClick();
                  goHome();
                }}
              >
                トップへ戻る
              </button>
            </div>

            {history.length === 0 ? (
              <p className="empty-state">まだ履歴がありません。先に診断してから戻ってきてください。</p>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <article key={item.id} className="history-item">
                    <div className="history-date">
                      {new Date(item.createdAt).toLocaleString('ja-JP', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        <footer className="footer-note">
          <span>全10問 / スマホ対応 / LocalStorage 履歴保存</span>
          <span>いつでも再診断できます。</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
