export function generateMultiplication(unit, level) {
  const totalLevelIndex = (unit - 1) * 20 + level;
  // Scaled down slightly so products don't instantly break UI bounds
  const minVal = Math.floor(2 * Math.pow(1.015, totalLevelIndex - 1));
  const maxVal = Math.floor(10 * Math.pow(1.03, totalLevelIndex - 1));

  let num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  let num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  const correctAnswer = num1 * num2;

  return {
    question: `${num1} × ${num2}`,
    correctAnswer: correctAnswer,
    unit: `Unit ${unit}`,
    level: `Level ${level}`
  };
}