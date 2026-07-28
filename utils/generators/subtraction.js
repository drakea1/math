export function generateSubtraction(unit, level) {
  // Calculate a scaling factor from 1 to 400 (20 units * 20 levels)
  const totalLevelIndex = (unit - 1) * 20 + level;
  
  // Dynamically scale min and max bounds based on the level index
  const minVal = Math.floor(5 * Math.pow(1.02, totalLevelIndex - 1));
  const maxVal = Math.floor(15 * Math.pow(1.04, totalLevelIndex - 1));

  let num1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  let num2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  // Ensure num1 is always greater than or equal to num2 to avoid negative subtraction
  if (num1 < num2) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
  }

  const correctAnswer = num1 - num2;

  return {
    question: `${num1} - ${num2}`,
    correctAnswer: correctAnswer,
    unit: `Unit ${unit} - Level ${level}`
  };
}