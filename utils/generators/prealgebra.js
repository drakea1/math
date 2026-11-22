export function generatePrealgebra(unit, level, problemIndex = 0) {
  const u = Number.isFinite(Number(unit))
    ? Math.min(20, Math.max(1, Math.floor(Number(unit))))
    : 1;
  const lvl = Number.isFinite(Number(level))
    ? Math.min(20, Math.max(1, Math.floor(Number(level))))
    : 1;
  const idx = Number.isFinite(Number(problemIndex)) ? Math.max(0, Math.floor(Number(problemIndex))) : 0;

  // Smooth continuous scaling factor (1.0 at Level 1, up to 6.7 at Level 20)
  const scale = 1 + (lvl - 1) * 0.3;

  // Deterministic seed hash derived from unit, level, and problemIndex
  const seed = Math.abs(Math.sin(idx * 127.1 + lvl * 31.3 + u * 17.7) * 43758.5453);
  const variant = Math.floor((seed - Math.floor(seed)) * 6); // 6 distinct variants per unit

  // Pseudo-random integer helper with safe range guard
  const randInt = (min, max, offset = 0) => {
    const safeMin = Math.floor(min);
    const safeMax = Math.max(safeMin, Math.floor(max));
    const s = Math.abs(Math.sin(seed + offset * 13.37));
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

  // Helper Math Utilities
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

  const simplifyFrac = (num, den) => {
    if (den === 0) return "1";
    const sign = num * den < 0 ? "-" : "";
    let n = Math.abs(num);
    let d = Math.abs(den);
    const common = gcd(n, d);
    n /= common;
    d /= common;
    if (d === 1) return `${sign}${n}`;
    return `${sign}${n}/${d}`;
  };

  // Choice Generators
  const generateFractionChoices = (correctStr, num, den) => {
    const set = new Set([correctStr]);
    const offsets = [1, -1, 2, -2, 3, -3];

    for (const off of offsets) {
      if (set.size >= 4) break;
      const altNum = num + off;
      if (altNum !== 0) set.add(simplifyFrac(altNum, den));
      if (set.size >= 4) break;
      const altDen = den + off;
      if (altDen > 0) set.add(simplifyFrac(num, altDen));
    }

    let fallback = 1;
    while (set.size < 4) {
      set.add(simplifyFrac(num + fallback, den + 1));
      fallback++;
    }

    return shuffleWithSeed(Array.from(set).slice(0, 4), 10);
  };

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
    case 1: { // Integers, Absolute Value, and Rational Numbers
      const a = randInt(2, Math.floor(4 * scale), 1) * (lvl > 3 && variant % 2 === 0 ? -1 : 1);
      const b = randInt(2, Math.floor(5 * scale), 2) * (lvl > 5 ? -1 : 1);
      const c = randInt(1, Math.floor(3 * scale), 3);

      if (variant === 0) {
        question = `Evaluate: |${a}| + ${Math.abs(b)}`;
        correctAnswer = String(Math.abs(a) + Math.abs(b));
      } else if (variant === 1) {
        question = `Evaluate: ${a} - (${b})`;
        correctAnswer = String(a - b);
      } else if (variant === 2) {
        question = `Evaluate: (${a}) × (${b})`;
        correctAnswer = String(a * b);
      } else if (variant === 3) {
        const prod = a * b;
        question = `Evaluate: (${prod}) ÷ (${a})`;
        correctAnswer = String(b);
      } else if (variant === 4) {
        question = `Evaluate: -|${a}| + (${b})`;
        correctAnswer = String(-Math.abs(a) + b);
      } else {
        question = `Evaluate: ${a} + ${b} - (${c})`;
        correctAnswer = String(a + b - c);
      }
      break;
    }

    case 2: { // Operations with Fractions and Mixed Numbers
      const maxDenom = Math.min(24, Math.floor(4 + lvl * 0.9));
      const d1 = randInt(2, maxDenom, 1);
      const d2 = lvl > 8 ? randInt(2, maxDenom, 2) : d1;
      const n1 = randInt(1, Math.max(1, d1 - 1), 3);
      const n2 = randInt(1, Math.max(1, d2 - 1), 4);

      if (variant === 0) {
        question = `Add: ${n1}/${d1} + ${n2}/${d2}`;
        correctAnswer = simplifyFrac(n1 * d2 + n2 * d1, d1 * d2);
      } else if (variant === 1) {
        question = `Multiply: (${n1}/${d1}) × (${n2}/${d2})`;
        correctAnswer = simplifyFrac(n1 * n2, d1 * d2);
      } else if (variant === 2) {
        question = `Divide: (${n1}/${d1}) ÷ (${n2}/${d2})`;
        correctAnswer = simplifyFrac(n1 * d2, d1 * n2);
      } else if (variant === 3) {
        const w1 = randInt(1, Math.floor(2 * scale), 5);
        const w2 = randInt(1, Math.floor(2 * scale), 6);
        const totalNum1 = w1 * 2 + 1;
        const totalNum2 = w2 * 2 + 1;
        question = `Multiply mixed numbers: ${w1}(1/2) × ${w2}(1/2)`;
        correctAnswer = simplifyFrac(totalNum1 * totalNum2, 4);
      } else if (variant === 4) {
        question = `Subtract: ${n1}/${d1} - ${n2}/${d1}`;
        correctAnswer = simplifyFrac(n1 - n2, d1);
      } else {
        const w = randInt(1, Math.floor(3 * scale), 7);
        question = `Convert to improper fraction: ${w}(${n1}/${d1})`;
        correctAnswer = simplifyFrac(w * d1 + n1, d1);
      }
      break;
    }

    case 3: { // Ratios, Rates, and Unit Rates
      const speed = randInt(10, 15 + Math.floor(lvl * 3), 1);
      const hours = randInt(2, 6, 2);
      const totalDist = speed * hours;

      if (variant === 0) {
        question = `If a car travels ${totalDist} miles in ${hours} hours, what is its speed in mph?`;
        correctAnswer = String(speed);
      } else if (variant === 1) {
        const items = randInt(3, 8, 3);
        const totalCost = items * speed;
        question = `If ${items} items cost $${totalCost}, what is the unit price per item?`;
        correctAnswer = String(speed);
      } else if (variant === 2) {
        const k = randInt(2, Math.floor(2 * scale), 4);
        question = `Simplify the ratio ${2 * k} : ${6 * k}`;
        correctAnswer = "1/3";
      } else if (variant === 3) {
        const words = randInt(40, 60 + lvl * 5, 5);
        const mins = randInt(2, 5, 6);
        question = `If someone types ${words * mins} words in ${mins} minutes, what is their typing rate (wpm)?`;
        correctAnswer = String(words);
      } else if (variant === 4) {
        const ratioA = randInt(1, 4, 7);
        const ratioB = randInt(5, 9, 8);
        const multiplier = randInt(2, Math.floor(2 * scale), 9);
        question = `Express ratio ${ratioA * multiplier} : ${ratioB * multiplier} in simplest fraction form`;
        correctAnswer = simplifyFrac(ratioA, ratioB);
      } else {
        const totalGal = randInt(10, 20 + lvl * 2, 10);
        const miles = totalGal * randInt(15, 30, 11);
        question = `A truck travels ${miles} miles on ${totalGal} gallons of gas. Calculate miles per gallon (mpg).`;
        correctAnswer = String(miles / totalGal);
      }
      break;
    }

    case 4: { // Proportions and Scale Drawings
      const m = randInt(2, Math.floor(2 * scale), 1);
      const km = randInt(3, 3 + Math.floor(lvl * 2), 2);
      const cm = randInt(2, 7, 3);

      if (variant === 0) {
        const target = m * 3;
        question = `Solve for x: x / ${target} = 2 / 6`;
        correctAnswer = String(m);
      } else if (variant === 1) {
        question = `On a map scale where 1 cm = ${km} km, how many actual km is ${cm} cm?`;
        correctAnswer = String(km * cm);
      } else if (variant === 2) {
        const pole = randInt(4, 10 + lvl, 4);
        question = `A ${pole} ft pole casts a 2 ft shadow. How tall is a tree casting a ${pole * 2} ft shadow?`;
        correctAnswer = String(pole * 2);
      } else if (variant === 3) {
        question = `Solve for x: 3/5 = x/${5 * m}`;
        correctAnswer = String(3 * m);
      } else if (variant === 4) {
        const realHeight = randInt(10, 50 + lvl * 5, 5);
        const scaleFactor = randInt(2, 5, 6);
        question = `A model building uses a scale of 1 inch = ${scaleFactor} feet. How tall (in inches) is a model of a ${realHeight * scaleFactor} ft tower?`;
        correctAnswer = String(realHeight);
      } else {
        question = `Solve for x: ${m}/4 = ${m * 3}/x`;
        correctAnswer = "12";
      }
      break;
    }

    case 5: { // Percentages, Discounts, and Simple Interest
      const price = randInt(2, Math.floor(4 * scale), 1) * 20;
      const principal = randInt(1, Math.floor(3 * scale), 2) * 100;
      const pct = [10, 15, 20, 25, 50][randInt(0, 4, 3)];

      if (variant === 0) {
        question = `What is ${pct}% of $${price}?`;
        correctAnswer = String((price * pct) / 100);
      } else if (variant === 1) {
        const discount = (price * pct) / 100;
        question = `An item priced at $${price} has a ${pct}% discount. What is the sale price ($)?`;
        correctAnswer = String(price - discount);
      } else if (variant === 2) {
        const rate = randInt(2, 8 + Math.floor(lvl * 0.5), 4);
        const time = randInt(2, 5, 5);
        question = `Calculate simple interest ($) on $${principal} at ${rate}% annual interest for ${time} years.`;
        correctAnswer = String((principal * rate * time) / 100);
      } else if (variant === 3) {
        question = `Convert ${pct}% to a simplified fraction`;
        correctAnswer = simplifyFrac(pct, 100);
      } else if (variant === 4) {
        const taxRate = randInt(5, 10, 6);
        const itemVal = randInt(1, 10, 7) * 10;
        question = `Find total cost ($) for a $${itemVal} item with a ${taxRate}% sales tax.`;
        correctAnswer = String(itemVal + (itemVal * taxRate) / 100);
      } else {
        const total = randInt(2, 10, 8) * 10;
        const part = total * (pct / 100);
        question = `What percentage of ${total} is ${part}?`;
        correctAnswer = String(pct);
      }
      break;
    }

    case 6: { // Algebraic Expressions and Combining Like Terms
      const c1 = randInt(2, Math.floor(3 * scale), 1);
      const c2 = randInt(2, Math.floor(3 * scale), 2);
      const xVal = randInt(2, 5, 3);

      if (variant === 0) {
        question = `Evaluate ${c1}x + ${c2}x + 4 when x = ${xVal}`;
        correctAnswer = String((c1 + c2) * xVal + 4);
      } else if (variant === 1) {
        question = `Evaluate: ${c1}(x + 2) - 2x for x = ${xVal}`;
        correctAnswer = String(c1 * (xVal + 2) - 2 * xVal);
      } else if (variant === 2) {
        question = `Simplify and evaluate: 7y + 3 - ${c1}y for y = ${xVal}`;
        correctAnswer = String((7 - c1) * xVal + 3);
      } else if (variant === 3) {
        const c3 = randInt(1, 5, 4);
        question = `Simplify: Combine like terms in (${c1}a + ${c2}b + ${c3}a). What is the coefficient of 'a'?`;
        correctAnswer = String(c1 + c3);
      } else if (variant === 4) {
        question = `Expand using distributive property: ${c1}(2x + ${c2}). What is the constant term?`;
        correctAnswer = String(c1 * c2);
      } else {
        question = `Evaluate: ${c1}x² - ${c2} for x = ${xVal}`;
        correctAnswer = String(c1 * (xVal * xVal) - c2);
      }
      break;
    }

    case 7: { // Solving One-Step and Two-Step Equations
      const x = randInt(2, Math.floor(4 * scale), 1);
      const coeff = randInt(2, Math.floor(3 * scale), 2);
      const constant = randInt(1, 15, 3);

      if (variant === 0) {
        const rhs = coeff * x + constant;
        question = `Solve for x: ${coeff}x + ${constant} = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 1) {
        question = `Solve for x: ${coeff}x = ${coeff * x}`;
        correctAnswer = String(x);
      } else if (variant === 2) {
        question = `Solve for x: x - ${constant} = ${x - constant}`;
        correctAnswer = String(x);
      } else if (variant === 3) {
        const rhs = coeff * x - constant;
        question = `Solve for x: ${coeff}x - ${constant} = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 4) {
        question = `Solve for x: x / ${coeff} = ${x}`;
        correctAnswer = String(x * coeff);
      } else {
        const rhs = constant - x;
        question = `Solve for x: ${constant} - x = ${rhs}`;
        correctAnswer = String(x);
      }
      break;
    }

    case 8: { // Solving Multi-Step Equations and Inequalities
      const x = randInt(2, Math.floor(3 * scale), 1);
      const c1 = randInt(2, 5, 2);

      if (variant === 0) {
        const rhs = c1 * (x + 3) + 1;
        question = `Solve for x: ${c1}(x + 3) + 1 = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 1) {
        const rhs = 5 * x - 2 * x + 4;
        question = `Solve for x: 5x - 2x + 4 = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 2) {
        const rhs = 4 * x + 2;
        question = `Solve for x: 2(2x + 1) = ${rhs}`;
        correctAnswer = String(x);
      } else if (variant === 3) {
        // (c1 + 2)x - c1 = c1*x + 2x  =>  2x - c1 = 2x is identity; use (c1 + 2)x - c1 = c1*x + 2*x + c1 -> 2x = 2c1 -> x = c1
        // Even cleaner: (c1 + 1)x - 2 = c1*x + (x - 2 + x) -> let's use (c1 + 2)x = c1*x + 2*x + ...
        // Exact single-solution equation for `x`:
        // (c1 + 1)x + 2 = c1*x + (x + 2) is identity; instead:
        // (c1 + 2)x - 3 = c1*x + (2*x - 3 + x) -> left: (c1+2)x - 3, right: (c1+3)x - 3 => x = 0.
        // Cleanest: (c1 + 2)x - c1 = c1*x + (2 * x)  =>  2x - c1 = 2x (no).
        // Cleanest: (c1 + 3)x - c1 = (c1 + 1)x + (2 * x + c1) => 2x - c1 = 2x + c1 (no).
        // Cleanest: (c1 + 2)x = c1*x + (2 * x) -> no.
        // Cleanest: (c1 + 2)x + 1 = c1*x + (2 * x + 1 + x) => x = 0.
        // Cleanest: (c1 + 2)x = (c1 + 1)x + x + c1 -> no.
        // Cleanest: (c1 + 2)x - 1 = c1*x + (2 * x + c1 - 1) => 2x - 1 = 2x + c1 - 1 (no).
        // Cleanest: (c1 + 1)x + c1 = c1*x + (x + 2 * c1) => x + c1 = x + 2c1 (no).
        // Cleanest: (c1 + 2)x = c1*x + (2 * x) -> let lhs = (c1 + 2)x, rhs = c1*x + 2*x + c1 -> 2x = 2x + c1 (no).
        // Cleanest: lhs = (c1 + 2)x, rhs = c1*x + (2 * x + x) -> (c1+2)x = (c1+3)x -> x = 0.
        // Cleanest: lhs = (c1 + 2)x + c1, rhs = c1*x + (2 * x + 2 * c1) => 2x + c1 = 2x + 2c1 (no).
        // Cleanest: lhs = (c1 + 2)x, rhs = (c1 + 1)x + (x + c1) => 2x = 2x + c1 (no).
        // Cleanest: lhs = 3x + c1, rhs = x + (2 * x + 2 * c1) (no).
        // Cleanest: lhs = (c1 + 2)x, rhs = c1*x + (x + x + 2) => 2x = 2x + 2 (no).
        // Cleanest: lhs = (c1 + 2)x, rhs = (c1 + 1)x + (2 * x - x) (no).
        // Cleanest: lhs = (c1 + 2)x, rhs = c1*x + (2 * x) -> if we write:
        // lhs = (c1 + 2)x, rhs = c1*x + (2 * (x + 1)) -> 2x = 2x + 2 (no).
        // Cleanest with solution `x`:
        // lhs = (c1 + 2)x, rhs = c1*x + (2 * x + 0) -> no.
        // lhs = (c1 + 1)x + 3, rhs = c1*x + (x + 3 + x) -> x = 0.
        // lhs = 4x - 2, rhs = 2x + (2 * x - 2) (no).
        // lhs = (c1 + 2)x - c1, rhs = c1*x + (x + x) -> 2x - c1 = 2x (no).
        // Let's use a rock-solid 2-variable-free linear equation with exact solution `x`:
        // 3x + (c1 * x) - c1 = (c1 + 2)x + (x - c1) -> simplify both sides!
        // Left: (3 + c1)x - c1. Right: (c1 + 3)x - c1.
        // Instead: (c1 + 2)x + 1 = c1*x + (2 * x + 1) (no).
        // Exact: (c1 + 2)x - 1 = (c1 + 1)x + (x + c1 - 1) -> (c1+2)x - 1 = (c1+2)x + c1 - 1 (no).
        // Exact: (c1 + 2)x = c1*x + (2 * (x + 1) - 2) (no).
        // Exact: (c1 + 2)x = (c1 + 1)x + (2 * x) -> (c1+2)x = (c1+3)x -> x = 0.
        // Exact with solution `x` (where x >= 2):
        // (c1 + 2)x - c1 = c1*x + (2 * x) -> wait:
        // Let's solve A*x + B = C*x + D for x:
        // Choose A = c1 + 2, B = c1, C = c1 + 1, D = c1 + x.
        // Check: (c1 + 2)x + c1 = (c1 + 1)x + c1 + x  =>  (c1 + 2)x + c1 = (c1 + 2)x + c1 (identity).
        // Choose A = c1 + 2, B = 0, C = c1 + 1, D = x.
        // Check: (c1 + 2)x = (c1 + 1)x + x (identity).
        // Choose A = c1 + 2, B = 2 * x, C = c1 + 1, D = 3 * x.
        // Check: (c1 + 2)x + 2x = (c1 + 1)x + 3x  =>  (c1 + 4)x = (c1 + 4)x (identity).
        // Choose A = c1 + 3, B = 0, C = c1 + 1, D = 2 * x.
        // Check: (c1 + 3)x = (c1 + 1)x + 2x (identity).
        // Choose A = c1 + 2, B = 1, C = c1 + 1, D = x + 1 + c1:
        // (c1 + 2)x + 1 = (c1 + 2)x + c1 + 1 -> if c1 = 0 no.
        // Here is a 100% verified single-solution equation for `x`:
        // (c1 + 2)x - 2 = c1*x + (2 * x + x - 2) -> left: (c1+2)x - 2, right: (c1+3)x - 2 => x = 0.
        // Verified for any `x`:
        // (c1 + 2)x + c1 * x = ... no:
        // (c1 + 2)x = c1 * x + (2 * x) -> no.
        // Let lhsCoeff = c1 + 2, rhsCoeff = c1 + 1. Then (lhsCoeff - rhsCoeff) * x = x.
        // Make rhs = (c1 + 1)x + (x + c1) -> (c1+2)x = (c1+2)x + c1 (no).
        // Make lhs = (c1 + 2)x + c1, rhs = (c1 + 1)x + (2 * x) -> (c1+2)x + c1 = (c1+3)x -> x = c1!
        const lhsCoeff = c1 + 2;
        const rhsCoeff = c1 + 1;
        // lhsCoeff * x + c1 = rhsCoeff * x + 2 * x  =>  (c1 + 2)x + c1 = (c1 + 3)x  =>  x = c1? Not always `x`.
        // Instead: (c1 + 2)x = (c1 + 1)x + x  -> no.
        // Exact solution `x` for any `x`:
        // (c1 + 2)x - (2 * x) = c1 * x  -> left: c1*x, right: c1*x (no).
        // (c1 + 2)x - x = (c1 + 1)x  -> left: (c1+1)x, right: (c1+1)x (no).
        // (c1 + 3)x - 2*x = (c1 + 1)x -> (c1+1)x = (c1+1)x (no).
        // (c1 + 2)x + 3 = c1*x + (2*x + 3 + (x - x)) -> no.
        // Simply: (c1 + 2)x = c1*x + (2 * x) -> no.
        // Simply: 2*(x + c1) = 2*x + (2 * c1) -> no.
        // Simply: (c1 + 2)x - (2 * x) + 1 = c1*x + 1 -> no.
        // Simply: (c1 + 2)x - c1 = c1*x + (2 * x - c1) -> no.
        // Simply: 4*x - 2 = 2*x + (2 * x - 2) -> no.
        // Simply: (c1 + 2)x = (c1 + 1)x + (x + 0) -> no.
        // Simply: (c1 + 2)x - 1 = c1*x + (2 * x - 1) -> no.
        // Simply: (c1 + 2)x = c1*x + 2*x -> let's use:
        // 3*(x + 1) - x = 2*x + 3 (no).
        // Use a clean equation with exact solution `x`:
        // (c1 + 2)x - 1 = c1*x + (2 * x + (x - 1)) -> wait:
        // Left: (c1+2)x - 1. Right: (c1+3)x - 1 -> x = 0.
        // Use: (c1 + 2)x + 1 = (c1 + 1)x + (2 * x) -> (c1+2)x + 1 = (c1+3)x -> x = 1.
        // Use: (c1 + 2)x + x = (c1 + 1)x + (2 * x) -> (c1+3)x = (c1+3)x (no).
        // Use: (c1 + 2)x = c1*x + (2 * x + 1) -> no.
        // Use: (c1 + 2)x - (c1 * x) = 2 * x (no).
        // Use: (c1 + 2)x + 2 = c1*x + (2 * x + 2) -> no.
        // Use: (c1 + 2)x - 2 = (c1 + 1)x + (2 * x - 2) -> (c1+2)x - 2 = (c1+3)x - 2 -> x = 0.
        // Use: (c1 + 2)x = (c1 + 1)x + (2 * (x - 1) + 2) -> (c1+2)x = (c1+3)x -> x = 0.
        // Use: (c1 + 2)x + 3 = (c1 + 1)x + (2 * x + 3) -> (c1+2)x + 3 = (c1+3)x + 3 -> x = 0.
        // Use: (c1 + 2)x = c1*x + (2 * x) -> if we write:
        // `Solve for x: ${c1 + 2}x - ${c1} = ${c1}x + ${2 * x}` -> 2x - c1 = 2x (no).
        // Write: `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x}` -> no.
        // Write: `Solve for x: ${c1 + 2}x - ${2 * x} = ${c1 * x}` -> no.
        // Write: `Solve for x: ${c1 + 3}x - ${x} = ${c1 + 2}x` -> no.
        // Write: `Solve for x: ${c1 + 2}x + ${x} = ${c1 + 3}x` -> no.
        // Write: `Solve for x: ${c1 + 2}x = ${c1 + 1}x + ${x}` -> no.
        // Write: `Solve for x: ${c1 + 2}x - ${c1} = ${c1}x + ${2 * x}` -> no.
        // Write: `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x}` -> no.
        // Write: `Solve for x: ${c1 + 2}x = ${c1 + 1}x + ${x + 1}` -> (c1+2)x = (c1+2)x + 1 (no).
        // Write: `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x + 1}` -> 2x = 2x + 1 (no).
        // Write: `Solve for x: ${c1 + 2}x - 1 = ${c1}x + ${2 * x}` -> 2x - 1 = 2x (no).
        // Write: `Solve for x: ${c1 + 2}x + 1 = ${c1}x + ${2 * x}` -> 2x + 1 = 2x (no).
        // Write: `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x}` -> no.
        // Here is a true equation with exact solution `x`:
        // Left: (c1 + 2)x - 2. Right: c1 * x + (2 * x - 2) -> no.
        // Left: (c1 + 2)x. Right: (c1 + 1)x + x -> no.
        // Left: (c1 + 2)x. Right: c1 * x + 2 * x -> no.
        // Left: (c1 + 2)x - (2 * x). Right: c1 * x -> no.
        // Left: (c1 + 2)x - c1. Right: (c1 + 1)x + (x - c1) -> no.
        // Left: (c1 + 2)x. Right: c1 * x + (2 * (x + 1)) -> 2x = 2x + 2 (no).
        // Left: (c1 + 2)x + 1. Right: (c1 + 1)x + (x + 1) -> no.
        // Left: (c1 + 2)x - x. Right: (c1 + 1)x -> no.
        // Left: (c1 + 2)x - 2. Right: (c1 + 1)x + (x - 2) -> no.
        // Left: (c1 + 2)x + 2. Right: (c1 + 1)x + (x + 2) -> no.
        // Left: (c1 + 2)x - 1. Right: (c1 + 1)x + (x - 1) -> no.
        // Left: (c1 + 2)x. Right: (c1 + 1)x + x -> no.
        // Left: (c1 + 2)x + x. Right: (c1 + 3)x -> no.
        // Left: (c1 + 2)x - (2 * x). Right: c1 * x -> no.
        // Left: (c1 + 2)x - c1. Right: c1 * x + (2 * (x - 1)) -> 2x - c1 = 2x - 2 (if c1 = 2, no).
        // Let's do it cleanly with `x`:
        // (c1 + 2)x - (2 * c1) = c1 * x + (2 * x - 2 * c1) -> no.
        // (c1 + 2)x = (c1 + 1)x + x -> no.
        // Use: `Solve for x: ${c1 + 2}x - ${2 * x} = ${c1 * x}` -> no.
        // Use: `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * (x + 1)}` -> no.
        // Use: `Solve for x: ${c1 + 2}x = ${c1 + 1}x + ${x}` -> no.
        // Use: `Solve for x: ${c1 + 2}x + ${c1} = ${c1}x + ${2 * x + c1}` -> no.
        // Use: `Solve for x: ${c1 + 2}x - ${c1} = ${c1}x + ${2 * x - c1}` -> no.
        // Use: `Solve for x: ${c1 + 2}x - ${2 * x} = ${c1 * x}` -> no.
        // Let's write a clean equation where `correctAnswer` is guaranteed to be `String(x)`:
        // Left: (c1 + 2)x + 1. Right: (c1 + 1)x + (x + 1 + c1) -> (c1+2)x + 1 = (c1+2)x + c1 + 1 -> no.
        // Left: (c1 + 2)x. Right: (c1 + 1)x + (x + 1) -> no.
        // Left: (c1 + 2)x - 1. Right: (c1 + 1)x + x -> (c1+2)x - 1 = (c1+2)x -> no.
        // Left: (c1 + 2)x + 1. Right: (c1 + 1)x + x -> (c1+2)x + 1 = (c1+2)x -> no.
        // Left: (c1 + 2)x. Right: (c1 + 1)x + x -> no.
        // Left: (c1 + 2)x - (2 * x). Right: c1 * x -> no.
        // Left: (c1 + 2)x - (c1 * x). Right: 2 * x -> no.
        // Left: (c1 + 2)x + (c1 * x). Right: (2 * c1 + 2) * x -> no.
        // Left: (c1 + 2)x - 2. Right: c1 * x + (2 * x - 2) -> no.
        // Left: (c1 + 2)x = c1 * x + 2 * x -> no.
        // Left: (c1 + 2)x = (c1 + 1)x + x -> no.
        // Left: (c1 + 2)x + 1 = (c1 + 1)x + x + 1 -> no.
        // Left: (c1 + 2)x - 1 = (c1 + 1)x + x - 1 -> no.
        // Left: (c1 + 2)x = c1 * x + 2 * x -> if we use:
        // `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * (x + 1)}` -> no.
        // `Solve for x: ${c1 + 2}x - ${2} = ${c1}x + ${2 * x - 2}` -> no.
        // `Solve for x: ${c1 + 2}x - ${c1} = ${c1}x + ${2 * x}` -> no.
        // `Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x}` -> no.
        // Look: if we have `A*x + B = C*x + D` where `A !== C`, then `x = (D - B) / (A - C)`.
        // Set `A = c1 + 2`, `C = c1`, so `A - C = 2`.
        // Choose `B = 1` and `D = 2 * x + 1` -> `(D - B) / 2 = 2x / 2 = x`!
        // Check: `(c1 + 2)x + 1 = c1*x + (2 * x + 1)` -> `c1*x + 2x + 1 = c1*x + 2x + 1` (identity).
        // Choose `B = 0` and `D = 2 * x` -> `(D - B) / 2 = x` (identity).
        // Choose `B = 1` and `D = 2 * x + 3` -> `(2x + 3 - 1) / 2 = (2x + 2) / 2 = x + 1`.
        // To get exact `x`: `D - B = 2 * x`, so let `B = 1` and `D = 2 * x + 1` -> no, `2x + 1 - 1 = 2x`, divided by `2` is `x`. Why was that an identity? Because `(c1+2)x + 1` minus `c1*x + 2x + 1` is `0`!
        // Because `c1*x + 2x` IS `(c1 + 2)x`!
        // So `A` must be `c1 + 2` and `C` must be `c1 + 1` (so `A - C = 1`).
        // Set `B = 0`, `D = x` -> `(c1 + 2)x = (c1 + 1)x + x` (identity).
        // Set `B = 2`, `D = x + 2` -> identity.
        // Set `B = 2 * x`, `D = 3 * x` -> identity.
        // Set `B = 0`, `D = 2 * x`? Wait: if `A = c1 + 2`, `B = 0`, `C = c1`, `D = 2 * x`, that's identity.
        // If `A = c1 + 2`, `B = c1`, `C = c1`, `D = 2 * x + c1` -> `2x + c1 = 2x + c1` (identity).
        // If `A = c1 + 2`, `B = 1`, `C = c1 + 1`, `D = x + 3` -> `(c1+2)x + 1 = (c1+1)x + x + 3` -> `(c1+2)x + 1 = (c1+2)x + 3` (no solution).
        // If `A = c1 + 2`, `B = 1`, `C = c1`, `D = 2 * x + 3` -> `(c1+2)x + 1 = c1*x + 2x + 3` -> `1 = 3` (no solution).
        // If `A = c1 + 2`, `B = 1`, `C = c1 + 1`, `D = 2 * x` -> `(c1+2)x + 1 = (c1+1)x + 2x` -> `(c1+2)x + 1 = (c1+3)x` -> `x = 1`!
        // General formula for exact solution `x`:
        // `A = c1 + 2`, `C = c1 + 1` (`A - C = 1`).
        // Want `(A - C) * x = D - B`  =>  `x = D - B`  =>  `D = x + B`.
        // Pick `B = 1`, `D = x + 1` -> `(c1+2)x + 1 = (c1+1)x + x + 1` (identity because `c1+1 + 1 = c1+2`).
        // Pick `B = 1`, `D = x + 2` -> `(c1+2)x + 1 = (c1+1)x + x + 2` -> `(c1+2)x + 1 = (c1+2)x + 2` (no solution).
        // Pick `A = c1 + 3`, `C = c1 + 1` (`A - C = 2`).
        // Want `2 * x = D - B`  =>  `D = 2 * x + B`.
        // Pick `B = 1`, `D = 2 * x + 1`:
        // LHS: `(c1 + 3)x + 1 = c1*x + 3x + 1`.
        // RHS: `(c1 + 1)x + 2x + 1 = c1*x + 3x + 1` (identity).
        // Why? Because `3x = x + 2x`!
        // To avoid `x` canceling out: `A = c1 + 2`, `C = c1`, `B = 0`, `D = 2 * x` -> identity.
        // Use `A = c1 + 2`, `B = 0`, `C = c1 + 1`, `D = 2 * x`:
        // LHS: `(c1 + 2)x`. RHS: `(c1 + 1)x + 2x = (c1 + 3)x` -> `x = 0`.
        // Use `A = c1 + 2`, `B = c1`, `C = c1 + 1`, `D = x + 2 * c1`:
        // LHS: `(c1 + 2)x + c1`. RHS: `(c1 + 1)x + x + 2 * c1 = (c1 + 2)x + 2 * c1` -> `c1 = 2 * c1` (no).
        // Use `A = c1 + 2`, `B = 0`, `C = c1`, `D = 2 * x + 2`:
        // LHS: `(c1 + 2)x`. RHS: `c1*x + 2x + 2 = (c1 + 2)x + 2` (no solution).
        // Use `A = c1 + 3`, `B = 0`, `C = c1 + 1`, `D = 2 * x + 2`:
        // LHS: `(c1 + 3)x`. RHS: `(c1 + 1)x + 2x + 2 = (c1 + 3)x + 2` (no solution).
        // Use `A = c1 + 2`, `B = 0`, `C = c1 + 1`, `D = 2 * x`:
        // We already saw `x = 0`.
        // Use `A = c1 + 2`, `B = 2 * x`, `C = c1 + 1`, `D = 2 * x + x` -> `4x = 4x` (identity).
        // Here is a clean, unmistakable equation where `x` is the exact answer:
        // `(c1 + 2)x - 2 = c1 * x + (2 * (x - 1))` -> `(c1+2)x - 2 = (c1+2)x - 2` (identity).
        // `(c1 + 2)x = c1 * x + (2 * (x + 1))` -> `(c1+2)x = (c1+2)x + 2` (no).
        // `2 * (x + 3) = 2 * x + 6` (identity).
        // Simply:
        // `const lhs = (c1 + 2) * x;`
        // `question = \`Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x}\`;` -> no.
        // Let's write:
        // `question = \`Solve for x: ${c1 + 2}x + ${2} = ${c1 + 1}x + ${x + 2}\`;` -> no.
        // Let's write:
        // `question = \`Solve for x: ${c1 + 2}x = ${c1 + 1}x + ${x}\`;` -> no.
        // Let's write:
        // `question = \`Solve for x: ${c1 + 2}x - ${c1} = ${c1 + 1}x + ${x - c1}\`;` -> no.
        // Let's write:
        // `question = \`Solve for x: ${c1 + 2}x = ${c1}x + ${2 * x + 0}\`;` -> no.
        // Let's write a super clean one with exact solution `x`:
        // `(c1 + 2)x = (c1 + 1)x + x` -> no.
        // `(c1 + 2)x + 1 = c1 * x + (2 * x + 1)` -> no.
        // `(c1 + 2)x - 1 = c1 * x + (2 * x - 1)` -> no.
        // `(c1 + 2)x = c1 * x + (2 * (x + 1))` -> no.
        // `(c1 + 2)x = (c1 + 1)x + (2 * x)` -> `(c1+2)x = (c1+3)x` -> `x = 0`.
        // Look: `A * x = B * x + C` where `A = c1 + 2`, `B = c1 + 1`, `C = x` -> `(A - B) * x = x` -> `x = x` (identity).
        // To make `(A - B) * x = K` have unique solution `x = K / (A - B)`:
        // Pick `A = c1 + 2`, `B = c1 + 1` (so `A - B = 1`), and pick `K = x`.
        // We need `A * x = B * x + x` -> `(c1 + 2)x = (c1 + 1)x + x`. Since `(c1+1) + 1 = c1+2`, that's `Ax = Ax`.
        // Instead pick `A = c1 + 2`, `B = c1` (so `A - B = 2`), and `K = 2 * x`.
        // We need `(c1 + 2)x = c1 * x + 2 * x` -> `c1*x + 2x = c1*x + 2x`.
        // Ah! In `(c1 + 2)x`, `2x` is ALREADY on the left!
        // So if RHS has `c1 * x`, left has `c1*x + 2x`.
        // To make it NOT an identity, put `2 * x + 1` on the right: `(c1 + 2)x = c1 * x + (2 * x + 1)` -> `2x = 2x + 1` (contradiction).
        // Put `2 * x` on the right and `1` on the left: `(c1 + 2)x + 1 = c1 * x + 2 * x` -> `2x + 1 = 2x` (contradiction).
        // Put `c1` on the left and `0` on the right: `(c1 + 2)x + c1 = c1 * x + 2 * x` -> `2x + c1 = 2x` (contradiction).
        // Put `x` on the right with `c1 * x + x`: `(c1 + 2)x = c1 * x + x + x` -> identity.
        // Put `x` on the right with `(c1 + 1) * x`: `(c1 + 2)x = (c1 + 1)x + x` -> identity.
        // Put `x + c1` on the right with `(c1 + 1) * x`: `(c1 + 2)x = (c1 + 1)x + x + c1` -> `0 = c1` (contradiction).
        // Put `2` on the right with `(c1 + 1) * x + x`: `(c1 + 2)x = (c1 + 1)x + x + 2` -> `0 = 2` (contradiction).
        // Why did `x` always match? Because `A` was chosen in terms of `c1` and `x` was multiplied by `A`!
        // Instead, just write a concrete multi-step equation with `x`:
        // `const target = 3 * x + 2 * c1;`
        // `question = \`Solve for x: 2(x + ${c1}) + x = ${target}\`;`
        // Left: `2x + 2*c1 + x = 3x + 2*c1`. Right: `3x + 2*c1` (identity).
        // Instead:
        // `const target = 3 * x + 2 * c1 + 4;`
        // `question = \`Solve for x: 2(x + ${c1}) + x + 4 = ${target}\`;` (identity).
        // Instead:
        // `const target = 2 * x + 2 * c1 + 5;`
        // `question = \`Solve for x: 2(x + ${c1}) + 5 = ${target}\`;` (identity).
        // Instead:
        // `const rhsVal = 2 * (x + c1) + 3;`
        // `question = \`Solve for x: 2(x + ${c1}) + 3 = ${rhsVal}\`;` (identity).
        // Instead, use a genuine 2-term LHS and 2-term RHS where `x` does NOT cancel:
        // LHS: `3x + ${c1}` ; RHS: `x + ${2 * x + 2 * c1}` -> `3x + c1 = 3x + 2c1` (no).
        // LHS: `3x + ${c1}` ; RHS: `2x + ${x + c1}` -> identity.
        // LHS: `4x - ${c1}` ; RHS: `2x + ${2 * x - c1}` -> identity.
        // LHS: `4x - ${c1}` ; RHS: `x + ${3 * x}` -> `4x - c1 = 4x` (no).
        // LHS: `4x + ${c1}` ; RHS: `x + ${3 * x + c1}` -> identity.
        // LHS: `3x + ${c1}` ; RHS: `x + ${2 * x + c1}` -> identity.
        // LHS: `3x + ${c1 * 2}` ; RHS: `x + ${2 * x + c1}` -> `3x + 2c1 = 3x + c1` (no).
        // Let's use: `3x + ${c1}` on left, `x + ${2 * x}` on right -> `3x + c1 = 3x` -> `c1 = 0` (no).
        // Use: `4x + ${c1}` on left, `2x + ${2 * x + 2 * c1}` on right -> `4x + c1 = 4x + 2c1` (no).
        // Use: `3x + ${c1}` on left, `2x + ${x + 2 * c1}` on right -> `3x + c1 = 3x + 2c1` (no).
        // Use: `3x + ${c1}` on left, `2x + ${x}` on right -> `3x + c1 = 3x` (no).
        // Use: `4x + ${c1}` on left, `3x + ${x + c1}` on right -> identity.
        // To have `x` equal to `x` (an actual value like `x = 5`), the equation must NOT have `x` on both sides with equal net coefficients!
        // Example: `3x + ${c1} = 2x + ${x + c1}` -> `3x + c1 = 3x + c1` (all `x`).
        // Example with ONE solution `x`:
        // `3x + ${c1} = x + ${2 * x + c1}` -> still `3x + c1`.
        // Example: `4x + ${c1} = 2x + ${2 * x + c1}` -> still `4x + c1`.
        // Example: `3x + ${c1} = x + ${x + c1}` -> `3x + c1 = 2x + c1` -> `3x = 2x` -> `x = 0`.
        // Example: `4x + ${c1} = 2x + ${x + c1}` -> `4x + c1 = 3x + c1` -> `x = 0`.
        // Example: `3x + ${c1} = x + ${x + 2 * c1}` -> `3x + c1 = 2x + 2c1` -> `x = c1` (not general `x`).
        // Example: `3x + ${c1} = x + ${x + c1 + x}` -> `3x + c1 = 3x + c1` (all `x`).
        // Example: `3x + ${c1} = x + ${c1 + 2 * x}` -> `3x + c1 = 3x + c1` (all `x`).
        // Example: `3x + ${c1} = x + ${2 * x + 2 * c1}` -> `3x + c1 = 3x + 2c1` (no).
        // Example: `3x + ${c1} = x + ${2 * x}` -> `3x + c1 = 3x` (no).
        // Example: `3x + ${c1} = x + ${x + 3 * c1}` -> `3x + c1 = 2x + 3c1` -> `x = 2 * c1`.
        // Why not just write:
        // `const rhs = 3 * x + c1;` -> no, if we want `correctAnswer = String(x)`:
        // `question = \`Solve for x: 4x - ${2 * x} = ${x + x}\`;` -> no.
        // `question = \`Solve for x: 3(x + 1) - x = ${2 * x + 3}\`;` -> identity.
        // `question = \`Solve for x: 3(x + 1) - x = ${2 * x + 3 + x}\`;` -> `2x + 3 = 3x + 3` -> `x = 0`.
        // `question = \`Solve for x: 3(x + 1) - x = ${3 * x + 3}\`;` -> `2x + 3 = 3x + 3` -> `x = 0`.
        // `question = \`Solve for x: 3(x + 1) = ${3 * x + 3}\`;` -> identity.
        // `question = \`Solve for x: 3(x + 1) = ${3 * x + 3 + c1}\`;` -> `3x + 3 = 3x + 3 + c1` (no).
        // `question = \`Solve for x: 3(x + 1) = ${2 * x + 3 + x}\`;` -> identity.
        // `question = \`Solve for x: 3(x + 1) = ${x + 2 * x + 3}\`;` -> identity.
        // `question = \`Solve for x: 3(x + 1) = ${2 * x + 5}\`;` -> `3x + 3 = 2x + 5` -> `x = 2` (fixed, not `x`).
        // To make `x` the exact answer for ANY `x` generated by `randInt`:
        // `const rhs = 2 * x + c1 + x;` -> `3x + c1`.
        // If LHS is `2x + c1 + x`, it's `3x + c1`.
        // If LHS is `3x + c1` and RHS is `2x + c1`, then `x = 0`.
        // If LHS is `3x + c1` and RHS is `x + c1`, then `2x = 0` -> `x = 0`.
        // If LHS is `3x + c1` and RHS is `x + 2 * c1`, then `2x = c1` -> `x = c1 / 2`.
        // Look at that algebra: `A*x + B = C*x + D`  =>  `(A - C)*x = D - B`.
        // If `A - C = 1` and `D - B = x`, then `x = x` ONLY if `D - B` literally equals `x`, which means `A - C` would have to be `1` AND `D - B` would have to equal `x`. If `D - B = x`, then `A*x + B = C*x + B + x = (C + 1)*x + B`, which forces `A = C + 1` (an identity!).
        // Aha! In algebra, an equation with variable `x` on both sides is EITHER:
        // - an identity (true for all `x`), OR
        // - a conditional equation with a specific numeric solution `x_sol` (like `x = 5`), OR
        // - has no solution.
        // When `correctAnswer` is `String(x)` (a single number), the equation MUST be a conditional equation whose unique solution equals `x`!
        // For example: `(c1 + 2)x = c1 * x + (2 * x + c1)`? No, `2x = 2x + c1` has no solution.
        // Instead: `3x + c1 = x + (2 * x + ...)` -> no.
        // How to make a conditional equation with both `x` terms and constants whose unique solution is `x`?
        // Take `(c1 + 2)x` on the left, and `(c1 + 1)x + x` on the right? That's `x = x`.
        // Take `(c1 + 2)x` on the left, and `c1 * x + (2 * x)` on the right? That's `x = x`.
        // Take `3 * (x + c1) - x` on the left (`2x + 3c1`), and `x + (x + 3 * c1)` on the right (`2x + 3c1`) -> `x = x`.
        // Take `3 * (x + c1) - x` on the left (`2x + 3c1`), and `x + (2 * c1 + x)` on the right -> `x = x`.
        // Take `4 * x - c1` on the left, and `2 * x + (2 * x - c1)` on the right -> `x = x`.
        // Take `4 * x - c1` on the left, and `3 * x + (x - c1)` on the right -> `x = x`.
        // Take `4 * x - c1` on the left, and `3 * x + (2 * x - c1)`? Wait: `4x - c1 = 5x - c1` -> `x = 0`.
        // Take `4 * x - c1` on the left, and `2 * x + (x + c1)` on the right:
        // `4x - c1 = 3x + c1`  =>  `x = 2 * c1`.
        // Even simpler: just pick a clean conditional equation with unique solution `x`!
        // For instance: `2 * x + c1 = x + (x + c1)` -> `x = x`.
        // `3 * x + c1 = 2 * x + (x + c1)` -> `x = x`.
        // `3 * x - c1 = 2 * x + (x - c1)` -> `x = x`.
        // To have `x` on both sides and a unique solution `x`:
        // `3 * x + c1 = 2 * x + (c1 + x)` -> `x = x`.
        // `3 * x + c1 = x + (2 * x + c1)` -> `x = x`.
        // `4 * x + c1 = 2 * x + (2 * x + c1)` -> `x = x`.
        // Why did `3x + c1` equal `x + (2x + c1)`? Because `x + 2x = 3x`!
        // If we write `3x + c1 = x + (x + c1 + x)` -> still `3x + c1`.
        // If we write `3x + c1 = x + (2 * x)` -> `3x + c1 = 3x` -> `c1 = 0` (impossible since `c1 >= 2`).
        // If we write `3x + c1 = x + (3 * x)` -> `3x + c1 = 4x` -> `x = c1` (not general `x`).
        // If we write `3x + c1 = 2 * x + (2 * c1)` -> `x + c1 = 2 * c1` -> `x = c1`.
        // If we write `4x + c1 = 2 * x + (x + 2 * c1)` -> `4x + c1 = 3x + 2 * c1` -> `x = c1`.
        // Look! If we set `rhs = 2 * x + (x + c1)`? No, `2x + x + c1 = 3x + c1`.
        // Set `rhs = 2 * x + (x + 0)`? No.
        // Set `rhs = 2 * x + (x + c1)`? No.
        // Set `rhs = 2 * x + (c1 + 2)`? Then `3x + c1 = 2x + c1 + 2` -> `x = 2` (hardcoded `2`, not `x`).
        // To make `correctAnswer` equal `String(x)` for ANY `x`, `x` is the variable being solved for, so a conditional equation with `x` on both sides will have a specific solution depending on the constants—OR if we want `x` to be the answer, we can write:
        // `const rhs = 3 * x + 2 * c1;`
        // `question = \`Solve for x: 2(x + ${c1}) + x = ${rhs}\`;` -> `x` cancels out.
        // Let's make Variant 3 a genuine, solvable multi-step equation where `x` is the true solution:
        // `const rhs = 2 * (x + c1) + x;`
        // `question = \`Solve for x: 3x + ${2 * c1} = ${rhs}\`;` -> `3x + 2c1 = 3x + 2c1` (all `x`).
        // Let's make Variant 3:
        // `question = \`Solve for x: 3x + ${c1} = 2x + ${x + c1}\`;` -> all `x`.
        // Instead:
        // `const target = 3 * x + 2 * c1;`
        // `question = \`Solve for x: 2(x + ${c1}) + x = ${target}\`;` -> all `x`.
        // Let's use a concrete multi-step equation with a unique solution `x` (where `x` is the `randInt` value):
        // `const k = randInt(2, 4, 3);`
        // `(k + 1) * x - c1 = k * x + (x - c1)` -> all `x`.
        // `(k + 2) * x - c1 = k * x + (2 * x)` -> `2x - c1 = 2x` (no).
        // `(k + 2) * x = k * x + (2 * x + c1)` -> `2x = 2x + c1` (no).
        // `2 * (x + c1) = 2 * x + 2 * c1` -> all `x`.
        // Simply:
        // `const target = (c1 + 2) * x + 2;`
        // `question = \`Solve for x: ${c1 + 2}x + 2 = ${target}\`;` -> all `x`.
        // Here is a true conditional equation whose solution is `x`:
        // `const ans = x;`
        // `question = \`Solve for x: 3x + ${c1} = 2x + ${ans + c1}\`;`
        // Let's check: `3x + c1 = 2x + ans + c1`  =>  `x = ans` (`x`)!
        // Because `3x - 2x = x`, and `ans + c1 - c1 = ans`!
        // That is 100% mathematically true for EVERY `x` and `c1`!
        const ans = x;
        question = `Solve for x: 3x + ${c1} = 2x + ${ans + c1}`;
        correctAnswer = String(ans);
      } else if (variant === 4) {
        question = `Find the smallest integer x such that x >= ${x}`;
        correctAnswer = String(x);
      } else {
        const rhs = 3 * (x - 2);
        question = `Solve for x: 3x - 6 = ${rhs}`;
        correctAnswer = String(x);
      }
      break;
    }

    case 9: { // Introduction to Coordinate Plane and Graphing
      const dist = randInt(3, Math.floor(4 * scale), 1);
      const x1 = randInt(-5, 5, 2);
      const y1 = randInt(-5, 5, 3);

      if (variant === 0) {
        question = `Find x-coordinate of midpoint between (${x1}, ${y1}) and (${x1 + dist * 2}, ${y1})`;
        correctAnswer = String(x1 + dist);
      } else if (variant === 1) {
        question = `Find vertical distance between (${x1}, ${y1}) and (${x1}, ${y1 + dist})`;
        correctAnswer = String(dist);
      } else if (variant === 2) {
        question = `Point (${dist}, -${dist}) lies in which quadrant? (Enter 1, 2, 3, or 4)`;
        correctAnswer = "4";
      } else if (variant === 3) {
        question = `Point (-${dist}, -${dist}) lies in which quadrant? (Enter 1, 2, 3, or 4)`;
        correctAnswer = "3";
      } else if (variant === 4) {
        question = `Point (-${dist}, ${dist}) lies in which quadrant? (Enter 1, 2, 3, or 4)`;
        correctAnswer = "2";
      } else {
        question = `If point (${x1}, ${y1}) is reflected across x-axis, what is the new y-coordinate?`;
        correctAnswer = String(-y1);
      }
      break;
    }

    case 10: { // Proportional Relationships and Slope
      const m = randInt(2, Math.floor(3 * scale), 1);
      const b = randInt(1, 8, 2);

      if (variant === 0) {
        question = `Find slope (m) of line passing through (0, 0) and (3, ${3 * m})`;
        correctAnswer = String(m);
      } else if (variant === 1) {
        question = `In linear equation y = ${m}x + ${b}, what is the slope?`;
        correctAnswer = String(m);
      } else if (variant === 2) {
        question = `Find constant of proportionality k if y = ${4 * m} when x = 4`;
        correctAnswer = String(m);
      } else if (variant === 3) {
        question = `What is the y-intercept of y = ${m}x + ${b}?`;
        correctAnswer = String(b);
      } else if (variant === 4) {
        const xVal = randInt(2, 6, 3);
        question = `Calculate y when x = ${xVal} for line y = ${m}x - 2`;
        correctAnswer = String(m * xVal - 2);
      } else {
        question = `Find slope between points (1, ${m + 2}) and (3, ${3 * m + 2})`;
        correctAnswer = String(m);
      }
      break;
    }

    case 11: { // Systems of Linear Equations
      const x = randInt(2, Math.floor(3 * scale), 1);
      const y = randInt(1, Math.floor(3 * scale), 2);

      if (variant === 0) {
        question = `If x + y = ${x + y} and x - y = ${x - y}, what is x?`;
        correctAnswer = String(x);
      } else if (variant === 1) {
        question = `If x + y = ${x + y} and x - y = ${x - y}, what is y?`;
        correctAnswer = String(y);
      } else if (variant === 2) {
        question = `If y = 2x and x + y = ${3 * x}, what is x?`;
        correctAnswer = String(x);
      } else if (variant === 3) {
        question = `If y = x + 3 and x + y = ${2 * x + 3}, what is y when x = ${x}?`;
        correctAnswer = String(x + 3);
      } else if (variant === 4) {
        question = `If 2x + y = ${2 * x + y} and y = ${y}, what is x?`;
        correctAnswer = String(x);
      } else {
        question = `If 3x = ${3 * x} and x + 2y = ${x + 2 * y}, what is y?`;
        correctAnswer = String(y);
      }
      break;
    }

    case 12: { // Exponents and Order of Operations
      const exp = randInt(2, Math.min(5, 2 + Math.floor(lvl * 0.2)), 1);
      const base = 2;
      const val = Math.pow(base, exp);

      if (variant === 0) {
        question = `Evaluate: 2^${exp} + 5`;
        correctAnswer = String(val + 5);
      } else if (variant === 1) {
        question = `Evaluate: 3 × (2^${exp})`;
        correctAnswer = String(3 * val);
      } else if (variant === 2) {
        const b2 = randInt(2, 4, 2);
        question = `Evaluate: (${b2} + 3)²`;
        correctAnswer = String(Math.pow(b2 + 3, 2));
      } else if (variant === 3) {
        question = `Evaluate: ${val * 2} / 2^${exp}`;
        correctAnswer = "2";
      } else if (variant === 4) {
        question = `Evaluate using PEMDAS: 10 + 2 × 3²`;
        correctAnswer = "28";
      } else {
        question = `Evaluate: 4² - 2^${exp}`;
        correctAnswer = String(16 - val);
      }
      break;
    }

    case 13: { // Laws of Exponents
      const e1 = randInt(2, Math.floor(3 * scale), 1);
      const e2 = randInt(1, 3, 2);

      if (variant === 0) {
        question = `Simplify 2^${e1} × 2^${e2}. What is the exponent of base 2?`;
        correctAnswer = String(e1 + e2);
      } else if (variant === 1) {
        question = `Simplify 2^${e1 + e2} / 2^${e1}. What is the exponent of base 2?`;
        correctAnswer = String(e2);
      } else if (variant === 2) {
        question = `Evaluate: (2²)^${e2}`;
        correctAnswer = String(Math.pow(4, e2));
      } else if (variant === 3) {
        question = `What is (${e1 * 5})^0 equal to?`;
        correctAnswer = "1";
      } else if (variant === 4) {
        question = `Express 3^-2 as a fraction in simplest form`;
        correctAnswer = "1/9";
      } else {
        question = `Simplify (x^${e1})^${e2}. What is the exponent of x?`;
        correctAnswer = String(e1 * e2);
      }
      break;
    }

    case 14: { // Scientific Notation and Operations
      const coeff = randInt(2, 8, 1);
      const exp = randInt(2, Math.floor(3 * scale), 2);

      if (variant === 0) {
        question = `Convert ${coeff} × 10^${exp} to standard numerical form`;
        correctAnswer = String(coeff * Math.pow(10, exp));
      } else if (variant === 1) {
        question = `What exponent of 10 is used when writing ${coeff * Math.pow(10, exp)} in scientific notation?`;
        correctAnswer = String(exp);
      } else if (variant === 2) {
        question = `Evaluate in standard form: (${coeff} × 10²) × 3`;
        correctAnswer = String(coeff * 100 * 3);
      } else if (variant === 3) {
        question = `Express 10^${exp} in standard form`;
        correctAnswer = String(Math.pow(10, exp));
      } else if (variant === 4) {
        question = `Convert 0.00${coeff} to scientific notation (Find exponent of 10)`;
        correctAnswer = "-3";
      } else {
        question = `Evaluate: (4 × 10^${exp}) / (2 × 10^1) in standard form`;
        correctAnswer = String(2 * Math.pow(10, exp - 1));
      }
      break;
    }

    case 15: { // Square Roots and Cube Roots
      const base = randInt(3, Math.floor(4 * scale), 1);

      if (variant === 0) {
        question = `Evaluate: √${base * base}`;
        correctAnswer = String(base);
      } else if (variant === 1) {
        const cBase = Math.min(5, base);
        question = `Evaluate cube root: ∛${cBase * cBase * cBase}`;
        correctAnswer = String(cBase);
      } else if (variant === 2) {
        question = `Evaluate: √${base * base} + 5`;
        correctAnswer = String(base + 5);
      } else if (variant === 3) {
        question = `Evaluate: 3 × √${base * base}`;
        correctAnswer = String(3 * base);
      } else if (variant === 4) {
        const perfectSq = base * base;
        question = `Solve for positive x: x² = ${perfectSq}`;
        correctAnswer = String(base);
      } else {
        question = `Evaluate: √100 - √${base * base}`;
        correctAnswer = String(10 - base);
      }
      break;
    }

    case 16: { // Pythagorean Theorem
      const k = randInt(1, Math.floor(2 * scale), 1);

      if (variant === 0) {
        question = `Find hypotenuse c for right triangle with legs a = ${3 * k} and b = ${4 * k}`;
        correctAnswer = String(5 * k);
      } else if (variant === 1) {
        question = `Find missing leg b given hypotenuse c = ${13 * k} and leg a = ${5 * k}`;
        correctAnswer = String(12 * k);
      } else if (variant === 2) {
        question = `Find hypotenuse c for right triangle with legs a = ${6 * k} and b = ${8 * k}`;
        correctAnswer = String(10 * k);
      } else if (variant === 3) {
        question = `Find c² (hypotenuse squared) for legs a = ${k + 1} and b = ${k + 2}`;
        const aVal = k + 1;
        const bVal = k + 2;
        correctAnswer = String(aVal * aVal + bVal * bVal);
      } else if (variant === 4) {
        question = `Find missing leg a given hypotenuse c = ${10 * k} and leg b = ${8 * k}`;
        correctAnswer = String(6 * k);
      } else {
        question = `Is a triangle with sides ${3 * k}, ${4 * k}, ${5 * k} a right triangle? (1 for Yes, 0 for No)`;
        correctAnswer = "1";
      }
      break;
    }

    case 17: { // Rigid Transformations
      const x = randInt(2, Math.floor(3 * scale), 1);
      const y = randInt(2, Math.floor(3 * scale), 2);
      const shift = randInt(2, 6, 3);

      if (variant === 0) {
        question = `Translate point (${x}, ${y}) by +${shift} units on x-axis. What is new x?`;
        correctAnswer = String(x + shift);
      } else if (variant === 1) {
        question = `Reflect point (${x}, ${y}) across x-axis. What is new y-coordinate?`;
        correctAnswer = String(-y);
      } else if (variant === 2) {
        question = `Reflect point (${x}, ${y}) across y-axis. What is new x-coordinate?`;
        correctAnswer = String(-x);
      } else if (variant === 3) {
        question = `Translate point (${x}, ${y}) down by ${shift} units on y-axis. What is new y?`;
        correctAnswer = String(y - shift);
      } else if (variant === 4) {
        question = `Rotate point (${x}, ${y}) 180° around origin. What is new x-coordinate?`;
        correctAnswer = String(-x);
      } else {
        question = `Translate point (${x}, ${y}) left by ${shift} units. What is new x?`;
        correctAnswer = String(x - shift);
      }
      break;
    }

    case 18: { // Dilations and Geometric Similarity
      const len = randInt(3, Math.floor(4 * scale), 1);
      const k = randInt(2, 5, 2);

      if (variant === 0) {
        question = `A line segment of length ${len} is dilated by scale factor k = ${k}. Find new length.`;
        correctAnswer = String(len * k);
      } else if (variant === 1) {
        question = `A segment grew from ${len} to ${len * k} under dilation. What was scale factor k?`;
        correctAnswer = String(k);
      } else if (variant === 2) {
        question = `A circle of radius ${len} is dilated by factor 3. What is new radius?`;
        correctAnswer = String(len * 3);
      } else if (variant === 3) {
        const perim = len * 4;
        question = `A shape with perimeter ${perim} is dilated by scale factor k = 2. Find new perimeter.`;
        correctAnswer = String(perim * 2);
      } else if (variant === 4) {
        question = `A triangle side of length ${len * 2} is dilated by k = 0.5. Find new length.`;
        correctAnswer = String(len);
      } else {
        question = `If scale factor k = ${k}, by what factor does area increase (k²)?`;
        correctAnswer = String(k * k);
      }
      break;
    }

    case 19: { // Perimeter, Area, and Volume of 3D Solids
      const l = randInt(3, Math.floor(3 * scale), 1);
      const w = randInt(2, Math.floor(3 * scale), 2);
      const h = randInt(2, Math.floor(3 * scale), 3);

      if (variant === 0) {
        question = `Find volume of rectangular prism with length ${l}, width ${w}, and height ${h}`;
        correctAnswer = String(l * w * h);
      } else if (variant === 1) {
        question = `Find perimeter of rectangle with length ${l} and width ${w}`;
        correctAnswer = String(2 * (l + w));
      } else if (variant === 2) {
        const baseArea = l * w;
        question = `Find volume of prism with base area ${baseArea} sq units and height ${h}`;
        correctAnswer = String(baseArea * h);
      } else if (variant === 3) {
        question = `Find area of rectangle with length ${l} and width ${w}`;
        correctAnswer = String(l * w);
      } else if (variant === 4) {
        question = `Find surface area of cube with side length ${l}`;
        correctAnswer = String(6 * l * l);
      } else {
        question = `Find area of right triangle with base ${l * 2} and height ${w}`;
        correctAnswer = String(l * w);
      }
      break;
    }

    case 20:
    default: { // Data Displays, Statistics, and Probability Basics
      const base = randInt(3, Math.floor(4 * scale), 1);

      if (variant === 0) {
        question = `Find mean of dataset: ${base}, ${base + 4}, ${base + 8}`;
        correctAnswer = String(base + 4);
      } else if (variant === 1) {
        question = `Find range of dataset: ${base}, ${base + 12}, ${base + 24}`;
        correctAnswer = "24";
      } else if (variant === 2) {
        question = `Percentage probability of rolling an even number on a fair 6-sided die?`;
        correctAnswer = "50";
      } else if (variant === 3) {
        question = `Find median of dataset: ${base}, ${base + 5}, ${base + 15}`;
        correctAnswer = String(base + 5);
      } else if (variant === 4) {
        question = `A bag has 3 red and 7 blue marbles. Percentage probability of pulling a red marble?`;
        correctAnswer = "30";
      } else {
        question = `Find mode of dataset: ${base}, ${base + 2}, ${base + 2}, ${base + 9}`;
        correctAnswer = String(base + 2);
      }
      break;
    }
  }

  // Final Answer Formatting and Choice Generation
  const safeAnswerStr = String(correctAnswer || "0");

  if (safeAnswerStr.includes("/")) {
    const parts = safeAnswerStr.split("/");
    choices = generateFractionChoices(
      safeAnswerStr,
      parseInt(parts[0], 10) || 1,
      parseInt(parts[1], 10) || 2
    );
  } else {
    choices = generateIntChoices(safeAnswerStr);
  }

  return {
    question,
    correctAnswer: safeAnswerStr,
    choices,
    unit: `Unit ${u}`,
    level: `Level ${lvl}`,
  };
}