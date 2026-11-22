// precalc.js - High School Pre-Calculus Generator (Units 1-20, Levels 1-20)

const PRECALC_UNITS = {
  1: "Advanced Functions and Domain/Range Analysis",
  2: "Transformations of Functions and Piecewise Functions",
  3: "Polynomial and Rational Functions (Asymptotes and End Behavior)",
  4: "Exponential and Logarithmic Modeling",
  5: "Right Triangle Trigonometry and Radian Measure",
  6: "The Unit Circle and Trigonometric Values",
  7: "Graphing Trigonometric Functions and Transformations",
  8: "Inverse Trigonometric Functions",
  9: "Trigonometric Identities and Verifications",
  10: "Sum, Difference, Double-Angle, and Half-Angle Formulas",
  11: "Solving Trigonometric Equations",
  12: "Law of Sines and Law of Cosines",
  13: "Vectors in Two Dimensions and Applications",
  14: "Systems of Nonlinear Equations and Inequalities",
  15: "Matrices, Inverses, and Matrix Transformations",
  16: "Parametric Equations and Graphing",
  17: "Polar Coordinates and Polar Graphs",
  18: "Sequences, Series, and Mathematical Induction",
  19: "Introduction to Limits and Continuity",
  20: "Introduction to Derivatives (Slope of a curve preview)"
};

function createRng(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickOne(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Number((Math.round(num * factor) / factor).toFixed(decimals));
}

function buildNumericChoices(rng, ansStr) {
  const base = Number(ansStr);
  if (!Number.isFinite(base)) {
    return [ansStr, "0", "1", "-1"];
  }
  const decimals = ansStr.includes(".") ? ansStr.split(".")[1].length : 0;
  const step =
    decimals > 0
      ? Math.max(Math.pow(10, -decimals), roundTo(Math.abs(base) * 0.15 || 0.25, decimals))
      : Math.max(1, Math.round(Math.abs(base) * 0.2));

  const set = new Set([ansStr]);
  const multipliers = [-2, -1, 1, 2, 3, -3];
  for (const m of multipliers) {
    if (set.size >= 4) break;
    const candidate = roundTo(base + m * step, decimals).toFixed(decimals);
    const normalized = decimals > 0 ? String(Number(candidate)) : candidate;
    if (normalized !== ansStr) {
      set.add(normalized);
    }
  }
  let extra = 4;
  while (set.size < 4) {
    const candidate = roundTo(base + extra * step, decimals);
    set.add(String(candidate));
    extra++;
  }

  const arr = Array.from(set);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generatePrecalc(unit, level, problemIndex = 0) {
  const u = Number.isInteger(unit) && PRECALC_UNITS[unit] ? unit : 1;
  const lvl = Math.min(20, Math.max(1, Math.floor(Number(level) || 1)));
  const idx = Math.max(0, Math.floor(Number(problemIndex) || 0));

  const seed = (u * 1000081 + lvl * 37061 + idx * 9733 + 7777) >>> 0;
  const rng = createRng(seed);
  const arch = (idx + lvl - 1) % 8;

  let prob;
  switch (u) {
    case 1: prob = unit1FunctionsDomain(lvl, rng, arch); break;
    case 2: prob = unit2TransformationsPiecewise(lvl, rng, arch); break;
    case 3: prob = unit3PolyRational(lvl, rng, arch); break;
    case 4: prob = unit4ExpLog(lvl, rng, arch); break;
    case 5: prob = unit5RightTrigRadians(lvl, rng, arch); break;
    case 6: prob = unit6UnitCircle(lvl, rng, arch); break;
    case 7: prob = unit7GraphingTrig(lvl, rng, arch); break;
    case 8: prob = unit8InverseTrig(lvl, rng, arch); break;
    case 9: prob = unit9TrigIdentities(lvl, rng, arch); break;
    case 10: prob = unit10AngleFormulas(lvl, rng, arch); break;
    case 11: prob = unit11SolvingTrigEq(lvl, rng, arch); break;
    case 12: prob = unit12LawSinesCosines(lvl, rng, arch); break;
    case 13: prob = unit13Vectors2D(lvl, rng, arch); break;
    case 14: prob = unit14NonlinearSystems(lvl, rng, arch); break;
    case 15: prob = unit15Matrices(lvl, rng, arch); break;
    case 16: prob = unit16Parametric(lvl, rng, arch); break;
    case 17: prob = unit17Polar(lvl, rng, arch); break;
    case 18: prob = unit18SequencesSeries(lvl, rng, arch); break;
    case 19: prob = unit19LimitsIntro(lvl, rng, arch); break;
    case 20: prob = unit20DerivativesIntro(lvl, rng, arch); break;
    default: prob = unit1FunctionsDomain(lvl, rng, arch); break;
  }

  const finalAnswer = String(prob.answer);
  return {
    unit: u,
    unitName: PRECALC_UNITS[u],
    level: lvl,
    question: prob.question,
    answer: finalAnswer,
    correctAnswer: finalAnswer,
    explanation: prob.explanation,
    choices: buildNumericChoices(rng, finalAnswer)
  };
}

// 1. Advanced Functions and Domain/Range Analysis
function unit1FunctionsDomain(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const a = randInt(rng, 2, 10) * f;
  switch (arch) {
    case 0:
      return { question: `Domain lower bound of √(x - ${a})?`, answer: String(a), explanation: `x - ${a} ≥ 0 → x ≥ ${a}.` };
    case 1: {
      const x = randInt(rng, 2, 5);
      const val = 2 * (x * x - 1) + a;
      return { question: `f(x) = 2x + ${a}, g(x) = x² - 1. Find (f∘g)(${x})?`, answer: String(val), explanation: `g(${x}) = ${x * x - 1}; f(${x * x - 1}) = ${val}.` };
    }
    case 2:
      return { question: `f(x) = 3x. Find f⁻¹(${3 * a})?`, answer: String(a), explanation: `3x = ${3 * a} → x = ${a}.` };
    case 3:
      return { question: `Excluded x-value for 5 / (x - ${a})?`, answer: String(a), explanation: `Denominator is 0 at x = ${a}.` };
    case 4: {
      const x = randInt(rng, 1, 4);
      const k = randInt(rng, 2, 6);
      return { question: `f(x) = x + 3, g(x) = ${k}x. Find (g∘f)(${x})?`, answer: String(k * (x + 3)), explanation: `${k}(${x} + 3) = ${k * (x + 3)}.` };
    }
    case 5:
      return { question: `Vertex x-coordinate of f(x) = (x - ${a})² + 4?`, answer: String(a), explanation: `Vertex is at x = ${a}.` };
    case 6:
      return { question: `Maximum value of f(x) = -x² + ${2 * a}x?`, answer: String(a * a), explanation: `Vertex at x = ${a} gives ${a * a}.` };
    default:
      return { question: `If f(x) = 4x - ${a}, solve f(x) = ${3 * a}?`, answer: String(a), explanation: `4x = ${4 * a} → x = ${a}.` };
  }
}

// 2. Transformations of Functions and Piecewise Functions
function unit2TransformationsPiecewise(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const a = randInt(rng, 2, 8) * f;
  switch (arch) {
    case 0:
      return { question: `y = x² shifted right ${a} and up 3. New vertex x?`, answer: String(a), explanation: `Right shift of ${a} moves vertex x to ${a}.` };
    case 1: {
      const x = randInt(rng, 2, 6);
      return { question: `f(x) = { 2x if x < 2; x + ${a} if x ≥ 2 }. Find f(${x})?`, answer: String(x + a), explanation: `${x} ≥ 2 → ${x} + ${a} = ${x + a}.` };
    }
    case 2:
      return { question: `f(x) = { 2x if x < 2; x + ${a} if x ≥ 2 }. Find f(1)?`, answer: "2", explanation: `1 < 2 → 2(1) = 2.` };
    case 3:
      return { question: `Vertex y-coordinate of y = |x - 2| + ${a}?`, answer: String(a), explanation: `Vertical shift is ${a}.` };
    case 4:
      return { question: `f(x) = { -x if x < 0; x if x ≥ 0 }. Find f(-${a})?`, answer: String(a), explanation: `-(-${a}) = ${a}.` };
    case 5: {
      const k = randInt(rng, 2, 5);
      return { question: `y = f(x) vertically stretched by ${k}, then shifted down ${a}. Output for f(x) = 4?`, answer: String(k * 4 - a), explanation: `${k}(4) - ${a} = ${k * 4 - a}.` };
    }
    case 6:
      return { question: `y-intercept of branch y = 3x + ${a} (for x ≥ 0)?`, answer: String(a), explanation: `At x = 0, y = ${a}.` };
    default:
      return { question: `f(x) = { 5 if x < 3; ${2 * a} if x ≥ 3 }. Find f(4)?`, answer: String(2 * a), explanation: `4 ≥ 3 → ${2 * a}.` };
  }
}

// 3. Polynomial and Rational Functions (Asymptotes and End Behavior)
function unit3PolyRational(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const a = randInt(rng, 2, 7) * f;
  switch (arch) {
    case 0:
      return { question: `Vertical asymptote x of f(x) = 1 / (x - ${a})?`, answer: String(a), explanation: `x - ${a} = 0 → x = ${a}.` };
    case 1:
      return { question: `Horizontal asymptote y of f(x) = (${a}x² + 1) / (x² - 4)?`, answer: String(a), explanation: `Equal degrees → ${a}/1 = ${a}.` };
    case 2:
      return { question: `Horizontal asymptote y of ${a} / (x² + 1)?`, answer: "0", explanation: `Numerator degree < denominator degree → y = 0.` };
    case 3:
      return { question: `x-intercept root of (x - ${a})(x + 2) = 0?`, answer: String(a), explanation: `x - ${a} = 0 → x = ${a}.` };
    case 4:
      return { question: `y-intercept of (x + ${2 * a}) / (x + 2)?`, answer: String(a), explanation: `At x = 0: ${2 * a}/2 = ${a}.` };
    case 5:
      return { question: `Multiplicity of (x - ${a})³ in P(x) = (x - ${a})³(x + 1)?`, answer: "3", explanation: `Exponent on (x - ${a}) is 3.` };
    case 6:
      return { question: `Vertical asymptote x of 3 / (2x - ${2 * a})?`, answer: String(a), explanation: `2x - ${2 * a} = 0 → x = ${a}.` };
    default:
      return { question: `Constant term of 2x³ - 4x² + ${5 * a}?`, answer: String(5 * a), explanation: `Value at x = 0 is ${5 * a}.` };
  }
}

// 4. Exponential and Logarithmic Modeling
function unit4ExpLog(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 5);
  const a = randInt(rng, 2, 6) * f;
  switch (arch) {
    case 0: {
      const exp = randInt(rng, 2, 5);
      return { question: `Solve 2^x = ${Math.pow(2, exp)}?`, answer: String(exp), explanation: `2^${exp} = ${Math.pow(2, exp)} → x = ${exp}.` };
    }
    case 1: {
      const exp = randInt(rng, 2, 5);
      return { question: `Evaluate log₂(${Math.pow(2, exp)})?`, answer: String(exp), explanation: `2^${exp} = ${Math.pow(2, exp)}.` };
    }
    case 2:
      return { question: `Solve ln(x) = ln(${5 * a})?`, answer: String(5 * a), explanation: `x = ${5 * a}.` };
    case 3:
      return { question: `P(t) = P₀·2^(t/${a}). Doubling period constant?`, answer: String(a), explanation: `Denominator in exponent is ${a}.` };
    case 4:
      return { question: `Evaluate log₃(81) + ${a}?`, answer: String(4 + a), explanation: `4 + ${a} = ${4 + a}.` };
    case 5:
      return { question: `Evaluate e^(ln(${10 * a}))?`, answer: String(10 * a), explanation: `e^(ln(k)) = k → ${10 * a}.` };
    case 6:
      return { question: `Solve log_x(64) = 3?`, answer: "4", explanation: `4³ = 64 → x = 4.` };
    default:
      return { question: `Evaluate log₅(125) × ${f}?`, answer: String(3 * f), explanation: `3 × ${f} = ${3 * f}.` };
  }
}

// 5. Right Triangle Trigonometry and Radian Measure
function unit5RightTrigRadians(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const legA = 3 * f;
  const legB = 4 * f;
  const hyp = 5 * f;
  switch (arch) {
    case 0:
      return { question: `Right triangle legs ${legA}, ${legB}. Hypotenuse?`, answer: String(hyp), explanation: `√(${legA}² + ${legB}²) = ${hyp}.` };
    case 1:
      return { question: `Opposite = ${legA}, hypotenuse = ${hyp}. Numerator of sin(θ)?`, answer: String(legA), explanation: `sin(θ) = ${legA}/${hyp}.` };
    case 2:
      return { question: `Adjacent = ${legB}, hypotenuse = ${hyp}. Numerator of cos(θ)?`, answer: String(legB), explanation: `cos(θ) = ${legB}/${hyp}.` };
    case 3: {
      const r = 4 * f;
      const theta = randInt(rng, 2, 5);
      return { question: `Arc length s for r = ${r}, θ = ${theta} rad?`, answer: String(r * theta), explanation: `s = rθ = ${r} × ${theta} = ${r * theta}.` };
    }
    case 4: {
      const r = 4 * f;
      return { question: `Sector area for r = ${r}, θ = 1 rad?`, answer: String(0.5 * r * r), explanation: `½r²θ = 0.5 × ${r * r} × 1 = ${0.5 * r * r}.` };
    }
    case 5:
      return { question: `Convert π/6 radians to degrees?`, answer: "30", explanation: `180° / 6 = 30°.` };
    case 6:
      return { question: `Convert π/3 radians to degrees?`, answer: "60", explanation: `180° / 3 = 60°.` };
    default:
      return { question: `Convert π/4 radians to degrees?`, answer: "45", explanation: `180° / 4 = 45°.` };
  }
}

// 6. The Unit Circle and Trigonometric Values
function unit6UnitCircle(lvl, rng, arch) {
  switch (arch) {
    case 0: return { question: `Exact value of sin(90°)?`, answer: "1", explanation: `y-coordinate at 90° is 1.` };
    case 1: return { question: `Exact value of cos(180°)?`, answer: "-1", explanation: `x-coordinate at 180° is -1.` };
    case 2: return { question: `Exact value of sin(270°)?`, answer: "-1", explanation: `y-coordinate at 270° is -1.` };
    case 3: return { question: `Exact value of cos(90°)?`, answer: "0", explanation: `x-coordinate at 90° is 0.` };
    case 4: return { question: `Quadrant (1–4) of 150°?`, answer: "2", explanation: `90° < 150° < 180° → Quadrant II.` };
    case 5: return { question: `Quadrant (1–4) of 225°?`, answer: "3", explanation: `180° < 225° < 270° → Quadrant III.` };
    case 6: return { question: `Reference angle (deg) for 225°?`, answer: "45", explanation: `225° - 180° = 45°.` };
    default: return { question: `Reference angle (deg) for 300°?`, answer: "60", explanation: `360° - 300° = 60°.` };
  }
}

// 7. Graphing Trigonometric Functions and Transformations
function unit7GraphingTrig(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const amp = randInt(rng, 2, 7) * f;
  switch (arch) {
    case 0:
      return { question: `Amplitude of y = -${amp}cos(x)?`, answer: String(amp), explanation: `|- ${amp}| = ${amp}.` };
    case 1:
      return { question: `Maximum value of y = ${amp}sin(x)?`, answer: String(amp), explanation: `Peak is ${amp}.` };
    case 2:
      return { question: `Minimum trough of y = ${amp}cos(x)?`, answer: String(-amp), explanation: `Trough is -${amp}.` };
    case 3:
      return { question: `Maximum of y = 2cos(x) + ${amp}?`, answer: String(2 + amp), explanation: `2 + ${amp} = ${2 + amp}.` };
    case 4:
      return { question: `Minimum of y = 3sin(x) - ${amp}?`, answer: String(-3 - amp), explanation: `-3 - ${amp} = ${-3 - amp}.` };
    case 5: {
      const freq = randInt(rng, 2, 6) + Math.floor(lvl / 6);
      return { question: `Frequency B of y = sin(${freq}x)?`, answer: String(freq), explanation: `Coefficient B is ${freq}.` };
    }
    case 6:
      return { question: `Midline shift of y = 4sin(2x) + ${amp}?`, answer: String(amp), explanation: `Vertical shift is ${amp}.` };
    default:
      return { question: `Period of y = cos(2x) as multiple of π (enter 1 for 1π)?`, answer: "1", explanation: `2π / 2 = 1π.` };
  }
}

// 8. Inverse Trigonometric Functions
function unit8InverseTrig(lvl, rng, arch) {
  switch (arch) {
    case 0: return { question: `arcsin(1) in degrees?`, answer: "90", explanation: `sin(90°) = 1.` };
    case 1: return { question: `arccos(-1) in degrees?`, answer: "180", explanation: `cos(180°) = -1.` };
    case 2: return { question: `arctan(1) in degrees?`, answer: "45", explanation: `tan(45°) = 1.` };
    case 3: return { question: `arcsin(-1) in degrees?`, answer: "-90", explanation: `sin(-90°) = -1.` };
    case 4: return { question: `arcsin(0.5) in degrees?`, answer: "30", explanation: `sin(30°) = 0.5.` };
    case 5: return { question: `arccos(0.5) in degrees?`, answer: "60", explanation: `cos(60°) = 0.5.` };
    case 6: return { question: `Restricted range max of arctan(x) in degrees?`, answer: "90", explanation: `Range is (-90°, 90°).` };
    default: return { question: `Evaluate 10 × sin(arcsin(0.5))?`, answer: "5", explanation: `10 × 0.5 = 5.` };
  }
}

// 9. Trigonometric Identities and Verifications
function unit9TrigIdentities(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 5);
  switch (arch) {
    case 0: return { question: `sin²(θ) + cos²(θ)?`, answer: "1", explanation: `Pythagorean identity equals 1.` };
    case 1: return { question: `sin(θ)·csc(θ)?`, answer: "1", explanation: `Reciprocal product equals 1.` };
    case 2: return { question: `cos(θ)·sec(θ)?`, answer: "1", explanation: `Reciprocal product equals 1.` };
    case 3: return { question: `tan(θ)·cot(θ)?`, answer: "1", explanation: `Reciprocal product equals 1.` };
    case 4: return { question: `If sin(θ) = 3/5 and cos(θ) = 4/5, numerator of tan(θ)?`, answer: "3", explanation: `(3/5)/(4/5) = 3/4.` };
    case 5: return { question: `If sec(θ) = 5/4, numerator of cos(θ)?`, answer: "4", explanation: `cos(θ) = 1/sec(θ) = 4/5.` };
    case 6: return { question: `${f}·(sin²(θ) + cos²(θ))?`, answer: String(f), explanation: `${f} × 1 = ${f}.` };
    default: return { question: `If csc(θ) = 5/3, numerator of sin(θ)?`, answer: "3", explanation: `sin(θ) = 1/csc(θ) = 3/5.` };
  }
}

// 10. Sum, Difference, Double-Angle, and Half-Angle Formulas
function unit10AngleFormulas(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 5);
  switch (arch) {
    case 0: return { question: `2·sin(30°)·cos(30°) × 100 (round to nearest int)?`, answer: String(roundTo(2 * 0.5 * 0.8660254 * 100, 0)), explanation: `sin(60°) ≈ 0.8660 → 87.` };
    case 1: return { question: `cos(60° - 0°) × ${10 * f}?`, answer: String(5 * f), explanation: `cos(60°) = 0.5 → 0.5 × ${10 * f} = ${5 * f}.` };
    case 2: return { question: `sin(30° + 60°) × ${8 * f}?`, answer: String(8 * f), explanation: `sin(90°) = 1 → ${8 * f}.` };
    case 3: return { question: `cos²(30°) - sin²(30°) = cos(60°). Value × ${20 * f}?`, answer: String(10 * f), explanation: `0.5 × ${20 * f} = ${10 * f}.` };
    case 4: return { question: `2cos²(45°) - 1 = cos(90°). Value?`, answer: "0", explanation: `cos(90°) = 0.` };
    case 5: return { question: `1 - 2sin²(45°) = cos(90°). Value?`, answer: "0", explanation: `cos(90°) = 0.` };
    case 6: return { question: `sin(45° + 45°) × ${6 * f}?`, answer: String(6 * f), explanation: `sin(90°) = 1 → ${6 * f}.` };
    default: return { question: `cos(90° - 30°) × ${10 * f}?`, answer: String(5 * f), explanation: `cos(60°) = 0.5 → ${5 * f}.` };
  }
}

// 11. Solving Trigonometric Equations
function unit11SolvingTrigEq(lvl, rng, arch) {
  switch (arch) {
    case 0: return { question: `Solve sin(x) = 1 on [0°, 360°) (in deg)?`, answer: "90", explanation: `sin(90°) = 1.` };
    case 1: return { question: `Solve cos(x) = -1 on [0°, 360°) (in deg)?`, answer: "180", explanation: `cos(180°) = -1.` };
    case 2: return { question: `Solve tan(x) = 1 on [0°, 90°) (in deg)?`, answer: "45", explanation: `tan(45°) = 1.` };
    case 3: return { question: `Solve 2sin(x) = 1 on [0°, 90°) (in deg)?`, answer: "30", explanation: `sin(x) = 0.5 → x = 30°.` };
    case 4: return { question: `Solve 2cos(x) = 1 on [0°, 90°) (in deg)?`, answer: "60", explanation: `cos(x) = 0.5 → x = 60°.` };
    case 5: return { question: `Solve sin(x) = -1 on [0°, 360°) (in deg)?`, answer: "270", explanation: `sin(270°) = -1.` };
    case 6: return { question: `Solve cos(x) = 1 on [0°, 360°) (in deg)?`, answer: "0", explanation: `cos(0°) = 1.` };
    default: return { question: `Solve sin(2x) = 1 on [0°, 90°) for x (in deg)?`, answer: "45", explanation: `2x = 90° → x = 45°.` };
  }
}

// 12. Law of Sines and Law of Cosines
function unit12LawSinesCosines(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const a = 6 * f;
      const b = 8 * f;
      return { question: `Triangle: a = ${a}, b = ${b}, angle C = 90°. Side c?`, answer: String(10 * f), explanation: `c = √(${a}² + ${b}²) = ${10 * f}.` };
    }
    case 1: {
      const a1 = randInt(rng, 35, 75);
      const a2 = randInt(rng, 35, 160 - a1);
      return { question: `Triangle angles are ${a1}° and ${a2}°. Third angle?`, answer: String(180 - a1 - a2), explanation: `180° - ${a1}° - ${a2}° = ${180 - a1 - a2}°. ` };
    }
    case 2: {
      const s1 = 5 * f;
      const s2 = 12 * f;
      return { question: `Right triangle legs ${s1} and ${s2}. Hypotenuse?`, answer: String(13 * f), explanation: `√(${s1}² + ${s2}²) = ${13 * f}.` };
    }
    case 3: {
      const side = 8 * f;
      return { question: `Equilateral triangle side = ${side}. Perimeter?`, answer: String(3 * side), explanation: `3 × ${side} = ${3 * side}.` };
    }
    case 4: {
      const a = 5 * f;
      return { question: `Law of Sines: sin(A)/${a} = sin(90°)/x. Find x?`, answer: String(a), explanation: `sin(90°) = 1 → x = ${a}.` };
    }
    case 5: {
      const s = 6 * f;
      return { question: `Isosceles triangle with equal sides ${s} and base ${s}. Perimeter?`, answer: String(3 * s), explanation: `${s} + ${s} + ${s} = ${3 * s}.` };
    }
    case 6: {
      const b = 4 * f;
      const h = 3 * f;
      return { question: `Triangle area with base ${b} and height ${h}?`, answer: String(0.5 * b * h), explanation: `½(${b})(${h}) = ${0.5 * b * h}.` };
    }
    default: {
      const a = 3 * f;
      const b = 4 * f;
      return { question: `Law of Cosines with C = 90°: c² for a = ${a}, b = ${b}?`, answer: String(a * a + b * b), explanation: `${a}² + ${b}² = ${a * a + b * b}.` };
    }
  }
}

// 13. Vectors in Two Dimensions and Applications
function unit13Vectors2D(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const x1 = randInt(rng, 1, 6) * f;
      const y1 = randInt(rng, 1, 6) * f;
      const x2 = randInt(rng, 1, 6) * f;
      const y2 = randInt(rng, 1, 6) * f;
      return { question: `u = <${x1}, ${y1}>, v = <${x2}, ${y2}>. x-component of u + v?`, answer: String(x1 + x2), explanation: `${x1} + ${x2} = ${x1 + x2}.` };
    }
    case 1: {
      const x1 = randInt(rng, 1, 6) * f;
      const y1 = randInt(rng, 1, 6) * f;
      const x2 = randInt(rng, 1, 6) * f;
      const y2 = randInt(rng, 1, 6) * f;
      return { question: `u = <${x1}, ${y1}>, v = <${x2}, ${y2}>. Dot product u·v?`, answer: String(x1 * x2 + y1 * y2), explanation: `${x1}(${x2}) + ${y1}(${y2}) = ${x1 * x2 + y1 * y2}.` };
    }
    case 2:
      return { question: `Magnitude of <${3 * f}, ${4 * f}>?`, answer: String(5 * f), explanation: `√(${3 * f}² + ${4 * f}²) = ${5 * f}.` };
    case 3: {
      const k = randInt(rng, 2, 6);
      const vx = randInt(rng, 1, 6) * f;
      return { question: `Scale <${vx}, 2> by ${k}. New x-component?`, answer: String(k * vx), explanation: `${k} × ${vx} = ${k * vx}.` };
    }
    case 4: {
      const x1 = randInt(rng, 2, 8) * f;
      const x2 = randInt(rng, 1, 5) * f;
      return { question: `u = <${x1}, 5>, v = <${x2}, 2>. x-component of u - v?`, answer: String(x1 - x2), explanation: `${x1} - ${x2} = ${x1 - x2}.` };
    }
    case 5: {
      const x1 = randInt(rng, 2, 6) * f;
      const y1 = randInt(rng, 2, 6) * f;
      return { question: `u = <${x1}, ${y1}>, v = <${y1}, ${-x1}>. Dot product u·v?`, answer: "0", explanation: `${x1}(${y1}) + ${y1}(${-x1}) = 0.` };
    }
    case 6:
      return { question: `Magnitude of <${6 * f}, ${8 * f}>?`, answer: String(10 * f), explanation: `√(${6 * f}² + ${8 * f}²) = ${10 * f}.` };
    default: {
      const y1 = randInt(rng, 1, 6) * f;
      const y2 = randInt(rng, 1, 6) * f;
      return { question: `u = <2, ${y1}>, v = <3, ${y2}>. y-component of u + v?`, answer: String(y1 + y2), explanation: `${y1} + ${y2} = ${y1 + y2}.` };
    }
  }
}

// 14. Systems of Nonlinear Equations and Inequalities
function unit14NonlinearSystems(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const r = randInt(rng, 2, 6) * f;
  switch (arch) {
    case 0: return { question: `Radius of circle x² + y² = ${r * r}?`, answer: String(r), explanation: `√${r * r} = ${r}.` };
    case 1: return { question: `y = x² and y = ${r * r}. Positive x intersection?`, answer: String(r), explanation: `x² = ${r * r} → x = ${r}.` };
    case 2: return { question: `y = x + ${r} and y = x. Number of intersections?`, answer: "0", explanation: `Parallel lines never intersect.` };
    case 3: return { question: `x² + y² = ${25 * f * f}. Value of x² when y = ${3 * f}?`, answer: String(16 * f * f), explanation: `${25 * f * f} - ${9 * f * f} = ${16 * f * f}.` };
    case 4: return { question: `y = 2x and y = x² - ${3 * f}. Value of y when x = ${3 * f}?`, answer: String(6 * f), explanation: `2(${3 * f}) = ${6 * f}.` };
    case 5: return { question: `Circle x² + y² = ${r * r}: y-intercepts sum?`, answer: "0", explanation: `±${r} sum to 0.` };
    case 6: return { question: `y = x² + ${f}. Minimum y-value?`, answer: String(f), explanation: `x² ≥ 0 → y ≥ ${f}.` };
    default: return { question: `xy = ${12 * f}. Find y when x = ${3 * f}?`, answer: "4", explanation: `${12 * f} / ${3 * f} = 4.` };
  }
}

// 15. Matrices, Inverses, and Matrix Transformations
function unit15Matrices(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const a = 3 * f;
      const d = 4 * f;
      return { question: `det [[${a}, 1], [2, ${d}]]?`, answer: String(a * d - 2), explanation: `(${a})(${d}) - (1)(2) = ${a * d - 2}.` };
    }
    case 1: {
      const k = randInt(rng, 2, 6);
      const val = randInt(rng, 1, 7) * f;
      return { question: `Multiply matrix by ${k}. Entry ${val} becomes?`, answer: String(k * val), explanation: `${k} × ${val} = ${k * val}.` };
    }
    case 2: {
      const a = randInt(rng, 2, 8) * f;
      const b = randInt(rng, 2, 8) * f;
      return { question: `Add matching entries ${a} and ${b}?`, answer: String(a + b), explanation: `${a} + ${b} = ${a + b}.` };
    }
    case 3: {
      const a = randInt(rng, 5, 12) * f;
      const b = randInt(rng, 1, 4) * f;
      return { question: `Subtract matching entries ${a} - ${b}?`, answer: String(a - b), explanation: `${a} - ${b} = ${a - b}.` };
    }
    case 4:
      return { question: `det of 2×2 identity matrix?`, answer: "1", explanation: `1(1) - 0(0) = 1.` };
    case 5:
      return { question: `Rows in a 3×4 matrix?`, answer: "3", explanation: `First number is rows (3).` };
    case 6:
      return { question: `Columns in a 3×4 matrix?`, answer: "4", explanation: `Second number is columns (4).` };
    default: {
      const a = 2 * f;
      return { question: `det [[${a}, 0], [0, ${a}]]?`, answer: String(a * a), explanation: `${a} × ${a} - 0 = ${a * a}.` };
    }
  }
}

// 16. Parametric Equations and Graphing
function unit16Parametric(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const m = randInt(rng, 2, 6) * f;
      const t = randInt(rng, 1, 5);
      return { question: `x(t) = ${m}t. Find x at t = ${t}?`, answer: String(m * t), explanation: `${m} × ${t} = ${m * t}.` };
    }
    case 1: {
      const m = randInt(rng, 2, 5);
      const b = randInt(rng, 1, 8) * f;
      const t = randInt(rng, 1, 4);
      return { question: `y(t) = ${m}t + ${b}. Find y at t = ${t}?`, answer: String(m * t + b), explanation: `${m}(${t}) + ${b} = ${m * t + b}.` };
    }
    case 2: {
      const t = randInt(rng, 1, 5) * f;
      return { question: `x(t) = t², y(t) = 2t. Find x at t = ${t}?`, answer: String(t * t), explanation: `${t}² = ${t * t}.` };
    }
    case 3: {
      const t = randInt(rng, 1, 5) * f;
      return { question: `x(t) = t², y(t) = 2t. Find y at t = ${t}?`, answer: String(2 * t), explanation: `2 × ${t} = ${2 * t}.` };
    }
    case 4: {
      const r = randInt(rng, 2, 8) * f;
      return { question: `x(t) = ${r}cos(t), y(t) = ${r}sin(t). Circle radius?`, answer: String(r), explanation: `x² + y² = ${r * r} → r = ${r}.` };
    }
    case 5: {
      const x0 = randInt(rng, 1, 6) * f;
      return { question: `x(t) = ${x0} + 3t. Value of x at t = 0?`, answer: String(x0), explanation: `${x0} + 0 = ${x0}.` };
    }
    case 6: {
      const y0 = randInt(rng, 1, 6) * f;
      return { question: `y(t) = ${y0} - 2t. Value of y at t = 0?`, answer: String(y0), explanation: `${y0} - 0 = ${y0}.` };
    }
    default: {
      const m = randInt(rng, 2, 6);
      const t = randInt(rng, 2, 5) * f;
      return { question: `x(t) = t, y(t) = ${m}t. Find y when x = ${t}?`, answer: String(m * t), explanation: `t = ${t} → y = ${m * t}.` };
    }
  }
}

// 17. Polar Coordinates and Polar Graphs
function unit17Polar(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const r = randInt(rng, 2, 8) * f;
  switch (arch) {
    case 0: return { question: `Polar point (${r}, 0°): Cartesian x?`, answer: String(r), explanation: `${r}cos(0°) = ${r}.` };
    case 1: return { question: `Polar point (${r}, 0°): Cartesian y?`, answer: "0", explanation: `${r}sin(0°) = 0.` };
    case 2: return { question: `Polar point (${r}, 90°): Cartesian y?`, answer: String(r), explanation: `${r}sin(90°) = ${r}.` };
    case 3: return { question: `Polar point (${r}, 90°): Cartesian x?`, answer: "0", explanation: `${r}cos(90°) = 0.` };
    case 4: return { question: `Polar point (${r}, 180°): Cartesian x?`, answer: String(-r), explanation: `${r}cos(180°) = -${r}.` };
    case 5: return { question: `Max r of limaçon r = 2 + ${r}sin(θ)?`, answer: String(2 + r), explanation: `2 + ${r}(1) = ${2 + r}.` };
    case 6: return { question: `Max r of circle r = ${2 * r}cos(θ)?`, answer: String(2 * r), explanation: `Diameter is ${2 * r}.` };
    default: return { question: `Distance from pole for (${r}, 135°)?`, answer: String(r), explanation: `|r| = ${r}.` };
  }
}

// 18. Sequences, Series, and Mathematical Induction
function unit18SequencesSeries(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const a1 = randInt(rng, 2, 10) * f;
      const d = randInt(rng, 2, 6);
      const n = randInt(rng, 3, 6);
      return { question: `Arithmetic a₁ = ${a1}, d = ${d}. Find a_${n}?`, answer: String(a1 + (n - 1) * d), explanation: `${a1} + (${n - 1})(${d}) = ${a1 + (n - 1) * d}.` };
    }
    case 1: {
      const a1 = randInt(rng, 2, 6) * f;
      const r = 2;
      const n = randInt(rng, 2, 4);
      return { question: `Geometric a₁ = ${a1}, r = 2. Find a_${n}?`, answer: String(a1 * Math.pow(r, n - 1)), explanation: `${a1} × 2^${n - 1} = ${a1 * Math.pow(r, n - 1)}.` };
    }
    case 2: {
      const k = randInt(rng, 2, 6) * f;
      return { question: `∑_{i=1}^3 ${k}?`, answer: String(3 * k), explanation: `3 × ${k} = ${3 * k}.` };
    }
    case 3: {
      const n = randInt(rng, 4, 10) * f;
      return { question: `Sum of first ${n} positive integers n(n+1)/2?`, answer: String((n * (n + 1)) / 2), explanation: `${n}(${n + 1})/2 = ${(n * (n + 1)) / 2}.` };
    }
    case 4: {
      const a = randInt(rng, 2, 8) * f;
      return { question: `Infinite geometric series a = ${a}, r = 0.5. Sum?`, answer: String(a / 0.5), explanation: `${a} / (1 - 0.5) = ${a / 0.5}.` };
    }
    case 5: {
      const a1 = randInt(rng, 1, 5);
      const d = randInt(rng, 2, 5) * f;
      return { question: `Arithmetic a₁ = ${a1}, d = ${d}. Sum of first 2 terms?`, answer: String(2 * a1 + d), explanation: `${a1} + (${a1 + d}) = ${2 * a1 + d}.` };
    }
    case 6: {
      const a1 = randInt(rng, 2, 6) * f;
      return { question: `Geometric a₁ = ${a1}, r = 3. Find a₂?`, answer: String(3 * a1), explanation: `${a1} × 3 = ${3 * a1}.` };
    }
    default: {
      const n = randInt(rng, 2, 6) * f;
      return { question: `∑_{i=1}^${n} 1?`, answer: String(n), explanation: `${n} terms of 1 equal ${n}.` };
    }
  }
}

// 19. Introduction to Limits and Continuity
function unit19LimitsIntro(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  const c = randInt(rng, 1, 7) + Math.floor(lvl / 6);
  switch (arch) {
    case 0: {
      const m = randInt(rng, 2, 6) * f;
      const b = randInt(rng, 1, 10);
      return { question: `lim(x → ${c}) [${m}x + ${b}]?`, answer: String(m * c + b), explanation: `${m}(${c}) + ${b} = ${m * c + b}.` };
    }
    case 1:
      return { question: `lim(x → ${c}) (x² - ${c * c}) / (x - ${c})?`, answer: String(2 * c), explanation: `Factor and plug in ${c} → ${2 * c}.` };
    case 2: {
      const L = randInt(rng, 2, 12) * f;
      return { question: `Continuous at x = ${c} and lim(x → ${c}) f(x) = ${L}. Find f(${c})?`, answer: String(L), explanation: `f(${c}) = ${L}.` };
    }
    case 3: {
      const k = randInt(rng, 2, 8) * f;
      return { question: `lim(x → ∞) ${k} / x?`, answer: "0", explanation: `${k}/x approaches 0 as x → ∞.` };
    }
    case 4: {
      const num = randInt(rng, 2, 9) * f;
      const den = randInt(rng, 1, 6) * f;
      return { question: `lim(x → ∞) ${num}x / ${den}x?`, answer: String(roundTo(num / den, 2)), explanation: `${num}/${den}.` };
    }
    case 5: {
      const a = randInt(rng, 1, 5);
      const b = randInt(rng, 1, 6) * f;
      return { question: `lim(x → ${a}) x² + ${b}?`, answer: String(a * a + b), explanation: `${a}² + ${b} = ${a * a + b}.` };
    }
    case 6: {
      const left = randInt(rng, 2, 8) * f;
      return { question: `lim(x → ${c}⁻) f(x) = ${left} and lim(x → ${c}⁺) f(x) = ${left}. Limit at ${c}?`, answer: String(left), explanation: `Left and right limits match at ${left}.` };
    }
    default: {
      const k = randInt(rng, 2, 7) * f;
      return { question: `lim(x → ${c}) ${k}?`, answer: String(k), explanation: `Limit of a constant is ${k}.` };
    }
  }
}

// 20. Introduction to Derivatives (Slope of a curve preview)
function unit20DerivativesIntro(lvl, rng, arch) {
  const f = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const a = randInt(rng, 2, 6) * f;
      const x0 = randInt(rng, 1, 5);
      return { question: `f(x) = ${a}x². Slope of tangent at x = ${x0} (2ax)?`, answer: String(2 * a * x0), explanation: `f'(x) = ${2 * a}x → ${2 * a * x0}.` };
    }
    case 1: {
      const m = randInt(rng, 2, 9) * f;
      const x0 = randInt(rng, 1, 8);
      return { question: `f(x) = ${m}x + 4. Slope of tangent at x = ${x0}?`, answer: String(m), explanation: `Slope of line is ${m}.` };
    }
    case 2: {
      const c = randInt(rng, 3, 20) * f;
      const x0 = randInt(rng, 1, 6);
      return { question: `f(x) = ${c}. Slope of tangent at x = ${x0}?`, answer: "0", explanation: `Horizontal line has slope 0.` };
    }
    case 3: {
      const t1 = 1;
      const t2 = 3;
      const k = randInt(rng, 2, 6) * f;
      // s(t) = k*t^2 -> avg rate on [1, 3] is k*(9 - 1)/2 = 4k
      return { question: `s(t) = ${k}t². Average rate on [1, 3]?`, answer: String(4 * k), explanation: `(${9 * k} - ${k}) / 2 = ${4 * k}.` };
    }
    case 4: {
      const x0 = randInt(rng, 1, 4);
      const k = randInt(rng, 1, 5);
      // f(x) = x^3 - kx -> f'(x) = 3x^2 - k
      return { question: `f(x) = x³ - ${k}x. f'(${x0})?`, answer: String(3 * x0 * x0 - k), explanation: `3(${x0})² - ${k} = ${3 * x0 * x0 - k}.` };
    }
    case 5: {
      const x0 = randInt(rng, 1, 5);
      const y0 = randInt(rng, 2, 12) * f;
      const m = randInt(rng, 2, 5);
      return { question: `Point (${x0}, ${y0}) with tangent slope ${m}. Tangent y at x = ${x0 + 1}?`, answer: String(y0 + m), explanation: `${y0} + ${m}(1) = ${y0 + m}.` };
    }
    case 6: {
      const a = randInt(rng, 1, 4) * f;
      const x0 = randInt(rng, 1, 4);
      return { question: `f(x) = ${a}x³. f'(${x0})?`, answer: String(3 * a * x0 * x0), explanation: `3(${a})(${x0})² = ${3 * a * x0 * x0}.` };
    }
    default: {
      const x0 = randInt(rng, 1, 5);
      const b = randInt(rng, 1, 8) * f;
      return { question: `f(x) = x² + ${b}x. f'(${x0})?`, answer: String(2 * x0 + b), explanation: `2(${x0}) + ${b} = ${2 * x0 + b}.` };
    }
  }
}

export { PRECALC_UNITS, generatePrecalc };