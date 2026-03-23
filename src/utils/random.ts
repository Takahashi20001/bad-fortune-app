export const pickRandom = <T,>(items: T[], seed = Math.random()): T => {
  const index = Math.floor(seed * items.length) % items.length;
  return items[index];
};

export const shuffle = <T,>(items: T[]): T[] => {
  const cloned = [...items];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
};
