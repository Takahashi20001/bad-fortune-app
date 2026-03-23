import type { Question } from '../types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    category: '行動傾向',
    text: '朝起きたときの気分に近いのは？',
    options: [
      {
        id: 'a',
        label: '今日こそ何か変えたい',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 1 },
        tags: ['ambitious', 'restless'],
      },
      {
        id: 'b',
        label: 'とりあえず普通',
        scores: { exhaustion: 0, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['neutral'],
      },
      {
        id: 'c',
        label: 'できれば何もしたくない',
        scores: { exhaustion: 2, misfire: 0, distrust: 0, stagnation: 1 },
        tags: ['tired', 'avoidant'],
      },
      {
        id: 'd',
        label: 'もうすでに疲れている',
        scores: { exhaustion: 3, misfire: 0, distrust: 1, stagnation: 0 },
        tags: ['burnout'],
      },
    ],
  },
  {
    id: 2,
    category: '自己認識',
    text: '何か失敗したとき、まず思うのは？',
    options: [
      {
        id: 'a',
        label: '次に活かせばいい',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['optimistic', 'retry'],
      },
      {
        id: 'b',
        label: 'まあ仕方ない',
        scores: { exhaustion: 1, misfire: 0, distrust: 0, stagnation: 1 },
        tags: ['detached'],
      },
      {
        id: 'c',
        label: 'やっぱり自分はダメかも',
        scores: { exhaustion: 2, misfire: 0, distrust: 0, stagnation: 1 },
        tags: ['self-doubt'],
      },
      {
        id: 'd',
        label: 'もう全部嫌になる',
        scores: { exhaustion: 2, misfire: 0, distrust: 1, stagnation: 1 },
        tags: ['collapse'],
      },
    ],
  },
  {
    id: 3,
    category: '対人関係',
    text: '人から褒められたときどう感じる？',
    options: [
      {
        id: 'a',
        label: '素直にうれしい',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['open'],
      },
      {
        id: 'b',
        label: '少し照れる',
        scores: { exhaustion: 0, misfire: 1, distrust: 1, stagnation: 0 },
        tags: ['shy'],
      },
      {
        id: 'c',
        label: '本心じゃない気がする',
        scores: { exhaustion: 0, misfire: 0, distrust: 2, stagnation: 0 },
        tags: ['guarded'],
      },
      {
        id: 'd',
        label: 'そのうち裏切られそう',
        scores: { exhaustion: 0, misfire: 0, distrust: 3, stagnation: 0 },
        tags: ['paranoid'],
      },
    ],
  },
  {
    id: 4,
    category: 'ストレス耐性',
    text: '予定のない休日はどう過ごす？',
    options: [
      {
        id: 'a',
        label: '新しいことをしたい',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['stimulus'],
      },
      {
        id: 'b',
        label: 'ゆっくり休む',
        scores: { exhaustion: 1, misfire: 0, distrust: 0, stagnation: 1 },
        tags: ['recover'],
      },
      {
        id: 'c',
        label: '気づいたら終わっている',
        scores: { exhaustion: 1, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['drift'],
      },
      {
        id: 'd',
        label: '何もせず自己嫌悪になる',
        scores: { exhaustion: 2, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['guilt'],
      },
    ],
  },
  {
    id: 5,
    category: '恋愛観',
    text: '恋愛について近い考えは？',
    options: [
      {
        id: 'a',
        label: '良い出会いはあると思う',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['romantic'],
      },
      {
        id: 'b',
        label: 'タイミング次第',
        scores: { exhaustion: 0, misfire: 1, distrust: 0, stagnation: 1 },
        tags: ['waiting'],
      },
      {
        id: 'c',
        label: '面倒なことが多い',
        scores: { exhaustion: 1, misfire: 0, distrust: 1, stagnation: 1 },
        tags: ['avoidant'],
      },
      {
        id: 'd',
        label: '期待するだけ無駄',
        scores: { exhaustion: 0, misfire: 0, distrust: 2, stagnation: 1 },
        tags: ['jaded'],
      },
    ],
  },
  {
    id: 6,
    category: '金銭感覚',
    text: 'お金に対してどう思う？',
    options: [
      {
        id: 'a',
        label: '計画的に使いたい',
        scores: { exhaustion: 0, misfire: 1, distrust: 0, stagnation: 1 },
        tags: ['careful'],
      },
      {
        id: 'b',
        label: '必要な分あればいい',
        scores: { exhaustion: 0, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['minimal'],
      },
      {
        id: 'c',
        label: '気づいたら減っている',
        scores: { exhaustion: 1, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['impulsive'],
      },
      {
        id: 'd',
        label: '自分には縁が薄い',
        scores: { exhaustion: 1, misfire: 0, distrust: 1, stagnation: 1 },
        tags: ['scarcity'],
      },
    ],
  },
  {
    id: 7,
    category: '人間関係',
    text: '人間関係で一番多いのは？',
    options: [
      {
        id: 'a',
        label: '気を遣いすぎる',
        scores: { exhaustion: 2, misfire: 0, distrust: 1, stagnation: 0 },
        tags: ['people-pleasing'],
      },
      {
        id: 'b',
        label: 'ほどよい距離を取る',
        scores: { exhaustion: 0, misfire: 0, distrust: 1, stagnation: 1 },
        tags: ['reserved'],
      },
      {
        id: 'c',
        label: 'なんとなく疲れる',
        scores: { exhaustion: 2, misfire: 0, distrust: 1, stagnation: 0 },
        tags: ['social-fatigue'],
      },
      {
        id: 'd',
        label: '信じた分だけ損する',
        scores: { exhaustion: 0, misfire: 0, distrust: 3, stagnation: 0 },
        tags: ['betrayal'],
      },
    ],
  },
  {
    id: 8,
    category: '将来志向',
    text: '将来について考えると？',
    options: [
      {
        id: 'a',
        label: 'まだ可能性はある',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['hopeful'],
      },
      {
        id: 'b',
        label: 'なんとかなると思う',
        scores: { exhaustion: 0, misfire: 1, distrust: 0, stagnation: 1 },
        tags: ['casual'],
      },
      {
        id: 'c',
        label: '少し不安',
        scores: { exhaustion: 1, misfire: 0, distrust: 1, stagnation: 1 },
        tags: ['anxious'],
      },
      {
        id: 'd',
        label: '期待しない方が楽',
        scores: { exhaustion: 0, misfire: 0, distrust: 1, stagnation: 2 },
        tags: ['resigned'],
      },
    ],
  },
  {
    id: 9,
    category: '決断力',
    text: '重要な決断をするときは？',
    options: [
      {
        id: 'a',
        label: 'すぐ決める',
        scores: { exhaustion: 0, misfire: 3, distrust: 0, stagnation: 0 },
        tags: ['fast'],
      },
      {
        id: 'b',
        label: '少し考える',
        scores: { exhaustion: 0, misfire: 1, distrust: 0, stagnation: 1 },
        tags: ['balanced'],
      },
      {
        id: 'c',
        label: 'かなり悩む',
        scores: { exhaustion: 1, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['hesitant'],
      },
      {
        id: 'd',
        label: '決めた後で後悔する',
        scores: { exhaustion: 1, misfire: 2, distrust: 0, stagnation: 1 },
        tags: ['regret'],
      },
    ],
  },
  {
    id: 10,
    category: '自己評価',
    text: '今の自分を一言で表すなら？',
    options: [
      {
        id: 'a',
        label: '伸びしろがある',
        scores: { exhaustion: 0, misfire: 2, distrust: 0, stagnation: 0 },
        tags: ['growth'],
      },
      {
        id: 'b',
        label: '普通',
        scores: { exhaustion: 0, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['flat'],
      },
      {
        id: 'c',
        label: '迷っている',
        scores: { exhaustion: 1, misfire: 0, distrust: 0, stagnation: 2 },
        tags: ['lost'],
      },
      {
        id: 'd',
        label: '詰みかけている',
        scores: { exhaustion: 2, misfire: 0, distrust: 1, stagnation: 1 },
        tags: ['doom'],
      },
    ],
  },
];
