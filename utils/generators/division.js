export function generateDivision(unit, level) {
  const totalLevelIndex = (unit - 1) * 20 + level;
  
  // Moderate exponential growth (higher than the chilled version, lower than the first version)
  const minVal = Math.floor(2 * Math.pow(1.008, totalLevelIndex - 1));
  const maxVal = Math.floor(8 * Math.pow(1.018, totalLevelIndex - 1));

  let divisor = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  let quotient = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  let dividend = divisor * quotient; // Guarantees clean division

  return {
    question: `${dividend} ÷ ${divisor}`,
    correctAnswer: quotient,
    unit: `Unit ${unit}`,
    level: `Level ${level}`
  };
}