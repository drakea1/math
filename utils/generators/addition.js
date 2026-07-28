export function generateAddition(unit, level) {
  // Calculate a scaling factor from 1 to 400 (20 units * 20 levels)
  const totalLevelIndex = (unit - 1) * 20 + level;
  
  // Dynamically scale min and max bounds based on the level index
  const minVal = Math.floor(5 * Math.pow(1.02, totalLevelIndex - 1));
  const maxVal = Math.floor(15 * Math.pow(1.04, totalLevelIndex - 1));

  const num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  const num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  const correctAnswer = num1 + num2;

  return {
    question: `${num1} + ${num2}`,
    correctAnswer: correctAnswer,
    unit: `Unit ${unit} - Level ${level}`
  };
}