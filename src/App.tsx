import { useEffect, useEffectEvent, useRef, useState } from 'react';

type Screen = 'title' | 'playing' | 'dead' | 'clear';
type RollState = 'idle' | 'rolling' | 'safe' | 'dead' | 'clear';
type CapsuleTone = 'neutral' | 'rolling' | 'safe' | 'dead' | 'clear' | 'gold' | 'silver';
type AudioKey =
  | 'titleBgm'
  | 'playBgm'
  | 'clickSe'
  | 'startSe'
  | 'retrySe'
  | 'rollSe'
  | 'safeSe'
  | 'deadSe'
  | 'clearSe'
  | 'specialSe';
type RewardType = 'gold' | 'silver' | 'safe';

const TOTAL_STAGES = 50;
const STORAGE_KEY = 'luck-only-survival-best-stage';
const ROLL_DELAY_MS = 520;
const RESULT_DELAY_MS = 520;
const GOLD_CHANCE = 0.01;
const SILVER_CHANCE = 0.05;
const SILVER_BOOST_TURNS = 10;

const audioSources: Record<AudioKey, string> = {
  titleBgm: '/audio/title-bgm.mp3',
  playBgm: '/audio/play-bgm.mp3',
  clickSe: '/audio/click-se.mp3',
  startSe: '/audio/start-se.mp3',
  retrySe: '/audio/retry-se.mp3',
  rollSe: '/audio/roll-se.mp3',
  safeSe: '/audio/safe-se.mp3',
  deadSe: '/audio/dead-se.mp3',
  clearSe: '/audio/safe-se.mp3',
  specialSe: '/audio/special-se.mp3',
};

const deathRates = Array.from({ length: TOTAL_STAGES }, (_, index) => {
  if (index < 40) {
    return 10 + index * 2;
  }

  return 89 + (index - 40);
});

const stageButtonLabels = (stage: number) => {
  if (stage >= 45) {
    return ['まだ押すの？', 'やめとけ', '本当に進む？'][stage % 3];
  }

  if (stage >= 30) {
    return ['進む', '押す', '生きる'][stage % 3];
  }

  return ['進む', '押す', '引く', '次へ'][stage % 4];
};

const loadBestStage = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const rollRewardType = (): RewardType => {
  const roll = Math.random();

  if (roll < GOLD_CHANCE) {
    return 'gold';
  }

  if (roll < GOLD_CHANCE + SILVER_CHANCE) {
    return 'silver';
  }

  return 'safe';
};

function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [rollState, setRollState] = useState<RollState>('idle');
  const [capsuleTone, setCapsuleTone] = useState<CapsuleTone>('neutral');
  const [currentStage, setCurrentStage] = useState(1);
  const [bestStage, setBestStage] = useState(0);
  const [resultText, setResultText] = useState('READY');
  const [resultSubtext, setResultSubtext] = useState('タップするだけ。生きろ。');
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastReachedStage, setLastReachedStage] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [shieldCount, setShieldCount] = useState(0);
  const [silverTurnsLeft, setSilverTurnsLeft] = useState(0);

  const audioMapRef = useRef<Record<AudioKey, HTMLAudioElement | null>>({
    titleBgm: null,
    playBgm: null,
    clickSe: null,
    startSe: null,
    retrySe: null,
    rollSe: null,
    safeSe: null,
    deadSe: null,
    clearSe: null,
    specialSe: null,
  });
  const currentBgmRef = useRef<AudioKey | null>(null);

  useEffect(() => {
    setBestStage(loadBestStage());
  }, []);

  useEffect(() => {
    const audioEntries = Object.entries(audioSources) as Array<[AudioKey, string]>;

    for (const [key, src] of audioEntries) {
      const audio = new Audio(src);
      audio.preload = 'auto';

      if (key === 'titleBgm' || key === 'playBgm') {
        audio.loop = true;
        audio.volume = key === 'titleBgm' ? 0.24 : 0.18;
      } else if (key === 'rollSe') {
        audio.volume = 0.42;
      } else if (key === 'safeSe' || key === 'clearSe') {
        audio.volume = 0.52;
      } else if (key === 'specialSe') {
        audio.volume = 0.56;
      } else if (key === 'deadSe') {
        audio.volume = 0.48;
      } else {
        audio.volume = 0.5;
      }

      audioMapRef.current[key] = audio;
    }

    return () => {
      for (const audio of Object.values(audioMapRef.current)) {
        if (!audio) {
          continue;
        }

        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const stopAudio = useEffectEvent((key: AudioKey) => {
    const audio = audioMapRef.current[key];
    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  });

  const playAudio = useEffectEvent((key: AudioKey) => {
    const audio = audioMapRef.current[key];
    if (!audio || !audioReady) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  });

  const syncBgm = useEffectEvent((nextScreen: Screen) => {
    if (!audioReady) {
      return;
    }

    const nextKey: AudioKey = nextScreen === 'title' ? 'titleBgm' : 'playBgm';

    if (currentBgmRef.current === nextKey) {
      return;
    }

    if (currentBgmRef.current) {
      stopAudio(currentBgmRef.current);
    }

    const nextAudio = audioMapRef.current[nextKey];
    if (!nextAudio) {
      return;
    }

    currentBgmRef.current = nextKey;
    nextAudio.currentTime = 0;
    void nextAudio.play().catch(() => {});
  });

  const unlockAudio = useEffectEvent(() => {
    if (audioReady) {
      return;
    }

    setAudioReady(true);
  });

  useEffect(() => {
    syncBgm(screen);
  }, [screen, syncBgm]);

  const persistBestStage = (value: number) => {
    setBestStage((prev) => {
      const next = Math.max(prev, value);
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const resetRun = (nextScreen: Screen) => {
    setScreen(nextScreen);
    setRollState('idle');
    setCapsuleTone('neutral');
    setCurrentStage(1);
    setResultText('READY');
    setResultSubtext('タップするだけ。生きろ。');
    setIsAnimating(false);
    setLastReachedStage(0);
    setShieldCount(0);
    setSilverTurnsLeft(0);
    stopAudio('rollSe');
  };

  const finishRun = (stage: number) => {
    persistBestStage(stage);
    setLastReachedStage(stage);
  };

  const applyStageAdvance = (stage: number, usingSilverBoost: boolean) => {
    const advance = usingSilverBoost ? 2 : 1;
    const nextStage = stage + advance;
    const finalReachedStage = Math.min(TOTAL_STAGES, nextStage);

    finishRun(finalReachedStage);

    if (finalReachedStage >= TOTAL_STAGES) {
      playAudio('clearSe');
      setRollState('clear');
      setCapsuleTone('clear');
      setResultText('CLEAR');
      setResultSubtext('50ステージ突破。意味はないが勝ち。');
      setScreen('clear');
      setIsAnimating(false);
      return;
    }

    window.setTimeout(() => {
      setCurrentStage(nextStage);
      setRollState('idle');
      setCapsuleTone('neutral');
      setResultText('READY');
      setResultSubtext(usingSilverBoost ? '銀効果で2ステージ進行中。' : '次のカプセルを引け。');
      setIsAnimating(false);
    }, RESULT_DELAY_MS);
  };

  const startGame = useEffectEvent(() => {
    unlockAudio();
    playAudio(screen === 'title' ? 'startSe' : 'retrySe');
    resetRun('playing');
  });

  const goToTitle = useEffectEvent(() => {
    unlockAudio();
    playAudio('clickSe');
    resetRun('title');
  });

  const handleAdvance = useEffectEvent(() => {
    if (screen !== 'playing' || isAnimating) {
      return;
    }

    unlockAudio();

    const stage = currentStage;
    const deathRate = deathRates[stage - 1];
    const survived = Math.random() >= deathRate / 100;
    const usingSilverBoost = silverTurnsLeft > 0;
    const nextSilverTurns = Math.max(0, silverTurnsLeft - 1);

    playAudio('clickSe');
    playAudio('rollSe');

    setIsAnimating(true);
    setRollState('rolling');
    setCapsuleTone('rolling');
    setResultText('GACHA...');
    setResultSubtext(`STAGE ${stage} を抽選中。カプセル排出待ち。`);

    window.setTimeout(() => {
      stopAudio('rollSe');
      setSilverTurnsLeft(nextSilverTurns);

      if (!survived) {
        if (shieldCount > 0) {
          setShieldCount((prev) => Math.max(0, prev - 1));
          playAudio('specialSe');
          setRollState('safe');
          setCapsuleTone('gold');
          setResultText('GUARD');
          setResultSubtext('金カプセルの加護で死亡を1回無効化。');
          applyStageAdvance(stage, usingSilverBoost);
          return;
        }

        playAudio('deadSe');
        finishRun(stage - 1);
        setRollState('dead');
        setCapsuleTone('dead');
        setResultText('DEAD');
        setResultSubtext(`赤カプセル。STAGE ${stage} で終了。`);

        window.setTimeout(() => {
          setScreen('dead');
          setIsAnimating(false);
        }, RESULT_DELAY_MS);

        return;
      }

      const rewardType = rollRewardType();

      if (rewardType === 'gold') {
        playAudio('specialSe');
        setShieldCount((prev) => prev + 1);
        setRollState('safe');
        setCapsuleTone('gold');
        setResultText('GOLD');
        setResultSubtext('金カプセル。次の死亡を1回だけ無効化。');
        applyStageAdvance(stage, usingSilverBoost);
        return;
      }

      if (rewardType === 'silver') {
        playAudio('specialSe');
        setSilverTurnsLeft(SILVER_BOOST_TURNS);
        setRollState('safe');
        setCapsuleTone('silver');
        setResultText('SILVER');
        setResultSubtext('銀カプセル。ここから10ターン、進行が2倍。');
        applyStageAdvance(stage, true);
        return;
      }

      playAudio('safeSe');
      setRollState('safe');
      setCapsuleTone('safe');
      setResultText('SAFE');
      setResultSubtext(usingSilverBoost ? '黄カプセル。銀効果で2ステージ進行。' : '黄カプセル。まだ生きてる。');
      applyStageAdvance(stage, usingSilverBoost);
    }, ROLL_DELAY_MS);
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (screen === 'title') {
          startGame();
          return;
        }

        if (screen === 'dead' || screen === 'clear') {
          startGame();
          return;
        }

        handleAdvance();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAdvance, screen, startGame]);

  const deathRate = deathRates[currentStage - 1];
  const survivalRate = 100 - deathRate;
  const progress = ((currentStage - 1) / TOTAL_STAGES) * 100;
  const buttonLabel =
    screen === 'dead' || screen === 'clear'
      ? 'もう一回'
      : rollState === 'rolling'
        ? 'ガチャ中...'
        : stageButtonLabels(currentStage);

  return (
    <div
      className={[
        'app-shell',
        screen === 'playing' ? 'mode-playing' : '',
        currentStage >= 30 ? 'phase-uneasy' : '',
        currentStage >= 45 ? 'phase-danger' : '',
        rollState === 'rolling' ? 'state-rolling' : '',
        rollState === 'dead' || screen === 'dead' ? 'state-dead' : '',
        rollState === 'clear' || screen === 'clear' ? 'state-clear' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="noise" />
      <div className="scanline" />

      <main className="game-card">
        <header className="topbar">
          <div>
            <p className="eyebrow">HIGH SPEED LUCK GACHA</p>
            <h1>運だけで生きろ</h1>
          </div>

          <div className="best-box">
            <span>BEST</span>
            <strong>{bestStage}</strong>
          </div>
        </header>

        {screen === 'title' ? (
          <section className="hero-panel">
            <div className="hero-copy">
              <p>押せばガチャが回る</p>
              <p>金なら保険、銀なら加速</p>
              <p>赤なら基本的に即終了</p>
            </div>

            <div className="rule-grid">
              <article>
                <span>金カプセル 1%</span>
                <p>次の死亡を1回だけ無効化。貯め込みも可能。</p>
              </article>
              <article>
                <span>銀カプセル 5%</span>
                <p>10ターンの間、進行が2倍。終盤を飛ばせる。</p>
              </article>
              <article>
                <span>死亡率は据え置き</span>
                <p>生き残った時だけ色が分岐。赤の脅威はそのまま。</p>
              </article>
            </div>

            <div className="action-row">
              <button className="main-button" onClick={startGame}>
                スタート
              </button>
              <p className="support-copy">Enter / Space でも開始可能</p>
            </div>
          </section>
        ) : (
          <section className="play-panel">
            <div className="status-grid status-grid-wide">
              <article className="status-card stage-card">
                <span>STAGE</span>
                <strong>{screen === 'clear' ? TOTAL_STAGES : currentStage}</strong>
              </article>
              <article className="status-card">
                <span>死亡率</span>
                <strong>{screen === 'clear' ? deathRates[TOTAL_STAGES - 1] : deathRate}%</strong>
              </article>
              <article className="status-card">
                <span>生存率</span>
                <strong>{screen === 'clear' ? 100 - deathRates[TOTAL_STAGES - 1] : survivalRate}%</strong>
              </article>
              <article className="status-card gold-card">
                <span>金シールド</span>
                <strong>{shieldCount}</strong>
              </article>
              <article className="status-card silver-card">
                <span>銀ブースト</span>
                <strong>{silverTurnsLeft}</strong>
              </article>
            </div>

            <div className="progress-shell">
              <div className="progress-meta">
                <span>50回生き残れ</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className={`gacha-machine ${rollState} ${capsuleTone}`}>
              <div className="machine-top">
                <div className="machine-label">運命抽選機</div>
                <div className="machine-lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="globe">
                  <div className="globe-liquid" />
                  <div className="capsule-cloud">
                    <span className="mini-capsule c1" />
                    <span className="mini-capsule c2" />
                    <span className="mini-capsule c3" />
                    <span className="mini-capsule c4" />
                    <span className="mini-capsule c5" />
                  </div>
                </div>
                <div className="handle-area">
                  <div className="handle-arm" />
                  <div className="handle-knob" />
                </div>
              </div>

              <div className="machine-body">
                <div className="chute">
                  <div className="chute-ring" />
                  <div className={`result-capsule ${capsuleTone}`}>
                    <span className="capsule-top" />
                    <span className="capsule-bottom" />
                    <span className="capsule-core" />
                  </div>
                </div>
                <p className="capsule-hint">
                  {capsuleTone === 'rolling'
                    ? 'カプセル排出中...'
                    : capsuleTone === 'safe'
                      ? '黄カプセル: 生存'
                      : capsuleTone === 'dead'
                        ? '赤カプセル: 死亡'
                        : capsuleTone === 'gold'
                          ? '金カプセル: 死亡無効 +1'
                          : capsuleTone === 'silver'
                            ? '銀カプセル: 10ターン2倍進行'
                            : capsuleTone === 'clear'
                              ? '金カプセル: 制覇'
                              : '押すとカプセルが出る'}
                </p>
              </div>
            </div>

            <div className={`result-panel ${rollState} ${capsuleTone}`}>
              <p className="result-main">{resultText}</p>
              <p className="result-sub">{resultSubtext}</p>
            </div>

            {screen === 'playing' ? (
              <div className="action-row action-row-play">
                <button className="main-button" onClick={handleAdvance} disabled={isAnimating}>
                  {buttonLabel}
                </button>
                <p className="support-copy">
                  {shieldCount > 0
                    ? `金シールド ${shieldCount} 枚待機中`
                    : silverTurnsLeft > 0
                      ? `銀ブースト残り ${silverTurnsLeft} ターン`
                      : currentStage >= 45
                        ? 'ここから先は赤カプセル祭り'
                        : currentStage >= 30
                          ? 'だんだん黄カプセルが信用できない'
                          : 'まだ黄カプセルが出る世界'}
                </p>
              </div>
            ) : null}

            {screen === 'dead' ? (
              <div className="end-panel dead-panel">
                <h2>GAME OVER</h2>
                <p>到達ステージ {lastReachedStage}</p>
                <p>ベスト記録 {bestStage}</p>
                <div className="action-row">
                  <button className="main-button" onClick={startGame}>
                    {buttonLabel}
                  </button>
                  <button className="sub-button" onClick={goToTitle}>
                    タイトルへ戻る
                  </button>
                </div>
              </div>
            ) : null}

            {screen === 'clear' ? (
              <div className="end-panel clear-panel">
                <h2>ALL CLEAR</h2>
                <p>全50ステージ突破。意味はないが勝ち。</p>
                <p>ベスト記録 {bestStage}</p>
                <div className="action-row">
                  <button className="main-button" onClick={startGame}>
                    {buttonLabel}
                  </button>
                  <button className="sub-button" onClick={goToTitle}>
                    タイトルへ戻る
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
