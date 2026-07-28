export function generatePrealgebra(unit, level) {
  let question = "";
  let correctAnswer;
  let choices = [];

  const unitNum = Number(unit);

  const unitNames = {
    1: "Real Number Operations & Properties",
    2: "Integers & Absolute Value Applications",
    3: "Exponent Rules & Scientific Notation",
    4: "Square Roots & Radical Expressions",
    5: "Order of Operations with Grouping Symbols",
    6: "Algebraic Expressions & Multi-Variable Substitution",
    7: "Simplifying Polynomial Expressions & Combining Like Terms",
    8: "The Distributive Property & Binomial Multiplication",
    9: "Factoring Linear Expressions via Greatest Common Factor",
    10: "Solving Multi-Step Linear Equations",
    11: "Linear Equations with Variables on Both Sides",
    12: "Literal Equations & Formula Rearranging",
    13: "Linear Inequalities & Compound Inequalities",
    14: "Ratios, Rates, & Proportions",
    15: "Advanced Percents & Financial Applications",
    16: "The Coordinate Plane & Distance Formula",
    17: "Slope & Slope-Intercept Form of a Line",
    18: "Introduction to Functions & Function Notation",
    19: "Systems of Linear Equations",
    20: "Exponent Laws & Scientific Notation Operations"
  };

  const unitName = unitNames[unitNum] || "General Pre-Algebra";

  switch (unitNum) {
    case 1: { // Unit 1: Real Number Operations & Properties
      const a = (Math.floor(Math.random() * 20) - 10);
      const b = (Math.floor(Math.random() * 20) - 10);
      const c = (Math.floor(Math.random() * 10) - 5);
      question = `Evaluate: (${a}) - [(${b}) + (${c})]`;
      correctAnswer = a - (b + c);
      choices = [correctAnswer, correctAnswer + 3, correctAnswer - 2, -correctAnswer];
      break;
    }
    case 2: { // Unit 2: Integers & Absolute Value Applications
      const a = Math.floor(Math.random() * 30) - 15;
      const b = Math.floor(Math.random() * 30) - 15;
      question = `What is the absolute difference between ${a} and ${b} on the number line?`;
      correctAnswer = Math.abs(a - b);
      choices = [correctAnswer, correctAnswer + 4, Math.abs(a + b), Math.max(1, correctAnswer - 5)];
      break;
    }
    case 3: { // Unit 3: Exponent Rules & Scientific Notation
      const base = Math.floor(Math.random() * 3) + 2;
      const e1 = Math.floor(Math.random() * 3) + 3;
      const e2 = Math.floor(Math.random() * 2) + 2;
      question = `Simplify and evaluate: (${base}^{${e1}} \\times ${base}^{${e2}}) / ${base}^{${e1 - 1}}`;
      correctAnswer = Math.pow(base, e1 + e2 - (e1 - 1));
      choices = [correctAnswer, Math.pow(base, e1), correctAnswer + base, Math.pow(base, e2)];
      break;
    }
    case 4: { // Unit 4: Square Roots & Radical Expressions
      const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
      const val = squares[Math.floor(Math.random() * squares.length)];
      const coef = Math.floor(Math.random() * 3) + 2;
      question = `Evaluate: ${coef}√(${val}) - ${Math.floor(Math.random() * 6) + 1}`;
      const subVal = parseInt(question.split('-')[1].trim());
      correctAnswer = (coef * Math.sqrt(val)) - subVal;
      choices = [correctAnswer, correctAnswer + 3, coef * Math.sqrt(val), correctAnswer - 4];
      break;
    }
    case 5: { // Unit 5: Order of Operations with Grouping Symbols
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 3) + 2;
      const c = Math.floor(Math.random() * 4) + 1;
      question = `Evaluate: [(${a} + ${b})^2 - (${c} × 3)] / 2`;
      correctAnswer = (Math.pow(a + b, 2) - (c * 3)) / 2;
      choices = [correctAnswer, correctAnswer + 6, correctAnswer - 3, correctAnswer * 2];
      break;
    }
    case 6: { // Unit 6: Algebraic Expressions & Multi-Variable Substitution
      const x = Math.floor(Math.random() * 4) + 2;
      const y = Math.floor(Math.random() * 3) + 1;
      const z = Math.floor(Math.random() * 2) + 1;
      question = `Evaluate 3x^2 - 4xy + yz^2 when x = ${x}, y = ${y}, z = ${z}`;
      correctAnswer = (3 * Math.pow(x, 2)) - (4 * x * y) + (y * Math.pow(z, 2));
      choices = [correctAnswer, correctAnswer + 5, correctAnswer - 4, 3 * Math.pow(x, 2)];
      break;
    }
    case 7: { // Unit 7: Simplifying Polynomial Expressions & Combining Like Terms
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 6) + 2;
      const c = Math.floor(Math.random() * 4) + 1;
      const d = Math.floor(Math.random() * 5) + 3;
      question = `What is the coefficient of x^2 in the expansion of: ${a}x(x - 2) + ${b}x^2 - ${c}x + ${d}?`;
      correctAnswer = a + b;
      choices = [correctAnswer, a - b, a * b, correctAnswer + 2];
      break;
    }
    case 8: { // Unit 8: The Distributive Property & Binomial Multiplication
      const a = Math.floor(Math.random() * 3) + 2;
      const b = Math.floor(Math.random() * 4) + 2;
      const c = Math.floor(Math.random() * 5) + 1;
      question = `Expand and simplify: ${a}(${b}x - ${c}) - 2(${b}x + 4) — Enter coefficient of x`;
      correctAnswer = (a * b) - (2 * b);
      choices = [correctAnswer, a * b, correctAnswer + 3, correctAnswer - 3];
      break;
    }
    case 9: { // Unit 9: Factoring Linear Expressions via Greatest Common Factor
      const gcf = Math.floor(Math.random() * 4) + 3;
      const f1 = Math.floor(Math.random() * 5) + 2;
      const f2 = Math.floor(Math.random() * 5) + 2;
      question = `Factor completely: ${gcf * f1}x^2 + ${gcf * f2}x — Enter the GCF`;
      correctAnswer = gcf;
      choices = [correctAnswer, f1, correctAnswer * 2, 1];
      break;
    }
    case 10: { // Unit 10: Solving Multi-Step Linear Equations
      const x = Math.floor(Math.random() * 10) + 3;
      const m = Math.floor(Math.random() * 4) + 3;
      const b = Math.floor(Math.random() * 8) + 2;
      const total = (m * x) - b;
      question = `Solve for x: ${m}x - ${b} = ${total}`;
      correctAnswer = x;
      choices = [correctAnswer, correctAnswer + 3, correctAnswer - 2, total];
      break;
    }
    case 11: { // Unit 11: Linear Equations with Variables on Both Sides
      const x = Math.floor(Math.random() * 8) + 2;
      const a = Math.floor(Math.random() * 3) + 4;
      const b = Math.floor(Math.random() * 6) + 2;
      const c = a - 2;
      const rhsVal = (c * x) + (b + 4);
      question = `Solve for x: ${a}x + ${b} = ${c}x + ${rhsVal}`;
      correctAnswer = x + 2;
      choices = [correctAnswer, x, correctAnswer + 3, Math.max(1, correctAnswer - 2)];
      break;
    }
    case 12: { // Unit 12: Literal Equations & Formula Rearranging
      const pVal = Math.floor(Math.random() * 20) + 40;
      const wVal = Math.floor(Math.random() * 4) + 4;
      question = `Using formula P = 2l + 2w, solve for length (l) if P = ${pVal} and w = ${wVal}`;
      correctAnswer = (pVal - (2 * wVal)) / 2;
      choices = [correctAnswer, correctAnswer + 2, correctAnswer - 3, wVal];
      break;
    }
    case 13: { // Unit 13: Linear Inequalities & Compound Inequalities
      const a = Math.floor(Math.random() * 3) + 2;
      const lower = Math.floor(Math.random() * 4) + 2;
      const upper = lower + 12;
      question = `Solve for x: ${lower} ≤ ${a}x - 2 ≤ ${upper}`;
      correctAnswer = Number(((lower + 2) / a).toFixed(1));
      choices = [correctAnswer, correctAnswer + 2, lower, upper];
      break;
    }
    case 14: { // Unit 14: Ratios, Rates, & Proportions
      const scale = Math.floor(Math.random() * 3) + 2;
      const x = Math.floor(Math.random() * 6) + 3;
      question = `Solve for x in the proportion: (3 / 4) = (x / ${x * scale})`;
      correctAnswer = Number((3 * scale).toFixed(1));
      choices = [correctAnswer, correctAnswer + 1.5, x, scale * 4];
      break;
    }
    case 15: { // Unit 15: Advanced Percents & Financial Applications
      const orig = 120;
      question = `A $${orig} item is subjected to a 25% discount followed by a 10% tax on the discounted price. What is the final total?`;
      correctAnswer = Number((orig * 0.75 * 1.1).toFixed(2));
      choices = [correctAnswer, orig, Number((orig * 0.85).toFixed(2)), Number((orig * 0.8).toFixed(2))];
      break;
    }
    case 16: { // Unit 16: The Coordinate Plane & Distance Formula
      const x1 = 1, y1 = 2, x2 = 4, y2 = 6;
      question = `Find the exact distance between points (${x1}, ${y1}) and (${x2}, ${y2})`;
      correctAnswer = 5;
      choices = [5, 7, 25, 3];
      break;
    }
    case 17: { // Unit 17: Slope & Slope-Intercept Form of a Line
      const x1 = 2, y1 = 3, x2 = 6, y2 = 11;
      question = `What is the slope (m) of the line passing through (${x1}, ${y1}) and (${x2}, ${y2})?`;
      correctAnswer = (y2 - y1) / (x2 - x1);
      choices = [correctAnswer, correctAnswer + 1, 2, 1];
      break;
    }
    case 18: { // Unit 18: Introduction to Functions & Function Notation
      const x = 3;
      question = `Given f(x) = 2x^2 - 4x + 5, what is f(${x})?`;
      correctAnswer = (2 * Math.pow(x, 2)) - (4 * x) + 5;
      choices = [correctAnswer, correctAnswer + 4, correctAnswer - 5, 11];
      break;
    }
    case 19: { // Unit 19: Systems of Linear Equations
      const x = 4;
      const y = 3;
      question = `Solve the system for x: 2x + y = ${2*x + y} and x - y = ${x - y}`;
      correctAnswer = x;
      choices = [correctAnswer, y, correctAnswer + 3, 1];
      break;
    }
    case 20: { // Unit 20: Exponent Laws & Scientific Notation Operations
      question = `Evaluate and express in standard form: (3 × 10^3) × (2 × 10^2)`;
      correctAnswer = 600000;
      choices = [600000, 60000, 6000, 6000000];
      break;
    }
    default: {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      question = `Evaluate: ${a}x + ${b} when x = 2`;
      correctAnswer = (a * 2) + b;
      choices = [correctAnswer, correctAnswer + 3, Math.abs(correctAnswer - 4), correctAnswer + 5];
      break;
    }
  }

  return {
    question,
    correctAnswer,
    choices: Array.from(new Set(choices)),
    unit: unitNum,
    unitName: unitName
  };
}