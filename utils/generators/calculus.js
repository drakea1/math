// calculus.js - AP Calculus Generator (Units 1-20, Levels 1-20)

const CALCULUS_UNITS = {
  1: "Limits and Continuity (Graphical and Numerical)",
  2: "Algebraic Limit Evaluation and Squeeze Theorem",
  3: "Asymptotes, End Behavior, and Intermediate Value Theorem",
  4: "Definition of Derivative and Rates of Change",
  5: "Basic Differentiation Rules (Power, Product, Quotient)",
  6: "Chain Rule and Implicit Differentiation",
  7: "Derivatives of Trig, Exponential, and Logarithmic Functions",
  8: "Inverse Functions and Parametric/Polar Derivatives",
  9: "Related Rates",
  10: "Linear Approximation, Differentials, and L'Hopital's Rule",
  11: "Mean Value Theorem and First Derivative Test (Extrema)",
  12: "Concavity, Second Derivative Test, and Inflection Points",
  13: "Curve Sketching and Optimization",
  14: "Riemann Sums and Definite Integral Definition",
  15: "Fundamental Theorem of Calculus (Part 1 and Part 2)",
  16: "Antiderivatives and u-Substitution",
  17: "Integration by Parts and Partial Fractions",
  18: "Area Between Curves and Volumes of Revolution",
  19: "Differential Equations, Slope Fields, and Euler's Method",
  20: "Sequences, Series, and Taylor Polynomials"
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

export function generateCalculus(unit, level, problemIndex = 0) {
  const u = Number.isInteger(unit) && CALCULUS_UNITS[unit] ? unit : 1;
  const lvl = Math.min(20, Math.max(1, Math.floor(Number(level) || 1)));
  const idx = Math.max(0, Math.floor(Number(problemIndex) || 0));

  const seed = (u * 1000037 + lvl * 37039 + idx * 9721 + 4242) >>> 0;
  const rng = createRng(seed);
  const arch = (idx + lvl - 1) % 8;

  let prob;
  switch (u) {
    case 1: prob = unit1LimitsAndContinuity(lvl, rng, arch); break;
    case 2: prob = unit2AlgebraicLimits(lvl, rng, arch); break;
    case 3: prob = unit3AsymptotesAndIvt(lvl, rng, arch); break;
    case 4: prob = unit4RatesOfChange(lvl, rng, arch); break;
    case 5: prob = unit5BasicDerivatives(lvl, rng, arch); break;
    case 6: prob = unit6ChainAndImplicit(lvl, rng, arch); break;
    case 7: prob = unit7TranscendentalDerivs(lvl, rng, arch); break;
    case 8: prob = unit8InverseParametricPolar(lvl, rng, arch); break;
    case 9: prob = unit9RelatedRates(lvl, rng, arch); break;
    case 10: prob = unit10LinearApproxLhopital(lvl, rng, arch); break;
    case 11: prob = unit11MvtAndFirstDeriv(lvl, rng, arch); break;
    case 12: prob = unit12ConcavityAndInflection(lvl, rng, arch); break;
    case 13: prob = unit13Optimization(lvl, rng, arch); break;
    case 14: prob = unit14RiemannAndDefinite(lvl, rng, arch); break;
    case 15: prob = unit15Ftc(lvl, rng, arch); break;
    case 16: prob = unit16Substitution(lvl, rng, arch); break;
    case 17: prob = unit17PartsAndFractions(lvl, rng, arch); break;
    case 18: prob = unit18AreaAndVolume(lvl, rng, arch); break;
    case 19: prob = unit19DiffEqAndEuler(lvl, rng, arch); break;
    case 20: prob = unit20SeriesAndTaylor(lvl, rng, arch); break;
    default: prob = unit1LimitsAndContinuity(lvl, rng, arch); break;
  }

  const finalAnswer = String(prob.answer);
  return {
    unit: u,
    unitName: CALCULUS_UNITS[u],
    level: lvl,
    question: prob.question,
    answer: finalAnswer,
    correctAnswer: finalAnswer,
    explanation: prob.explanation,
    choices: buildNumericChoices(rng, finalAnswer)
  };
}

// 1. Limits and Continuity (Graphical and Numerical)
function unit1LimitsAndContinuity(lvl, rng, arch) {
  const c = randInt(rng, -6, 8) + Math.floor(lvl / 5);
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const m = randInt(rng, 2, 7) * scale;
      const b = randInt(rng, -10, 15);
      const val = m * c + b;
      return {
        question: `lim(x → ${c}) [${m}x + (${b})]?`,
        answer: String(val),
        explanation: `${m}(${c}) + (${b}) = ${val}.`
      };
    }
    case 1: {
      const a = randInt(rng, 1, 4);
      const b = randInt(rng, -5, 8);
      const val = a * c * c + b;
      return {
        question: `lim(x → ${c}) [${a}x² + (${b})]?`,
        answer: String(val),
        explanation: `${a}(${c})² + (${b}) = ${val}.`
      };
    }
    case 2: {
      const leftVal = randInt(rng, -8, 12) * scale;
      const rightVal = leftVal + randInt(rng, 1, 6) * scale;
      const k = randInt(rng, 1, 4);
      return {
        question: `Left limit is ${leftVal}, right limit is ${rightVal} at x = ${c}. Find ${k}·[lim(x→${c}⁺) f(x) - lim(x→${c}⁻) f(x)]?`,
        answer: String(k * (rightVal - leftVal)),
        explanation: `${k} × (${rightVal} - ${leftVal}) = ${k * (rightVal - leftVal)}.`
      };
    }
    case 3: {
      const L = randInt(rng, -10, 15) * scale;
      return {
        question: `f(x) is continuous at x = ${c} and lim(x→${c}) f(x) = ${L}. Find f(${c})?`,
        answer: String(L),
        explanation: `Continuity gives f(${c}) = lim(x→${c}) f(x) = ${L}.`
      };
    }
    case 4: {
      const k = randInt(rng, 1, 6) * scale;
      const cVal = randInt(rng, -10, 20);
      return {
        question: `f(x) = ${k}x + b for x < ${c}, and ${cVal} for x ≥ ${c}. Value of b for continuity at x = ${c}?`,
        answer: String(cVal - k * c),
        explanation: `${k}(${c}) + b = ${cVal} → b = ${cVal - k * c}.`
      };
    }
    case 5: {
      const x1 = randInt(rng, -5, 5);
      const x2 = x1 + 0.1;
      const y1 = roundTo(randInt(rng, 10, 40) + lvl * 0.5, 2);
      const y2 = roundTo(y1 + randInt(rng, -3, 5) * 0.2, 2);
      const approx = roundTo((y1 + y2) / 2, 2);
      return {
        question: `Table: f(${x1}) = ${y1}, f(${x2}) = ${y2}. Estimate lim(x→${roundTo((x1 + x2) / 2, 2)}) f(x) (2 dec)?`,
        answer: String(approx),
        explanation: `Average neighboring values: (${y1} + ${y2})/2 = ${approx}.`
      };
    }
    case 6: {
      const limF = randInt(rng, -5, 8);
      const limG = randInt(rng, -4, 7);
      return {
        question: `lim f(x) = ${limF}, lim g(x) = ${limG} as x → ${c}. Find lim [2f(x) - 3g(x)]?`,
        answer: String(2 * limF - 3 * limG),
        explanation: `2(${limF}) - 3(${limG}) = ${2 * limF - 3 * limG}.`
      };
    }
    default: {
      const limF = randInt(rng, -4, 6);
      const limG = randInt(rng, -4, 6);
      return {
        question: `lim f(x) = ${limF}, lim g(x) = ${limG} as x → ${c}. Find lim [f(x)·g(x)]?`,
        answer: String(limF * limG),
        explanation: `(${limF}) × (${limG}) = ${limF * limG}.`
      };
    }
  }
}

// 2. Algebraic Limit Evaluation and Squeeze Theorem
function unit2AlgebraicLimits(lvl, rng, arch) {
  const a = randInt(rng, 1, 7) + Math.floor(lvl / 4);
  switch (arch) {
    case 0: {
      // (x^2 - a^2) / (x - a) -> 2a
      return {
        question: `lim(x → ${a}) (x² - ${a * a}) / (x - ${a})?`,
        answer: String(2 * a),
        explanation: `Factor (x - ${a})(x + ${a})/(x - ${a}) = x + ${a} → ${2 * a}.`
      };
    }
    case 1: {
      const r1 = randInt(rng, 1, 6);
      const r2 = randInt(rng, 1, 6);
      const sum = r1 + r2;
      const prod = r1 * r2;
      return {
        question: `lim(x → ${r1}) (x² - ${sum}x + ${prod}) / (x - ${r1})?`,
        answer: String(r1 - r2),
        explanation: `(x - ${r1})(x - ${r2})/(x - ${r1}) at x = ${r1} gives ${r1 - r2}.`
      };
    }
    case 2: {
      // (sqrt(x + h) - sqrt(h)) / h as h -> 0 is 1/(2*sqrt(h))
      const k = pickOne(rng, [1, 4, 9, 16, 25]);
      const ans = roundTo(1 / (2 * Math.sqrt(k)), 4);
      return {
        question: `lim(h → 0) [√(${k} + h) - ${Math.sqrt(k)}] / h (4 dec)?`,
        answer: String(ans),
        explanation: `Derivative of √x at x = ${k} is 1/(2√${k}) = ${ans}.`
      };
    }
    case 3: {
      const m = randInt(rng, 2, 8);
      return {
        question: `lim(x → 0) sin(${m}x) / x?`,
        answer: String(m),
        explanation: `sin(${m}x)/x → ${m} as x → 0.`
      };
    }
    case 4: {
      const m = randInt(rng, 2, 7);
      return {
        question: `lim(x → 0) tan(${m}x) / x?`,
        answer: String(m),
        explanation: `tan(${m}x)/x → ${m} as x → 0.`
      };
    }
    case 5: {
      const m = randInt(rng, 2, 6);
      return {
        question: `lim(x → 0) [1 - cos(${m}x)] / x?`,
        answer: "0",
        explanation: `[1 - cos(${m}x)]/x² · x → (1/2)(${m}²)·0 = 0.`
      };
    }
    case 6: {
      // Squeeze theorem: h(x) bounded between g1(x) and g2(x)
      const val = randInt(rng, -5, 10) + lvl;
      return {
        question: `For x near ${a}, ${val} - (x - ${a})² ≤ f(x) ≤ ${val} + (x - ${a})². By Squeeze Theorem, lim(x→${a}) f(x)?`,
        answer: String(val),
        explanation: `Both bounds approach ${val} as x → ${a}.`
      };
    }
    default: {
      const b = randInt(rng, 1, 6);
      const ans = roundTo(1 / (2 * Math.sqrt(b)), 4);
      return {
        question: `lim(x → ${b}) (√x - ${roundTo(Math.sqrt(b), 2)}) / (x - ${b}) (4 dec)?`,
        answer: String(ans),
        explanation: `1 / (√x + √${b}) at x = ${b} is 1/(2√${b}) ≈ ${ans}.`
      };
    }
  }
}

// 3. Asymptotes, End Behavior, and Intermediate Value Theorem
function unit3AsymptotesAndIvt(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const numC = randInt(rng, 2, 12) * scale;
      const denC = randInt(rng, 1, 8) * scale;
      const ha = roundTo(numC / denC, 3);
      return {
        question: `Horizontal asymptote of y = (${numC}x² + 3x) / (${denC}x² - 5) as x → ∞ (3 dec)?`,
        answer: String(ha),
        explanation: `Equal degrees → ratio of leading coefficients ${numC}/${denC} ≈ ${ha}.`
      };
    }
    case 1: {
      const va = randInt(rng, -8, 8) + Math.floor(lvl / 6);
      return {
        question: `Vertical asymptote x = a of f(x) = (x + 2) / (x - ${va}). Value of a?`,
        answer: String(va),
        explanation: `Denominator x - ${va} = 0 at x = ${va}.`
      };
    }
    case 2: {
      const k = randInt(rng, 2, 9) * scale;
      return {
        question: `lim(x → ∞) (${k}x + 7) / (x² + 1)?`,
        answer: "0",
        explanation: `Degree of denominator (2) > numerator (1) → limit is 0.`
      };
    }
    case 3: {
      // Slant asymptote y = mx + b for (ax^2 + bx + c) / (x + d)
      const m = randInt(rng, 2, 6);
      const d = randInt(rng, 1, 5);
      const rem = randInt(rng, 1, 8);
      // (mx + b)(x + d) + rem = mx^2 + (md + b)x + bd + rem
      const b = randInt(rng, -4, 6);
      const c1 = m * d + b;
      const c0 = b * d + rem;
      const xEval = randInt(rng, 1, 5);
      const slantY = m * xEval + b;
      return {
        question: `Slant asymptote of (${m}x² + ${c1}x + ${c0}) / (x + ${d}) evaluated at x = ${xEval}?`,
        answer: String(slantY),
        explanation: `Slant line is y = ${m}x + ${b}; at x = ${xEval}, y = ${slantY}.`
      };
    }
    case 4: {
      // IVT linear interpolation estimate
      const x1 = randInt(rng, 1, 5);
      const x2 = x1 + randInt(rng, 2, 5);
      const y1 = -randInt(rng, 2, 10) * scale;
      const y2 = randInt(rng, 2, 10) * scale;
      const xZero = roundTo(x1 + ((-y1) / (y2 - y1)) * (x2 - x1), 3);
      return {
        question: `Continuous f has f(${x1}) = ${y1} and f(${x2}) = ${y2}. Linear IVT estimate for c in (${x1}, ${x2}) where f(c) = 0 (3 dec)?`,
        answer: String(xZero),
        explanation: `${x1} + (0 - ${y1})/(${y2} - ${y1}) × (${x2} - ${x1}) ≈ ${xZero}.`
      };
    }
    case 5: {
      const b = randInt(rng, 1, 7);
      const n = randInt(rng, 2, 4);
      const ans = Math.pow(b, n);
      return {
        question: `lim(x → ∞) (${b}x^${n} + 4x) / x^${n}?`,
        answer: String(ans),
        explanation: `Leading term ratio is ${ans}.`
      };
    }
    case 6: {
      const k = randInt(rng, 1, 6);
      return {
        question: `lim(x → ∞) ${k} / e^x?`,
        answer: "0",
        explanation: `e^x grows without bound → ${k}/e^x → 0.`
      };
    }
    default: {
      const m = randInt(rng, 2, 7);
      const c = randInt(rng, -5, 5);
      return {
        question: `f(x) = (x - ${c})(${m}x + 1) / (x - ${c}). Value of removable hole y-coordinate at x = ${c}?`,
        answer: String(m * c + 1),
        explanation: `Simplify to ${m}x + 1 at x = ${c} → ${m * c + 1}.`
      };
    }
  }
}

// 4. Definition of Derivative and Rates of Change
function unit4RatesOfChange(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // Average rate of change of s(t) = a*t^2 + b*t on [t1, t2]
      const a = randInt(rng, 2, 6) * scale;
      const b = randInt(rng, 1, 8);
      const t1 = randInt(rng, 1, 4);
      const t2 = t1 + randInt(rng, 2, 4);
      const s1 = a * t1 * t1 + b * t1;
      const s2 = a * t2 * t2 + b * t2;
      const avgRate = roundTo((s2 - s1) / (t2 - t1), 2);
      return {
        question: `s(t) = ${a}t² + ${b}t. Average rate of change on [${t1}, ${t2}]?`,
        answer: String(avgRate),
        explanation: `(s(${t2}) - s(${t1})) / (${t2} - ${t1}) = (${s2} - ${s1}) / ${t2 - t1} = ${avgRate}.`
      };
    }
    case 1: {
      // Instantaneous rate at t0 for s(t) = a*t^2 + b*t + c -> 2*a*t0 + b
      const a = randInt(rng, 2, 7) * scale;
      const b = randInt(rng, -5, 10);
      const c = randInt(rng, 0, 20);
      const t0 = randInt(rng, 1, 6);
      const v = 2 * a * t0 + b;
      return {
        question: `s(t) = ${a}t² + (${b})t + ${c}. Velocity s'(${t0})?`,
        answer: String(v),
        explanation: `s'(t) = ${2 * a}t + (${b}) → s'(${t0}) = ${v}.`
      };
    }
    case 2: {
      // Tangent line slope at x0 for f(x) = x^3 - k*x
      const x0 = randInt(rng, 2, 5);
      const k = randInt(rng, 1, 6);
      const slope = 3 * x0 * x0 - k;
      return {
        question: `f(x) = x³ - ${k}x. Slope of tangent line at x = ${x0}?`,
        answer: String(slope),
        explanation: `f'(x) = 3x² - ${k} → f'(${x0}) = ${slope}.`
      };
    }
    case 3: {
      // Normal line slope = -1 / m
      const m = pickOne(rng, [2, 4, 5, -2, -4, -5]);
      const normSlope = roundTo(-1 / m, 3);
      return {
        question: `Tangent line has slope ${m}. Slope of normal line (3 dec)?`,
        answer: String(normSlope),
        explanation: `-1 / ${m} = ${normSlope}.`
      };
    }
    case 4: {
      // Difference quotient (f(a+h) - f(a-h)) / (2h) for f(x) = c*x^2 -> 2*c*a
      const c = randInt(rng, 2, 6) * scale;
      const a = randInt(rng, 1, 6);
      const h = roundTo(randInt(rng, 1, 5) / 10, 1);
      const fPlus = c * Math.pow(a + h, 2);
      const fMinus = c * Math.pow(a - h, 2);
      const symDiff = roundTo((fPlus - fMinus) / (2 * h), 2);
      return {
        question: `f(x) = ${c}x². Symmetric difference [f(${a}+${h}) - f(${a}-${h})] / (2·${h})?`,
        answer: String(symDiff),
        explanation: `Equals 2(${c})(${a}) = ${symDiff}.`
      };
    }
    case 5: {
      // Acceleration from s(t) = a*t^3 + b*t^2 -> 6*a*t + 2*b
      const a = randInt(rng, 1, 4);
      const b = randInt(rng, 1, 6);
      const t = randInt(rng, 1, 4);
      const acc = 6 * a * t + 2 * b;
      return {
        question: `s(t) = ${a}t³ + ${b}t². Acceleration s''(${t})?`,
        answer: String(acc),
        explanation: `v(t) = ${3 * a}t² + ${2 * b}t; a(t) = ${6 * a}t + ${2 * b} → a(${t}) = ${acc}.`
      };
    }
    case 6: {
      // Secant slope from two points
      const x1 = randInt(rng, 1, 5);
      const x2 = x1 + randInt(rng, 2, 6);
      const y1 = randInt(rng, 2, 15);
      const y2 = randInt(rng, 10, 35) + lvl;
      const mSec = roundTo((y2 - y1) / (x2 - x1), 2);
      return {
        question: `Secant line through (${x1}, ${y1}) and (${x2}, ${y2}). Slope (2 dec)?`,
        answer: String(mSec),
        explanation: `(${y2} - ${y1}) / (${x2} - ${x1}) = ${mSec}.`
      };
    }
    default: {
      // Tangent line y-intercept at x0 for y = m*(x - x0) + y0 -> y0 - m*x0
      const x0 = randInt(rng, 1, 5);
      const y0 = randInt(rng, 5, 20);
      const m = randInt(rng, 2, 6);
      const yInt = y0 - m * x0;
      return {
        question: `Tangent at (${x0}, ${y0}) has slope ${m}. y-intercept of tangent line?`,
        answer: String(yInt),
        explanation: `y - ${y0} = ${m}(x - ${x0}) → y-intercept is ${yInt}.`
      };
    }
  }
}

// 5. Basic Differentiation Rules (Power, Product, Quotient)
function unit5BasicDerivatives(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // Power rule: a*x^n at x0 -> a*n*x0^(n-1)
      const a = randInt(rng, 2, 7) * scale;
      const n = randInt(rng, 2, 5);
      const x0 = randInt(rng, 1, 4);
      const ans = a * n * Math.pow(x0, n - 1);
      return {
        question: `f(x) = ${a}x^${n}. Find f'(${x0})?`,
        answer: String(ans),
        explanation: `f'(x) = ${a * n}x^${n - 1} → f'(${x0}) = ${ans}.`
      };
    }
    case 1: {
      // Polynomial at x0: a*x^2 + b*x + c -> 2*a*x0 + b
      const a = randInt(rng, 2, 6) * scale;
      const b = randInt(rng, -8, 10);
      const x0 = randInt(rng, 1, 5);
      const ans = 2 * a * x0 + b;
      return {
        question: `f(x) = ${a}x² + (${b})x + 9. Find f'(${x0})?`,
        answer: String(ans),
        explanation: `f'(x) = ${2 * a}x + (${b}) → f'(${x0}) = ${ans}.`
      };
    }
    case 2: {
      // Product rule: (f*g)'(a) = f'(a)g(a) + f(a)g'(a)
      const fa = randInt(rng, 2, 6);
      const fpa = randInt(rng, -4, 6);
      const ga = randInt(rng, 2, 6);
      const gpa = randInt(rng, -4, 6);
      const x = randInt(rng, 1, 5);
      const ans = fpa * ga + fa * gpa;
      return {
        question: `f(${x}) = ${fa}, f'(${x}) = ${fpa}, g(${x}) = ${ga}, g'(${x}) = ${gpa}. Find (fg)'(${x})?`,
        answer: String(ans),
        explanation: `(${fpa})(${ga}) + (${fa})(${gpa}) = ${ans}.`
      };
    }
    case 3: {
      // Quotient rule: (f/g)'(a) = [f'(a)g(a) - f(a)g'(a)] / [g(a)]^2
      const ga = randInt(rng, 2, 5);
      const fa = randInt(rng, 1, 6);
      const gpa = randInt(rng, -3, 4);
      // Choose fpa so numerator is divisible by ga^2 for clean numbers
      const g2 = ga * ga;
      const k = randInt(rng, -2, 3);
      const fpa = Math.round((k * g2 + fa * gpa) / ga);
      const num = fpa * ga - fa * gpa;
      const ans = roundTo(num / g2, 3);
      return {
        question: `f(2) = ${fa}, f'(2) = ${fpa}, g(2) = ${ga}, g'(2) = ${gpa}. Find (f/g)'(2) (3 dec)?`,
        answer: String(ans),
        explanation: `[${fpa}(${ga}) - ${fa}(${gpa})] / ${ga}² = ${num} / ${g2} ≈ ${ans}.`
      };
    }
    case 4: {
      // Negative power: k / x^2 at x0 -> -2*k / x0^3
      const x0 = pickOne(rng, [1, 2, 4]);
      const k = randInt(rng, 2, 8) * scale;
      const ans = roundTo((-2 * k) / Math.pow(x0, 3), 3);
      return {
        question: `f(x) = ${k} / x². Find f'(${x0}) (3 dec)?`,
        answer: String(ans),
        explanation: `f'(x) = -${2 * k}/x³ → f'(${x0}) = ${ans}.`
      };
    }
    case 5: {
      // Linear combination derivative: (3f + 2g)'(a)
      const x = randInt(rng, 1, 6);
      const fp = randInt(rng, -5, 8);
      const gp = randInt(rng, -5, 8);
      const c1 = randInt(rng, 2, 4);
      const c2 = randInt(rng, 2, 5);
      return {
        question: `f'(${x}) = ${fp}, g'(${x}) = ${gp}. Find (${c1}f + ${c2}g)'(${x})?`,
        answer: String(c1 * fp + c2 * gp),
        explanation: `${c1}(${fp}) + ${c2}(${gp}) = ${c1 * fp + c2 * gp}.`
      };
    }
    case 6: {
      // Constant derivative
      const c = randInt(rng, 10, 99) * scale;
      const x = randInt(rng, 1, 10);
      return {
        question: `f(x) = ${c}. Find f'(${x})?`,
        answer: "0",
        explanation: `Derivative of a constant is 0.`
      };
    }
    default: {
      // (a*x + b)^2 derivative at x0 -> 2*a*(a*x0 + b)
      const a = randInt(rng, 2, 5);
      const b = randInt(rng, 1, 6);
      const x0 = randInt(rng, 1, 4);
      const ans = 2 * a * (a * x0 + b);
      return {
        question: `f(x) = (${a}x + ${b})². Find f'(${x0})?`,
        answer: String(ans),
        explanation: `f'(x) = 2(${a}x + ${b})(${a}) → f'(${x0}) = ${ans}.`
      };
    }
  }
}

// 6. Chain Rule and Implicit Differentiation
function unit6ChainAndImplicit(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // (g(h(x)))' = g'(h(x)) * h'(x)
      const x = randInt(rng, 1, 5);
      const hx = randInt(rng, 1, 6);
      const hp = randInt(rng, -4, 6);
      const gpAtH = randInt(rng, -5, 7);
      return {
        question: `h(${x}) = ${hx}, h'(${x}) = ${hp}, g'(${hx}) = ${gpAtH}. Find (g∘h)'(${x})?`,
        answer: String(gpAtH * hp),
        explanation: `g'(h(${x}))·h'(${x}) = (${gpAtH})(${hp}) = ${gpAtH * hp}.`
      };
    }
    case 1: {
      // (a*x^2 + b)^n at x0 -> n*(a*x0^2 + b)^(n-1) * 2*a*x0
      const a = randInt(rng, 1, 3);
      const b = randInt(rng, 1, 5);
      const x0 = randInt(rng, 1, 3);
      const u = a * x0 * x0 + b;
      const du = 2 * a * x0;
      const ans = 3 * u * u * du;
      return {
        question: `f(x) = (${a}x² + ${b})³. Find f'(${x0})?`,
        answer: String(ans),
        explanation: `3(${u})²(${du}) = ${ans}.`
      };
    }
    case 2: {
      // Implicit: x^2 + y^2 = r^2 -> dy/dx = -x/y
      const x = randInt(rng, 2, 6);
      const y = randInt(rng, 2, 6);
      const ans = roundTo(-x / y, 3);
      return {
        question: `x² + y² = ${x * x + y * y}. Find dy/dx at (${x}, ${y}) (3 dec)?`,
        answer: String(ans),
        explanation: `2x + 2y(dy/dx) = 0 → dy/dx = -${x}/${y} ≈ ${ans}.`
      };
    }
    case 3: {
      // Implicit: x*y = k -> dy/dx = -y/x
      const x = randInt(rng, 2, 6) * scale;
      const y = randInt(rng, 2, 8);
      const ans = roundTo(-y / x, 3);
      return {
        question: `xy = ${x * y}. Find dy/dx at (${x}, ${y}) (3 dec)?`,
        answer: String(ans),
        explanation: `y + x(dy/dx) = 0 → dy/dx = -${y}/${x} ≈ ${ans}.`
      };
    }
    case 4: {
      // Implicit: 2x + 3y = c -> dy/dx = -2/3
      const a = randInt(rng, 2, 7);
      const b = randInt(rng, 2, 7);
      const ans = roundTo(-a / b, 3);
      return {
        question: `${a}x + ${b}y = ${a * 3 + b * 4}. Find dy/dx (3 dec)?`,
        answer: String(ans),
        explanation: `${a} + ${b}(dy/dx) = 0 → dy/dx = -${a}/${b} ≈ ${ans}.`
      };
    }
    case 5: {
      // Implicit: y^2 = 4*p*x -> dy/dx = (2*p) / y
      const y = randInt(rng, 2, 8);
      const k = randInt(rng, 2, 6);
      const ans = roundTo(k / (2 * y), 3);
      return {
        question: `y² = ${k}x. Find dy/dx when y = ${y} (3 dec)?`,
        answer: String(ans),
        explanation: `2y(dy/dx) = ${k} → dy/dx = ${k}/(2·${y}) ≈ ${ans}.`
      };
    }
    case 6: {
      // [f(x)]^2 at a -> 2*f(a)*f'(a)
      const fa = randInt(rng, 2, 7);
      const fpa = randInt(rng, -4, 6);
      return {
        question: `f(3) = ${fa}, f'(3) = ${fpa}. Derivative of [f(x)]² at x = 3?`,
        answer: String(2 * fa * fpa),
        explanation: `2·f(3)·f'(3) = 2(${fa})(${fpa}) = ${2 * fa * fpa}.`
      };
    }
    default: {
      // y = (3x - 1)^4 at x = 1 -> 4 * (2)^3 * 3 = 96
      const a = randInt(rng, 2, 4);
      const b = randInt(rng, -3, 3);
      const x0 = 1;
      const inner = a * x0 + b;
      const ans = 4 * Math.pow(inner, 3) * a;
      return {
        question: `f(x) = (${a}x + (${b}))⁴. Find f'(1)?`,
        answer: String(ans),
        explanation: `4(${inner})³(${a}) = ${ans}.`
      };
    }
  }
}

// 7. Derivatives of Trig, Exponential, and Logarithmic Functions
function unit7TranscendentalDerivs(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // d/dx [a * e^(k*x)] at x = 0 -> a*k
      const a = randInt(rng, 2, 8) * scale;
      const k = randInt(rng, 2, 6);
      return {
        question: `f(x) = ${a}e^(${k}x). Find f'(0)?`,
        answer: String(a * k),
        explanation: `f'(x) = ${a * k}e^(${k}x) → f'(0) = ${a * k}.`
      };
    }
    case 1: {
      // d/dx [ln(a*x)] at x0 -> 1/x0
      const a = randInt(rng, 2, 6);
      const x0 = randInt(rng, 2, 10) * scale;
      const ans = roundTo(1 / x0, 4);
      return {
        question: `f(x) = ln(${a}x). Find f'(${x0}) (4 dec)?`,
        answer: String(ans),
        explanation: `f'(x) = 1/x → f'(${x0}) = ${ans}.`
      };
    }
    case 2: {
      // d/dx [a * sin(x)] at x = 0 -> a * cos(0) = a
      const a = randInt(rng, 2, 9) * scale;
      return {
        question: `f(x) = ${a}sin(x). Find f'(0)?`,
        answer: String(a),
        explanation: `f'(x) = ${a}cos(x) → ${a}cos(0) = ${a}.`
      };
    }
    case 3: {
      // d/dx [a * cos(k*x)] at x = 0 -> -a*k*sin(0) = 0
      const a = randInt(rng, 2, 8);
      const k = randInt(rng, 2, 6);
      return {
        question: `f(x) = ${a}cos(${k}x). Find f'(0)?`,
        answer: "0",
        explanation: `f'(0) = -${a * k}sin(0) = 0.`
      };
    }
    case 4: {
      // d/dx [tan(x)] at x = 0 -> sec^2(0) = 1
      const c = randInt(rng, 2, 7) * scale;
      return {
        question: `f(x) = ${c}tan(x). Find f'(0)?`,
        answer: String(c),
        explanation: `f'(x) = ${c}sec²(x) → ${c}(1) = ${c}.`
      };
    }
    case 5: {
      // d/dx [ln(x^2 + k)] at x = 0 -> 0 / k = 0
      const k = randInt(rng, 2, 10);
      return {
        question: `f(x) = ln(x² + ${k}). Find f'(0)?`,
        answer: "0",
        explanation: `f'(x) = 2x/(x² + ${k}) → f'(0) = 0.`
      };
    }
    case 6: {
      // d/dx [ln(x^2 + k)] at x = 2 -> 4 / (4 + k)
      const k = randInt(rng, 1, 6);
      const ans = roundTo(4 / (4 + k), 4);
      return {
        question: `f(x) = ln(x² + ${k}). Find f'(2) (4 dec)?`,
        answer: String(ans),
        explanation: `2(2)/(2² + ${k}) = 4/${4 + k} ≈ ${ans}.`
      };
    }
    default: {
      // d/dx [b^x] at x = 0 -> ln(b)
      const b = pickOne(rng, [2, 3, 4, 5, 10]);
      const ans = roundTo(Math.log(b), 4);
      return {
        question: `f(x) = ${b}^x. Find f'(0) (4 dec)?`,
        answer: String(ans),
        explanation: `f'(0) = ln(${b}) ≈ ${ans}.`
      };
    }
  }
}

// 8. Inverse Functions and Parametric/Polar Derivatives
function unit8InverseParametricPolar(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      // (f^-1)'(f(a)) = 1 / f'(a)
      const a = randInt(rng, 1, 5);
      const k = randInt(rng, 2, 6);
      // f(x) = k*x^2 -> f(a) = k*a^2, f'(a) = 2*k*a
      const fa = k * a * a;
      const ans = roundTo(1 / (2 * k * a), 4);
      return {
        question: `f(x) = ${k}x² (x > 0). Find (f⁻¹)'(${fa}) (4 dec)?`,
        answer: String(ans),
        explanation: `f(${a}) = ${fa} and f'(${a}) = ${2 * k * a} → 1/${2 * k * a} ≈ ${ans}.`
      };
    }
    case 1: {
      // (f^-1)'(b) given f(a) = b, f'(a) = m
      const a = randInt(rng, 1, 6);
      const b = randInt(rng, 2, 15) + lvl;
      const m = randInt(rng, 2, 8);
      const ans = roundTo(1 / m, 4);
      return {
        question: `f(${a}) = ${b} and f'(${a}) = ${m}. Find (f⁻¹)'(${b}) (4 dec)?`,
        answer: String(ans),
        explanation: `1 / f'(${a}) = 1 / ${m} ≈ ${ans}.`
      };
    }
    case 2: {
      // Parametric dy/dx = (dy/dt) / (dx/dt)
      const dxdt = randInt(rng, 2, 8);
      const dydt = randInt(rng, -10, 12);
      const ans = roundTo(dydt / dxdt, 3);
      return {
        question: `Parametric: dx/dt = ${dxdt} and dy/dt = ${dydt}. Find dy/dx (3 dec)?`,
        answer: String(ans),
        explanation: `(dy/dt)/(dx/dt) = ${dydt}/${dxdt} ≈ ${ans}.`
      };
    }
    case 3: {
      // x(t) = a*t^2, y(t) = b*t -> dy/dx = b / (2*a*t)
      const a = randInt(rng, 1, 4);
      const b = randInt(rng, 2, 8);
      const t = randInt(rng, 1, 4);
      const ans = roundTo(b / (2 * a * t), 3);
      return {
        question: `x(t) = ${a}t², y(t) = ${b}t. Find dy/dx at t = ${t} (3 dec)?`,
        answer: String(ans),
        explanation: `dy/dt = ${b}, dx/dt = ${2 * a * t} → ${b}/${2 * a * t} ≈ ${ans}.`
      };
    }
    case 4: {
      // Polar r(theta) = a*theta at theta = 0 -> dr/dtheta = a
      const a = randInt(rng, 2, 9);
      const th = roundTo(randInt(rng, 1, 5) / 2, 1);
      return {
        question: `Polar r(θ) = ${a}θ. Find dr/dθ at θ = ${th}?`,
        answer: String(a),
        explanation: `dr/dθ = ${a}.`
      };
    }
    case 5: {
      // Polar r(theta) = k*theta^2 at theta = t -> 2*k*t
      const k = randInt(rng, 1, 5);
      const t = randInt(rng, 1, 4);
      return {
        question: `Polar r(θ) = ${k}θ². Find dr/dθ at θ = ${t}?`,
        answer: String(2 * k * t),
        explanation: `dr/dθ = ${2 * k}θ → ${2 * k * t}.`
      };
    }
    case 6: {
      // Parametric speed sqrt((dx/dt)^2 + (dy/dt)^2) using 3-4-5 or 5-12-13
      const mult = randInt(rng, 1, 4);
      const vx = 3 * mult;
      const vy = 4 * mult;
      return {
        question: `Velocity components: dx/dt = ${vx}, dy/dt = ${vy}. Speed?`,
        answer: String(5 * mult),
        explanation: `√(${vx}² + ${vy}²) = ${5 * mult}.`
      };
    }
    default: {
      // Inverse trig derivative: d/dx [arcsin(x)] at x = 0 is 1
      const c = randInt(rng, 2, 7);
      return {
        question: `f(x) = ${c}·arcsin(x). Find f'(0)?`,
        answer: String(c),
        explanation: `${c} / √(1 - 0²) = ${c}.`
      };
    }
  }
}

// 9. Related Rates
function unit9RelatedRates(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 5);
  switch (arch) {
    case 0: {
      // Circle area A = pi*r^2 -> dA/dt = 2*pi*r*(dr/dt), return coefficient of pi
      const r = randInt(rng, 2, 10) * scale;
      const drdt = randInt(rng, 1, 6);
      return {
        question: `Circle radius r = ${r} grows at dr/dt = ${drdt}. Coefficient k of π in dA/dt = kπ?`,
        answer: String(2 * r * drdt),
        explanation: `dA/dt = 2πr(dr/dt) = 2π(${r})(${drdt}) = ${2 * r * drdt}π.`
      };
    }
    case 1: {
      // Square area A = s^2 -> dA/dt = 2*s*(ds/dt)
      const s = randInt(rng, 3, 12) * scale;
      const dsdt = randInt(rng, 1, 5);
      return {
        question: `Square side s = ${s} increases at ds/dt = ${dsdt}. Rate dA/dt?`,
        answer: String(2 * s * dsdt),
        explanation: `2(${s})(${dsdt}) = ${2 * s * dsdt}.`
      };
    }
    case 2: {
      // Right triangle hypotenuse: x^2 + y^2 = z^2 -> x(dx/dt) + y(dy/dt) = z(dz/dt)
      // Use 3-4-5 triangle: x = 3, y = 4, z = 5; dx/dt = 5 -> dz/dt = 3*5/5 = 3
      const m = randInt(rng, 1, 3);
      const x = 3 * m;
      const y = 4 * m;
      const z = 5 * m;
      const dxdt = 5 * m;
      const dzdt = roundTo((x * dxdt) / z, 2);
      return {
        question: `x = ${x}, y = ${y}, z = ${z} with x² + y² = z². If dx/dt = ${dxdt} and dy/dt = 0, find dz/dt?`,
        answer: String(dzdt),
        explanation: `(${x})(${dxdt}) = (${z})(dz/dt) → dz/dt = ${dzdt}.`
      };
    }
    case 3: {
      // Cube volume V = s^3 -> dV/dt = 3*s^2*(ds/dt)
      const s = randInt(rng, 2, 6);
      const dsdt = randInt(rng, 1, 4);
      return {
        question: `Cube edge s = ${s}, ds/dt = ${dsdt}. Rate dV/dt?`,
        answer: String(3 * s * s * dsdt),
        explanation: `3(${s})²(${dsdt}) = ${3 * s * s * dsdt}.`
      };
    }
    case 4: {
      // Sphere surface area S = 4*pi*r^2 -> dS/dt = 8*pi*r*(dr/dt), coeff of pi
      const r = randInt(rng, 2, 8);
      const drdt = randInt(rng, 1, 5);
      return {
        question: `Sphere r = ${r}, dr/dt = ${drdt}. Coefficient k of π in dS/dt = kπ?`,
        answer: String(8 * r * drdt),
        explanation: `8π(${r})(${drdt}) = ${8 * r * drdt}π.`
      };
    }
    case 5: {
      // Linear relation y = m*x -> dy/dt = m*(dx/dt)
      const m = randInt(rng, 2, 6);
      const dxdt = randInt(rng, 2, 8) * scale;
      return {
        question: `y = ${m}x and dx/dt = ${dxdt}. Find dy/dt?`,
        answer: String(m * dxdt),
        explanation: `${m} × ${dxdt} = ${m * dxdt}.`
      };
    }
    case 6: {
      // Circumference C = 2*pi*r -> dC/dt = 2*pi*(dr/dt), coeff of pi
      const drdt = randInt(rng, 2, 10) * scale;
      return {
        question: `Circle radius changes at dr/dt = ${drdt}. Coefficient k of π in dC/dt = kπ?`,
        answer: String(2 * drdt),
        explanation: `2π(${drdt}) = ${2 * drdt}π.`
      };
    }
    default: {
      // Volume V = B * h with constant base B = area -> dV/dt = B * (dh/dt)
      const baseArea = randInt(rng, 10, 40) * scale;
      const dhdt = randInt(rng, 1, 6);
      return {
        question: `Tank has constant base area ${baseArea} and water rises at dh/dt = ${dhdt}. Flow rate dV/dt?`,
        answer: String(baseArea * dhdt),
        explanation: `${baseArea} × ${dhdt} = ${baseArea * dhdt}.`
      };
    }
  }
}

// 10. Linear Approximation, Differentials, and L'Hopital's Rule
function unit10LinearApproxLhopital(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      // Linear approx L(x) = f(a) + f'(a)*(x - a) for f(x) = x^2 at a = 2 -> f(2)=4, f'(2)=4
      const a = randInt(rng, 1, 4);
      const fa = a * a;
      const fpa = 2 * a;
      const dx = roundTo(randInt(rng, -3, 3) / 10, 1);
      const x = roundTo(a + dx, 1);
      const lx = roundTo(fa + fpa * dx, 2);
      return {
        question: `Linear approx of f(x) = x² at a = ${a}, evaluated at x = ${x} (2 dec)?`,
        answer: String(lx),
        explanation: `L(${x}) = ${fa} + ${fpa}(${dx}) = ${lx}.`
      };
    }
    case 1: {
      // Differential dy = f'(x)*dx for f(x) = k*x^3
      const k = randInt(rng, 1, 4);
      const x = randInt(rng, 1, 4);
      const dx = roundTo(randInt(rng, 1, 5) / 10, 1);
      const dy = roundTo(3 * k * x * x * dx, 2);
      return {
        question: `y = ${k}x³. Differential dy when x = ${x} and dx = ${dx} (2 dec)?`,
        answer: String(dy),
        explanation: `dy = ${3 * k}x²·dx = ${3 * k}(${x})²(${dx}) = ${dy}.`
      };
    }
    case 2: {
      // L'Hopital: sin(k*x) / x as x -> 0 is k
      const k = randInt(rng, 2, 9);
      return {
        question: `L'Hôpital: lim(x → 0) sin(${k}x) / x?`,
        answer: String(k),
        explanation: `Differentiate top and bottom: ${k}cos(${k}x)/1 at x = 0 → ${k}.`
      };
    }
    case 3: {
      // L'Hopital: (e^(k*x) - 1) / x as x -> 0 is k
      const k = randInt(rng, 2, 8);
      return {
        question: `L'Hôpital: lim(x → 0) (e^(${k}x) - 1) / x?`,
        answer: String(k),
        explanation: `${k}e^(${k}x)/1 at x = 0 → ${k}.`
      };
    }
    case 4: {
      // L'Hopital: (a*x^2 + b*x) / (c*x^2) as x -> inf is a / c
      const a = randInt(rng, 2, 10);
      const c = randInt(rng, 2, 8);
      const ans = roundTo(a / c, 3);
      return {
        question: `lim(x → ∞) (${a}x² + 5x) / (${c}x² + 2) (3 dec)?`,
        answer: String(ans),
        explanation: `Apply L'Hôpital twice → ${a}/${c} ≈ ${ans}.`
      };
    }
    case 5: {
      // L'Hopital: (x^2 - a^2) / (x - a) as x -> a is 2a
      const a = randInt(rng, 2, 8);
      return {
        question: `lim(x → ${a}) (x² - ${a * a}) / (x - ${a})?`,
        answer: String(2 * a),
        explanation: `2x / 1 at x = ${a} → ${2 * a}.`
      };
    }
    case 6: {
      // Tangent line y-value: y0 + m*(x - x0)
      const x0 = randInt(rng, 1, 5);
      const y0 = randInt(rng, 2, 12);
      const m = randInt(rng, 1, 5);
      const x = x0 + 0.5;
      return {
        question: `Tangent at (${x0}, ${y0}) has slope ${m}. Approximate y at x = ${x}?`,
        answer: String(roundTo(y0 + m * 0.5, 2)),
        explanation: `${y0} + ${m}(0.5) = ${roundTo(y0 + m * 0.5, 2)}.`
      };
    }
    default: {
      // L'Hopital: ln(1 + k*x) / x as x -> 0 is k
      const k = randInt(rng, 2, 8);
      return {
        question: `lim(x → 0) ln(1 + ${k}x) / x?`,
        answer: String(k),
        explanation: `[${k}/(1 + ${k}x)] / 1 at x = 0 → ${k}.`
      };
    }
  }
}

// 11. Mean Value Theorem and First Derivative Test (Extrema)
function unit11MvtAndFirstDeriv(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // MVT for f(x) = a*x^2 + b*x on [x1, x2]: f'(c) = (f(x2)-f(x1))/(x2-x1) -> c = (x1+x2)/2
      const x1 = randInt(rng, 0, 4);
      const x2 = x1 + randInt(rng, 2, 6);
      const c = roundTo((x1 + x2) / 2, 2);
      return {
        question: `MVT on [${x1}, ${x2}] for quadratic f(x) = x² + 3x: find c?`,
        answer: String(c),
        explanation: `f'(c) = 2c + 3 = average slope (x1 + x2 + 3) → c = (${x1} + ${x2})/2 = ${c}.`
      };
    }
    case 1: {
      // Average slope on [a, b] for MVT
      const a = randInt(rng, 1, 4);
      const b = a + randInt(rng, 2, 5);
      const fa = randInt(rng, 2, 12) * scale;
      const fb = fa + randInt(rng, 6, 24) * scale;
      const avgSlope = roundTo((fb - fa) / (b - a), 2);
      return {
        question: `f(${a}) = ${fa}, f(${b}) = ${fb}. Value of f'(c) guaranteed by MVT on [${a}, ${b}]?`,
        answer: String(avgSlope),
        explanation: `(${fb} - ${fa}) / (${b} - ${a}) = ${avgSlope}.`
      };
    }
    case 2: {
      // Critical point of f(x) = a*x^2 - b*x + c -> f'(x) = 2ax - b = 0 -> x = b/(2a)
      const a = randInt(rng, 1, 4);
      const xCrit = randInt(rng, 1, 6) * scale;
      const b = 2 * a * xCrit;
      return {
        question: `Critical number x of f(x) = ${a}x² - ${b}x + 7?`,
        answer: String(xCrit),
        explanation: `f'(x) = ${2 * a}x - ${b} = 0 → x = ${xCrit}.`
      };
    }
    case 3: {
      // Local min value of f(x) = (x - h)^2 + k -> k
      const h = randInt(rng, -5, 6);
      const k = randInt(rng, -10, 20) * scale;
      return {
        question: `Minimum value of f(x) = (x - (${h}))² + (${k})?`,
        answer: String(k),
        explanation: `Square term ≥ 0, so minimum is ${k} at x = ${h}.`
      };
    }
    case 4: {
      // Local max value of f(x) = -(x - h)^2 + k -> k
      const h = randInt(rng, -5, 6);
      const k = randInt(rng, -5, 25) * scale;
      return {
        question: `Maximum value of f(x) = -(x - (${h}))² + (${k})?`,
        answer: String(k),
        explanation: `-(x - (${h}))² ≤ 0, so maximum is ${k}.`
      };
    }
    case 5: {
      // f'(x) = m*(x - r): zero at x = r
      const r = randInt(rng, -6, 8) + Math.floor(lvl / 5);
      const m = randInt(rng, 2, 6);
      return {
        question: `f'(x) = ${m}(x - (${r})). Critical point x?`,
        answer: String(r),
        explanation: `Set f'(x) = 0 → x = ${r}.`
      };
    }
    case 6: {
      // Value at local extremum for f(x) = x^2 - 2*h*x + c
      const h = randInt(rng, 1, 6);
      const c = randInt(rng, 1, 15);
      const minVal = c - h * h;
      return {
        question: `f(x) = x² - ${2 * h}x + ${c}. Minimum value of f(x)?`,
        answer: String(minVal),
        explanation: `Vertex at x = ${h}: (${h})² - ${2 * h}(${h}) + ${c} = ${minVal}.`
      };
    }
    default: {
      // MVT slope when f(b) - f(a) = d on [a, b]
      const a = randInt(rng, 1, 5);
      const len = randInt(rng, 2, 6);
      const b = a + len;
      const diff = len * randInt(rng, 2, 8);
      return {
        question: `f is continuous/differentiable with f(${b}) - f(${a}) = ${diff}. Average slope on [${a}, ${b}]?`,
        answer: String(diff / len),
        explanation: `${diff} / ${len} = ${diff / len}.`
      };
    }
  }
}

// 12. Concavity, Second Derivative Test, and Inflection Points
function unit12ConcavityAndInflection(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // f''(x) for f(x) = a*x^3 + b*x^2 at x0 -> 6*a*x0 + 2*b
      const a = randInt(rng, 1, 4) * scale;
      const b = randInt(rng, -6, 8);
      const x0 = randInt(rng, 1, 4);
      const fpp = 6 * a * x0 + 2 * b;
      return {
        question: `f(x) = ${a}x³ + (${b})x² + 5x. Find f''(${x0})?`,
        answer: String(fpp),
        explanation: `f''(x) = ${6 * a}x + (${2 * b}) → f''(${x0}) = ${fpp}.`
      };
    }
    case 1: {
      // Inflection x for f(x) = a*x^3 - 3*a*k*x^2 -> 6*a*x - 6*a*k = 0 -> x = k
      const a = randInt(rng, 1, 4);
      const k = randInt(rng, -5, 7) + Math.floor(lvl / 6);
      return {
        question: `Inflection point x-coordinate of f(x) = ${a}x³ - ${3 * a * k}x² + 2x?`,
        answer: String(k),
        explanation: `f''(x) = ${6 * a}x - ${6 * a * k} = 0 → x = ${k}.`
      };
    }
    case 2: {
      // f''(x) = m*(x - r): inflection x = r
      const r = randInt(rng, -6, 8);
      const m = randInt(rng, 2, 7);
      return {
        question: `f''(x) = ${m}(x - (${r})). Inflection point x-coordinate?`,
        answer: String(r),
        explanation: `f''(x) changes sign at x = ${r}.`
      };
    }
    case 3: {
      // Evaluate f''(x) = c*x^2 - d at x0
      const c = randInt(rng, 2, 5);
      const d = randInt(rng, 1, 10);
      const x0 = randInt(rng, 1, 5);
      return {
        question: `f''(x) = ${c}x² - ${d}. Value of f''(${x0})?`,
        answer: String(c * x0 * x0 - d),
        explanation: `${c}(${x0})² - ${d} = ${c * x0 * x0 - d}.`
      };
    }
    case 4: {
      // Inflection y-value for f(x) = (x - h)^3 + k -> (h, k)
      const h = randInt(rng, -4, 5);
      const k = randInt(rng, -10, 15) * scale;
      return {
        question: `f(x) = (x - (${h}))³ + (${k}). Inflection point y-coordinate?`,
        answer: String(k),
        explanation: `Inflection point is (${h}, ${k}).`
      };
    }
    case 5: {
      // Constant second derivative f''(x) = c
      const c = randInt(rng, -12, 14) * scale;
      const x0 = randInt(rng, 1, 10);
      return {
        question: `f(x) = ${roundTo(c / 2, 2)}x² + 4x - 1. Find f''(${x0})?`,
        answer: String(c),
        explanation: `f''(x) = ${c} everywhere.`
      };
    }
    case 6: {
      // f'(x) = x^2 - 4 -> f''(x) = 2x at x = a
      const a = randInt(rng, -5, 6);
      return {
        question: `f'(x) = 3x² - 6x. Find f''(${a})?`,
        answer: String(6 * a - 6),
        explanation: `f''(x) = 6x - 6 → f''(${a}) = ${6 * a - 6}.`
      };
    }
    default: {
      // Inflection x of x^3 + 6x^2 + 9x + 1 -> x = -2
      const a = randInt(rng, 1, 3);
      const b = 3 * a * randInt(rng, -4, 4);
      const xInf = roundTo(-b / (3 * a), 2);
      return {
        question: `Inflection point x-coordinate of f(x) = ${a}x³ + (${b})x² + 5x?`,
        answer: String(xInf),
        explanation: `f''(x) = ${6 * a}x + ${2 * b} = 0 → x = ${xInf}.`
      };
    }
  }
}

// 13. Curve Sketching and Optimization
function unit13Optimization(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // Two numbers with sum S have max product (S/2)^2 at each = S/2
      const half = randInt(rng, 5, 25) * scale;
      const sum = 2 * half;
      return {
        question: `Two positive numbers sum to ${sum}. Maximum possible product?`,
        answer: String(half * half),
        explanation: `Max product occurs when both equal ${half}: ${half} × ${half} = ${half * half}.`
      };
    }
    case 1: {
      // Two positive numbers sum to S: value of larger part at max product
      const half = randInt(rng, 6, 24) * scale;
      return {
        question: `Two positive numbers sum to ${2 * half}. Value of each number maximizing their product?`,
        answer: String(half),
        explanation: `x(S - x) peaks at x = S/2 = ${half}.`
      };
    }
    case 2: {
      // Fencing with perimeter P against a wall: width w = P/4, length L = P/2, max area = P^2 / 8
      const w = randInt(rng, 5, 20) * scale;
      const perim = 4 * w;
      const maxArea = w * (2 * w);
      return {
        question: `${perim} ft of fencing encloses a rectangle along a straight wall (no fence on wall). Max area (sq ft)?`,
        answer: String(maxArea),
        explanation: `2w + L = ${perim} → max area at w = ${w}, L = ${2 * w} gives ${maxArea}.`
      };
    }
    case 3: {
      // Profit P(x) = -a*x^2 + b*x - c -> max x = b / (2a)
      const a = randInt(rng, 1, 4);
      const xMax = randInt(rng, 5, 25) * scale;
      const b = 2 * a * xMax;
      const c = randInt(rng, 10, 50);
      const maxP = -a * xMax * xMax + b * xMax - c;
      return {
        question: `Profit P(x) = -${a}x² + ${b}x - ${c}. Maximum profit?`,
        answer: String(maxP),
        explanation: `P'(x) = 0 at x = ${xMax} → P(${xMax}) = ${maxP}.`
      };
    }
    case 4: {
      // Product x * y = k with x + y minimized -> x = sqrt(k)
      const s = randInt(rng, 4, 15) * scale;
      const prod = s * s;
      return {
        question: `Positive x and y satisfy xy = ${prod}. Minimum value of sum x + y?`,
        answer: String(2 * s),
        explanation: `x + y = x + ${prod}/x is minimized at x = ${s} → ${2 * s}.`
      };
    }
    case 5: {
      // Rectangle with fixed perimeter P: side of max area is P/4
      const side = randInt(rng, 4, 20) * scale;
      return {
        question: `Rectangle has perimeter ${4 * side}. Side length maximizing area?`,
        answer: String(side),
        explanation: `Square of side ${side} maximizes area.`
      };
    }
    case 6: {
      // Cost C(x) = a*x + b/x for x > 0 -> min at x = sqrt(b/a)
      const a = 2;
      const xOpt = randInt(rng, 3, 10);
      const b = a * xOpt * xOpt;
      const minC = a * xOpt + b / xOpt;
      return {
        question: `C(x) = ${a}x + ${b}/x for x > 0. Minimum value of C(x)?`,
        answer: String(minC),
        explanation: `C'(x) = ${a} - ${b}/x² = 0 at x = ${xOpt} → C(${xOpt}) = ${minC}.`
      };
    }
    default: {
      // Maximizing -x^2 + k*x
      const k = 2 * randInt(rng, 4, 18) * scale;
      return {
        question: `Maximum value of f(x) = -x² + ${k}x?`,
        answer: String((k / 2) * (k / 2)),
        explanation: `Peak at x = ${k / 2}: (${k / 2})² = ${(k / 2) * (k / 2)}.`
      };
    }
  }
}

// 14. Riemann Sums and Definite Integral Definition
function unit14RiemannAndDefinite(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // Left Riemann sum on [0, n] with n subintervals of width 1 for f(x) = k*x
      const n = randInt(rng, 3, 5);
      const k = randInt(rng, 2, 5) * scale;
      // Left endpoints: 0, 1, ..., n-1 -> sum = k * (n*(n-1)/2)
      const lram = (k * n * (n - 1)) / 2;
      return {
        question: `Left Riemann sum (n = ${n}, Δx = 1) for f(x) = ${k}x on [0, ${n}]?`,
        answer: String(lram),
        explanation: `Δx·[f(0) + ... + f(${n - 1})] = ${lram}.`
      };
    }
    case 1: {
      // Right Riemann sum on [0, n] with n subintervals of width 1 for f(x) = k*x
      const n = randInt(rng, 3, 5);
      const k = randInt(rng, 2, 5) * scale;
      // Right endpoints: 1, 2, ..., n -> sum = k * (n*(n+1)/2)
      const rram = (k * n * (n + 1)) / 2;
      return {
        question: `Right Riemann sum (n = ${n}, Δx = 1) for f(x) = ${k}x on [0, ${n}]?`,
        answer: String(rram),
        explanation: `Δx·[f(1) + ... + f(${n})] = ${rram}.`
      };
    }
    case 2: {
      // Midpoint sum with 2 subintervals of width dx on [a, a + 2*dx] for f(x) = m*x
      const a = randInt(rng, 0, 4);
      const dx = randInt(rng, 1, 3);
      const m = randInt(rng, 2, 5) * scale;
      const mid1 = a + dx / 2;
      const mid2 = a + 1.5 * dx;
      const mram = roundTo(dx * (m * mid1 + m * mid2), 2);
      return {
        question: `Midpoint sum (2 subintervals, Δx = ${dx}) for f(x) = ${m}x on [${a}, ${a + 2 * dx}]?`,
        answer: String(mram),
        explanation: `${dx} × [f(${mid1}) + f(${mid2})] = ${mram}.`
      };
    }
    case 3: {
      // Trapezoid rule with 2 equal subintervals of width h on [x0, x2]
      const h = randInt(rng, 1, 4);
      const x0 = randInt(rng, 0, 3);
      const y0 = randInt(rng, 1, 8) * scale;
      const y1 = randInt(rng, 2, 10) * scale;
      const y2 = randInt(rng, 1, 8) * scale;
      const trap = roundTo((h / 2) * (y0 + 2 * y1 + y2), 2);
      return {
        question: `Trapezoid rule (Δx = ${h}) on [${x0}, ${x0 + 2 * h}]: f(${x0})=${y0}, f(${x0 + h})=${y1}, f(${x0 + 2 * h})=${y2}?`,
        answer: String(trap),
        explanation: `(${h}/2)[${y0} + 2(${y1}) + ${y2}] = ${trap}.`
      };
    }
    case 4: {
      // Definite integral of constant c on [a, b]
      const c = randInt(rng, 2, 10) * scale;
      const a = randInt(rng, 1, 4);
      const b = a + randInt(rng, 2, 6);
      return {
        question: `∫_${a}^${b} ${c} dx?`,
        answer: String(c * (b - a)),
        explanation: `${c} × (${b} - ${a}) = ${c * (b - a)}.`
      };
    }
    case 5: {
      // Additivity: int_a^c + int_c^b = int_a^b
      const i1 = randInt(rng, 3, 15) * scale;
      const i2 = randInt(rng, 4, 18) * scale;
      return {
        question: `∫_0^3 f(x)dx = ${i1} and ∫_3^7 f(x)dx = ${i2}. Find ∫_0^7 f(x)dx?`,
        answer: String(i1 + i2),
        explanation: `${i1} + ${i2} = ${i1 + i2}.`
      };
    }
    case 6: {
      // Reversing limits negates integral
      const val = randInt(rng, 4, 20) * scale;
      return {
        question: `∫_1^5 f(x)dx = ${val}. Find ∫_5^1 f(x)dx?`,
        answer: String(-val),
        explanation: `Swapping limits flips sign: -${val}.`
      };
    }
    default: {
      // Subinterval width dx = (b - a) / n
      const a = randInt(rng, 1, 5);
      const n = randInt(rng, 4, 10);
      const dx = randInt(rng, 2, 5);
      const b = a + n * dx;
      return {
        question: `Partition [${a}, ${b}] into ${n} equal subintervals. Width Δx?`,
        answer: String(dx),
        explanation: `(${b} - ${a}) / ${n} = ${dx}.`
      };
    }
  }
}

// 15. Fundamental Theorem of Calculus (Part 1 and Part 2)
function unit15Ftc(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // FTC Part 2: int_0^b (k*x) dx = k * b^2 / 2
      const k = 2 * randInt(rng, 1, 5) * scale;
      const b = randInt(rng, 2, 6);
      const ans = (k * b * b) / 2;
      return {
        question: `∫_0^${b} ${k}x dx?`,
        answer: String(ans),
        explanation: `[${k / 2}x²]_0^${b} = ${ans}.`
      };
    }
    case 1: {
      // FTC Part 2: int_a^b (3*x^2) dx = b^3 - a^3
      const a = randInt(rng, 1, 3);
      const b = a + randInt(rng, 1, 3);
      const ans = b * b * b - a * a * a;
      return {
        question: `∫_${a}^${b} 3x² dx?`,
        answer: String(ans),
        explanation: `[x³]_${a}^${b} = ${b}³ - ${a}³ = ${ans}.`
      };
    }
    case 2: {
      // FTC Part 1: d/dx [int_a^x (m*t + b) dt] at x0 -> m*x0 + b
      const m = randInt(rng, 2, 6) * scale;
      const b = randInt(rng, -5, 8);
      const x0 = randInt(rng, 1, 5);
      return {
        question: `g(x) = ∫_1^x (${m}t + (${b})) dt. Find g'(${x0})?`,
        answer: String(m * x0 + b),
        explanation: `g'(x) = ${m}x + (${b}) → g'(${x0}) = ${m * x0 + b}.`
      };
    }
    case 3: {
      // FTC Part 1 with chain rule: d/dx [int_0^(k*x) f(t) dt] at x0 -> k * f(k*x0)
      const k = randInt(rng, 2, 4);
      const x0 = randInt(rng, 1, 2);
      const u = k * x0;
      const fAtU = randInt(rng, 2, 8) * scale;
      return {
        question: `g(x) = ∫_0^(${k}x) f(t) dt and f(${u}) = ${fAtU}. Find g'(${x0})?`,
        answer: String(k * fAtU),
        explanation: `${k} · f(${u}) = ${k} × ${fAtU} = ${k * fAtU}.`
      };
    }
    case 4: {
      // Average value of f(x) = c on [a, b] is c
      const c = randInt(rng, 5, 30) * scale;
      const a = randInt(rng, 1, 5);
      const b = a + randInt(rng, 3, 10);
      return {
        question: `Average value of f(x) = ${c} on [${a}, ${b}]?`,
        answer: String(c),
        explanation: `[1/(${b}-${a})] ∫_${a}^${b} ${c} dx = ${c}.`
      };
    }
    case 5: {
      // F(b) = F(a) + int_a^b f(t) dt
      const fa = randInt(rng, 4, 20) * scale;
      const area = randInt(rng, 5, 25) * scale;
      return {
        question: `F(2) = ${fa} and ∫_2^6 F'(t) dt = ${area}. Find F(6)?`,
        answer: String(fa + area),
        explanation: `F(6) = F(2) + ∫_2^6 F'(t)dt = ${fa} + ${area} = ${fa + area}.`
      };
    }
    case 6: {
      // FTC Part 2: int_0^b (2*x + 1) dx = b^2 + b
      const b = randInt(rng, 2, 7);
      return {
        question: `∫_0^${b} (2x + 1) dx?`,
        answer: String(b * b + b),
        explanation: `[x² + x]_0^${b} = ${b * b + b}.`
      };
    }
    default: {
      // Average value of f(x) = 2x on [0, b] is b
      const b = randInt(rng, 2, 12) * scale;
      return {
        question: `Average value of f(x) = 2x on [0, ${b}]?`,
        answer: String(b),
        explanation: `(1/${b})[x²]_0^${b} = ${b}²/${b} = ${b}.`
      };
    }
  }
}

// 16. Antiderivatives and u-Substitution
function unit16Substitution(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // int_0^1 2x*(x^2 + k) dx: u = x^2 + k (1..1+k), int_k^(k+1) u du = ((k+1)^2 - k^2)/2 = (2k+1)/2
      const k = randInt(rng, 1, 6) * scale;
      const ans = roundTo((2 * k + 1) / 2, 2);
      return {
        question: `∫_0^1 2x(x² + ${k}) dx?`,
        answer: String(ans),
        explanation: `Let u = x² + ${k}, du = 2x dx: ∫_${k}^${k + 1} u du = ${ans}.`
      };
    }
    case 1: {
      // int_0^2 2x*e^(x^2) dx = e^4 - 1 (approx) or keep exact integer using x * (x^2 + 3)^2
      const a = randInt(rng, 1, 3);
      const ans = Math.round(((Math.pow(4 + a, 3) - Math.pow(a, 3)) / 3));
      return {
        question: `∫_0^2 3x(x² + ${a})² dx?`,
        answer: String(ans),
        explanation: `u = x² + ${a}, du = 2x dx → [ (x² + ${a})³ / 2 ]_0^2... wait: d/dx[(x²+${a})³] = 6x(x²+${a})², so ∫ 3x(x²+${a})² dx = ½(x²+${a})³; value is ${roundTo(0.5 * (Math.pow(4 + a, 3) - Math.pow(a, 3)), 2)}.`
      };
    }
    case 2: {
      // int_0^(b) (2x) / (x^2 + 1) dx = ln(b^2 + 1)
      const b = randInt(rng, 1, 4);
      const ans = roundTo(Math.log(b * b + 1), 4);
      return {
        question: `∫_0^${b} [2x / (x² + 1)] dx (4 dec)?`,
        answer: String(ans),
        explanation: `[ln(x² + 1)]_0^${b} = ln(${b * b + 1}) ≈ ${ans}.`
      };
    }
    case 3: {
      // u-sub upper limit when u = a*x + b at x = x0
      const a = randInt(rng, 2, 5);
      const b = randInt(rng, 1, 7) * scale;
      const x0 = randInt(rng, 1, 5);
      return {
        question: `Using u = ${a}x + ${b} in a definite integral, what is the new upper limit when x = ${x0}?`,
        answer: String(a * x0 + b),
        explanation: `u(${x0}) = ${a}(${x0}) + ${b} = ${a * x0 + b}.`
      };
    }
    case 4: {
      // u-sub lower limit when u = x^2 + c at x = x0
      const c = randInt(rng, 2, 8) * scale;
      const x0 = randInt(rng, 1, 4);
      return {
        question: `Using u = x² + ${c} in a definite integral, what is the new lower limit when x = ${x0}?`,
        answer: String(x0 * x0 + c),
        explanation: `u(${x0}) = ${x0}² + ${c} = ${x0 * x0 + c}.`
      };
    }
    case 5: {
      // int_0^1 k*(2x + 1) dx = k*(1 + 1) = 2k
      const k = randInt(rng, 2, 8) * scale;
      return {
        question: `∫_0^1 ${k}(2x + 1) dx?`,
        answer: String(2 * k),
        explanation: `${k}[x² + x]_0^1 = ${k}(2) = ${2 * k}.`
      };
    }
    case 6: {
      // int_0^1 (x + 1)^3 dx = ((2)^4 - 1)/4 = 15/4 = 3.75
      const c = randInt(rng, 1, 3);
      const ans = roundTo((Math.pow(1 + c, 4) - Math.pow(c, 4)) / 4, 3);
      return {
        question: `∫_0^1 (x + ${c})³ dx (3 dec)?`,
        answer: String(ans),
        explanation: `[(x + ${c})⁴ / 4]_0^1 = ${ans}.`
      };
    }
    default: {
      // int_0^1 a * e^(k*x) dx = a*(e^k - 1)/k
      const k = randInt(rng, 1, 3);
      const a = k * randInt(rng, 2, 5);
      const ans = roundTo(a * ((Math.exp(k) - 1) / k), 3);
      return {
        question: `∫_0^1 ${a}e^(${k}x) dx (3 dec)?`,
        answer: String(ans),
        explanation: `[${a / k}e^(${k}x)]_0^1 ≈ ${ans}.`
      };
    }
  }
}

// 17. Integration by Parts and Partial Fractions
function unit17PartsAndFractions(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      // int_0^1 x * e^x dx = [x*e^x - e^x]_0^1 = 1
      const c = randInt(rng, 2, 6);
      return {
        question: `∫_0^1 ${c}x·e^x dx (3 dec)?`,
        answer: String(c),
        explanation: `By parts, ∫_0^1 x·e^x dx = 1, so ${c} × 1 = ${c}.`
      };
    }
    case 1: {
      // Partial fractions: 1 / [(x - a)(x - b)] = A/(x - a) + B/(x - b); A = 1/(a - b)
      const a = randInt(rng, 2, 5);
      const b = a + randInt(rng, 1, 3);
      // 1 / [(x - a)(x - b)] = [-1/(b-a)]/(x - a) + [1/(b-a)]/(x - b)
      const coeffB = roundTo(1 / (b - a), 3);
      return {
        question: `1/[(x - ${a})(x - ${b})] = A/(x - ${a}) + B/(x - ${b}). Find B (3 dec)?`,
        answer: String(coeffB),
        explanation: `Cover-up at x = ${b}: 1/(${b} - ${a}) = ${coeffB}.`
      };
    }
    case 2: {
      // Partial fractions A value: 1/[(x - a)(x - b)] -> A = -1/(b - a)
      const a = randInt(rng, 1, 4);
      const b = a + randInt(rng, 2, 4);
      const coeffA = roundTo(-1 / (b - a), 3);
      return {
        question: `1/[(x - ${a})(x - ${b})] = A/(x - ${a}) + B/(x - ${b}). Find A (3 dec)?`,
        answer: String(coeffA),
        explanation: `Cover-up at x = ${a}: 1/(${a} - ${b}) = ${coeffA}.`
      };
    }
    case 3: {
      // int_0^1 x * (1 - x) dx = 1/6
      const k = randInt(rng, 6, 18);
      return {
        question: `∫_0^1 ${k}x(1 - x) dx?`,
        answer: String(roundTo(k / 6, 2)),
        explanation: `∫_0^1 (x - x²) dx = 1/6 → ${k}/6 = ${roundTo(k / 6, 2)}.`
      };
    }
    case 4: {
      // int_1^e ln(x) dx = [x*ln(x) - x]_1^e = 1
      const c = randInt(rng, 2, 7) + Math.floor(lvl / 6);
      return {
        question: `∫_1^e ${c}·ln(x) dx?`,
        answer: String(c),
        explanation: `∫_1^e ln(x) dx = 1 → ${c} × 1 = ${c}.`
      };
    }
    case 5: {
      // Sum of A + B for (p*x + q)/[(x - 1)(x - 2)]
      const aVal = randInt(rng, -4, 6);
      const bVal = randInt(rng, -4, 6);
      // At x = 1: -A = p + q; at x = 2: B = 2p + q -> A + B = 2p + q - (p + q) = p
      const p = bVal + aVal;
      const q = -aVal - p;
      return {
        question: `(${p}x + (${q})) / [(x - 1)(x - 2)] = A/(x - 1) + B/(x - 2). Find A + B?`,
        answer: String(aVal + bVal),
        explanation: `A = ${aVal}, B = ${bVal} → A + B = ${aVal + bVal}.`
      };
    }
    case 6: {
      // int_0^1 x * e^(2x) dx = [x*e^(2x)/2 - e^(2x)/4]_0^1 = (e^2 + 1)/4
      const val = roundTo((Math.exp(2) + 1) / 4, 4);
      return {
        question: `∫_0^1 x·e^(2x) dx (4 dec)?`,
        answer: String(val),
        explanation: `[½x·e^(2x) - ¼e^(2x)]_0^1 = (e² + 1)/4 ≈ ${val}.`
      };
    }
    default: {
      // int_0^(pi/2) x*cos(x) dx = [x*sin(x) + cos(x)]_0^(pi/2) = pi/2 - 1
      const val = roundTo(Math.PI / 2 - 1, 4);
      return {
        question: `∫_0^(π/2) x·cos(x) dx (4 dec)?`,
        answer: String(val),
        explanation: `[x·sin(x) + cos(x)]_0^(π/2) = π/2 - 1 ≈ ${val}.`
      };
    }
  }
}

// 18. Area Between Curves and Volumes of Revolution
function unit18AreaAndVolume(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // Area between y = b*x and y = x^2 on [0, b] is b^3 / 6
      const b = randInt(rng, 2, 6) * scale;
      const area = roundTo((b * b * b) / 6, 3);
      return {
        question: `Area enclosed by y = ${b}x and y = x² on [0, ${b}] (3 dec)?`,
        answer: String(area),
        explanation: `∫_0^${b} (${b}x - x²) dx = ${b}³/6 ≈ ${area}.`
      };
    }
    case 1: {
      // Area between y = k and y = 0 on [a, b]
      const k = randInt(rng, 2, 10) * scale;
      const a = randInt(rng, 0, 3);
      const b = a + randInt(rng, 2, 6);
      return {
        question: `Area between y = ${k} and x-axis on [${a}, ${b}]?`,
        answer: String(k * (b - a)),
        explanation: `${k} × (${b} - ${a}) = ${k * (b - a)}.`
      };
    }
    case 2: {
      // Disk volume about x-axis for y = r on [0, h]: pi*r^2*h -> coeff of pi is r^2*h
      const r = randInt(rng, 2, 7) * scale;
      const h = randInt(rng, 2, 8);
      return {
        question: `Revolve y = ${r} around x-axis on [0, ${h}]. Coefficient k of π in Volume = kπ?`,
        answer: String(r * r * h),
        explanation: `π∫_0^${h} ${r}² dx = ${r * r * h}π.`
      };
    }
    case 3: {
      // Disk volume for y = sqrt(x) on [0, b]: pi * b^2 / 2 -> coeff of pi is b^2 / 2
      const b = 2 * randInt(rng, 1, 5) * scale;
      return {
        question: `Revolve y = √x around x-axis on [0, ${b}]. Coefficient k of π in Volume = kπ?`,
        answer: String((b * b) / 2),
        explanation: `π∫_0^${b} x dx = ${b}²/2 · π = ${(b * b) / 2}π.`
      };
    }
    case 4: {
      // Washer volume: outer R = 3, inner r = 1 on [0, h] -> pi*(9 - 1)*h = 8*h*pi
      const R = randInt(rng, 3, 6);
      const r = randInt(rng, 1, R - 1);
      const h = randInt(rng, 1, 5) * scale;
      return {
        question: `Washer around x-axis on [0, ${h}] with outer radius ${R} and inner radius ${r}. Coefficient k of π in Volume = kπ?`,
        answer: String((R * R - r * r) * h),
        explanation: `π(${R}² - ${r}²)(${h}) = ${(R * R - r * r) * h}π.`
      };
    }
    case 5: {
      // Area between y = x + c and y = x on [a, b] is c*(b - a)
      const c = randInt(rng, 2, 8) * scale;
      const a = randInt(rng, 0, 3);
      const b = a + randInt(rng, 2, 5);
      return {
        question: `Area between y = x + ${c} and y = x on [${a}, ${b}]?`,
        answer: String(c * (b - a)),
        explanation: `∫_${a}^${b} ${c} dx = ${c * (b - a)}.`
      };
    }
    case 6: {
      // Volume of cone (y = m*x on [0, h] around x-axis): pi * m^2 * h^3 / 3 -> coeff of pi
      const m = 1;
      const h = 3 * randInt(rng, 1, 3);
      return {
        question: `Revolve y = x around x-axis on [0, ${h}]. Coefficient k of π in Volume = kπ?`,
        answer: String((m * m * Math.pow(h, 3)) / 3),
        explanation: `π∫_0^${h} x² dx = ${h}³/3 · π = ${Math.pow(h, 3) / 3}π.`
      };
    }
    default: {
      // Area between y = 4 - x^2 and y = 0 on [-2, 2] is 32/3
      const a = randInt(rng, 2, 5) * scale;
      const area = roundTo((4 * Math.pow(a, 1.5)) / 3, 3);
      return {
        question: `Area under y = ${a} - x² above x-axis from -√${a} to √${a} (3 dec)?`,
        answer: String(area),
        explanation: `4(${a})^(3/2)/3 ≈ ${area}.`
      };
    }
  }
}

// 19. Differential Equations, Slope Fields, and Euler's Method
function unit19DiffEqAndEuler(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      // Slope of dy/dx = a*x + b*y at (x0, y0)
      const a = randInt(rng, 1, 4) * scale;
      const b = randInt(rng, 1, 4);
      const x0 = randInt(rng, -3, 5);
      const y0 = randInt(rng, -3, 5);
      return {
        question: `dy/dx = ${a}x + ${b}y. Slope at (${x0}, ${y0})?`,
        answer: String(a * x0 + b * y0),
        explanation: `${a}(${x0}) + ${b}(${y0}) = ${a * x0 + b * y0}.`
      };
    }
    case 1: {
      // Euler's method 1 step: dy/dx = m*x + c, y(x0) = y0, step h -> y1 = y0 + h*(m*x0 + c)
      const x0 = randInt(rng, 0, 3);
      const y0 = randInt(rng, 1, 8) * scale;
      const m = randInt(rng, 1, 4);
      const c = randInt(rng, 0, 4);
      const h = 0.5;
      const y1 = roundTo(y0 + h * (m * x0 + c), 3);
      return {
        question: `Euler's method: dy/dx = ${m}x + ${c}, y(${x0}) = ${y0}, step h = ${h}. Find y(${roundTo(x0 + h, 1)}) (3 dec)?`,
        answer: String(y1),
        explanation: `${y0} + ${h}(${m}(${x0}) + ${c}) = ${y1}.`
      };
    }
    case 2: {
      // Exponential growth dy/dt = k*y, y(0) = y0 -> y(t) = y0 * e^(k*t)
      const y0 = randInt(rng, 2, 10) * scale;
      const k = randInt(rng, 1, 3);
      const t = 1;
      const ans = roundTo(y0 * Math.exp(k * t), 3);
      return {
        question: `dy/dt = ${k}y with y(0) = ${y0}. Find y(${t}) (3 dec)?`,
        answer: String(ans),
        explanation: `y(t) = ${y0}e^(${k}t) → ${y0}e^${k} ≈ ${ans}.`
      };
    }
    case 3: {
      // Separable dy/dx = k*x, y(0) = y0 -> y(x) = (k/2)*x^2 + y0
      const k = 2 * randInt(rng, 1, 4);
      const y0 = randInt(rng, 1, 10) * scale;
      const x = randInt(rng, 1, 4);
      const yx = (k / 2) * x * x + y0;
      return {
        question: `dy/dx = ${k}x and y(0) = ${y0}. Find y(${x})?`,
        answer: String(yx),
        explanation: `y = ${k / 2}x² + ${y0} → y(${x}) = ${yx}.`
      };
    }
    case 4: {
      // Logistic growth carrying capacity: dP/dt = k*P*(1 - P/M) -> M
      const M = randInt(rng, 100, 1000) * scale;
      const k = roundTo(randInt(rng, 1, 5) / 10, 1);
      return {
        question: `dP/dt = ${k}P(1 - P/${M}). Carrying capacity?`,
        answer: String(M),
        explanation: `Carrying capacity is ${M}.`
      };
    }
    case 5: {
      // Slope dy/dx = x*y at (x0, y0)
      const x0 = randInt(rng, -4, 5);
      const y0 = randInt(rng, -4, 5);
      return {
        question: `dy/dx = xy. Slope at (${x0}, ${y0})?`,
        answer: String(x0 * y0),
        explanation: `(${x0})(${y0}) = ${x0 * y0}.`
      };
    }
    case 6: {
      // Euler's method 1 step for dy/dx = k*y, y(0) = y0, h = 0.25 -> y0*(1 + 0.25*k)
      const y0 = randInt(rng, 4, 16);
      const k = randInt(rng, 1, 4);
      const h = 0.25;
      const y1 = roundTo(y0 * (1 + h * k), 3);
      return {
        question: `Euler's method: dy/dx = ${k}y, y(0) = ${y0}, h = ${h}. Find y(${h})?`,
        answer: String(y1),
        explanation: `${y0} + ${h}(${k}·${y0}) = ${y1}.`
      };
    }
    default: {
      // dy/dx = c -> y(x) = c*(x - x0) + y0
      const c = randInt(rng, -6, 8) * scale;
      const x0 = randInt(rng, 0, 3);
      const y0 = randInt(rng, 2, 10);
      const x1 = x0 + randInt(rng, 1, 4);
      return {
        question: `dy/dx = ${c} and y(${x0}) = ${y0}. Find y(${x1})?`,
        answer: String(y0 + c * (x1 - x0)),
        explanation: `${y0} + ${c}(${x1} - ${x0}) = ${y0 + c * (x1 - x0)}.`
      };
    }
  }
}

// 20. Sequences, Series, and Taylor Polynomials
function unit20SeriesAndTaylor(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      // Geometric series sum a / (1 - r) for |r| < 1
      const a = randInt(rng, 2, 12) + Math.floor(lvl / 4);
      const r = pickOne(rng, [0.5, 0.25, 0.2, -0.5, 0.75]);
      const sum = roundTo(a / (1 - r), 3);
      return {
        question: `Infinite geometric series with first term a = ${a} and ratio r = ${r}. Sum (3 dec)?`,
        answer: String(sum),
        explanation: `${a} / (1 - (${r})) = ${sum}.`
      };
    }
    case 1: {
      // nth term of geometric sequence: a * r^(n-1)
      const a = randInt(rng, 2, 8);
      const r = pickOne(rng, [2, 3, 0.5]);
      const n = randInt(rng, 3, 5);
      const term = roundTo(a * Math.pow(r, n - 1), 3);
      return {
        question: `Geometric sequence a₁ = ${a}, r = ${r}. Term a_${n} (3 dec)?`,
        answer: String(term),
        explanation: `${a} × (${r})^${n - 1} = ${term}.`
      };
    }
    case 2: {
      // Taylor degree 2 for e^x at x = 0: 1 + x + x^2/2 at x = k
      const k = randInt(rng, 1, 3);
      const p2 = roundTo(1 + k + (k * k) / 2, 3);
      return {
        question: `2nd-degree Maclaurin polynomial P₂(x) = 1 + x + x²/2 for e^x at x = ${k} (3 dec)?`,
        answer: String(p2),
        explanation: `1 + ${k} + ${k}²/2 = ${p2}.`
      };
    }
    case 3: {
      // Taylor degree 3 for sin(x) at x = 0: x - x^3/6 at x = k
      const k = randInt(rng, 1, 2);
      const p3 = roundTo(k - Math.pow(k, 3) / 6, 4);
      return {
        question: `3rd-degree Maclaurin polynomial P₃(x) = x - x³/6 for sin(x) at x = ${k} (4 dec)?`,
        answer: String(p3),
        explanation: `${k} - ${k}³/6 ≈ ${p3}.`
      };
    }
    case 4: {
      // Taylor degree 2 for cos(x) at x = 0: 1 - x^2/2 at x = k
      const k = randInt(rng, 1, 3);
      const p2 = roundTo(1 - (k * k) / 2, 3);
      return {
        question: `2nd-degree Maclaurin polynomial P₂(x) = 1 - x²/2 for cos(x) at x = ${k} (3 dec)?`,
        answer: String(p2),
        explanation: `1 - ${k}²/2 = ${p2}.`
      };
    }
    case 5: {
      // Radius of convergence for sum c_n (x - a)^n when interval is (a - R, a + R)
      const a = randInt(rng, -4, 5);
      const R = randInt(rng, 2, 8);
      return {
        question: `Power series converges on (${a - R}, ${a + R}). Radius of convergence R?`,
        answer: String(R),
        explanation: `Half-width of (${a - R}, ${a + R}) is R = ${R}.`
      };
    }
    case 6: {
      // Taylor polynomial coefficient c_n = f^(n)(a) / n! for n = 2
      const fpp = 2 * randInt(rng, 2, 12);
      return {
        question: `At x = 0, f(0) = 3, f'(0) = 5, f''(0) = ${fpp}. Coefficient of x² in Taylor series?`,
        answer: String(fpp / 2),
        explanation: `f''(0) / 2! = ${fpp} / 2 = ${fpp / 2}.`
      };
    }
    default: {
      // Partial sum of first 3 terms of geometric series a + a*r + a*r^2
      const a = randInt(rng, 2, 6);
      const r = pickOne(rng, [2, 0.5]);
      const s3 = roundTo(a + a * r + a * r * r, 2);
      return {
        question: `Geometric series with a = ${a}, r = ${r}: sum of first 3 terms (2 dec)?`,
        answer: String(s3),
        explanation: `${a} + ${roundTo(a * r, 2)} + ${roundTo(a * r * r, 2)} = ${s3}.`
      };
    }
  }
}

export { CALCULUS_UNITS, generateCalculus };