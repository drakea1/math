// algebra2.js - Comprehensive High School Algebra 2 Curriculum Generator (Units 1-20)

const ALGEBRA2_UNITS = {
  1: "Equations and Inequalities Review",
  2: "Linear Relations and Functions",
  3: "Systems of Linear Equations and Inequalities in Three Variables",
  4: "Matrices and Matrix Multiplication",
  5: "Determinants and Cramer's Rule",
  6: "Quadratic Functions and Complex Numbers",
  7: "Polynomial Functions and Higher-Degree Graphs",
  8: "Polynomial Operations and Division",
  9: "Rational Exponents and Radical Functions",
  10: "Exponential Functions and Equations",
  11: "Logarithmic Functions and Properties of Logarithms",
  12: "Exponential and Logarithmic Equations",
  13: "Rational Expressions and Complex Fractions",
  14: "Solving Rational Equations and Applications",
  15: "Quadratic Relations and Conic Sections",
  16: "Sequences and Series",
  17: "Probability, Permutations, and Combinations",
  18: "Statistics and Normal Distributions",
  19: "Trigonometric Functions and the Unit Circle",
  20: "Graphing Sine, Cosine, and Tangent Functions"
};

export function generateAlgebra2(unit, level, problemIndex = 0) {
  const u = Number.isFinite(Number(unit))
    ? Math.min(20, Math.max(1, Math.floor(Number(unit))))
    : 1;
  const lvl = Number.isFinite(Number(level))
    ? Math.min(20, Math.max(1, Math.floor(Number(level))))
    : 1;
  const idx = Number.isFinite(Number(problemIndex))
    ? Math.max(0, Math.floor(Number(problemIndex)))
    : 0;

  const seed = Math.abs(Math.sin(idx * 137.7 + lvl * 41.3 + u * 19.9) * 43758.5453);
  const variant = Math.floor((seed - Math.floor(seed)) * 15);

  const randInt = (min, max, offset = 0) => {
    const safeMin = Math.floor(min);
    const safeMax = Math.max(safeMin, Math.floor(max));
    const s = Math.abs(Math.sin(seed + offset * 23.17));
    return Math.floor((s - Math.floor(s)) * (safeMax - safeMin + 1)) + safeMin;
  };

  let problemObj;
  switch (u) {
    case 1: problemObj = generateAlg2Unit1(lvl, variant, seed, randInt); break;
    case 2: problemObj = generateAlg2Unit2(lvl, variant, seed, randInt); break;
    case 3: problemObj = generateAlg2Unit3(lvl, variant, seed, randInt); break;
    case 4: problemObj = generateAlg2Unit4(lvl, variant, seed, randInt); break;
    case 5: problemObj = generateAlg2Unit5(lvl, variant, seed, randInt); break;
    case 6: problemObj = generateAlg2Unit6(lvl, variant, seed, randInt); break;
    case 7: problemObj = generateAlg2Unit7(lvl, variant, seed, randInt); break;
    case 8: problemObj = generateAlg2Unit8(lvl, variant, seed, randInt); break;
    case 9: problemObj = generateAlg2Unit9(lvl, variant, seed, randInt); break;
    case 10: problemObj = generateAlg2Unit10(lvl, variant, seed, randInt); break;
    case 11: problemObj = generateAlg2Unit11(lvl, variant, seed, randInt); break;
    case 12: problemObj = generateAlg2Unit12(lvl, variant, seed, randInt); break;
    case 13: problemObj = generateAlg2Unit13(lvl, variant, seed, randInt); break;
    case 14: problemObj = generateAlg2Unit14(lvl, variant, seed, randInt); break;
    case 15: problemObj = generateAlg2Unit15(lvl, variant, seed, randInt); break;
    case 16: problemObj = generateAlg2Unit16(lvl, variant, seed, randInt); break;
    case 17: problemObj = generateAlg2Unit17(lvl, variant, seed, randInt); break;
    case 18: problemObj = generateAlg2Unit18(lvl, variant, seed, randInt); break;
    case 19: problemObj = generateAlg2Unit19(lvl, variant, seed, randInt); break;
    case 20:
    default: problemObj = generateAlg2Unit20(lvl, variant, seed, randInt); break;
  }

  const finalAnswer = String(problemObj.answer);
  const numericAns = Number(finalAnswer);

  let rawChoices;
  if (Array.isArray(problemObj.choices) && problemObj.choices.length > 0) {
    rawChoices = problemObj.choices.map(String);
  } else if (Number.isFinite(numericAns)) {
    const step1 = variant % 2 === 0 ? 4 : -4;
    const step2 = variant % 3 === 0 ? 9 : -9;
    const step3 = variant % 5 === 0 ? 15 : -15;
    const set = new Set([
      finalAnswer,
      String(numericAns + step1),
      String(numericAns + step2),
      String(numericAns + step3)
    ]);
    let extra = 1;
    while (set.size < 4) {
      set.add(String(numericAns + extra * 6));
      extra++;
    }
    rawChoices = Array.from(set).slice(0, 4);
  } else {
    const set = new Set([finalAnswer, "0", "1", "2"]);
    let extra = 1;
    while (set.size < 4) {
      set.add(String(extra * 3));
      extra++;
    }
    rawChoices = Array.from(set).slice(0, 4);
  }

  return {
    unit: u,
    unitName: ALGEBRA2_UNITS[u] || "Algebra 2",
    level: lvl,
    question: problemObj.question,
    answer: finalAnswer,
    correctAnswer: finalAnswer,
    explanation: problemObj.explanation || "Solve step by step.",
    choices: shuffleArray(rawChoices, seed)
  };
}

function shuffleArray(array, seed) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const s = Math.abs(Math.sin(seed + (i + 1) * 19.73));
    const frac = s - Math.floor(s);
    const j = Math.floor(frac * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateAlg2Unit1(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const a = randInt(2, 5, 1) * f;
  const b = randInt(1, 4, 2) * f;
  const c = randInt(6, 15, 3) * f;
  if (variant === 0) return { question: `Solve absolute value equation |${f}x - ${a}| = ${c}. Enter positive x solution:`, answer: String((c + a) / f), explanation: "Split into two linear branches." };
  if (variant === 1) return { question: `Solve absolute value inequality |x + ${a}| ≤ ${c}. Enter upper bound value:`, answer: String(c - a), explanation: "Isolate inequality bounds." };
  if (variant === 2) return { question: `Evaluate absolute expression |-${a} * ${b}| + ${c}`, answer: String(a * b + c), explanation: "Compute inner product and take absolute value." };
  if (variant === 3) return { question: `Solve compound inequality: ${b} < ${f}x + ${b} ≤ ${c * f + b}. Enter upper bound integer x:`, answer: String(c), explanation: "Subtract offset and divide coefficient." };
  if (variant === 4) return { question: `Find distance on number line between -${a * 2} and ${c * 2}:`, answer: String(2 * (c + a)), explanation: "Compute absolute difference between coordinates." };
  if (variant === 5) return { question: `Solve equation |${f}x - ${a * 2}| = ${c * 2}. Enter positive root x:`, answer: String((2 * c + 2 * a) / f), explanation: "Isolate positive absolute branch." };
  if (variant === 6) return { question: `Find lower bound limit for |x - ${a}| < ${c}`, answer: String(a - c), explanation: "Center minus radius." };
  if (variant === 7) return { question: `Evaluate |-(${a})²| + ${c * 5}`, answer: String(a * a + c * 5), explanation: "Square the term first, then apply absolute value." };
  if (variant === 8) return { question: `Solve literal equation for x: |x + ${a}| = ${c + a}. Enter positive solution:`, answer: String(c), explanation: "Equate positive branch." };
  if (variant === 9) return { question: `Find absolute difference |-${a * 3}| - |-${b * 2}|`, answer: String(Math.abs(a * 3 - b * 2)), explanation: "Subtract absolute values." };
  if (variant === 10) return { question: `Solve |2x + ${a}| = ${a * 3}. Enter positive root x:`, answer: String(a), explanation: "2x + a = 3a -> 2x = 2a -> x = a." };
  if (variant === 11) return { question: `Evaluate |${a - c}| + |-${c}|`, answer: String(Math.abs(a - c) + c), explanation: "Sum absolute values." };
  if (variant === 12) return { question: `Find maximum integer x satisfying |x| ≤ ${c}`, answer: String(c), explanation: "Upper limit of absolute inequality." };
  if (variant === 13) return { question: `Solve equation 3|x - 2| = ${c * 3}. Enter positive x:`, answer: String(c + 2), explanation: "Divide by 3 then solve branches." };
  return { question: `Evaluate |-(${f} * 5)| - ${f}`, answer: String(4 * f), explanation: "Compute magnitude and subtract." };
}

function generateAlg2Unit2(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const m = randInt(2, 7, 1) * f;
  const x = randInt(2, 9, 2);
  const b = randInt(4, 15, 3) * f;
  const k = randInt(2, 8, 4);
  if (variant === 0) return { question: `Given linear function f(x) = ${m}x + ${b}, evaluate f(${x}).`, answer: String(m * x + b), explanation: "Substitute x value." };
  if (variant === 1) return { question: `Find slope of line passing through (2, ${b}) and (4, ${2 * m + b})`, answer: String(m), explanation: "Change in y over change in x." };
  if (variant === 2) return { question: `Find x-intercept for linear function y = ${m}x - ${m * 4}`, answer: "4", explanation: "Set y = 0." };
  if (variant === 3) return { question: `If f(x) = -${m}x + ${b * 2}, find f(3)`, answer: String(-m * 3 + b * 2), explanation: "Evaluate at x = 3." };
  if (variant === 4) return { question: `Find output y when x = ${f + 2} for rule y = ${m}x + ${b}`, answer: String(m * (f + 2) + b), explanation: "Substitute input." };
  if (variant === 5) return { question: `What is slope coefficient in equation ${m * 2}x - ${f}y = ${b}?`, answer: String(m * 2 / f), explanation: "Rewrite in slope-intercept form." };
  if (variant === 6) return { question: `Find y-intercept value for equation 3y - ${m}x = ${b * 3}`, answer: String(b), explanation: "Isolate y constant term." };
  if (variant === 7) return { question: `Given f(x) = ${m}x, evaluate composite expression 2 * f(${x}) - ${b}`, answer: String(2 * (m * x) - b), explanation: "Evaluate inner function first." };
  if (variant === 8) return { question: `Find input x if ${m}x + ${b} = ${m * 5 + b}`, answer: "5", explanation: "Equate and solve." };
  if (variant === 9) return { question: `Find constant k if line through (1, ${k}) and (3, ${k + m * 2}) has slope ${m}`, answer: String(k), explanation: "Apply slope formula." };
  if (variant === 10) return { question: `Find slope of line perpendicular to y = -(1/${m})x + 4`, answer: String(m), explanation: "Negative reciprocal slope." };
  if (variant === 11) return { question: `Evaluate linear expression ${m}x + ${b} when x = 0`, answer: String(b), explanation: "y-intercept evaluation." };
  if (variant === 12) return { question: `Find x-intercept for y = 2x - ${b * 2}`, answer: String(b), explanation: "Set y = 0." };
  if (variant === 13) return { question: `Find change in y if slope is ${m} and run is 5`, answer: String(5 * m), explanation: "Δy = m * Δx." };
  return { question: `Find slope of horizontal line parallel to y = ${b}`, answer: "0", explanation: "Horizontal lines have zero slope." };
}

function generateAlg2Unit3(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const x = randInt(2, 6, 1) * f;
  const y = randInt(1, 5, 2) * f;
  const z = randInt(1, 4, 3) * f;
  const sum = x + y + z;
  if (variant === 0) return { question: `In 3-variable system, if x + y + z = ${sum}, y = ${y}, and z = ${z}, what is x?`, answer: String(x), explanation: "Subtract y and z." };
  if (variant === 1) return { question: `If x + 2y + z = ${x + 2*y + z}, y = ${y}, and z = ${z}, find x`, answer: String(x), explanation: "Substitute variables." };
  if (variant === 2) return { question: `Given x = ${x}, y = ${y}, z = ${z}, evaluate 2x - y + 3z`, answer: String(2*x - y + 3*z), explanation: "Evaluate linear combination." };
  if (variant === 3) return { question: `If 2x + y + z = ${2*x + y + z} and y = ${y}, z = ${z}, find x`, answer: String(x), explanation: "Isolate 2x." };
  if (variant === 4) return { question: `If x + y = ${x + y} and z = ${z}, what is sum x + y + z?`, answer: String(x + y + z), explanation: "Combine sums." };
  if (variant === 5) return { question: `If 3x - y = ${3*x - y} and y = ${y}, find x`, answer: String(x), explanation: "Solve for x." };
  if (variant === 6) return { question: `If x + y + z = ${sum} and x + y = ${x + y}, find z`, answer: String(z), explanation: "Subtract partial sum." };
  if (variant === 7) return { question: `Given x + y + z = ${sum}, if x = ${x} and z = ${z}, find y`, answer: String(y), explanation: "Isolate y." };
  if (variant === 8) return { question: `If 4x = ${4*x} and y = ${y}, find product x * y`, answer: String(x * y), explanation: "Multiply variables." };
  if (variant === 9) return { question: `If x + 3y + 2z = ${x + 3*y + 2*z}, y = ${y}, and z = ${z}, find x`, answer: String(x), explanation: "Substitute values." };
  if (variant === 10) return { question: `If x + y = ${x + y} and x - y = ${x - y}, find x`, answer: String(x), explanation: "Add equations." };
  if (variant === 11) return { question: `If 2x + 2y = ${2*(x + y)} and x = ${x}, find y`, answer: String(y), explanation: "Substitute x." };
  if (variant === 12) return { question: `If x + y + z = ${sum} and x = ${x}, find y + z`, answer: String(y + z), explanation: "Subtract x." };
  if (variant === 13) return { question: `If 5x = ${5*x}, what is x + 2?`, answer: String(x + 2), explanation: "Solve for x and add 2." };
  return { question: `If x = ${x} and y = ${y}, what is 3x + 2y?`, answer: String(3*x + 2*y), explanation: "Evaluate expression." };
}

function generateAlg2Unit4(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const a = randInt(1, 5, 1) * f;
  const b = randInt(2, 6, 2) * f;
  if (variant === 0) return { question: `Find top-left element of matrix product [[${a}, ${b}], [1, 2]] * [[3, 1], [0, 2]]`, answer: String(a * 3 + b * 0), explanation: "Row 1 dot Column 1." };
  if (variant === 1) return { question: `Find scalar result: ${f} * [[${a}, 3], [2, 5]] top-left element`, answer: String(f * a), explanation: "Scalar multiplication." };
  if (variant === 2) return { question: `Add matrices [[${a}, 4], [2, 6]] + [[${b}, 1], [3, 2]]. Top-left element?`, answer: String(a + b), explanation: "Add corresponding entries." };
  if (variant === 3) return { question: `Find bottom-right element of product [[2, 1], [3, ${a}]] * [[1, 0], [0, ${f}]]`, answer: String(a * f), explanation: "Row 2 dot Column 2." };
  if (variant === 4) return { question: `Subtract matrices [[${a + 10}, 8], [6, 5]] - [[${a}, 2], [1, 1]] top-left element`, answer: "10", explanation: "Subtract matrix entries." };
  if (variant === 5) return { question: `Find top-right element of product [[${a}, 2], [1, 4]] * [[1, ${f}], [0, 1]]`, answer: String(a * f + 2), explanation: "Row 1 dot Column 2." };
  if (variant === 6) return { question: `Find trace of matrix [[${a}, 7], [4, ${b}]]`, answer: String(a + b), explanation: "Sum of main diagonal elements." };
  if (variant === 7) return { question: `Multiply ${f} * [[${a}, 2], [1, 3]] top-right element`, answer: String(2 * f), explanation: "Scalar multiplication." };
  if (variant === 8) return { question: `Find bottom-left element of [[1, ${a}], [2, 4]] * [[${f}, 0], [1, 1]]`, answer: String(2 * f + 4), explanation: "Row 2 dot Column 1." };
  if (variant === 9) return { question: `Find diagonal product element for [[${a}, 0], [0, ${b}]]`, answer: String(a * b), explanation: "Multiply diagonal." };
  if (variant === 10) return { question: `Find top-left element of identity matrix product I * [[${a}, 3], [4, 5]]`, answer: String(a), explanation: "Identity matrix preserves values." };
  if (variant === 11) return { question: `Find sum of row 1 elements in [[${a}, ${b}], [1, 2]]`, answer: String(a + b), explanation: "Add row entries." };
  if (variant === 12) return { question: `Find element at row 2, column 2 of [[1, 2], [3, ${a}]]`, answer: String(a), explanation: "Direct matrix lookup." };
  if (variant === 13) return { question: `Find trace of 2x2 identity matrix I`, answer: "2", explanation: "1 + 1 = 2." };
  return { question: `Multiply scalar 2 * [[${a}, 1], [0, 3]] bottom-right element`, answer: "6", explanation: "2 * 3 = 6." };
}

function generateAlg2Unit5(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const a = randInt(1, 6, 1) * f;
  const b = randInt(2, 5, 2);
  const c = randInt(1, 4, 3);
  const d = randInt(2, 7, 4) * f;
  const det = (a * d) - (b * c);
  if (variant === 0) return { question: `Find determinant of 2x2 matrix [[${a}, ${b}], [${c}, ${d}]].`, answer: String(det), explanation: "Apply ad - bc." };
  if (variant === 1) return { question: `Find determinant of [[${f * 2}, 1], [3, ${f * 4}]]`, answer: String(f * 2 * (f * 4) - 3), explanation: "Compute ad - bc." };
  if (variant === 2) return { question: `Find determinant of [[${f}, 0], [0, ${f}]]`, answer: String(f * f), explanation: "Diagonal product." };
  if (variant === 3) return { question: `Find determinant of upper triangular matrix [[${a}, ${b}], [0, ${d}]]`, answer: String(a * d), explanation: "Triangular determinant." };
  if (variant === 4) return { question: `Using Cramer's Rule, solve for x in system: x + y = ${5 * f}, 2x + 3y = ${13 * f}. Enter x:`, answer: String(2 * f), explanation: "Dx / D." };
  if (variant === 5) return { question: `Using Cramer's Rule, solve for y in system: x + y = ${5 * f}, 2x + 3y = ${13 * f}. Enter y:`, answer: String(3 * f), explanation: "Dy / D." };
  if (variant === 6) return { question: `Find determinant of [[${a}, 0], [5, 3]]`, answer: String(a * 3), explanation: "Main diagonal product." };
  if (variant === 7) return { question: `Find determinant of [[${f}, ${f}], [${f}, ${f}]]`, answer: "0", explanation: "Duplicate rows." };
  if (variant === 8) return { question: `Using Cramer's Rule, find determinant D for system 2x + y = 4, x - y = 2`, answer: "-3", explanation: "2(-1) - 1(1) = -3." };
  if (variant === 9) return { question: `Find determinant of [[${a}, 2], [1, ${a}]]`, answer: String(a * a - 2), explanation: "Compute a² - 2." };
  if (variant === 10) return { question: `Find determinant of [[1, 2], [3, 4]]`, answer: "-2", explanation: "1(4) - 2(3) = -2." };
  if (variant === 11) return { question: `Find determinant of [[5, 1], [2, 3]]`, answer: "13", explanation: "5(3) - 1(2) = 13." };
  if (variant === 12) return { question: `Find determinant of [[0, 1], [1, 0]]`, answer: "-1", explanation: "0 - 1 = -1." };
  if (variant === 13) return { question: `Find determinant of [[2, 0], [0, 2]]`, answer: "4", explanation: "2 * 2 = 4." };
  return { question: `Find determinant of [[4, 1], [2, 3]]`, answer: "10", explanation: "4(3) - 1(2) = 10." };
}

function generateAlg2Unit6(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const r = randInt(2, 7, 1) * f;
  if (variant === 0) return { question: `Simplify product (3 + ${r}i)(3 - ${r}i). Enter real result:`, answer: String(9 + r * r), explanation: "a² + b²." };
  if (variant === 1) return { question: `Find x-coordinate of vertex for quadratic function y = x² - ${4 * f}x + ${3 * f * f}`, answer: String(2 * f), explanation: "x = -b / (2a)." };
  if (variant === 2) return { question: `Add complex numbers: (${f} + 2i) + (1 + ${r}i). Real part?`, answer: String(f + 1), explanation: "Combine real parts." };
  if (variant === 3) return { question: `Find discriminant b² - 4ac for x² + ${6 * f}x + ${8 * f * f} = 0`, answer: String(36 * f * f - 32 * f * f), explanation: "b² - 4ac." };
  if (variant === 4) return { question: `Subtract complex numbers: (${r} + 5i) - (3 + 2i). Imaginary coefficient?`, answer: "3", explanation: "Subtract imaginary parts." };
  if (variant === 5) return { question: `Find vertex y-value for quadratic function y = x² - ${2 * f}x + ${f * f + 3}`, answer: "3", explanation: "Evaluate function at vertex x." };
  if (variant === 6) return { question: `Simplify complex sum (${f} + i) + (${f + 1} - i). Real sum?`, answer: String(2 * f + 1), explanation: "Combine real components." };
  if (variant === 7) return { question: `Evaluate power of i: What is i^${4 * f + 2}?`, answer: "-1", explanation: "Simplify exponent modulo 4." };
  if (variant === 8) return { question: `Find axis of symmetry equation value x for quadratic function y = 2x² - ${8 * f}x + 5`, answer: String(2 * f), explanation: "x = -b / (2a)." };
  if (variant === 9) return { question: `Find absolute magnitude squared |${f} + ${r}i|²`, answer: String(f * f + r * r), explanation: "Real² + imaginary²." };
  if (variant === 10) return { question: `Evaluate product (2 + i)(2 - i)`, answer: "5", explanation: "2² + 1² = 5." };
  if (variant === 11) return { question: `Find y-intercept for quadratic function y = x² + 3x + ${5 * f}`, answer: String(5 * f), explanation: "Constant term." };
  if (variant === 12) return { question: `Evaluate i^4`, answer: "1", explanation: "i^4 = 1." };
  if (variant === 13) return { question: `Find real part of complex product (1 + i)(1 + 2i)`, answer: "-1", explanation: "1 - 2 = -1." };
  return { question: `Evaluate (3 + 2i) + (3 - 2i). Real result?`, answer: "6", explanation: "Sum real parts." };
}

function generateAlg2Unit7(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const root = randInt(1, 6, 1) * f;
  if (variant === 0) return { question: `Find degree of polynomial P(x) = (x - ${root})^${f + 2} * (x + 2)^3`, answer: String(f + 5), explanation: "Sum of multiplicities." };
  if (variant === 1) return { question: `How many distinct x-intercept roots does P(x) = x(x - ${f})(x + 3)(x - 5) have?`, answer: "4", explanation: "Count distinct linear factors." };
  if (variant === 2) return { question: `Find leading coefficient of polynomial P(x) = ${f * 3}x^4 - 2x² + 5`, answer: String(f * 3), explanation: "Highest degree coefficient." };
  if (variant === 3) return { question: `What is end behavior limit as x -> ∞ for P(x) = -${f}x^6? (Enter -1 for negative, 1 for positive)`, answer: "-1", explanation: "Negative even-degree end behavior." };
  if (variant === 4) return { question: `Find y-intercept of polynomial P(x) = x³ + ${f}x² - ${root * 4}`, answer: String(-root * 4), explanation: "Evaluate P(0)." };
  if (variant === 5) return { question: `Find degree of polynomial product (x^${f} + 1)(x^${f + 1} - 2)`, answer: String(2 * f + 1), explanation: "Add degrees." };
  if (variant === 6) return { question: `How many turning points at most does a degree ${f + 3} polynomial have?`, answer: String(f + 2), explanation: "n - 1 turning points." };
  if (variant === 7) return { question: `Find constant term of polynomial product (x - ${f})(x - 3)`, answer: String(3 * f), explanation: "Multiply constant terms." };
  if (variant === 8) return { question: `Find multiplicity of root x = ${f} in P(x) = (x - ${f})^${f + 4}`, answer: String(f + 4), explanation: "Factor exponent." };
  if (variant === 9) return { question: `What is maximum number of real zeros for a degree ${f * 2} polynomial?`, answer: String(f * 2), explanation: "Degree equals max real roots." };
  if (variant === 10) return { question: `Find degree of monomial 5x^7`, answer: "7", explanation: "Exponent is 7." };
  if (variant === 11) return { question: `Find leading coefficient of 3x^5 - 2x + 1`, answer: "3", explanation: "Coefficient of x^5." };
  if (variant === 12) return { question: `Find constant term of x³ + 4x² - 7`, answer: "-7", explanation: "Constant term is -7." };
  if (variant === 13) return { question: `How many real roots does x² + 4 = 0 have?`, answer: "0", explanation: "No real solutions." };
  return { question: `Find degree of binomial x² - 9`, answer: "2", explanation: "Highest exponent is 2." };
}

function generateAlg2Unit8(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const c = randInt(1, 6, 1) * f;
  const rem = c * c + 3 * c + 2;
  if (variant === 0) return { question: `Using remainder theorem, find remainder when x² + 3x + 2 is divided by (x - ${c})`, answer: String(rem), explanation: "Substitute x = c." };
  if (variant === 1) return { question: `Find remainder when x² - ${c * c} is divided by (x - ${c})`, answer: "0", explanation: "Exact factor remainder is 0." };
  if (variant === 2) return { question: `Using synthetic division, find remainder for (x³ - ${f * f * f}) / (x - ${f})`, answer: "0", explanation: "Evaluate at root." };
  if (variant === 3) return { question: `Find remainder when ${f}x² + x + 5 is divided by (x - 1)`, answer: String(f + 6), explanation: "Evaluate at x = 1." };
  if (variant === 4) return { question: `What is remainder when x³ + 2x² + x + ${f} is divided by (x + 1)?`, answer: String(f), explanation: "Evaluate at x = -1." };
  if (variant === 5) return { question: `Find remainder when x² + ${f + 5}x + ${f * 6} is divided by (x + ${f})`, answer: "0", explanation: "Substitute root." };
  if (variant === 6) return { question: `Find constant remainder when ${f}x - 5 is divided by (x - 2)`, answer: String(2 * f - 5), explanation: "Evaluate at x = 2." };
  if (variant === 7) return { question: `Find remainder when x² is divided by (x - ${c})`, answer: String(c * c), explanation: "Substitute x = c." };
  if (variant === 8) return { question: `Find remainder for (x^4 - ${f * f * f * f}) / (x - ${f})`, answer: "0", explanation: "Evaluate quartic polynomial." };
  if (variant === 9) return { question: `Find remainder when ${f}x² + x + 1 is divided by (x - 2)`, answer: String(f * 4 + 3), explanation: "Evaluate at x = 2." };
  if (variant === 10) return { question: `Find remainder when x² + 5x + 6 is divided by (x + 2)`, answer: "0", explanation: "x = -2 is root." };
  if (variant === 11) return { question: `Find remainder when 3x - 1 is divided by (x - 3)`, answer: "8", explanation: "3(3) - 1 = 8." };
  if (variant === 12) return { question: `Find remainder when x³ is divided by (x - 2)`, answer: "8", explanation: "2³ = 8." };
  if (variant === 13) return { question: `Find remainder when 4x² + 2 is divided by (x - 1)`, answer: "6", explanation: "4(1)² + 2 = 6." };
  return { question: `Find remainder when 2x - 4 is divided by (x - 2)`, answer: "0", explanation: "Exact factor." };
}

function generateAlg2Unit9(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const base = randInt(2, 4, 1);
  const ans = Math.pow(base, 3);
  if (variant === 0) return { question: `Evaluate rational exponent expression: (${ans * f * f})^(1/2)`, answer: String(base * f), explanation: "Square root." };
  if (variant === 1) return { question: `Evaluate expression: ${16 * f * f}^(1/2)`, answer: String(4 * f), explanation: "Square root of 16f²." };
  if (variant === 2) return { question: `Simplify radical expression: sqrt(${36 * f * f} * x²) evaluated for x = 1`, answer: String(6 * f), explanation: "Square root of coefficient." };
  if (variant === 3) return { question: `Evaluate (${8 * f * f * f})^(2/3)`, answer: String(4 * f * f), explanation: "Cube root (2f) then square (4f²)." };
  if (variant === 4) return { question: `Solve radical equation: sqrt(x + ${f * 4}) = ${f + 3}. What is x?`, answer: String((f + 3) * (f + 3) - f * 4), explanation: "Square both sides." };
  if (variant === 5) return { question: `Evaluate (${27 * f * f * f})^(1/3)`, answer: String(3 * f), explanation: "Cube root." };
  if (variant === 6) return { question: `Simplify x^(1/2) * x^(1/2) for x = ${f * 3}`, answer: String(f * 3), explanation: "Add exponents 1/2 + 1/2 = 1." };
  if (variant === 7) return { question: `Evaluate (${4 * f * f})^(3/2)`, answer: String(8 * f * f * f), explanation: "Square root cubed." };
  if (variant === 8) return { question: `Solve radical equation sqrt(x) = ${f * 5}. What is x?`, answer: String(25 * f * f), explanation: "Square both sides." };
  if (variant === 9) return { question: `Evaluate (${32 * f * f * f * f * f})^(1/5)`, answer: String(2 * f), explanation: "Fifth root." };
  if (variant === 10) return { question: `Evaluate 8^(1/3)`, answer: "2", explanation: "Cube root of 8." };
  if (variant === 11) return { question: `Evaluate 9^(1/2)`, answer: "3", explanation: "Square root of 9." };
  if (variant === 12) return { question: `Evaluate 64^(1/3)`, answer: "4", explanation: "Cube root of 64." };
  if (variant === 13) return { question: `Evaluate 125^(1/3)`, answer: "5", explanation: "Cube root of 125." };
  return { question: `Evaluate 4^(1/2)`, answer: "2", explanation: "Square root of 4." };
}

function generateAlg2Unit10(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  if (variant === 0) return { question: `Solve exponential growth model: 2^x = ${2 * 2 * 2 * f} / ${f}`, answer: "3", explanation: "Match exponents." };
  if (variant === 1) return { question: `Solve 3^x = ${27 * f} / ${f}`, answer: "3", explanation: "3³ = 27." };
  if (variant === 2) return { question: `Evaluate exponential function y = ${f}(2)^x when x = 3`, answer: String(f * 8), explanation: "Compute value." };
  if (variant === 3) return { question: `Solve 5^x = ${125 * f} / ${f}`, answer: "3", explanation: "5³ = 125." };
  if (variant === 4) return { question: `Find initial value coefficient a in y = ${50 * f}(1.04)^x`, answer: String(50 * f), explanation: "Initial value coefficient." };
  if (variant === 5) return { question: `Solve 4^x = ${16 * f} / ${f}`, answer: "2", explanation: "4² = 16." };
  if (variant === 6) return { question: `Evaluate expression ${f} * 2^4`, answer: String(16 * f), explanation: "Compute power and multiply." };
  if (variant === 7) return { question: `Solve 10^x = ${1000 * f} / ${f}`, answer: "3", explanation: "10³ = 1000." };
  if (variant === 8) return { question: `Evaluate ${f} * 3^3`, answer: String(27 * f), explanation: "Evaluate 3³." };
  if (variant === 9) return { question: `Solve exponential equation 2^(x + 1) = ${8 * f} / ${f}`, answer: "2", explanation: "x + 1 = 3." };
  if (variant === 10) return { question: `Solve 2^x = 8`, answer: "3", explanation: "2³ = 8." };
  if (variant === 11) return { question: `Solve 3^x = 9`, answer: "2", explanation: "3² = 9." };
  if (variant === 12) return { question: `Evaluate 2^3`, answer: "8", explanation: "2 * 2 * 2 = 8." };
  if (variant === 13) return { question: `Evaluate 5^2`, answer: "25", explanation: "5 * 5 = 25." };
  return { question: `Solve 10^x = 100`, answer: "2", explanation: "10² = 100." };
}

function generateAlg2Unit11(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const base = randInt(2, 5, 1);
  const exp = randInt(2, 4, 2);
  const val = Math.pow(base, exp);
  if (variant === 0) return { question: `Evaluate logarithmic expression: log_${base}(${val * f}) - log_${base}(${f})`, answer: String(exp), explanation: "Quotient property." };
  if (variant === 1) return { question: `Evaluate log_2(${32 * f}) - log_2(${f})`, answer: "5", explanation: "Simplify log rule." };
  if (variant === 2) return { question: `Evaluate log_3(${81 * f}) - log_3(${f})`, answer: "4", explanation: "3^4 = 81." };
  if (variant === 3) return { question: `Evaluate log_10(${10000 * f}) - log_10(${f})`, answer: "4", explanation: "10^4 = 10000." };
  if (variant === 4) return { question: `Evaluate log_5(${125 * f}) - log_5(${f})`, answer: "3", explanation: "5³ = 125." };
  if (variant === 5) return { question: `Evaluate log_7(${49 * f}) - log_7(${f})`, answer: "2", explanation: "7² = 49." };
  if (variant === 6) return { question: `Evaluate log_${base + 2}(${base + 2}) * ${f}`, answer: String(f), explanation: "Log base to itself is 1." };
  if (variant === 7) return { question: `Evaluate log_4(1) + ${f}`, answer: String(f), explanation: "Log of 1 is 0." };
  if (variant === 8) return { question: `Evaluate log_2(${64 * f}) - log_2(${f})`, answer: "6", explanation: "2^6 = 64." };
  if (variant === 9) return { question: `Evaluate log_6(${216 * f}) - log_6(${f})`, answer: "3", explanation: "6³ = 216." };
  if (variant === 10) return { question: `Evaluate log_2(8)`, answer: "3", explanation: "2³ = 8." };
  if (variant === 11) return { question: `Evaluate log_3(27)`, answer: "3", explanation: "3³ = 27." };
  if (variant === 12) return { question: `Evaluate log_10(100)`, answer: "2", explanation: "10² = 100." };
  if (variant === 13) return { question: `Evaluate log_5(25)`, answer: "2", explanation: "5² = 25." };
  return { question: `Evaluate log_2(4)`, answer: "2", explanation: "2² = 4." };
}

function generateAlg2Unit12(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const c = randInt(3, 10, 1) * f;
  if (variant === 0) return { question: `Solve logarithmic equation: ln(x) = ln(${c})`, answer: String(c), explanation: "Property of equality." };
  if (variant === 1) return { question: `Solve log_2(x) = ${f + 1}`, answer: String(Math.pow(2, f + 1)), explanation: "Convert to exponential form." };
  if (variant === 2) return { question: `Solve log_3(x) = 4`, answer: "81", explanation: "3^4 = 81." };
  if (variant === 3) return { question: `Solve e^x = e^${f + 4}`, answer: String(f + 4), explanation: "Equate exponents." };
  if (variant === 4) return { question: `Solve log_10(x) = 2`, answer: "100", explanation: "10² = 100." };
  if (variant === 5) return { question: `Solve 2^x = ${16 * f} / ${f}`, answer: "4", explanation: "2^4 = 16." };
  if (variant === 6) return { question: `Solve log_5(x) = 3`, answer: "125", explanation: "5³ = 125." };
  if (variant === 7) return { question: `Solve log_x(8) = 3`, answer: "2", explanation: "x³ = 8." };
  if (variant === 8) return { question: `Solve log_4(x) = 2`, answer: "16", explanation: "4² = 16." };
  if (variant === 9) return { question: `Solve ln(e^${f * 3})`, answer: String(f * 3), explanation: "Inverse property." };
  if (variant === 10) return { question: `Solve log_2(x) = 3`, answer: "8", explanation: "2³ = 8." };
  if (variant === 11) return { question: `Solve log_3(x) = 3`, answer: "27", explanation: "3³ = 27." };
  if (variant === 12) return { question: `Solve log_10(x) = 3`, answer: "1000", explanation: "10³ = 1000." };
  if (variant === 13) return { question: `Solve 2^x = 32`, answer: "5", explanation: "2^5 = 32." };
  return { question: `Solve e^x = e^7`, answer: "7", explanation: "x = 7." };
}

function generateAlg2Unit13(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const n = randInt(2, 6, 1) * f;
  if (variant === 0) return { question: `Simplify rational expression: (x² - ${n * n}) / (x - ${n}) when x = ${n + 3}`, answer: String(n + 3 + n), explanation: "Factor numerator." };
  if (variant === 1) return { question: `Simplify fraction: ${4 * f}x² / (${2 * f}x) when x = 3`, answer: String(6 * f), explanation: "Cancel factors." };
  if (variant === 2) return { question: `Find excluded value for (x + 1) / (x - ${n})`, answer: String(n), explanation: "Denominator non-zero." };
  if (variant === 3) return { question: `Simplify: (x² - 1) / (x - 1) when x = ${f + 5}`, answer: String(f + 6), explanation: "x + 1." };
  if (variant === 4) return { question: `Find excluded value for 3 / (${f}x + ${f * 3})`, answer: "-3", explanation: "Set denominator to 0." };
  if (variant === 5) return { question: `Simplify: ${10 * f}x³ / (${5 * f}x²) when x = 2`, answer: "4", explanation: "Divide terms." };
  if (variant === 6) return { question: `Simplify: (x² - 9) / (x + 3) when x = ${f + 3}`, answer: String(f), explanation: "(x + 3) simplifies to x - 3 -> f." };
  if (variant === 7) return { question: `Find excluded positive value for 1 / (x² - ${n * n})`, answer: String(n), explanation: "x² = n²." };
  if (variant === 8) return { question: `Simplify product: (${6 * f}x / 3x)`, answer: String(2 * f), explanation: "Cancel x." };
  if (variant === 9) return { question: `Simplify: (2x² + ${4 * f}x) / (2x) when x = 3`, answer: String(3 + 2 * f), explanation: "Factor out 2x." };
  if (variant === 10) return { question: `Find excluded value for 5 / (x - 4)`, answer: "4", explanation: "x = 4." };
  if (variant === 11) return { question: `Simplify: 4x / 2 when x = 5`, answer: "10", explanation: "2(5) = 10." };
  if (variant === 12) return { question: `Find excluded value for 1 / (x + 7)`, answer: "-7", explanation: "x = -7." };
  if (variant === 13) return { question: `Simplify: 9x² / 3x when x = 2`, answer: "6", explanation: "3(2) = 6." };
  return { question: `Find excluded value for 2 / (x - 10)`, answer: "10", explanation: "x = 10." };
}

function generateAlg2Unit14(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const divisors = [2, 3, 4, 6];
  const d = divisors[randInt(0, divisors.length - 1, 1)];
  const ans = d * f;
  if (variant === 0) return { question: `Solve rational equation: ${12 * f} / x = ${(12 / d) * f}`, answer: String(ans), explanation: "Cross-multiply and divide." };
  if (variant === 1) return { question: `Solve ${10 * f} / x = ${f}`, answer: "10", explanation: "Isolate x." };
  if (variant === 2) return { question: `Solve x / 3 = ${4 * f}`, answer: String(12 * f), explanation: "Multiply by 3." };
  if (variant === 3) return { question: `Solve ${6 * f} / (x + 1) = ${f}`, answer: "5", explanation: "Solve proportion." };
  if (variant === 4) return { question: `Solve ${15 * f} / x = ${3 * f}`, answer: "5", explanation: "Divide both sides." };
  if (variant === 5) return { question: `Solve x / 4 = ${5 * f}`, answer: String(20 * f), explanation: "Multiply by 4." };
  if (variant === 6) return { question: `Solve ${8 * f} / x = ${4 * f}`, answer: "2", explanation: "Solve for x." };
  if (variant === 7) return { question: `Solve ${20 * f} / (x - 2) = ${4 * f}`, answer: "7", explanation: "Cross-multiply." };
  if (variant === 8) return { question: `Solve ${14 * f} / x = ${7 * f}`, answer: "2", explanation: "Solve for x." };
  if (variant === 9) return { question: `Solve ${9 * f} / (x + 3) = ${f}`, answer: "6", explanation: "Solve proportion." };
  if (variant === 10) return { question: `Solve 4 / x = 2`, answer: "2", explanation: "x = 2." };
  if (variant === 11) return { question: `Solve 10 / x = 5`, answer: "2", explanation: "x = 2." };
  if (variant === 12) return { question: `Solve x / 2 = 6`, answer: "12", explanation: "x = 12." };
  if (variant === 13) return { question: `Solve 6 / x = 3`, answer: "2", explanation: "x = 2." };
  return { question: `Solve 12 / x = 4`, answer: "3", explanation: "x = 3." };
}

function generateAlg2Unit15(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const rBase = randInt(3, 7, 1) * f;
  const r2 = rBase * rBase;
  if (variant === 0) return { question: `What is radius r of circle given by equation x² + y² = ${r2}?`, answer: String(rBase), explanation: "Square root of r²." };
  if (variant === 1) return { question: `Find radius of circle x² + y² = ${25 * f * f}`, answer: String(5 * f), explanation: "Square root of 25f²." };
  if (variant === 2) return { question: `Find radius of circle x² + y² = ${81 * f * f}`, answer: String(9 * f), explanation: "Square root of 81f²." };
  if (variant === 3) return { question: `Find center x-coordinate for circle (x - ${3 * f})² + (y - 4)² = 25`, answer: String(3 * f), explanation: "Horizontal center h." };
  if (variant === 4) return { question: `Find center y-coordinate for circle (x + 1)² + (y - ${5 * f})² = 16`, answer: String(5 * f), explanation: "Vertical center k." };
  if (variant === 5) return { question: `Find radius of circle x² + y² = ${100 * f * f}`, answer: String(10 * f), explanation: "Square root of 100f²." };
  if (variant === 6) return { question: `Find radius of circle x² + y² = ${49 * f * f}`, answer: String(7 * f), explanation: "Square root of 49f²." };
  if (variant === 7) return { question: `What is r² value for circle with radius ${6 * f} centered at origin?`, answer: String(36 * f * f), explanation: "Square the radius." };
  if (variant === 8) return { question: `Find radius of circle x² + y² = ${16 * f * f}`, answer: String(4 * f), explanation: "Square root of 16f²." };
  if (variant === 9) return { question: `Find center x-coordinate for circle (x + ${2 * f})² + y² = 9`, answer: String(-2 * f), explanation: "Shift h." };
  if (variant === 10) return { question: `Find radius of circle x² + y² = 9`, answer: "3", explanation: "sqrt(9) = 3." };
  if (variant === 11) return { question: `Find radius of circle x² + y² = 4`, answer: "2", explanation: "sqrt(4) = 2." };
  if (variant === 12) return { question: `Find radius of circle x² + y² = 1`, answer: "1", explanation: "sqrt(1) = 1." };
  if (variant === 13) return { question: `Find center y-coordinate for x² + (y - 3)² = 25`, answer: "3", explanation: "k = 3." };
  return { question: `Find center x-coordinate for (x - 5)² + y² = 16`, answer: "5", explanation: "h = 5." };
}

function generateAlg2Unit16(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const start = randInt(1, 5, 1) * f;
  if (variant === 0) return { question: `Find 4th term of geometric sequence with first term ${start} and common ratio 2.`, answer: String(start * Math.pow(2, 3)), explanation: "a_n = a_1 * r^(n-1)." };
  if (variant === 1) return { question: `Find 5th term of arithmetic sequence with start ${3 * f} and common difference 4.`, answer: String(3 * f + 16), explanation: "Arithmetic formula." };
  if (variant === 2) return { question: `Find 3rd term of geometric sequence with start ${2 * f} and ratio 3.`, answer: String(2 * f * 9), explanation: "a_1 * r²." };
  if (variant === 3) return { question: `Find 10th term of arithmetic sequence with start ${f} and common difference 1.`, answer: String(f + 9), explanation: "a_1 + 9d." };
  if (variant === 4) return { question: `Find 2nd term of geometric sequence with start ${5 * f} and ratio 4.`, answer: String(20 * f), explanation: "Multiply by ratio." };
  if (variant === 5) return { question: `Find 4th term of arithmetic sequence with start ${2 * f} and difference 3.`, answer: String(2 * f + 9), explanation: "Add difference." };
  if (variant === 6) return { question: `Find common ratio if geometric sequence terms are ${3 * f}, ${6 * f}, ${12 * f}...`, answer: "2", explanation: "Ratio between terms." };
  if (variant === 7) return { question: `Find common difference if arithmetic sequence terms are ${5 * f}, ${8 * f}, ${11 * f}...`, answer: String(3 * f), explanation: "Difference between terms." };
  if (variant === 8) return { question: `Find 3rd term of arithmetic sequence starting at ${10 * f} with difference -2.`, answer: String(10 * f - 4), explanation: "Arithmetic formula." };
  if (variant === 9) return { question: `Find 3rd term of geometric sequence with start ${f} and ratio 5.`, answer: String(f * 25), explanation: "a_1 * r²." };
  if (variant === 10) return { question: `Find 2nd term of arithmetic sequence starting at 4 with difference 3.`, answer: "7", explanation: "4 + 3 = 7." };
  if (variant === 11) return { question: `Find 2nd term of geometric sequence starting at 2 with ratio 4.`, answer: "8", explanation: "2 * 4 = 8." };
  if (variant === 12) return { question: `Find 3rd term of arithmetic sequence starting at 1 with difference 2.`, answer: "5", explanation: "1 + 2(2) = 5." };
  if (variant === 13) return { question: `Find common ratio for 5, 15, 45...`, answer: "3", explanation: "15 / 5 = 3." };
  return { question: `Find common difference for 10, 15, 20...`, answer: "5", explanation: "15 - 10 = 5." };
}

function generateAlg2Unit17(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const n = randInt(5, 8, 1) + f;
  if (variant === 0) return { question: `Evaluate permutation P(${n}, 2):`, answer: String(n * (n - 1)), explanation: "n! / (n-r)!." };
  if (variant === 1) return { question: `Evaluate combination C(5, 2) * ${f}:`, answer: String(10 * f), explanation: "Combination scaled." };
  if (variant === 2) return { question: `Evaluate P(4, 2) * ${f}:`, answer: String(12 * f), explanation: "Permutation scaled." };
  if (variant === 3) return { question: `Evaluate combination C(6, 1) * ${f}:`, answer: String(6 * f), explanation: "Choosing 1." };
  if (variant === 4) return { question: `Evaluate factorial expression ${f} * 4!`, answer: String(24 * f), explanation: "4! = 24." };
  if (variant === 5) return { question: `Evaluate permutation P(5, 1) * ${f}:`, answer: String(5 * f), explanation: "P(n, 1) = n." };
  if (variant === 6) return { question: `Evaluate combination C(4, 4) * ${f}:`, answer: String(f), explanation: "C(n, n) = 1." };
  if (variant === 7) return { question: `Evaluate factorial expression ${f} * 3!`, answer: String(6 * f), explanation: "3! = 6." };
  if (variant === 8) return { question: `Evaluate combination C(6, 2):`, answer: "15", explanation: "15 combinations." };
  if (variant === 9) return { question: `Evaluate permutation P(3, 3) * ${f}:`, answer: String(6 * f), explanation: "3! * factor." };
  if (variant === 10) return { question: `Evaluate 2!`, answer: "2", explanation: "2 * 1 = 2." };
  if (variant === 11) return { question: `Evaluate C(5, 0):`, answer: "1", explanation: "C(n, 0) = 1." };
  if (variant === 12) return { question: `Evaluate P(4, 1):`, answer: "4", explanation: "P(n, 1) = n." };
  if (variant === 13) return { question: `Evaluate 1!`, answer: "1", explanation: "1! = 1." };
  return { question: `Evaluate C(3, 1):`, answer: "3", explanation: "3 choices." };
}

function generateAlg2Unit18(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const mean = randInt(50, 70, 1) * f;
  const sd = 5 * f;
  if (variant === 0) return { question: `In normal distribution with mean ${mean} and SD ${sd}, what is z-score for x = ${mean + sd}?`, answer: "1", explanation: "(x - mean) / sd." };
  if (variant === 1) return { question: `Find z-score if mean = ${50 * f}, sd = ${10 * f}, and x = ${70 * f}`, answer: "2", explanation: "(70 - 50) / 10." };
  if (variant === 2) return { question: `Find z-score if mean = ${100 * f}, sd = ${15 * f}, and x = ${85 * f}`, answer: "-1", explanation: "(85 - 100) / 15." };
  if (variant === 3) return { question: `What percentage of data falls within 1 standard deviation in a normal distribution?`, answer: "68", explanation: "Empirical rule." };
  if (variant === 4) return { question: `Find z-score if mean = ${60 * f}, sd = ${5 * f}, and x = ${60 * f}`, answer: "0", explanation: "x equals mean." };
  if (variant === 5) return { question: `What percentage of data falls within 2 standard deviations?`, answer: "95", explanation: "95% rule." };
  if (variant === 6) return { question: `Find x-value if mean = ${50 * f}, sd = ${10 * f}, and z-score = 1`, answer: String(60 * f), explanation: "mean + z*sd." };
  if (variant === 7) return { question: `Find z-score if mean = ${75 * f}, sd = ${5 * f}, and x = ${85 * f}`, answer: "2", explanation: "(85 - 75) / 5." };
  if (variant === 8) return { question: `What percentage falls within 3 standard deviations (approx whole %)?`, answer: "99", explanation: "Empirical rule 99%." };
  if (variant === 9) return { question: `Find z-score if mean = ${40 * f}, sd = ${4 * f}, and x = ${32 * f}`, answer: "-2", explanation: "(32 - 40) / 4." };
  if (variant === 10) return { question: `What percentage falls above mean in normal distribution?`, answer: "50", explanation: "Symmetrical distribution." };
  if (variant === 11) return { question: `Find z-score if mean = 10, sd = 2, and x = 14`, answer: "2", explanation: "(14 - 10) / 2 = 2." };
  if (variant === 12) return { question: `Find z-score if mean = 20, sd = 5, and x = 10`, answer: "-2", explanation: "(10 - 20) / 5 = -2." };
  if (variant === 13) return { question: `What is median of a standard normal distribution?`, answer: "0", explanation: "Mean and median are 0 in standard normal." };
  return { question: `What is variance if standard deviation is 3?`, answer: "9", explanation: "Variance is SD squared (3² = 9)." };
}

function generateAlg2Unit19(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  if (variant === 0) return { question: `What is exact value of sin(90°) * ${f}?`, answer: String(f), explanation: "sin(90°) = 1." };
  if (variant === 1) return { question: `What is exact value of cos(0°) * ${f}?`, answer: String(f), explanation: "cos(0°) = 1." };
  if (variant === 2) return { question: `What is exact value of sin(0°)?`, answer: "0", explanation: "sin(0°) = 0." };
  if (variant === 3) return { question: `What is cos(180°) * ${f}?`, answer: String(-f), explanation: "cos(180°) = -1." };
  if (variant === 4) return { question: `What is sin(270°) * ${f}?`, answer: String(-f), explanation: "sin(270°) = -1." };
  if (variant === 5) return { question: `What is tan(45°) * ${f}?`, answer: String(f), explanation: "tan(45°) = 1." };
  if (variant === 6) return { question: `What quadrant does 120° angle lie in? (Enter number 1-4)`, answer: "2", explanation: "Q2." };
  if (variant === 7) return { question: `What is cos(90°)?`, answer: "0", explanation: "cos(90°) = 0." };
  if (variant === 8) return { question: `What quadrant does 220° angle lie in?`, answer: "3", explanation: "Q3." };
  if (variant === 9) return { question: `What is sin(180°)?`, answer: "0", explanation: "sin(180°) = 0." };
  if (variant === 10) return { question: `What is cos(360°)?`, answer: "1", explanation: "cos(360°) = 1." };
  if (variant === 11) return { question: `In a 30°-60°-90° right triangle with hypotenuse ${2 * f}, find the side opposite the 30° angle:`, answer: String(f), explanation: "sin(30°) = 1/2 -> opposite = hypotenuse / 2 = f." };
  if (variant === 12) return { question: `What quadrant does 45° angle lie in?`, answer: "1", explanation: "Q1." };
  if (variant === 13) return { question: `What quadrant does 300° angle lie in?`, answer: "4", explanation: "Q4." };
  return { question: `What is tan(0°)?`, answer: "0", explanation: "tan(0°) = 0." };
}

function generateAlg2Unit20(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const amp = randInt(2, 5, 1) * f;
  if (variant === 0) return { question: `What is amplitude of trigonometric function y = ${amp} sin(x)?`, answer: String(amp), explanation: "Leading coefficient absolute value." };
  if (variant === 1) return { question: `What is amplitude of y = ${3 * f} cos(2x)?`, answer: String(3 * f), explanation: "Amplitude coefficient." };
  if (variant === 2) return { question: `What is maximum peak value of y = ${4 * f} sin(x)?`, answer: String(4 * f), explanation: "Max peak equals amplitude." };
  if (variant === 3) return { question: `What is amplitude of y = -${5 * f} sin(x)?`, answer: String(5 * f), explanation: "Always positive." };
  if (variant === 4) return { question: `What is minimum trough value of y = ${2 * f} cos(x)?`, answer: String(-2 * f), explanation: "Negative amplitude." };
  if (variant === 5) return { question: `What is amplitude of y = ${7 * f} cos(x)?`, answer: String(7 * f), explanation: "Coefficient 7*factor." };
  if (variant === 6) return { question: `Find vertical shift constant in y = 2 sin(x) + ${4 * f}`, answer: String(4 * f), explanation: "Midline shift." };
  if (variant === 7) return { question: `What is maximum value of y = 3 cos(x) + ${f}?`, answer: String(3 + f), explanation: "Amplitude + shift." };
  if (variant === 8) return { question: `What is minimum value of y = 3 cos(x) - ${f}?`, answer: String(-3 - f), explanation: "-Amplitude - shift." };
  if (variant === 9) return { question: `What is amplitude of y = ${6 * f} sin(4x)?`, answer: String(6 * f), explanation: "Coefficient multiplier." };
  if (variant === 10) return { question: `What is amplitude of y = sin(x)?`, answer: "1", explanation: "Implicit coefficient 1." };
  if (variant === 11) return { question: `What is amplitude of y = 2 cos(x)?`, answer: "2", explanation: "Coefficient 2." };
  if (variant === 12) return { question: `What is maximum value of y = cos(x) + 5?`, answer: "6", explanation: "1 + 5 = 6." };
  if (variant === 13) return { question: `What is minimum value of y = sin(x) - 4?`, answer: "-5", explanation: "-1 - 4 = -5." };
  return { question: `What is amplitude of y = 5 sin(3x)?`, answer: "5", explanation: "Coefficient 5." };
}

export { ALGEBRA2_UNITS, generateAlgebra2 };