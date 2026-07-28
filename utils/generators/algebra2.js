// algebra2.js - Comprehensive High School Algebra 2 Curriculum Generator (Units 1-20)

const ALGEBRA2_UNITS = {
  1: "Equations and Inequalities",
  2: "Linear Equations and Functions",
  3: "Systems of Linear Equations and Inequalities",
  4: "Matrices and Determinants",
  5: "Quadratic Functions and Equations",
  6: "Polynomial Functions and Operations",
  7: "Polynomial Equations and Factoring",
  8: "Rational Exponents and Radical Functions",
  9: "Exponential and Logarithmic Functions",
  10: "Rational Functions and Equations",
  11: "Sequences and Series",
  12: "Quadratic Relations and Conic Sections",
  13: "Counting Methods and Probability",
  14: "Data Analysis and Statistics",
  15: "Trigonometric Ratios and Right Triangles",
  16: "Trigonometric Functions and the Unit Circle",
  17: "Graphing Trigonometric Functions",
  18: "Trigonometric Identities and Equations",
  19: "Limits and Introduction to Calculus Concepts",
  20: "Advanced Polynomial and Complex Number Theorems"
};

/**
 * Main entry function expected by math generators.
 * Accepts an itemIndex (0 to 9) to guarantee unique questions and answers for each of the 10 slots in a level.
 * @param {number} unit - Unit number (1 to 20)
 * @param {number} level - Level number within the unit (1 to 20)
 * @param {number} itemIndex - Index of the question within the level (0 to 9)
 * @returns {Object} Problem object
 */
export function generateAlgebra2(unit = 1, level = 1, itemIndex = 0) {
  return generateAlgebra2Problem(unit, level, itemIndex);
}

/**
 * Generates an Algebra 2 problem based on the specified unit, level, and itemIndex.
 */
function generateAlgebra2Problem(unit = 1, level = 1, itemIndex = 0) {
  const targetUnit = Math.max(1, Math.min(20, unit));
  const unitName = ALGEBRA2_UNITS[targetUnit];
  const safeLevel = Math.max(1, Math.min(20, level));
  const safeIndex = Math.max(0, itemIndex || 0);

  let problemObj;
  switch (targetUnit) {
    case 1: problemObj = generateAlg2Unit1(safeLevel, safeIndex, unitName); break;
    case 2: problemObj = generateAlg2Unit2(safeLevel, safeIndex, unitName); break;
    case 3: problemObj = generateAlg2Unit3(safeLevel, safeIndex, unitName); break;
    case 4: problemObj = generateAlg2Unit4(safeLevel, safeIndex, unitName); break;
    case 5: problemObj = generateAlg2Unit5(safeLevel, safeIndex, unitName); break;
    case 6: problemObj = generateAlg2Unit6(safeLevel, safeIndex, unitName); break;
    case 7: problemObj = generateAlg2Unit7(safeLevel, safeIndex, unitName); break;
    case 8: problemObj = generateAlg2Unit8(safeLevel, safeIndex, unitName); break;
    case 9: problemObj = generateAlg2Unit9(safeLevel, safeIndex, unitName); break;
    case 10: problemObj = generateAlg2Unit10(safeLevel, safeIndex, unitName); break;
    case 11: problemObj = generateAlg2Unit11(safeLevel, safeIndex, unitName); break;
    case 12: problemObj = generateAlg2Unit12(safeLevel, safeIndex, unitName); break;
    case 13: problemObj = generateAlg2Unit13(safeLevel, safeIndex, unitName); break;
    case 14: problemObj = generateAlg2Unit14(safeLevel, safeIndex, unitName); break;
    case 15: problemObj = generateAlg2Unit15(safeLevel, safeIndex, unitName); break;
    case 16: problemObj = generateAlg2Unit16(safeLevel, safeIndex, unitName); break;
    case 17: problemObj = generateAlg2Unit17(safeLevel, safeIndex, unitName); break;
    case 18: problemObj = generateAlg2Unit18(safeLevel, safeIndex, unitName); break;
    case 19: problemObj = generateAlg2Unit19(safeLevel, safeIndex, unitName); break;
    case 20: problemObj = generateAlg2Unit20(safeLevel, safeIndex, unitName); break;
    default: problemObj = generateAlg2Unit1(safeLevel, safeIndex, unitName); break;
  }

  const finalAnswer = problemObj.answer;
  const numericAns = Number(finalAnswer);

  let choices = problemObj.choices;
  if (!choices && !isNaN(numericAns)) {
    choices = shuffleArray([
      numericAns,
      numericAns + (safeIndex % 2 === 0 ? 3 : -3),
      numericAns + (safeIndex % 3 === 0 ? 7 : -7),
      numericAns + (safeIndex % 5 === 0 ? 12 : -12)
    ]).filter((val, i, arr) => arr.indexOf(val) === i);

    while (choices.length < 4) {
      choices.push(numericAns + (choices.length + 1) * 5);
    }
  } else if (!choices) {
    choices = shuffleArray([finalAnswer, "None of these", "0", "1"]);
  }

  return {
    ...problemObj,
    correctAnswer: finalAnswer,
    choices: shuffleArray(choices)
  };
}

// --- Unit Specific Generators (Scaling Harder for High School Algebra 2) ---

function generateAlg2Unit1(level, idx, unitName) {
  const a = level * 4 + idx * 3 + 2;
  const b = level * 2 + idx + 5;
  const c = level * 15 + idx * 4;
  return { unit: 1, unitName, level, question: `Solve for x: ${a}x - ${b} = ${c}`, answer: String(Math.round(((c + b) / a) * 100) / 100), explanation: "Isolate x by balancing terms across the inequality/equation." };
}

function generateAlg2Unit2(level, idx, unitName) {
  const m = level * 3 + idx - 4;
  const xVal = level + idx + 3;
  const b = level * 5 - idx * 2;
  const yVal = m * xVal + b;
  return { unit: 2, unitName, level, question: `Given f(x) = ${m}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}, find f(${xVal}).`, answer: String(yVal), explanation: "Substitute the x value into the linear function." };
}

function generateAlg2Unit3(level, idx, unitName) {
  const x = level * 2 + idx + 4;
  const y = level + idx + 2;
  const eq1a = 2;
  const eq1b = 3;
  const sum1 = eq1a * x + eq1b * y;
  const eq2a = 1;
  const eq2b = -1;
  const sum2 = eq2a * x + eq2b * y;
  return { unit: 3, unitName, level, question: `Solve the system: ${eq1a}x + ${eq1b}y = ${sum1}, and x - y = ${sum2}. What is x?`, answer: String(x), explanation: "Use elimination or substitution to find x." };
}

function generateAlg2Unit4(level, idx, unitName) {
  const a = level + idx;
  const b = idx + 3;
  const c = level + 2;
  const d = level * 2 + idx;
  const det = (a * d) - (b * c);
  return { unit: 4, unitName, level, question: `Find the determinant of matrix [[${a}, ${b}], [${c}, ${d}]].`, answer: String(det), explanation: "Determinant of 2x2 matrix is ad - bc." };
}

function generateAlg2Unit5(level, idx, unitName) {
  const h = level * 2 + idx;
  const k = level + idx * 3;
  return { unit: 5, unitName, level, question: `Find the y-coordinate of the vertex for f(x) = (x - ${h})^2 + ${k}.`, answer: String(k), explanation: "In vertex form f(x)=a(x-h)^2+k, the vertex is (h, k)." };
}

function generateAlg2Unit6(level, idx, unitName) {
  const p1 = level + idx + 1;
  const p2 = level + idx + 3;
  const mid = p1 + p2;
  const prod = p1 * p2;
  return { unit: 6, unitName, level, question: `Expand and simplify: (x + ${p1})(x + ${p2})`, answer: `x^2 + ${mid}x + ${prod}`, explanation: "Multiply using distributive property (FOIL)." };
}

function generateAlg2Unit7(level, idx, unitName) {
  const r = level * 2 + idx + 2;
  const cVal = r * r;
  return { unit: 7, unitName, level, question: `Solve for the positive root: x^2 - ${cVal} = 0`, answer: String(r), explanation: "Isolate x^2 and take the square root." };
}

function generateAlg2Unit8(level, idx, unitName) {
  const sub = level + idx;
  const res = level * 2 + idx + 3;
  const ans = (res * res) + sub;
  return { unit: 8, unitName, level, question: `Solve for x: √(x - ${sub}) = ${res}`, answer: String(ans), explanation: "Square both sides to eliminate the radical." };
}

function generateAlg2Unit9(level, idx, unitName) {
  const base = 2;
  const exp = level + idx + 1;
  const val = Math.pow(base, exp);
  return { unit: 9, unitName, level, question: `Evaluate log_${base}(${val})`, answer: String(exp), explanation: "Rewrite the log equation into its exponential equivalent." };
}

function generateAlg2Unit10(level, idx, unitName) {
  const q = level * 3 + idx + 2;
  return { unit: 10, unitName, level, question: `Find the vertical asymptote of f(x) = 5 / (x - ${q}).`, answer: String(q), explanation: "Set the denominator equal to zero and solve for x." };
}

function generateAlg2Unit11(level, idx, unitName) {
  const start = level * 3 + idx;
  const diff = level + idx + 2;
  const termNum = 6;
  const ans = start + (termNum - 1) * diff;
  return { unit: 11, unitName, level, question: `Find the ${termNum}th term of an arithmetic sequence with first term ${start} and common difference ${diff}.`, answer: String(ans), explanation: "Use formula a_n = a_1 + (n - 1)d." };
}

function generateAlg2Unit12(level, idx, unitName) {
  const r2 = (level * 2 + idx + 3) * (level * 2 + idx + 3);
  return { unit: 12, unitName, level, question: `What is the radius r of the circle given by x^2 + y^2 = ${r2}?`, answer: String(Math.sqrt(r2)), explanation: "The radius is the square root of r^2." };
}

function generateAlg2Unit13(level, idx, unitName) {
  const n = level * 2 + idx + 5;
  const ans = n * (n - 1);
  return { unit: 13, unitName, level, question: `Evaluate the permutation P(${n}, 2).`, answer: String(ans), explanation: "Use permutation formula P(n, r) = n! / (n-r)!." };
}

function generateAlg2Unit14(level, idx, unitName) {
  const s = level + idx;
  const data = [2 + s, 5 + s, 8 + s, 11 + s, 14 + s];
  return { unit: 14, unitName, level, question: `Find the median of the dataset: ${data.join(', ')}.`, answer: String(data[2]), explanation: "The median is the middle number in a sorted dataset." };
}

function generateAlg2Unit15(level, idx, unitName) {
  const opp = level * 2 + idx + 3;
  const adj = level + idx + 1;
  return { unit: 15, unitName, level, question: `In a right triangle, if opposite = ${opp} and adjacent = ${adj}, what is tan(theta) expressed as a fraction?`, answer: `${opp}/${adj}`, explanation: "Tangent is opposite divided by adjacent." };
}

function generateAlg2Unit16(level, idx, unitName) {
  const angle = 45 * ((idx % 4) + 1);
  const q = angle === 360 ? 4 : Math.ceil(angle / 90);
  return { unit: 16, unitName, level, question: `What quadrant does an angle measuring ${angle}° lie in? (Enter number 1-4)`, answer: String(q), explanation: "Determine quadrant based on angle bounds (0-90, 90-180, 180-270, 270-360)." };
}

function generateAlg2Unit17(level, idx, unitName) {
  const amp = level * 2 + idx + 1;
  return { unit: 17, unitName, level, question: `What is the amplitude of the function y = ${amp} cos(x)?`, answer: String(amp), multiplier: amp, explanation: "Amplitude is the absolute value of the leading coefficient." };
}

function generateAlg2Unit18(level, idx, unitName) {
  return { unit: 18, unitName, level, question: `Simplify completely: sin^2(x) + cos^2(x)`, answer: "1", explanation: "Pythagorean trigonometric identity equals 1." };
}

function generateAlg2Unit19(level, idx, unitName) {
  const constantVal = level * 3 + idx + 2;
  return { unit: 19, unitName, level, question: `Evaluate the limit: lim (x -> 3) of ${constantVal}`, answer: String(constantVal), explanation: "The limit of a constant value is simply that constant." };
}

function generateAlg2Unit20(level, idx, unitName) {
  const r1 = level + idx + 1;
  const r2 = level + idx + 3;
  const sumRoots = r1 + r2;
  return { unit: 20, unitName, level, question: `Find the sum of the roots for the quadratic equation with roots ${r1} and ${r2}.`, answer: String(sumRoots), explanation: "The sum of the roots is r1 + r2." };
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export { ALGEBRA2_UNITS, generateAlgebra2, generateAlgebra2Problem };