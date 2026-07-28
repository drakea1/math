export function generateMultiplication(unit, level) {
  // Calculate a scaling factor from 1 to 400 (20 units * 20 levels)
  const totalLevelIndex = (unit - 1) * 20 + level;
  
  // Dynamically scale min and max bounds based on the level index for multiplication
  const minVal = Math.max(1, Math.floor(2 * Math.pow(1.01, totalLevelIndex - 1)));
  const maxVal = Math.max(3, Math.floor(5 * Math.pow(1.025, totalLevelIndex - 1)));

  const num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  const num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  const correctAnswer = num1 * num2;

  return {
    question: `${num1} × ${num2}`,
    correctAnswer: correctAnswer,
    unit: `Unit ${unit} - Level ${level}`
  };
}