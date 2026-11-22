export function generateAlgebra(unit, level, problemIndex = 0) {
  const u = Number.isFinite(Number(unit))
    ? Math.min(20, Math.max(1, Math.floor(Number(unit))))
    : 1;
  const lvl = Number.isFinite(Number(level))
    ? Math.min(20, Math.max(1, Math.floor(Number(level))))
    : 1;
  const idx = Number.isFinite(Number(problemIndex))
    ? Math.max(0, Math.floor(Number(problemIndex)))
    : 0;

  // Smooth continuous scaling factor
  const scale = 1 + (lvl - 1) * 0.3;

  // Deterministic seed hash derived from unit, level, and problemIndex for uniqueness
  const seed = Math.abs(Math.sin(idx * 137.7 + lvl * 41.3 + u * 19.9) * 43758.5453);
  const variant = Math.floor((seed - Math.floor(seed)) * 10);

  // Pseudo-random integer helper seeded by problem index offsets with safe bounds
  const randInt = (min, max, offset = 0) => {
    const safeMin = Math.floor(min);
    const safeMax = Math.max(safeMin, Math.floor(max));
    const s = Math.abs(Math.sin(seed + offset * 23.17));
    return Math.floor((s - Math.floor(s)) * (safeMax - safeMin + 1)) + safeMin;
  };

  const shuffleWithSeed = (arr, offset = 0) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const s = Math.abs(Math.sin(seed + (i + 1) * 19.73 + offset * 7.11));
      const frac = s - Math.floor(s);
      const j = Math.floor(frac * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  let question = "";
  let correctAnswer = "0";
  let choices = [];

  const generateIntChoices = (correctStr) => {
    const val = parseInt(correctStr, 10);
    if (Number.isNaN(val)) {
      return shuffleWithSeed([correctStr, "0", "1", "2"], 20);
    }

    const set = new Set([correctStr]);
    const offsets = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];

    for (const off of offsets) {
      if (set.size >= 4) break;
      set.add(String(val + off));
    }

    let fallback = 1;
    while (set.size < 4) {
      set.add(String(val + fallback * 4));
      fallback++;
    }

    return shuffleWithSeed(Array.from(set).slice(0, 4), 30);
  };

  switch (u) {
    case 1: { // Foundations of Algebra and Real Number Properties
      const a = randInt(2, Math.floor(4 * scale), 1);
      const b = randInt(2, 8, 2);
      const c = randInt(1, 10, 3);
      const d = randInt(3, 9, 4);
      if (variant === 0) {
        question = `Find the absolute value: |-${a * 3}| + ${b}`;
        correctAnswer = String(a * 3 + b);
      } else if (variant === 1) {
        question = `Simplify using order of operations: ${a} × (${b} - ${c})`;
        correctAnswer = String(a * (b - c));
      } else if (variant === 2) {
        question = `What is the opposite (additive inverse) of -${a * 4}?`;
        correctAnswer = String(a * 4);
      } else if (variant === 3) {
        question = `Add the integers: ${a * 2} + (-${b})`;
        correctAnswer = String(a * 2 - b);
      } else if (variant === 4) {
        question = `Find the absolute value distance: |${a} - ${a * 3}|`;
        correctAnswer = String(Math.abs(a - a * 3));
      } else if (variant === 5) {
        question = `Evaluate expression: -(${a})² + ${b * 4}`;
        correctAnswer = String(-(a * a) + b * 4);
      } else if (variant === 6) {
        question = `Evaluate exponent: (${a} + 1)² - ${b}`;
        correctAnswer = String(Math.pow(a + 1, 2) - b);
      } else if (variant === 7) {
        question = `Find the value of expression: ${d} + (-${a}) × 3`;
        correctAnswer = String(d + (-a) * 3);
      } else if (variant === 8) {
        question = `Calculate cube value: ${a}³ - ${b}`;
        correctAnswer = String(Math.pow(a, 3) - b);
      } else {
        question = `Simplify: |-${a}| × |-${b}|`;
        correctAnswer = String(a * b);
      }
      break;
    }

    case 2: { // Expressions, Equations, and Inequalities
      const x = randInt(2, Math.floor(5 * scale), 1);
      const c = randInt(2, 10, 2);
      const evenC = randInt(1, 5, 2) * 2;
      const d = randInt(1, 6, 3);
      if (variant === 0) {
        question = `Plug in x = ${x} and evaluate: 3x² - ${c}`;
        correctAnswer = String(3 * (x * x) - c);
      } else if (variant === 1) {
        question = `Plug in x = ${x} and evaluate: 5(x - 1) + 3`;
        correctAnswer = String(5 * (x - 1) + 3);
      } else if (variant === 2) {
        question = `Evaluate the expression ${c}x + ${2 * d} when x = ${x}`;
        correctAnswer = String(c * x + 2 * d);
      } else if (variant === 3) {
        question = `Combine like terms in: 4x + 3y - 2x + ${c}y. What is the number attached to x (coefficient)?`;
        correctAnswer = "2";
      } else if (variant === 4) {
        question = `Plug in x = ${x} and solve: (${evenC}x - 2) / 2`;
        correctAnswer = String((evenC * x - 2) / 2);
      } else if (variant === 5) {
        question = `Plug in x = ${x} and evaluate: 2x² + 3x - ${d}`;
        correctAnswer = String(2 * (x * x) + 3 * x - d);
      } else if (variant === 6) {
        question = `Combine like terms: 7x - ${c}x + 5. What is the coefficient of x?`;
        correctAnswer = String(7 - c);
      } else if (variant === 7) {
        question = `Evaluate expression for x = ${x}: x³ - ${d}x`;
        correctAnswer = String(Math.pow(x, 3) - d * x);
      } else if (variant === 8) {
        question = `Find the perimeter of a square with side length expression (x + ${d}) when x = ${x}`;
        correctAnswer = String(4 * (x + d));
      } else {
        question = `Evaluate algebraic expression: 4(x + ${d}) - ${c} when x = ${x}`;
        correctAnswer = String(4 * (x + d) - c);
      }
      break;
    }

    case 3: { // Multi-Step Linear Equations and Literal Equations
      const x = randInt(2, Math.floor(5 * scale), 1);
      const coeff = randInt(2, 6, 2);
      const constant = randInt(2, 12, 3);
      if (variant === 0) {
        const rhs = coeff * x + constant;
        question = `Solve for x step-by-step: ${coeff}x + ${constant} = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 1) {
        const rhs = 2 * (x + constant);
        question = `Solve for x by distributing: 2(x + ${constant}) = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 2) {
        const c1 = randInt(4, 8, 4);
        const c2 = randInt(1, 3, 5);
        const diff = c1 - c2;
        question = `Solve for x with variables on both sides: ${c1}x + ${constant} = ${c2}x + ${diff * x + constant}`;
        correctAnswer = String(x);
      } else if (variant === 3) {
        question = `Using distance formula d = rt, find time t if distance d = ${coeff * 10} and rate r = ${coeff}`;
        correctAnswer = "10";
      } else if (variant === 4) {
        const rhs = 5 * x;
        question = `Combine like terms and solve for x: 4x + x = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 5) {
        const multiplier = randInt(2, 5, 6);
        const cleanX = x * multiplier;
        const rhsVal = x + constant;
        question = `Clear the fraction and solve for x: (x / ${multiplier}) + ${constant} = ${rhsVal}`;
        correctAnswer = String(cleanX);
      } else if (variant === 6) {
        question = `Solve for x: 3(x - ${constant}) = ${3 * (x - constant)}`;
        correctAnswer = String(x);
      } else if (variant === 7) {
        question = `Solve for x: ${coeff}x - ${constant} = ${coeff * x - constant}`;
        correctAnswer = String(x);
      } else if (variant === 8) {
        const cleanX = x * 3;
        const rhsVal = 2 * x + constant;
        question = `Solve for x: (2x / 3) + ${constant} = ${rhsVal}`;
        correctAnswer = String(cleanX);
      } else {
        question = `Solve literal equation for x: ax + b = c if a=2, b=4, c=${2 * x + 4}`;
        correctAnswer = String(x);
      }
      break;
    }

    case 4: { // Linear Inequalities in One and Two Variables
      const threshold = randInt(3, Math.floor(6 * scale), 1);
      if (variant === 0) {
        question = `Solve inequality 2x + 4 > ${2 * threshold + 4}. Enter the smallest whole number x can be:`;
        correctAnswer = String(threshold + 1);
      } else if (variant === 1) {
        question = `Solve inequality -3x ≥ ${-3 * threshold}. Enter the largest integer x can be:`;
        correctAnswer = String(threshold);
      } else if (variant === 2) {
        question = `Solve 3x + ${threshold} > ${3 * threshold + 6}. Enter the smallest integer value for x:`;
        correctAnswer = String(threshold + 3);
      } else if (variant === 3) {
        question = `Solve 5x - 10 ≤ ${5 * threshold - 10}. Enter the highest integer value for x:`;
        correctAnswer = String(threshold);
      } else if (variant === 4) {
        question = `Find the cutoff boundary number for x if 4x < ${4 * threshold}:`;
        correctAnswer = String(threshold);
      } else if (variant === 5) {
        question = `Find y when y = ${threshold}x - 4 and x = 2:`;
        correctAnswer = String(threshold * 2 - 4);
      } else if (variant === 6) {
        question = `Solve inequality x - ${threshold} ≥ 2. Enter the minimum integer x:`;
        correctAnswer = String(threshold + 2);
      } else if (variant === 7) {
        question = `Find the maximum integer solution for inequality 3x < ${3 * threshold + 1}:`;
        correctAnswer = String(threshold);
      } else if (variant === 8) {
        question = `Find y when y = 2x + ${threshold} and x = 3:`;
        correctAnswer = String(6 + threshold);
      } else {
        question = `Find the smallest integer solution for 2x - 3 ≥ ${2 * threshold - 3}:`;
        correctAnswer = String(threshold);
      }
      break;
    }

    case 5: { // Introduction to Functions, Domain, and Range
      const val = randInt(2, 8, 1);
      if (variant === 0) {
        question = `What single input value for x makes f(x) = 1 / (x - ${val}) undefined (division by zero)?`;
        correctAnswer = String(val);
      } else if (variant === 1) {
        question = `Find the output value f(${val}) for the function f(x) = 2x + 3`;
        correctAnswer = String(2 * val + 3);
      } else if (variant === 2) {
        question = `Find the output value (range) when x = 2 in the function f(x) = 3x + ${val}`;
        correctAnswer = String(6 + val);
      } else if (variant === 3) {
        question = `What is the lowest possible output value in the range of f(x) = x²?`;
        correctAnswer = "0";
      } else if (variant === 4) {
        question = `Given function f(x) = |x| - ${val}, what is the output when input is -${val}?`;
        correctAnswer = "0";
      } else if (variant === 5) {
        question = `What is the smallest x-allowed input in the domain of square root function g(x) = √(x - ${val})?`;
        correctAnswer = String(val);
      } else if (variant === 6) {
        question = `Evaluate function f(x) = x² + ${val} when x = 3`;
        correctAnswer = String(9 + val);
      } else if (variant === 7) {
        question = `Find output of linear function f(x) = 4x - ${val} when input x = 5`;
        correctAnswer = String(20 - val);
      } else if (variant === 8) {
        question = `What is the domain restriction value for denominator function f(x) = 5 / (x + ${val})?`;
        correctAnswer = String(-val);
      } else {
        question = `Evaluate absolute function f(x) = -|x| + ${val} when x = -4`;
        correctAnswer = String(-4 + val);
      }
      break;
    }

    case 6: { // Function Notation and Evaluating Functions
      const m = randInt(2, 6, 1);
      const x = randInt(2, 8, 2);
      if (variant === 0) {
        question = `Calculate function output f(${x}) if f(x) = ${m}x + 3`;
        correctAnswer = String(m * x + 3);
      } else if (variant === 1) {
        question = `Calculate function output f(${x}) if f(x) = x² - ${m}`;
        correctAnswer = String(x * x - m);
      } else if (variant === 2) {
        question = `Calculate g(${x}) if g(x) = 2x² + x`;
        correctAnswer = String(2 * (x * x) + x);
      } else if (variant === 3) {
        question = `If f(x) = ${m}x, what input x gives an output of ${m * x}?`;
        correctAnswer = String(x);
      } else if (variant === 4) {
        question = `Evaluate nested function: If f(x) = x + 2, find f(f(${x}))`;
        correctAnswer = String(x + 4);
      } else if (variant === 5) {
        question = `Find output h(${x}) given rule h(x) = -${m}x + 10`;
        correctAnswer = String(-m * x + 10);
      } else if (variant === 6) {
        question = `If f(x) = 3x - ${m}, find x when f(x) = ${3 * x - m}`;
        correctAnswer = String(x);
      } else if (variant === 7) {
        question = `Evaluate composite-style expression: If f(x) = x + ${m} and g(x) = 2x, find f(g(${x}))`;
        correctAnswer = String(2 * x + m);
      } else if (variant === 8) {
        question = `Calculate f(${x}) + g(${x}) if f(x) = x and g(x) = x²`;
        correctAnswer = String(x + x * x);
      } else {
        question = `Find input x if f(x) = x² + 1 equals ${x * x + 1} (positive x)`;
        correctAnswer = String(x);
      }
      break;
    }

    case 7: { // Rate of Change and Slope-Intercept Form
      const m = randInt(1, 5, 1);
      const b = randInt(-6, 6, 2);
      if (variant === 0) {
        question = `In the slope-intercept equation y = ${m}x - ${Math.abs(b)}, what is the starting y-intercept value?`;
        correctAnswer = String(-Math.abs(b));
      } else if (variant === 1) {
        question = `Find the slope (m) of a straight line connecting origin (0, 0) and point (2, ${2 * m})`;
        correctAnswer = String(m);
      } else if (variant === 2) {
        question = `Calculate output y when x = 3 using linear rule y = ${m}x + ${Math.abs(b)}`;
        correctAnswer = String(m * 3 + Math.abs(b));
      } else if (variant === 3) {
        question = `Find the steady rate of change if y goes up by ${m * 4} for every 4 steps of x`;
        correctAnswer = String(m);
      } else if (variant === 4) {
        question = `What is the slope of any flat horizontal line parallel to y = ${Math.abs(b)}?`;
        correctAnswer = "0";
      } else if (variant === 5) {
        question = `Given equation y = -${m}x + ${b}, what is the slope coefficient?`;
        correctAnswer = String(-m);
      } else if (variant === 6) {
        question = `Find y-intercept value b in equation y = 4x + ${b}`;
        correctAnswer = String(b);
      } else if (variant === 7) {
        question = `Find change in y (Δy) if slope is ${m} and run (Δx) is 3`;
        correctAnswer = String(m * 3);
      } else if (variant === 8) {
        question = `Evaluate slope m given two coordinate outputs: (0, ${b}) and (1, ${m + b})`;
        correctAnswer = String(m);
      } else {
        question = `Find x when y = ${m * 2 + b} in linear function y = ${m}x + ${b}`;
        correctAnswer = "2";
      }
      break;
    }

    case 8: { // Writing Linear Equations from Points
      const m = randInt(2, 5, 1);
      const x1 = randInt(1, 4, 2);
      const y1 = m * x1 + 2;
      if (variant === 0) {
        question = `Given slope m = ${m} and y-intercept b = 2, what is the y-intercept number in y = mx + b?`;
        correctAnswer = "2";
      } else if (variant === 1) {
        question = `Find slope (m) between coordinate points (${x1}, ${y1}) and (${x1 + 2}, ${y1 + 2 * m})`;
        correctAnswer = String(m);
      } else if (variant === 2) {
        question = `Find y-intercept (b) of a line with slope ${m} passing through (${x1}, ${y1})`;
        correctAnswer = String(y1 - m * x1);
      } else if (variant === 3) {
        question = `Given point-slope equation y - ${y1} = ${m}(x - ${x1}), what is the slope number?`;
        correctAnswer = String(m);
      } else if (variant === 4) {
        question = `Find where line crosses x-axis (x-intercept) for equation y = ${m}x - ${m * 2}`;
        correctAnswer = "2";
      } else if (variant === 5) {
        question = `Find slope between points (0, 4) and (2, ${4 + m * 2})`;
        correctAnswer = String(m);
      } else if (variant === 6) {
        question = `Find y-value for point-slope form when x = ${x1 + 1} given m=${m}, point (${x1}, ${y1})`;
        correctAnswer = String(y1 + m);
      } else if (variant === 7) {
        question = `What is standard form coefficient A if slope is 2 and equation is 2x - y = 4?`;
        correctAnswer = "2";
      } else if (variant === 8) {
        question = `Find constant term b when line passes through (0, 5) with slope ${m}`;
        correctAnswer = "5";
      } else {
        question = `Find slope of line passing through points (1, 3) and (3, ${3 + 2 * m})`;
        correctAnswer = String(m);
      }
      break;
    }

    case 9: { // Systems of Linear Equations (Substitution)
      const x = randInt(2, 6, 1);
      const y = randInt(1, 5, 2);
      if (variant === 0) {
        question = `Using substitution, if y = 2x and x + y = ${3 * x}, what is x?`;
        correctAnswer = String(x);
      } else if (variant === 1) {
        question = `If sum is x + y = ${x + y} and difference is x - y = ${x - y}, what is x?`;
        correctAnswer = String(x);
      } else if (variant === 2) {
        question = `If y = x + ${y} and x = ${x}, what is y?`;
        correctAnswer = String(x + y);
      } else if (variant === 3) {
        question = `Find matching x-coordinate where lines y = 2x and y = x + ${x} intersect`;
        correctAnswer = String(x);
      } else if (variant === 4) {
        question = `If 2x + y = ${2 * x + y} and y = ${y}, solve for x`;
        correctAnswer = String(x);
      } else if (variant === 5) {
        question = `If x = ${x} and y = ${y} form a system solution, what is their sum x + y?`;
        correctAnswer = String(x + y);
      } else if (variant === 6) {
        question = `If y = 3x and x + y = ${4 * x}, find x`;
        correctAnswer = String(x);
      } else if (variant === 7) {
        question = `Given system where x = ${x} and y = 2x, find y`;
        correctAnswer = String(2 * x);
      } else if (variant === 8) {
        question = `If 3x = ${3 * x} and x + y = ${x + y}, find y`;
        correctAnswer = String(y);
      } else {
        question = `If difference x - y = ${x - y} and y = ${y}, find x`;
        correctAnswer = String(x);
      }
      break;
    }

    case 10: { // Systems of Linear Equations (Elimination)
      const x = randInt(2, 6, 1);
      const y = randInt(1, 5, 2);
      if (variant === 0) {
        question = `Using elimination, if 2x + y = ${2 * x + y} and x - y = ${x - y}, what is x?`;
        correctAnswer = String(x);
      } else if (variant === 1) {
        question = `If 3x + 2y = ${3 * x + 2 * y} and 3x - 2y = ${3 * x - 2 * y}, what is x?`;
        correctAnswer = String(x);
      } else if (variant === 2) {
        question = `If x + y = ${x + y} and 2x + y = ${2 * x + y}, what is y?`;
        correctAnswer = String(y);
      } else if (variant === 3) {
        question = `If 4x + 2y = ${4 * x + 2 * y} and y = ${y}, find x`;
        correctAnswer = String(x);
      } else if (variant === 4) {
        question = `Two numbers add up to ${x + y} and their difference is ${x - y}. Find the larger number (x).`;
        correctAnswer = String(x);
      } else if (variant === 5) {
        question = `If 5x = ${5 * x} and x + y = ${x + y}, find y`;
        correctAnswer = String(y);
      } else if (variant === 6) {
        question = `If x + y = ${x + y} and x - y = ${x - y}, find y`;
        correctAnswer = String(y);
      } else if (variant === 7) {
        question = `If 2x + 2y = ${2 * (x + y)} and x = ${x}, find y`;
        correctAnswer = String(y);
      } else if (variant === 8) {
        question = `Solve elimination system: x + 3y = ${x + 3 * y} and x + y = ${x + y}. What is y?`;
        correctAnswer = String(y);
      } else {
        question = `If 3x + y = ${3 * x + y} and y = ${y}, find x`;
        correctAnswer = String(x);
      }
      break;
    }

    case 11: { // Exponential Growth and Decay
      const init = randInt(10, 60, 1);
      if (variant === 0) {
        question = `A population grows by 10% each year. What is the decimal growth multiplier base?`;
        correctAnswer = "1.1";
      } else if (variant === 1) {
        question = `Calculate exponential growth value y = ${init}(2)^x when x = 2`;
        correctAnswer = String(init * 4);
      } else if (variant === 2) {
        question = `A car drops in value by 20% each year. What is the decay factor base multiplier?`;
        correctAnswer = "0.8";
      } else if (variant === 3) {
        question = `Evaluate decay function y = 50(0.5)^x when x = 2`;
        correctAnswer = "12.5";
      } else if (variant === 4) {
        question = `You start with 200 bacteria that double every hour. How many do you have after 3 hours?`;
        correctAnswer = "1600";
      } else if (variant === 5) {
        question = `Identify starting initial value 'a' in exponential equation y = ${init}(1.05)^x`;
        correctAnswer = String(init);
      } else if (variant === 6) {
        question = `Calculate y = 10(3)^x when x = 2`;
        correctAnswer = "90";
      } else if (variant === 7) {
        question = `Find multiplier base if an investment triples annually`;
        correctAnswer = "3";
      } else if (variant === 8) {
        question = `Calculate y = 100(0.9)^1 value roughly (nearest whole number)`;
        correctAnswer = "90";
      } else {
        question = `If base growth rate is 5%, what is the growth factor b?`;
        correctAnswer = "1.05";
      }
      break;
    }

    case 12: { // Properties of Exponents
      const e1 = randInt(2, 6, 1);
      const e2 = randInt(1, 4, 2);
      if (variant === 0) {
        question = `Multiply powers: x^${e1} × x^${e2}. What is the new exponent rule result for x?`;
        correctAnswer = String(e1 + e2);
      } else if (variant === 1) {
        question = `Divide powers: x^${e1 + e2} / x^${e1}. What is the resulting exponent?`;
        correctAnswer = String(e2);
      } else if (variant === 2) {
        question = `Power of a power: (x^${e1})^${e2}. What is the resulting exponent?`;
        correctAnswer = String(e1 * e2);
      } else if (variant === 3) {
        question = `Evaluate expression: (2x)^3 when x = 2`;
        correctAnswer = "64";
      } else if (variant === 4) {
        question = `Zero exponent rule: What is (${e1 * 7})^0 equal to?`;
        correctAnswer = "1";
      } else if (variant === 5) {
        question = `Simplify power term (3x²)^2. What number coefficient is attached to x^4?`;
        correctAnswer = "9";
      } else if (variant === 6) {
        question = `Simplify product of powers: x² × x^${e1}`;
        correctAnswer = String(2 + e1);
      } else if (variant === 7) {
        question = `When 2⁻² is written as a unit fraction 1/n, what is the denominator n?`;
        correctAnswer = "4";
      } else if (variant === 8) {
        question = `Evaluate expression: (3)³`;
        correctAnswer = "27";
      } else {
        question = `Simplify (2x³)² coefficient value attached to x^6`;
        correctAnswer = "4";
      }
      break;
    }

    case 13: { // Polynomial Operations
      const c = randInt(2, 6, 1);
      if (variant === 0) {
        question = `Add polynomials: (3x² + 2x) + (${c}x² + 4x). What is combined coefficient of x²?`;
        correctAnswer = String(3 + c);
      } else if (variant === 1) {
        question = `Subtract polynomials: (5x² + 4x) - (2x² + x). What is coefficient of x?`;
        correctAnswer = "3";
      } else if (variant === 2) {
        question = `Multiply binomials using FOIL: (x + 2)(x + ${c}). What is final standalone constant?`;
        correctAnswer = String(2 * c);
      } else if (variant === 3) {
        question = `Distribute monomial: 2x(x + ${c}). What coefficient is in front of x²?`;
        correctAnswer = "2";
      } else if (variant === 4) {
        question = `What is highest degree exponent of polynomial 4x³ + 2x² - 7?`;
        correctAnswer = "3";
      } else if (variant === 5) {
        question = `Expand binomial square (x + 3)². What is middle term coefficient of x?`;
        correctAnswer = "6";
      } else if (variant === 6) {
        question = `Add terms: (4x + 5) + (3x - 2). What is constant sum?`;
        correctAnswer = "3";
      } else if (variant === 7) {
        question = `Multiply (x + 4)(x - 4). What is constant term?`;
        correctAnswer = "-16";
      } else if (variant === 8) {
        question = `Find degree of polynomial expression 5x⁴ - 3x² + 9`;
        correctAnswer = "4";
      } else {
        question = `Multiply 3(2x + ${c}). What is constant term?`;
        correctAnswer = String(3 * c);
      }
      break;
    }

    case 14: { // Factoring Quadratic Expressions (GCF & Difference of Squares)
      const gcf = randInt(2, 6, 1);
      if (variant === 0) {
        question = `Factor out GCF from ${gcf}x² + ${gcf * 4}x. What number is the GCF?`;
        correctAnswer = String(gcf);
      } else if (variant === 1) {
        question = `Factor difference of squares: x² - 25. What is constant number in factor (x - ?)?`;
        correctAnswer = "5";
      } else if (variant === 2) {
        question = `Factor perfect square trinomial x² + 6x + 9. What is repeated root value?`;
        correctAnswer = "-3";
      } else if (variant === 3) {
        question = `Factor out GCF from 4x³ - 12x². What is coefficient of GCF x² term?`;
        correctAnswer = "4";
      } else if (variant === 4) {
        question = `Factor difference of squares: 4x² - 9. What number multiplies x inside (2x - 3)?`;
        correctAnswer = "2";
      } else if (variant === 5) {
        question = `Factor x² - 16. What is constant number in factor (x - ?)?`;
        correctAnswer = "4";
      } else if (variant === 6) {
        question = `Factor GCF from 3x² + 9x. What is GCF coefficient?`;
        correctAnswer = "3";
      } else if (variant === 7) {
        question = `Factor x² - 49. What is subtracted value inside factor?`;
        correctAnswer = "7";
      } else if (variant === 8) {
        question = `Factor 9x² - 1. What is root value inside (3x - ?)?`;
        correctAnswer = "1";
      } else {
        question = `Factor perfect square x² - 10x + 25. What is repeated root value?`;
        correctAnswer = "5";
      }
      break;
    }

    case 15: { // Factoring Quadratic Trinomials
      const p = randInt(1, 5, 1);
      const q = randInt(1, 5, 2);
      if (variant === 0) {
        question = `Factor trinomial x² + ${p + q}x + ${p * q}. What is one positive solution root when set to 0?`;
        correctAnswer = String(p);
      } else if (variant === 1) {
        question = `Factor x² - ${p + q}x + ${p * q}. What is smaller root solution?`;
        correctAnswer = String(Math.min(p, q));
      } else if (variant === 2) {
        question = `To factor x² + 7x + 12, what two numbers multiply to 12 and add to 7? (Enter larger number)`;
        correctAnswer = "4";
      } else if (variant === 3) {
        question = `Factor x² - 9x + 20. What number is subtracted in factor (x - ?)?`;
        correctAnswer = "5";
      } else if (variant === 4) {
        question = `Factor x² + 2x - 8. What is solution x when factor (x - 2) = 0?`;
        correctAnswer = "2";
      } else if (variant === 5) {
        question = `Factor x² - x - 6. What is solution x when factor (x - 3) = 0?`;
        correctAnswer = "3";
      } else if (variant === 6) {
        question = `Find constant term c in x² + 5x + c if factors are (x+2)(x+3)`;
        correctAnswer = "6";
      } else if (variant === 7) {
        question = `Find middle coefficient b in x² + bx + 10 if factors are (x+2)(x+5)`;
        correctAnswer = "7";
      } else if (variant === 8) {
        question = `Factor x² + 8x + 15 root solution value`;
        correctAnswer = "-3";
      } else {
        question = `Factor x² - 3x - 10 positive root value`;
        correctAnswer = "5";
      }
      break;
    }

    case 16: { // Graphing Quadratic Functions & Vertex Form
      const h = randInt(1, 5, 1);
      const k = randInt(1, 6, 2);
      if (variant === 0) {
        question = `In vertex form parabola y = (x - ${h})² + ${k}, what is x-coordinate of vertex?`;
        correctAnswer = String(h);
      } else if (variant === 1) {
        question = `In vertex form y = (x + ${h})² - ${k}, what is y-coordinate of vertex?`;
        correctAnswer = String(-k);
      } else if (variant === 2) {
        question = `What is middle folding axis of symmetry for parabola y = (x - ${h})² + 3?`;
        correctAnswer = String(h);
      } else if (variant === 3) {
        question = `What is the y-coordinate of the vertex for parabola y = -2(x - 1)² + ${k + 4}?`;
        correctAnswer = String(k + 4);
      } else if (variant === 4) {
        question = `Find y-intercept value where parabola y = x² + ${k} crosses y-axis`;
        correctAnswer = String(k);
      } else if (variant === 5) {
        question = `What is vertical shift distance from parent graph y = x² to y = x² - ${k}?`;
        correctAnswer = String(k);
      } else if (variant === 6) {
        question = `Find minimum y-value vertex for y = (x - 3)² + ${k}`;
        correctAnswer = String(k);
      } else if (variant === 7) {
        question = `What is axis of symmetry equation line value for y = (x + 4)² - 2?`;
        correctAnswer = "-4";
      } else if (variant === 8) {
        question = `Find y-intercept for y = x² - ${k}`;
        correctAnswer = String(-k);
      } else {
        question = `Find vertex x-coordinate for y = 3(x - 2)² + 5`;
        correctAnswer = "2";
      }
      break;
    }

    case 17: { // Solving Quadratic Equations
      const r = randInt(2, 9, 1);
      if (variant === 0) {
        question = `Solve using square roots: x² = ${r * r}. What is positive answer solution?`;
        correctAnswer = String(r);
      } else if (variant === 1) {
        question = `Solve by factoring: (x - ${r})(x - 2) = 0. What is larger solution for x?`;
        correctAnswer = String(Math.max(r, 2));
      } else if (variant === 2) {
        question = `Solve quadratic equation x² - ${r * r} = 0. What is positive root?`;
        correctAnswer = String(r);
      } else if (variant === 3) {
        question = `Solve by taking square roots: (x + 3)² = ${r * r}. What is positive solution for x?`;
        correctAnswer = String(r - 3);
      } else if (variant === 4) {
        question = `Solve for positive x: 2x² = ${2 * r * r}`;
        correctAnswer = String(r);
      } else if (variant === 5) {
        question = `Find product of solution roots for (x - 3)(x - ${r}) = 0`;
        correctAnswer = String(3 * r);
      } else if (variant === 6) {
        question = `Solve equation x(x - ${r}) = 0 for non-zero solution root x`;
        correctAnswer = String(r);
      } else if (variant === 7) {
        question = `Find sum of roots for (x - 2)(x - 5) = 0`;
        correctAnswer = "7";
      } else if (variant === 8) {
        question = `Solve x² = 49 positive root`;
        correctAnswer = "7";
      } else {
        question = `Find root solution for (x + ${r}) = 0`;
        correctAnswer = String(-r);
      }
      break;
    }

    case 18: { // Completing the Square & Quadratic Formula
      if (variant === 0) {
        question = `What number completes square to turn x² + 6x + ? into a perfect square trinomial?`;
        correctAnswer = "9";
      } else if (variant === 1) {
        question = `What number completes square for x² - 8x + ?`;
        correctAnswer = "16";
      } else if (variant === 2) {
        question = `For equation 2x² + 4x - 6 = 0, what is discriminant value b² - 4ac?`;
        correctAnswer = "64";
      } else if (variant === 3) {
        question = `What is discriminant value b² - 4ac for x² + 5x + 6 = 0?`;
        correctAnswer = "1";
      } else if (variant === 4) {
        question = `How many real number solutions exist if quadratic discriminant equals 0?`;
        correctAnswer = "1";
      } else if (variant === 5) {
        question = `What number completes square for x² + 10x + ?`;
        correctAnswer = "25";
      } else if (variant === 6) {
        question = `Find discriminant for x² - 4x + 4 = 0`;
        correctAnswer = "0";
      } else if (variant === 7) {
        question = `Find constant c needed to complete square for x² - 2x + ?`;
        correctAnswer = "1";
      } else if (variant === 8) {
        question = `How many real solutions if discriminant is -12?`;
        correctAnswer = "0";
      } else {
        question = `Find discriminant for x² + 3x + 2 = 0`;
        correctAnswer = "1";
      }
      break;
    }

    case 19: { // Radical Expressions
      const b = randInt(2, 7, 1);
      if (variant === 0) {
        question = `Simplify radical: √${b * b * 3}. What whole integer comes out in front?`;
        correctAnswer = String(b);
      } else if (variant === 1) {
        question = `Evaluate radical expression: √${b * b} + √25`;
        correctAnswer = String(b + 5);
      } else if (variant === 2) {
        question = `Simplify square root √50. What whole number multiplier comes out?`;
        correctAnswer = "5";
      } else if (variant === 3) {
        question = `Multiply radicals together: √2 × √8`;
        correctAnswer = "4";
      } else if (variant === 4) {
        question = `Simplify radical √72. What whole number factor comes outside?`;
        correctAnswer = "6";
      } else if (variant === 5) {
        question = `Evaluate squaring a square root: (√${b})²`;
        correctAnswer = String(b);
      } else if (variant === 6) {
        question = `Simplify √18 whole number factor coefficient outside`;
        correctAnswer = "3";
      } else if (variant === 7) {
        question = `Evaluate √16 + √9`;
        correctAnswer = "7";
      } else if (variant === 8) {
        question = `Simplify √32 extracted whole multiplier factor`;
        correctAnswer = "4";
      } else {
        question = `Multiply √3 × √12`;
        correctAnswer = "6";
      }
      break;
    }

    case 20: { // Statistics & Data Analysis (Advanced & Diverse)
      const base = randInt(2, 10, 1);
      const offset = randInt(2, 6, 2);
      if (variant === 0) {
        const step = offset * 2;
        question = `Find the mean (average) of the dataset: ${base}, ${base + step}, ${base + step * 2}, ${base + step * 3}`;
        correctAnswer = String(base + step * 1.5);
      } else if (variant === 1) {
        const v1 = base;
        const v2 = base + randInt(2, 5, 3);
        const v3 = v2 + randInt(2, 5, 4);
        const v4 = v3 + randInt(2, 5, 5);
        const v5 = v4 + randInt(2, 5, 6);
        question = `Find the middle median value of the sorted dataset: ${v1}, ${v2}, ${v3}, ${v4}, ${v5}`;
        correctAnswer = String(v3);
      } else if (variant === 2) {
        const low = base;
        const high = base + randInt(15, 35, 3);
        question = `Find the spread range (highest minus lowest) for dataset with minimum ${low} and maximum ${high}`;
        correctAnswer = String(high - low);
      } else if (variant === 3) {
        const red = base;
        const blue = base + randInt(4, 10, 4);
        question = `A bag contains ${red} red marbles and ${blue} blue marbles. What is the total number of possible outcomes (total marbles)?`;
        correctAnswer = String(red + blue);
      } else if (variant === 4) {
        const rep = base + 3;
        const other1 = base;
        const other2 = base + 7;
        question = `Find the mode (most frequent number) in dataset: ${other1}, ${rep}, ${rep}, ${other2}, ${rep}`;
        correctAnswer = String(rep);
      } else if (variant === 5) {
        question = `Given dataset sequence: ${base}, ${base + 2}, ${base + 4}, ${base + 6}, ${base + 8}, ${base + 10}, ${base + 12}. What is the Interquartile Range (IQR = Q3 - Q1)?`;
        correctAnswer = "8";
      } else if (variant === 6) {
        const m = randInt(2, 5, 5);
        const b = randInt(3, 12, 6);
        const xVal = randInt(4, 10, 7);
        question = `A scatter plot line of best fit is given by y = ${m}x + ${b}. What is the predicted y-value when x = ${xVal}?`;
        correctAnswer = String(m * xVal + b);
      } else if (variant === 7) {
        const count = randInt(4, 8, 8);
        const meanVal = base + 10;
        question = `If the mean average of ${count} data test scores is ${meanVal}, what is their total combined sum?`;
        correctAnswer = String(meanVal * count);
      } else if (variant === 8) {
        const sd = 3;
        const xVal = base + sd * randInt(1, 4, 9);
        question = `Calculate the z-score z = (x - μ) / σ if data point x = ${xVal}, mean μ = ${base}, and standard deviation σ = ${sd}:`;
        correctAnswer = String((xVal - base) / sd);
      } else {
        const score1 = 80;
        const score2 = 90;
        question = `Calculate weighted grade average if Test 1 score is ${score1} (weighted 70%) and Test 2 score is ${score2} (weighted 30%):`;
        correctAnswer = String(score1 * 0.7 + score2 * 0.3);
      }
      break;
    }
  }

  const safeAnswerStr = String(correctAnswer || "0");
  choices = generateIntChoices(safeAnswerStr);

  return {
    question,
    correctAnswer: safeAnswerStr,
    choices,
    svg: null,
    unit: `Unit ${u}`,
    level: `Level ${lvl}`
  };
}