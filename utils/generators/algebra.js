// algebra.js - Comprehensive High School Algebra Curriculum Generator (Units 1-20)

const ALGEBRA_UNITS = {
  1: "Foundations of Algebra & Real Numbers",
  2: "Solving Linear Equations in One Variable",
  3: "Solving Linear Inequalities & Compound Inequalities",
  4: "Graphing Linear Equations & Functions",
  5: "Writing Linear Equations & Models",
  6: "Systems of Linear Equations & Inequalities",
  7: "Exponents, Radicals, & Scientific Notation",
  8: "Polynomial Operations & Special Products",
  9: "Factoring Polynomials Completely",
  10: "Quadratic Equations & Complex Numbers",
  11: "Solving Quadratics via Completing the Square & Formula",
  12: "Graphing Quadratic Functions & Transformations",
  13: "Radical Equations & Introduction to Rational Exponents",
  14: "Rational Expressions & Equations",
  15: "Exponential Functions, Growth, & Decay",
  16: "Sequences & Series (Arithmetic & Geometric)",
  17: "Statistics, Data Analysis, & Probability Distributions",
  18: "Absolute Value Equations, Inequalities, & Piecewise Functions",
  19: "Introduction to Trigonometric Ratios & Right Triangles",
  20: "Polynomial Functions & Fundamental Theorem of Algebra"
};

/**
 * Main entry function expected by math generators.
 * Accepts an itemIndex (0 to 9) to guarantee unique questions and answers for each of the 10 slots in a level.
 * @param {number} unit - Unit number (1 to 20)
 * @param {number} level - Level number within the unit (1 to 20)
 * @param {number} itemIndex - Index of the question within the level (0 to 9)
 * @returns {Object} Problem object
 */
export function generateAlgebra(unit = 1, level = 1, itemIndex = 0) {
  return generateAlgebraProblem(unit, level, itemIndex, 'medium');
}

/**
 * Generates an algebra problem based on the specified unit, level, itemIndex, and difficulty.
 */
function generateAlgebraProblem(unit = 1, level = 1, itemIndex = 0, difficulty = 'medium') {
  const targetUnit = Math.max(1, Math.min(20, unit));
  const unitName = ALGEBRA_UNITS[targetUnit];
  const safeLevel = Math.max(1, Math.min(20, level));
  const safeIndex = Math.max(0, itemIndex || 0);

  let problemObj;
  switch (targetUnit) {
    case 1: problemObj = generateFoundationsProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 2: problemObj = generateLinearEqProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 3: problemObj = generateInequalityProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 4: problemObj = generateGraphingLinearProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 5: problemObj = generateWritingLinearProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 6: problemObj = generateSystemsProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 7: problemObj = generateExponentsRadicalsProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 8: problemObj = generatePolynomialOpsProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 9: problemObj = generateFactoringProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 10: problemObj = generateQuadraticEqProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 11: problemObj = generateQuadFormulaProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 12: problemObj = generateGraphingQuadProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 13: problemObj = generateRadicalEqProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 14: problemObj = generateRationalExprProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 15: problemObj = generateExponentialProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 16: problemObj = generateSequencesProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 17: problemObj = generateStatisticsProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 18: problemObj = generateAbsoluteValueProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 19: problemObj = generateTrigonometryProblem(safeLevel, safeIndex, difficulty, unitName); break;
    case 20: problemObj = generateAdvancedPolynomialProblem(safeLevel, safeIndex, difficulty, unitName); break;
    default: problemObj = generateLinearEqProblem(safeLevel, safeIndex, difficulty, unitName); break;
  }

  // Generate close distractor choices if numeric answer applies
  const ansNum = Number(problemObj.answer);
  if (!isNaN(ansNum) && typeof problemObj.answer === 'string' && !problemObj.answer.includes('x') && !problemObj.answer.includes('/') && !problemObj.answer.includes('(')) {
    problemObj.choices = shuffleArray([
      ansNum,
      ansNum + (safeIndex % 2 === 0 ? 1 : -1),
      ansNum + (safeIndex % 3 === 0 ? 2 : -2),
      ansNum + (safeIndex % 5 === 0 ? 3 : -3)
    ]).filter((val, i, arr) => arr.indexOf(val) === i);

    while (problemObj.choices.length < 4) {
      const fallbackOffset = problemObj.choices.length + 1;
      problemObj.choices.push(ansNum + fallbackOffset);
    }
  }

  return problemObj;
}

// --- Unit Specific Generators with Integrated Graphing Metadata ---

function generateFoundationsProblem(level, idx, difficulty, unitName) {
  const baseVal = level * 5 + idx * 7;
  const a = baseVal + 12;
  const b = level + idx + 2;
  const c = level + (idx % 4) + 1;
  const multiplier = (idx % 3) + 2;
  const ans = a - (b + c) * multiplier;
  return {
    unit: 1,
    unitName,
    level,
    question: `Simplify completely: ${a} - (${b} + ${c}) × ${multiplier}`,
    answer: String(ans),
    explanation: "Follow order of operations: compute inside parentheses first, then multiplication, then subtraction."
  };
}

function generateLinearEqProblem(level, idx, difficulty, unitName) {
  const m = level + idx + 1;
  const x = level + idx + 3;
  const b = (idx + 1) * 4;
  const total = m * x + b;
  return {
    unit: 2,
    unitName,
    level,
    question: `Solve for x: ${m}x + ${b} = ${total}`,
    answer: String(x),
    explanation: `Subtract ${b} from both sides to get ${m}x = ${m * x}, then divide by ${m} to find x = ${x}.`
  };
}

function generateInequalityProblem(level, idx, difficulty, unitName) {
  const a = (idx % 3) + 2;
  const x = level + idx + 2;
  const b = (idx + 1) * 3;
  const c = a * x - b; 
  return {
    unit: 3,
    unitName,
    level,
    question: `Solve the inequality: ${a}x - ${b} > ${c}`,
    answer: `x > ${x}`,
    explanation: "Isolate the variable term by adding constants to both sides, then divide by the coefficient."
  };
}

function generateGraphingLinearProblem(level, idx, difficulty, unitName) {
  const m = (idx % 2 === 0 ? 1 : -1) * ((idx % 3) + 1);
  const b = (idx * 2) - 3;
  const xVal = idx + 1;
  const yVal = m * xVal + b;
  return {
    unit: 4,
    unitName,
    level,
    type: 'graphing',
    question: `Examine the linear function graph for y = ${m}x + ${b}. Find the y-value when x = ${xVal}.`,
    answer: String(yVal),
    explanation: `Substitute x = ${xVal} into the line equation: ${m}(${xVal}) + ${b} = ${yVal}.`,
    slope: m,
    yIntercept: b,
    graph: {
      type: 'linear',
      m: m,
      b: b,
      highlightPoint: { x: xVal, y: yVal }
    }
  };
}

function generateWritingLinearProblem(level, idx, difficulty, unitName) {
  const m = level + idx + 1;
  const x1 = idx + 1;
  const y1 = m * x1 + (idx + 2);
  const x2 = x1 + 3;
  const y2 = m * x2 + (idx + 2);
  return {
    unit: 5,
    unitName,
    level,
    type: 'graphing',
    question: `Find the slope of the line passing through points (${x1}, ${y1}) and (${x2}, ${y2}).`,
    answer: String(m),
    explanation: "Calculate change in y divided by change in x (rise over run).",
    slope: m,
    yIntercept: y1 - m * x1,
    graph: {
      type: 'points',
      points: [{ x: x1, y: y1 }, { x: x2, y: y2 }]
    }
  };
}

function generateSystemsProblem(level, idx, difficulty, unitName) {
  const x = level + idx + 2;
  const y = idx + 1;
  const sum = x + y;
  const diff = x - y;
  const m = -1;
  const b = sum;
  return {
    unit: 6,
    unitName,
    level,
    type: 'graphing',
    question: `Solve the system: x + y = ${sum}, x - y = ${diff}. What is x?`,
    answer: String(x),
    explanation: "Add the two equations together to eliminate y and solve directly for x.",
    slope: m,
    yIntercept: b,
    graph: {
      type: 'system',
      lines: [
        { m: -1, b: sum },
        { m: 1, b: -diff }
      ],
      intersection: { x, y }
    }
  };
}

function generateExponentsRadicalsProblem(level, idx, difficulty, unitName) {
  const base = (idx % 2 === 0) ? 2 : 3;
  const exp1 = level + (idx % 3);
  const exp2 = idx + 1;
  const ans = Math.pow(base, exp1 + exp2);
  return {
    unit: 7,
    unitName,
    level,
    question: `Simplify: ${base}^${exp1} × ${base}^${exp2}`,
    answer: String(ans),
    explanation: "When multiplying terms with the same base, add their exponents."
  };
}

function generatePolynomialOpsProblem(level, idx, difficulty, unitName) {
  const a = level + idx;
  const b = idx + 2;
  const midCoeff = a + b;
  const lastCoeff = a * b;
  return {
    unit: 8,
    unitName,
    level,
    question: `Expand and simplify: (x + ${a})(x + ${b})`,
    answer: `x^2 + ${midCoeff}x + ${lastCoeff}`,
    explanation: "Use the FOIL method (First, Outer, Inner, Last) to multiply binomials."
  };
}

function generateFactoringProblem(level, idx, difficulty, unitName) {
  const p = level + idx;
  const q = idx + 3;
  const bSum = p + q;
  const cProd = p * q;
  return {
    unit: 9,
    unitName,
    level,
    question: `Factor completely: x^2 + ${bSum}x + ${cProd}`,
    answer: `(x + ${p})(x + ${q})`,
    explanation: `Find two numbers that multiply to ${cProd} and add up to ${bSum}.`
  };
}

function generateQuadraticEqProblem(level, idx, difficulty, unitName) {
  const root = level + idx + 1;
  const cVal = root * root;
  return {
    unit: 10,
    unitName,
    level,
    question: `Solve for positive x: x^2 - ${cVal} = 0`,
    answer: String(root),
    explanation: `Isolate x^2 to get ${cVal}, then take the principal square root.`
  };
}

function generateQuadFormulaProblem(level, idx, difficulty, unitName) {
  const a = 1;
  const b = level + idx + 2;
  const c = idx + 1;
  const disc = (b * b) - (4 * a * c);
  return {
    unit: 11,
    unitName,
    level,
    question: `What is the discriminant of x^2 + ${b}x + ${c} = 0?`,
    answer: String(disc),
    explanation: "Calculate the discriminant using the formula b^2 - 4ac."
  };
}

function generateGraphingQuadProblem(level, idx, difficulty, unitName) {
  const h = (idx % 3) - 1;
  const k = (idx % 4) - 2;
  return {
    unit: 12,
    unitName,
    level,
    type: 'graphing',
    question: `What is the vertex (h, k) of the quadratic function plotted as f(x) = (x - ${h})^2 + ${k}?`,
    answer: `(${h}, ${k})`,
    explanation: "In vertex form f(x) = a(x - h)^2 + k, the vertex is directly given by coordinate points (h, k).",
    slope: 1,
    yIntercept: h * h + k,
    graph: {
      type: 'quadratic',
      h: h,
      k: k,
      a: 1
    }
  };
}

function generateRadicalEqProblem(level, idx, difficulty, unitName) {
  const subVal = level + idx;
  const rootVal = idx + 4;
  const rightSide = rootVal;
  const ans = (rootVal * rootVal) + subVal;
  return {
    unit: 13,
    unitName,
    level,
    question: `Solve for x: √(x - ${subVal}) = ${rightSide}`,
    answer: String(ans),
    explanation: "Square both sides of the equation to eliminate the radical."
  };
}

function generateRationalExprProblem(level, idx, difficulty, unitName) {
  const p = level + idx + 1;
  const q = idx + 2;
  const sumPq = p + q;
  const prodPq = p * q;
  return {
    unit: 14,
    unitName,
    level,
    question: `Simplify by factoring: (x^2 + ${sumPq}x + ${prodPq}) / (x + ${q})`,
    answer: `x + ${p}`,
    explanation: `Factor the numerator into (x + ${p})(x + ${q}) and cancel out the common factor (x + ${q}) from the denominator.`
  };
}

function generateExponentialProblem(level, idx, difficulty, unitName) {
  const initial = (level + idx) * 10;
  const multiplier = (idx % 2 === 0) ? 2 : 3;
  const ans = initial * multiplier;
  return {
    unit: 15,
    unitName,
    level,
    type: 'graphing',
    question: `An asset starts at ${initial} and multiplies by ${multiplier} every year. What is its value after 1 year?`,
    answer: String(ans),
    explanation: "Multiply the initial amount by the growth factor.",
    slope: multiplier,
    yIntercept: initial,
    graph: {
      type: 'exponential',
      initial: initial,
      base: multiplier
    }
  };
}

function generateSequencesProblem(level, idx, difficulty, unitName) {
  const start = level + idx;
  const diff = idx + 2;
  const termNum = 4;
  const ans = start + (termNum - 1) * diff;
  return {
    unit: 16,
    unitName,
    level,
    question: `Find the ${termNum}th term of an arithmetic sequence starting at ${start} with common difference ${diff}.`,
    answer: String(ans),
    explanation: "Use formula a_n = a_1 + (n - 1)d."
  };
}

function generateStatisticsProblem(level, idx, difficulty, unitName) {
  const shift = level + idx * 2;
  const setArr = [2 + shift, 4 + shift, 6 + shift, 8 + shift, 10 + shift];
  const median = setArr[2];
  return {
    unit: 17,
    unitName,
    level,
    question: `Find the median of the data set: ${setArr.join(', ')}.`,
    answer: String(median),
    explanation: "The median is the middle number in a sorted ascending data list."
  };
}

function generateAbsoluteValueProblem(level, idx, difficulty, unitName) {
  const val = (level + idx) * 4 + 2;
  return {
    unit: 18,
    unitName,
    level,
    type: 'graphing',
    question: `Solve for positive x: |x - ${val}| = 0`,
    answer: String(val),
    explanation: "An absolute value equation equals zero only when its inner expression equals zero.",
    slope: 1,
    yIntercept: val,
    graph: {
      type: 'absolute',
      vertex: val
    }
  };
}

function generateTrigonometryProblem(level, idx, difficulty, unitName) {
  const opp = level + idx;
  const adj = idx + 3;
  return {
    unit: 19,
    unitName,
    level,
    question: `In a right triangle, if the opposite side is ${opp} and the adjacent side is ${adj}, what is tan(theta)?`,
    answer: `${opp}/${adj}`,
    explanation: "Tangent is defined as Opposite divided by Adjacent (SOH-CAH-TOA)."
  };
}

function generateAdvancedPolynomialProblem(level, idx, difficulty, unitName) {
  const r1 = level + idx + 1;
  const r2 = idx + 2;
  const bCoeff = -(r1 + r2);
  const cCoeff = r1 * r2;
  const signB = bCoeff < 0 ? `- ${Math.abs(bCoeff)}` : `+ ${bCoeff}`;
  return {
    unit: 20,
    unitName,
    level,
    question: `Find the sum of the roots for the polynomial equation x^2 ${signB}x + ${cCoeff} = 0.`,
    answer: String(r1 + r2),
    explanation: "By Vieta's formulas, for a quadratic equation ax^2 + bx + c = 0, the sum of the roots is equal to -b/a."
  };
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export { ALGEBRA_UNITS, generateAlgebraProblem };