export function generateSubtraction(unit, level) {
  const totalLevelIndex = (unit - 1) * 20 + level;
  const minVal = Math.floor(4 * Math.pow(1.02, totalLevelIndex - 1));
  const maxVal = Math.floor(16 * Math.pow(1.04, totalLevelIndex - 1));

  let num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  let num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  // Ensure num1 is always greater than num2 to prevent negative results in basic subtraction
  if (num1 < num2) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
  }
  if (num1 === num2) num1 += Math.floor(Math.random() * 5) + 1;

  const correctAnswer = num1 - num2;

  return {
    question: `${num1} - ${num2}`,
    correctAnswer: correctAnswer,
    unit: `Unit ${unit}`,
    level: `Level ${level}`
  };
}