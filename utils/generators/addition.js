export function generateAddition(unit, level) {
  const totalLevelIndex = (unit - 1) * 20 + level;
  const minVal = Math.floor(4 * Math.pow(1.02, totalLevelIndex - 1));
  const maxVal = Math.floor(16 * Math.pow(1.04, totalLevelIndex - 1));

  let num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  let num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  if (Math.abs(num1 - num2) <= 1 && (maxVal - minVal) > 3) {
    const offset = Math.floor(Math.random() * 4) + 2;
    num2 = Math.random() > 0.5 ? num2 + offset : Math.max(minVal, num2 - offset);
  }

  const correctAnswer = num1 + num2;

  return {
    question: `${num1} + ${num2}`,
    correctAnswer: correctAnswer,
    unit: `Unit ${unit}`,
    level: `Level ${level}`
  };
}