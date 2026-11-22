'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

const mathGuides = {
  addition: {
    title: "Addition & Aggregation",
    units: [
      { unit: "1-5", title: "Foundational Sums", formula: "a + b = c", trick: "Look for combinations that make 10 first.", example: "Problem: 8 + 6 + 2 + 4\n1. Pair complementary numbers: (8 + 2) = 10 and (6 + 4) = 10.\n2. Add the two sums: 10 + 10 = 20." },
      { unit: "6-10", title: "Two-Digit Alignment", formula: "Tens + Ones grouping", trick: "Add the tens column first, then the ones.", example: "Problem: 57 + 38\n1. Split tens and ones: (50 + 30) + (7 + 8).\n2. Sum tens: 50 + 30 = 80.\n3. Sum ones: 7 + 8 = 15.\n4. Combine: 80 + 15 = 95." },
      { unit: "11-15", title: "Carrying & Multi-Digit", formula: "Align right-to-left columns", trick: "Round one number up, add, then adjust.", example: "Problem: 189 + 247\n1. Round 189 up to 200: 200 + 247 = 447.\n2. Adjust for the extra 11 added: 447 - 11 = 436." },
      { unit: "16-20", title: "Advanced Aggregation", formula: "Macro-sum totals", trick: "Break large values down by place value.", example: "Problem: 1,450 + 2,830\n1. Thousands: 1,000 + 2,000 = 3,000.\n2. Hundreds: 400 + 800 = 1,200.\n3. Tens: 50 + 30 = 80.\n4. Total: 3,000 + 1,200 + 80 = 4,280." }
    ]
  },
  subtraction: {
    title: "Subtraction & Difference",
    units: [
      { unit: "1-5", title: "Basic Takeaways", formula: "a - b = c", trick: "Think of subtraction as counting up.", example: "Problem: 15 - 8\n1. Start at 8 and count to 10 (+2).\n2. Count from 10 to 15 (+5).\n3. Add steps: 2 + 5 = 7." },
      { unit: "6-10", title: "Regrouping & Spans", formula: "Constant difference shift", trick: "Add or subtract the same value from both numbers.", example: "Problem: 73 - 39\n1. Add 1 to both numbers to clean subtrahend: 74 - 40.\n2. Compute: 74 - 40 = 34." },
      { unit: "11-15", title: "Multi-Digit Balances", formula: "Column subtraction", trick: "Subtract clean tens first, then adjust.", example: "Problem: 245 - 88\n1. Subtract 100: 245 - 100 = 145.\n2. Add back 12: 145 + 12 = 157." },
      { unit: "16-20", title: "Expert Variances", formula: "High-magnitude delta", trick: "Estimate range first to eliminate errors.", example: "Problem: 8,250 - 3,480\n1. Subtract thousands: 8,250 - 3,000 = 5,250.\n2. Subtract hundreds: 5,250 - 400 = 4,850.\n3. Subtract tens: 4,850 - 80 = 4,770." }
    ]
  },
  multiplication: {
    title: "Multiplication & Scaling",
    units: [
      { unit: "1-5", title: "Repeated Addition Arrays", formula: "a × b = Product", trick: "Double numbers for quick 4s.", example: "Problem: 18 × 4\n1. Double 18 once: 36.\n2. Double 36 again: 72." },
      { unit: "6-10", title: "Grid & Factor Splitting", formula: "Distributive: a × (b + c)", trick: "Break harder factors apart.", example: "Problem: 7 × 14\n1. Split 14: 7 × (10 + 4).\n2. Expand: (7 × 10) + (7 × 4) = 70 + 28 = 98." },
      { unit: "11-15", title: "Double-Digit Products", formula: "Partitioning method", trick: "Halving and doubling strategy.", example: "Problem: 16 × 25\n1. Halve 16 to 8, double 25 to 50: 8 × 50.\n2. Halve 8 to 4, double 50 to 100: 4 × 100 = 400." },
      { unit: "16-20", title: "Macro-Scaling & Factors", formula: "Exponential growth tracking", trick: "Compute base digits, append trailing zeros.", example: "Problem: 600 × 700\n1. Multiply base non-zero digits: 6 × 7 = 42.\n2. Count total zeros (4 zeros) and append: 420,000." }
    ]
  },
  division: {
    title: "Division & Unit Rates",
    units: [
      { unit: "1-5", title: "Equal Distribution", formula: "dividend ÷ divisor = quotient", trick: "Think of division as reverse multiplication.", example: "Problem: 56 ÷ 8\n1. Ask: What times 8 equals 56?\n2. Since 8 × 7 = 56, quotient is 7." },
      { unit: "6-10", title: "Currencies & Units", formula: "Total Value / Group Count", trick: "Cancel matching units.", example: "Problem: $84 for 6 t-shirts\n1. Divide total price by quantity: 84 ÷ 6.\n2. Split 84 into (60 + 24) ÷ 6 = 10 + 4 = $14 per shirt." },
      { unit: "11-15", title: "Scientific Rates", formula: "Distance / Interval", trick: "Simplify numerator and denominator.", example: "Problem: 280 miles in 4 hours\n1. Compute: 280 ÷ 4.\n2. Divide 28 by 4 = 7, append zero: 70 mph." },
      { unit: "16-20", title: "Expert Metrics & Physics", formula: "System Metric / Node Count", trick: "Use clean estimations for scale bounds.", example: "Problem: 3,600,000 ÷ 9,000\n1. Cancel 3 zeros from both: 3,600 ÷ 9.\n2. 36 ÷ 9 = 4, append remaining zero: 400." }
    ]
  },
  "pre-algebra": {
    title: "Pre-Algebra Curriculum",
    units: [
      {
        unit: "1",
        title: "Integers, Absolute Value, and Rational Numbers",
        formula: "|x| = distance from zero",
        trick: "Absolute distance is always non-negative.",
        example: "Problem: Evaluate |-18| - |-7| + (-4)\n1. Evaluate absolute values: |-18| = 18 and |-7| = 7.\n2. Substitute: 18 - 7 + (-4).\n3. Simplify left-to-right: 11 - 4 = 7."
      },
      {
        unit: "2",
        title: "Operations with Fractions and Mixed Numbers",
        formula: "a/b + c/d",
        trick: "Find common denominators.",
        example: "Problem: Solve 2/3 + 3/4 - 1/2\n1. Least Common Denominator (LCD) for 3, 4, 2 is 12.\n2. Convert fractions: 8/12 + 9/12 - 6/12.\n3. Combine numerators: (8 + 9 - 6)/12 = 11/12."
      },
      {
        unit: "3",
        title: "Ratios, Rates, and Unit Rates",
        formula: "Rate = Quantity / Unit Time",
        trick: "Simplify denominator to 1.",
        example: "Problem: Car uses 12 gallons to travel 324 miles. Find unit rate.\n1. Set up rate fraction: 324 miles / 12 gallons.\n2. Divide: 324 ÷ 12 = 27 miles per gallon (mpg)."
      },
      {
        unit: "4",
        title: "Proportions and Scale Drawings",
        formula: "a/b = c/d",
        trick: "Cross-multiply to solve.",
        example: "Problem: Solve proportion x/8 = 15/20\n1. Cross-multiply: 20 · x = 8 · 15.\n2. Simplify right side: 20x = 120.\n3. Divide by 20: x = 6."
      },
      {
        unit: "5",
        title: "Percentages, Discounts, and Simple Interest",
        formula: "I = Prt",
        trick: "Convert percentages to decimals.",
        example: "Problem: Find simple interest on $1,200 principal at 5% annual rate for 3 years.\n1. Identify variables: P = 1200, r = 0.05, t = 3.\n2. Substitute into formula: I = 1200 × 0.05 × 3.\n3. Compute: 60 × 3 = $180 interest."
      },
      {
        unit: "6",
        title: "Algebraic Expressions and Combining Like Terms",
        formula: "ax + bx = (a + b)x",
        trick: "Group variable terms by degree.",
        example: "Problem: Simplify 4(2x - 3) + 5x - 7\n1. Distribute 4: 8x - 12 + 5x - 7.\n2. Group like terms: (8x + 5x) + (-12 - 7).\n3. Combine: 13x - 19."
      },
      {
        unit: "7",
        title: "Solving One-Step and Two-Step Equations",
        formula: "ax + b = c",
        trick: "Undo addition before multiplication.",
        example: "Problem: Solve 3x - 8 = 19\n1. Add 8 to both sides: 3x = 27.\n2. Divide both sides by 3: x = 9.\n3. Check: 3(9) - 8 = 27 - 8 = 19."
      },
      {
        unit: "8",
        title: "Solving Multi-Step Equations and Inequalities",
        formula: "ax + b < cx + d",
        trick: "Flip inequality sign on negative division.",
        example: "Problem: Solve -4x + 6 ≤ 22\n1. Subtract 6 from both sides: -4x ≤ 16.\n2. Divide by -4 and reverse inequality sign: x ≥ -4."
      },
      {
        unit: "9",
        title: "Introduction to Coordinate Plane and Graphing",
        formula: "Ordered pair (x, y)",
        trick: "Run (x) before you rise (y).",
        example: "Problem: Find distance between points A(2, 5) and B(2, -3)\n1. X-coordinates match (2 = 2), so distance is vertical span.\n2. Calculate difference in Y: |5 - (-3)| = |5 + 3| = 8 units."
      },
      {
        unit: "10",
        title: "Proportional Relationships and Slope",
        formula: "m = (y₂ - y₁) / (x₂ - x₁)",
        trick: "Proportional graphs pass through origin.",
        example: "Problem: Find slope of line passing through (1, 3) and (4, 12)\n1. Identify coordinates: x₁=1, y₁=3, x₂=4, y₂=12.\n2. Apply slope formula: m = (12 - 3) / (4 - 1).\n3. Simplify: m = 9 / 3 = 3."
      },
      {
        unit: "11",
        title: "Systems of Linear Equations (Introduction)",
        formula: "Intersection point (x, y)",
        trick: "Solution is where lines cross.",
        example: "Problem: Check if (3, 2) is solution to system: x + y = 5 and 2x - y = 4\n1. Equation 1: 3 + 2 = 5 (True).\n2. Equation 2: 2(3) - 2 = 6 - 2 = 4 (True).\n3. Conclusion: (3, 2) is the solution."
      },
      {
        unit: "12",
        title: "Exponents and Order of Operations",
        formula: "PEMDAS / Grouping",
        trick: "Exponents evaluated right after parentheses.",
        example: "Problem: Evaluate 5 + 2 × (3² - 1)\n1. Parentheses first, power inside: 3² = 9 ⇒ (9 - 1) = 8.\n2. Multiply: 2 × 8 = 16.\n3. Add: 5 + 16 = 21."
      },
      {
        unit: "13",
        title: "Laws of Exponents (Multiplication and Division)",
        formula: "x^a × x^b = x^(a+b)",
        trick: "Add exponents on multiplication.",
        example: "Problem: Simplify (x⁵ · x³) / x²\n1. Combine numerator: x^(5+3) = x⁸.\n2. Apply division rule (subtract exponents): x^(8-2) = x⁶."
      },
      {
        unit: "14",
        title: "Scientific Notation and Operations",
        formula: "a × 10^n",
        trick: "Adjust decimal placement.",
        example: "Problem: Multiply (2 × 10⁴) × (3.5 × 10³)\n1. Multiply coefficients: 2 × 3.5 = 7.\n2. Add exponents: 10^(4+3) = 10⁷.\n3. Final form: 7 × 10⁷ (or 70,000,000)."
      },
      {
        unit: "15",
        title: "Square Roots, Cube Roots, and Irrational Numbers",
        formula: "∛a = x",
        trick: "Memorize major powers.",
        example: "Problem: Evaluate √81 + ∛125\n1. Evaluate principal square root: √81 = 9.\n2. Evaluate cube root: ∛125 = 5 (since 5³ = 125).\n3. Add: 9 + 5 = 14."
      },
      {
        unit: "16",
        title: "Pythagorean Theorem and Distance Formula",
        formula: "a² + b² = c²",
        trick: "Hypotenuse is always opposite right angle.",
        example: "Problem: Right triangle has legs a = 6 cm and b = 8 cm. Find hypotenuse c.\n1. Substitute into formula: 6² + 8² = c².\n2. Calculate powers: 36 + 64 = 100.\n3. Take square root: c = √100 = 10 cm."
      },
      {
        unit: "17",
        title: "Rigid Transformations",
        formula: "Translation/Reflection",
        trick: "Preserves side lengths and angles.",
        example: "Problem: Translate point P(-3, 4) by rule (x + 5, y - 2)\n1. Adjust x-coordinate: -3 + 5 = 2.\n2. Adjust y-coordinate: 4 - 2 = 2.\n3. New point P' = (2, 2)."
      },
      {
        unit: "18",
        title: "Dilations and Geometric Similarity",
        formula: "Scale factor k",
        trick: "Multiply coordinates by factor k.",
        example: "Problem: Triangle vertex A(3, -6) dilated centered at origin by k = 1/3.\n1. Multiply x by 1/3: 3 × (1/3) = 1.\n2. Multiply y by 1/3: -6 × (1/3) = -2.\n3. Image point A' = (1, -2)."
      },
      {
        unit: "19",
        title: "Perimeter, Area, and Volume of 3D Solids",
        formula: "V = Base × Height",
        trick: "Identify base shape first.",
        example: "Problem: Find volume of rectangular prism with length 5 cm, width 4 cm, height 10 cm.\n1. Area of base B = length × width = 5 × 4 = 20 cm².\n2. Volume = B × h = 20 × 10 = 200 cm³."
      },
      {
        unit: "20",
        title: "Data Displays, Statistics, and Probability Basics",
        formula: "P = favorable / total",
        trick: "Sort dataset numerically first.",
        example: "Problem: Bag contains 4 red, 6 blue, and 5 green marbles. Find P(blue).\n1. Count total marbles: 4 + 6 + 5 = 15.\n2. Favorable blue marbles = 6.\n3. Probability = 6/15 = 2/5 (or 40%)."
      }
    ]
  },
  algebra: {
    title: "Algebra 1 Curriculum",
    units: [
      {
        unit: "1",
        title: "Foundations of Algebra and Real Number Properties",
        formula: "Field axioms",
        trick: "Use commutative/associative laws.",
        example: "Problem: Simplify 3(x + 4) - 2(2x - 1)\n1. Distribute 3: 3x + 12.\n2. Distribute -2: -4x + 2.\n3. Combine like terms: (3x - 4x) + (12 + 2) = -x + 14."
      },
      {
        unit: "2",
        title: "Expressions, Equations, and Inequalities",
        formula: "Equivalent transformations",
        trick: "Balance both sides equally.",
        example: "Problem: Solve 5x - 3 = 2x + 12\n1. Subtract 2x from both sides: 3x - 3 = 12.\n2. Add 3 to both sides: 3x = 15.\n3. Divide by 3: x = 5."
      },
      {
        unit: "3",
        title: "Multi-Step Linear Equations and Literal Equations",
        formula: "Isolate target variable",
        trick: "Treat other letters as constants.",
        example: "Problem: Solve formula for C: F = (9/5)C + 32\n1. Subtract 32 from both sides: F - 32 = (9/5)C.\n2. Multiply both sides by 5/9: C = (5/9)(F - 32)."
      },
      {
        unit: "4",
        title: "Linear Inequalities in One and Two Variables",
        formula: "Boundary shading",
        trick: "Dashed line for strict inequalities.",
        example: "Problem: Graph inequality y < 2x - 1\n1. Plot boundary line y = 2x - 1 as dashed line (strict <).\n2. Test origin (0, 0): 0 < 2(0) - 1 ⇒ 0 < -1 (False).\n3. Shade region below dashed line not containing (0,0)."
      },
      {
        unit: "5",
        title: "Introduction to Functions, Domain, and Range",
        formula: "Input x → Output f(x)",
        trick: "Domain is valid input bounds.",
        example: "Problem: Find domain of function f(x) = 5 / (x - 3)\n1. Set denominator equal to zero: x - 3 = 0 ⇒ x = 3.\n2. Division by zero undefined.\n3. Domain: All real numbers except x = 3."
      },
      {
        unit: "6",
        title: "Function Notation and Evaluating Functions",
        formula: "Substitute x into f(x)",
        trick: "Wrap inputs in parentheses.",
        example: "Problem: Given f(x) = 2x² - 3x + 1, evaluate f(-3)\n1. Substitute x = -3: f(-3) = 2(-3)² - 3(-3) + 1.\n2. Evaluate powers: 2(9) - 3(-3) + 1 = 18 + 9 + 1.\n3. Sum total: 28."
      },
      {
        unit: "7",
        title: "Rate of Change and Slope-Intercept Form",
        formula: "y = mx + b",
        trick: "m is slope, b is intercept.",
        example: "Problem: Find line equation with slope m = -2 passing through y-intercept (0, 7)\n1. Identify slope m = -2 and y-intercept b = 7.\n2. Substitute into slope-intercept form: y = -2x + 7."
      },
      {
        unit: "8",
        title: "Writing Linear Equations from Points and Graphs",
        formula: "y - y₁ = m(x - x₁)",
        trick: "Calculate slope first.",
        example: "Problem: Find line passing through A(2, 4) and B(6, 12)\n1. Calculate slope: m = (12 - 4) / (6 - 2) = 8/4 = 2.\n2. Use point-slope form with A(2, 4): y - 4 = 2(x - 2).\n3. Convert to slope-intercept: y - 4 = 2x - 4 ⇒ y = 2x."
      },
      {
        unit: "9",
        title: "Systems of Linear Equations (Graphing and Substitution)",
        formula: "Substitute expression",
        trick: "Isolate variable first.",
        example: "Problem: Solve system: y = 3x - 1 and 2x + y = 9\n1. Substitute y into second equation: 2x + (3x - 1) = 9.\n2. Combine like terms: 5x - 1 = 9 ⇒ 5x = 10 ⇒ x = 2.\n3. Find y: y = 3(2) - 1 = 5. Solution: (2, 5)."
      },
      {
        unit: "10",
        title: "Systems of Linear Equations (Elimination and Applications)",
        formula: "Add/subtract equations",
        trick: "Match coefficients to cancel.",
        example: "Problem: Solve system: 3x + 2y = 16 and 3x - 5y = -5\n1. Subtract bottom equation from top: (3x - 3x) + (2y - (-5y)) = 16 - (-5).\n2. Simplify: 7y = 21 ⇒ y = 3.\n3. Substitute y = 3 into eq 1: 3x + 2(3) = 16 ⇒ 3x = 10 ⇒ x = 10/3."
      },
      {
        unit: "11",
        title: "Introduction to Exponential Growth and Decay",
        formula: "y = a(1 ± r)^t",
        trick: "Multiplier > 1 is growth.",
        example: "Problem: $500 invested at 6% interest compounded annually for 4 years.\n1. Identify variables: a = 500, r = 0.06, t = 4.\n2. Set up model: y = 500(1 + 0.06)⁴ = 500(1.06)⁴.\n3. Evaluate: 500 × 1.26248 = $631.24."
      },
      {
        unit: "12",
        title: "Properties of Exponents in Algebraic Expressions",
        formula: "(x^a)^b = x^(ab)",
        trick: "Multiply power indices.",
        example: "Problem: Simplify (3x³y²)³\n1. Apply power to coefficient: 3³ = 27.\n2. Apply power rule to x: (x³)³ = x⁹.\n3. Apply power rule to y: (y²)³ = y⁶.\n4. Final answer: 27x⁹y⁶."
      },
      {
        unit: "13",
        title: "Introduction to Polynomials",
        formula: "Combine like degree terms",
        trick: "Distribute negative signs.",
        example: "Problem: Subtract (4x² - 2x + 5) - (x² + 3x - 7)\n1. Distribute negative sign: 4x² - 2x + 5 - x² - 3x + 7.\n2. Combine like terms: (4x² - x²) + (-2x - 3x) + (5 + 7).\n3. Result: 3x² - 5x + 12."
      },
      {
        unit: "14",
        title: "Factoring Quadratic Expressions (GCF and Grouping)",
        formula: "ab + ac = a(b + c)",
        trick: "Factor GCF out first.",
        example: "Problem: Factor completely 6x³ - 18x²\n1. Identify Greatest Common Factor (GCF): 6x².\n2. Divide each term by GCF: 6x³/6x² = x and -18x²/6x² = -3.\n3. Factored form: 6x²(x - 3)."
      },
      {
        unit: "15",
        title: "Factoring Quadratic Trinomials",
        formula: "ax² + bx + c",
        trick: "Find factors adding to b and multiplying to c.",
        example: "Problem: Factor x² - 7x + 12\n1. Find two numbers multiplying to +12 and adding to -7.\n2. Test factor pairs: (-3) × (-4) = +12, and (-3) + (-4) = -7.\n3. Factored form: (x - 3)(x - 4)."
      },
      {
        unit: "16",
        title: "Graphing Quadratic Functions",
        formula: "Vertex form: a(x-h)² + k",
        trick: "Vertex is at (h, k).",
        example: "Problem: Find vertex and axis of symmetry for y = 2(x - 4)² + 3\n1. Compare to vertex form y = a(x - h)² + k.\n2. Identify h = 4 and k = 3.\n3. Vertex is (4, 3), Axis of Symmetry is line x = 4."
      },
      {
        unit: "17",
        title: "Solving Quadratic Equations by Factoring and Square Roots",
        formula: "Zero Product Property",
        trick: "Set factors equal to zero.",
        example: "Problem: Solve x² - 9x + 20 = 0\n1. Factor trinomial: (x - 4)(x - 5) = 0.\n2. Apply Zero Product Property: x - 4 = 0 or x - 5 = 0.\n3. Solutions: x = 4 or x = 5."
      },
      {
        unit: "18",
        title: "Solving Quadratics by Completing the Square and Formula",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        trick: "Check discriminant first.",
        example: "Problem: Solve x² - 6x + 5 = 0 using Quadratic Formula\n1. Identify coefficients: a = 1, b = -6, c = 5.\n2. Plug into formula: x = [ -(-6) ± √((-6)² - 4(1)(5)) ] / (2·1).\n3. Simplify: x = [ 6 ± √(36 - 20) ] / 2 = [ 6 ± √16 ] / 2 = (6 ± 4) / 2.\n4. Roots: x = 10/2 = 5, and x = 2/2 = 1."
      },
      {
        unit: "19",
        title: "Radical Expressions and Simplifying Square Roots",
        formula: "√(ab) = √a × √b",
        trick: "Extract perfect squares.",
        example: "Problem: Simplify 3√72\n1. Find largest perfect square in 72: 36 × 2.\n2. Rewrite: 3 · √(36 × 2) = 3 · √36 · √2.\n3. Simplify: 3 · 6 · √2 = 18√2."
      },
      {
        unit: "20",
        title: "One-Variable and Two-Variable Statistics",
        formula: "Line of best fit",
        trick: "Check correlation trends.",
        example: "Problem: Data points yield linear regression equation y = 1.5x + 10. Predict y when x = 8.\n1. Substitute x = 8 into equation.\n2. Compute: y = 1.5(8) + 10 = 12 + 10 = 22."
      }
    ]
  },
  geometry: {
    title: "Geometry Curriculum",
    units: [
      {
        unit: "1",
        title: "Tools of Geometry (Points, Lines, Planes, and Segments)",
        formula: "Segment Addition Postulate",
        trick: "Label diagrams clearly.",
        example: "Problem: Point B lies between A and C on a line segment. AB = 2x + 1, BC = 3x - 4, and AC = 22. Find x.\n1. Apply Segment Addition: AB + BC = AC.\n2. Set up equation: (2x + 1) + (3x - 4) = 22.\n3. Combine terms: 5x - 3 = 22 ⇒ 5x = 25 ⇒ x = 5."
      },
      {
        unit: "2",
        title: "Angles, Angle Bisectors, and Perpendicular Lines",
        formula: "Complementary = 90°",
        trick: "Vertical angles are congruent.",
        example: "Problem: Two angles are complementary. One angle is 3x + 12 and the other is 2x - 2. Find x.\n1. Complementary angles sum to 90°: (3x + 12) + (2x - 2) = 90.\n2. Combine like terms: 5x + 10 = 90.\n3. Solve: 5x = 80 ⇒ x = 16."
      },
      {
        unit: "3",
        title: "Logic, Conditional Statements, and Deductive Reasoning",
        formula: "If p, then q",
        trick: "Contrapositives are equivalent.",
        example: "Problem: Write contrapositive of statement: 'If x = 4, then x² = 16.'\n1. Identify p: x = 4, and q: x² = 16.\n2. Contrapositive form is: 'If not q, then not p.'\n3. Result: 'If x² ≠ 16, then x ≠ 4.'"
      },
      {
        unit: "4",
        title: "Rigid Transformations in the Coordinate Plane",
        formula: "Preserves distance/angle",
        trick: "Reflections across y = x swap coordinates.",
        example: "Problem: Reflect point A(-4, 3) across line y = x, then translate by vector <2, -5>.\n1. Reflection across y=x swaps coordinates: A' = (3, -4).\n2. Apply translation <2, -5>: A'' = (3 + 2, -4 - 5) = (5, -9)."
      },
      {
        unit: "5",
        title: "Triangle Classification and Interior/Exterior Angle Theorems",
        formula: "Interior sum = 180°",
        trick: "Exterior angle equals remote sum.",
        example: "Problem: Triangle has interior angles 40° and 65°. Find third angle and measure of its adjacent exterior angle.\n1. Interior sum theorem: 40° + 65° + x = 180° ⇒ 105° + x = 180° ⇒ x = 75°.\n2. Exterior angle = remote interior sum = 40° + 65° = 105°."
      },
      {
        unit: "6",
        title: "Triangle Congruence (SSS, SAS, ASA, AAS, HL)",
        formula: "SSS, SAS, ASA, AAS, HL",
        trick: "AAA and SSA do not prove congruence.",
        example: "Problem: Triangle ABC has AB=5, BC=7, ∠B=50°. Triangle DEF has DE=5, EF=7, ∠E=50°. Prove congruence.\n1. AB ≅ DE (Side 5).\n2. ∠B ≅ ∠E (Included Angle 50°).\n3. BC ≅ EF (Side 7).\n4. Conclusion: ΔABC ≅ ΔDEF by SAS theorem."
      },
      {
        unit: "7",
        title: "Proofs with Congruent Triangles",
        formula: "CPCTC justification",
        trick: "Prove triangles congruent first.",
        example: "Problem: Given ΔABC ≅ ΔXYZ where ∠A = 4x + 10 and ∠X = 70°. Find x.\n1. By CPCTC, corresponding angles are equal: ∠A = ∠X.\n2. Set up equation: 4x + 10 = 70.\n3. Solve: 4x = 60 ⇒ x = 15."
      },
      {
        unit: "8",
        title: "Relationships in Triangles (Midsegments, Medians, and Altitudes)",
        formula: "Midsegment = ½(Parallel Side)",
        trick: "Centroid divides medians 2:1.",
        example: "Problem: Segment DE is midsegment of ΔABC parallel to base BC. If DE = 4x - 2 and BC = 6x + 8, find DE.\n1. Midsegment theorem: 2(DE) = BC.\n2. Set up equation: 2(4x - 2) = 6x + 8 ⇒ 8x - 4 = 6x + 8.\n3. Solve for x: 2x = 12 ⇒ x = 6.\n4. Calculate DE: 4(6) - 2 = 22."
      },
      {
        unit: "9",
        title: "Properties of Polygons and Quadrilaterals",
        formula: "Interior sum = (n - 2)180°",
        trick: "Pentagon sum = 540°.",
        example: "Problem: Find interior angle sum and each angle measure of a regular octagon (n = 8).\n1. Sum formula: (8 - 2) × 180° = 6 × 180° = 1,080°.\n2. Regular polygon, divide by n: 1,080° / 8 = 135° per angle."
      },
      {
        unit: "10",
        title: "Similarity Ratios, Proportions, and Dilations",
        formula: "Ratio k",
        trick: "Area scales by k².",
        example: "Problem: Two similar triangles have scale factor ratio of 3:5. If area of smaller triangle is 36 cm², find area of larger triangle.\n1. Area ratio is square of scale factor: (3/5)² = 9/25.\n2. Set up proportion: 9/25 = 36 / A_large.\n3. Cross-multiply: 9 · A_large = 25 · 36 = 900 ⇒ A_large = 100 cm²."
      },
      {
        unit: "11",
        title: "Proving Triangles Similar (AA, SSS, SAS)",
        formula: "AA, SSS, SAS similarity",
        trick: "Angle-Angle (AA) is most common.",
        example: "Problem: Triangle 1 has angles 50° and 70°. Triangle 2 has angles 70° and 60°. Are they similar?\n1. Find 3rd angle of Triangle 1: 180° - (50° + 70°) = 60°.\n2. Triangle 1 angles: 50°, 60°, 70°.\n3. Triangle 2 angles: 50°, 60°, 70°.\n4. Triangles are similar by AA (or AAA) similarity."
      },
      {
        unit: "12",
        title: "Right Triangles and the Pythagorean Theorem",
        formula: "a² + b² = c²",
        trick: "Identify legs and hypotenuse.",
        example: "Problem: A 13-foot ladder leans against a vertical wall. Base of ladder is 5 feet from wall. How high up wall does ladder reach?\n1. Identify hypotenuse c = 13 and leg a = 5.\n2. Pythagorean theorem: 5² + h² = 13².\n3. Compute: 25 + h² = 169 ⇒ h² = 144 ⇒ h = 12 feet."
      },
      {
        unit: "13",
        title: "Special Right Triangles (45°-45°-90° and 30°-60°-90°)",
        formula: "45-45-90 and 30-60-90",
        trick: "Hypotenuse is 2x in 30-60-90.",
        example: "Problem: A 30-60-90 triangle has shorter leg opposite 30° equal to 5 cm. Find longer leg and hypotenuse.\n1. Shorter leg x = 5.\n2. Hypotenuse = 2x = 2(5) = 10 cm.\n3. Longer leg opposite 60° = x√3 = 5√3 cm."
      },
      {
        unit: "14",
        title: "Introduction to Trigonometric Ratios (Sine, Cosine, Tangent)",
        formula: "SOH - CAH - TOA",
        trick: "Sine = Opp / Hyp.",
        example: "Problem: Right triangle has angle θ with Opposite side = 8 and Adjacent side = 6. Find tan(θ) and sin(θ).\n1. Find hypotenuse: c = √(8² + 6²) = √(64 + 36) = √100 = 10.\n2. tan(θ) = Opp / Adj = 8/6 = 4/3.\n3. sin(θ) = Opp / Hyp = 8/10 = 4/5."
      },
      {
        unit: "15",
        title: "Circles (Radii, Chords, Arcs, and Central/Inscribed Angles)",
        formula: "Central angle = arc",
        trick: "Perpendicular radius bisects chord.",
        example: "Problem: Circle centered at O has central angle ∠AOB = 80°. Find measure of intercepted arc AB and inscribed angle ∠ACB intercepting same arc.\n1. Central angle = Intercepted Arc: Arc AB = 80°.\n2. Inscribed angle theorem: ∠ACB = (1/2) · Arc AB = 80° / 2 = 40°."
      },
      {
        unit: "16",
        title: "Tangents, Secants, and Angle Relationships in Circles",
        formula: "Inscribed angle = ½(arc)",
        trick: "Tangent meets radius at 90°.",
        example: "Problem: Two secants intersect outside circle forming angle θ. Intercepted arcs are 110° and 30°. Find angle θ.\n1. Exterior secant angle formula: θ = (1/2)(Far Arc - Near Arc).\n2. Substitute arc values: θ = (1/2)(110° - 30°).\n3. Compute: (1/2)(80°) = 40°."
      },
      {
        unit: "17",
        title: "Equation of a Circle and Coordinate Geometry Proofs",
        formula: "(x - h)² + (y - k)² = r²",
        trick: "Center is (h, k), radius is r.",
        example: "Problem: Find center and radius of circle given by equation (x + 3)² + (y - 5)² = 49\n1. Compare to standard form (x - h)² + (y - k)² = r².\n2. Center (h, k) = (-3, 5).\n3. Radius r = √49 = 7 units."
      },
      {
        unit: "18",
        title: "Area of Polygons and Circles",
        formula: "A = πr²",
        trick: "Apothem helps regular polygons.",
        example: "Problem: Find area of a circle sector with radius r = 6 cm and central angle θ = 60°.\n1. Sector area formula: A = (θ / 360°) · πr².\n2. Substitute values: A = (60 / 360) · π(6²).\n3. Simplify: (1/6) · 36π = 6π cm² (≈ 18.85 cm²)."
      },
      {
        unit: "19",
        title: "Three-Dimensional Solids (Surface Area of Prisms, Pyramids, Cones, Cylinders, Spheres)",
        formula: "SA = Lateral Area + 2(Base)",
        trick: "Sum individual face areas.",
        example: "Problem: Find surface area of right cylinder with radius r = 3 cm and height h = 7 cm.\n1. Surface area formula: SA = 2πr² + 2πrh.\n2. Base area part: 2π(3²) = 18π.\n3. Lateral area part: 2π(3)(7) = 42π.\n4. Total surface area: 18π + 42π = 60π cm² (≈ 188.5 cm²)."
      },
      {
        unit: "20",
        title: "Volume Formulas and Applications of 3D Figures",
        formula: "V = Base Area × Height",
        trick: "Cones/pyramids use ⅓ factor.",
        example: "Problem: Find volume of a cone with radius r = 4 cm and height h = 9 cm.\n1. Cone volume formula: V = (1/3)πr²h.\n2. Substitute values: V = (1/3) · π · (4²) · 9.\n3. Compute: (1/3) · π · 16 · 9 = 48π cm³ (≈ 150.8 cm³)."
      }
    ]
  },
  algebra2: {
    title: "Algebra II Curriculum",
    units: [
      {
        unit: "1",
        title: "Equations and Inequalities Review (Absolute value and compound inequalities)",
        formula: "Absolute value cases",
        trick: "Split into two linear equations.",
        example: "Problem: Solve |2x - 5| = 9\n1. Case 1: 2x - 5 = 9 ⇒ 2x = 14 ⇒ x = 7.\n2. Case 2: 2x - 5 = -9 ⇒ 2x = -4 ⇒ x = -2.\n3. Solutions: x = 7 or x = -2."
      },
      {
        unit: "2",
        title: "Linear Relations and Functions",
        formula: "Inverse functions f⁻¹(x)",
        trick: "Swap x and y variables.",
        example: "Problem: Find inverse function f⁻¹(x) for f(x) = (3x + 2) / 5\n1. Replace f(x) with y: y = (3x + 2) / 5.\n2. Swap x and y: x = (3y + 2) / 5.\n3. Solve for y: 5x = 3y + 2 ⇒ 3y = 5x - 2 ⇒ y = (5x - 2) / 3.\n4. Inverse: f⁻¹(x) = (5x - 2) / 3."
      },
      {
        unit: "3",
        title: "Systems of Linear Equations and Inequalities in Three Variables",
        formula: "Triple elimination",
        trick: "Eliminate same variable twice.",
        example: "Problem: Solve system: x + y + z = 6, 2y + z = 7, and z = 3\n1. Substitute z = 3 into eq 2: 2y + 3 = 7 ⇒ 2y = 4 ⇒ y = 2.\n2. Substitute y = 2 and z = 3 into eq 1: x + 2 + 3 = 6 ⇒ x + 5 = 6 ⇒ x = 1.\n3. Solution triplet: (1, 2, 3)."
      },
      {
        unit: "4",
        title: "Matrices and Matrix Multiplication",
        formula: "Row × column dot product",
        trick: "Check inner dimensions.",
        example: "Problem: Multiply Matrix A [2 3] (1x2) by Matrix B [[4], [5]] (2x1)\n1. Outer dimensions yield 1x1 result matrix.\n2. Compute dot product: (2 · 4) + (3 · 5).\n3. Result: 8 + 15 = [23]."
      },
      {
        unit: "5",
        title: "Determinants and Cramer's Rule",
        formula: "det(A) = ad - bc",
        trick: "Use determinants to solve systems.",
        example: "Problem: Find determinant of Matrix A = [[5, 2], [3, 4]]\n1. Identify elements: a=5, b=2, c=3, d=4.\n2. Apply formula det(A) = ad - bc = (5·4) - (2·3).\n3. Compute: 20 - 6 = 14."
      },
      {
        unit: "6",
        title: "Quadratic Functions and Complex Numbers (i)",
        formula: "i² = -1",
        trick: "Powers of i cycle every 4.",
        example: "Problem: Multiply complex numbers (3 + 2i)(4 - 5i)\n1. FOIL expansion: 3(4) + 3(-5i) + 2i(4) + 2i(-5i).\n2. Simplify terms: 12 - 15i + 8i - 10i².\n3. Replace i² with -1: 12 - 7i - 10(-1) = 12 - 7i + 10 = 22 - 7i."
      },
      {
        unit: "7",
        title: "Polynomial Functions and Higher-Degree Graphs",
        formula: "End behavior analysis",
        trick: "Check degree parity and sign.",
        example: "Problem: Determine end behavior for f(x) = -2x⁴ + 5x³ - 1\n1. Degree is 4 (Even), leading coefficient is -2 (Negative).\n2. Even degree implies both ends point same direction.\n3. Negative coefficient means both ends point down.\n4. As x → ∞, f(x) → -∞; as x → -∞, f(x) → -∞."
      },
      {
        unit: "8",
        title: "Polynomial Operations and Division (Synthetic and Long Division)",
        formula: "Synthetic & Long Division",
        trick: "Use synthetic division for linear divisors.",
        example: "Problem: Divide (2x³ - 5x² + 3x + 7) by (x - 2) using synthetic division\n1. Root divisor c = 2. Coefficients: [2, -5, 3, 7].\n2. Synthetic steps: Bring down 2. Multiply 2·2 = 4, add -5+4 = -1. Multiply -1·2 = -2, add 3+(-2) = 1. Multiply 1·2 = 2, add 7+2 = 9.\n3. Quotient: 2x² - x + 1 with Remainder 9."
      },
      {
        unit: "9",
        title: "Rational Exponents and Radical Functions",
        formula: "x^(a/b) = ⭠(b)(x^a)",
        trick: "Apply root first, then power.",
        example: "Problem: Evaluate 27^(2/3)\n1. Rewrite with radical form: (∛27)².\n2. Evaluate cube root first: ∛27 = 3.\n3. Square the result: 3² = 9."
      },
      {
        unit: "10",
        title: "Exponential Functions and Equations",
        formula: "y = ab^x",
        trick: "Isolate exponential term.",
        example: "Problem: Solve 4^(2x - 1) = 64\n1. Express 64 with base 4: 64 = 4³.\n2. Equate exponents: 2x - 1 = 3.\n3. Solve for x: 2x = 4 ⇒ x = 2."
      },
      {
        unit: "11",
        title: "Logarithmic Functions and Properties of Logarithms",
        formula: "log_b(xy) = log_b(x) + log_b(y)",
        trick: "Convert log forms to exponents.",
        example: "Problem: Expand expression log₂(8x⁵ / y³)\n1. Apply quotient rule: log₂(8x⁵) - log₂(y³).\n2. Apply product rule: log₂(8) + log₂(x⁵) - log₂(y³).\n3. Apply power rule and evaluate log₂(8)=3: 3 + 5 log₂(x) - 3 log₂(y)."
      },
      {
        unit: "12",
        title: "Exponential and Logarithmic Equations",
        formula: "One-to-one property",
        trick: "Match log arguments.",
        example: "Problem: Solve log₃(x + 4) = 2\n1. Convert to exponential form: 3² = x + 4.\n2. Simplify: 9 = x + 4.\n3. Solve: x = 5. Check validity: log₃(9) = 2 (Valid)."
      },
      {
        unit: "13",
        title: "Rational Expressions and Complex Fractions",
        formula: "Factor numerators/denominators",
        trick: "Cancel common factors.",
        example: "Problem: Simplify (x² - 16) / (x² + 2x - 24)\n1. Factor numerator (difference of squares): (x - 4)(x + 4).\n2. Factor denominator: (x + 6)(x - 4).\n3. Cancel common factor (x - 4): (x + 4) / (x + 6)."
      },
      {
        unit: "14",
        title: "Solving Rational Equations and Applications",
        formula: "LCD multiplication",
        trick: "Multiply through by LCD.",
        example: "Problem: Solve (2 / x) + (1 / 3) = 5 / 6\n1. Identify LCD for x, 3, 6: 6x.\n2. Multiply entire equation by 6x: 6x(2/x) + 6x(1/3) = 6x(5/6).\n3. Simplify: 12 + 2x = 5x ⇒ 3x = 12 ⇒ x = 4."
      },
      {
        unit: "15",
        title: "Quadratic Relations and Conic Sections (Circles, Parabolas, Ellipses, Hyperbolas)",
        formula: "Standard conic forms",
        trick: "Distinguish ellipses (+) from hyperbolas (-).",
        example: "Problem: Find foci of ellipse given by x²/25 + y²/9 = 1\n1. Identify a² = 25 (major axis) and b² = 9 (minor axis).\n2. Focus distance formula for ellipse: c² = a² - b².\n3. Compute: c² = 25 - 9 = 16 ⇒ c = 4.\n4. Foci located on major x-axis at (-4, 0) and (4, 0)."
      },
      {
        unit: "16",
        title: "Sequences and Series (Arithmetic and Geometric)",
        formula: "S_n = n/2 (a₁ + a_n)",
        trick: "Identify common ratio r.",
        example: "Problem: Find sum of first 10 terms of arithmetic sequence with a₁ = 3 and common difference d = 4.\n1. Find 10th term a₁₀: a₁₀ = a₁ + 9d = 3 + 9(4) = 3 + 36 = 39.\n2. Apply sum formula: S₁₀ = (10 / 2) · (3 + 39).\n3. Compute: 5 · 42 = 210."
      },
      {
        unit: "17",
        title: "Probability, Permutations, and Combinations",
        formula: "nCr = n! / (r!(n - r)!)",
        trick: "Permutations care about order.",
        example: "Problem: A committee of 3 students is chosen from a group of 8. How many different combinations are possible?\n1. Order does not matter, use Combination formula ₈C₃.\n2. Compute: ₈C₃ = (8 · 7 · 6) / (3 · 2 · 1).\n3. Simplify: 336 / 6 = 56 combinations."
      },
      {
        unit: "18",
        title: "Statistics and Normal Distributions",
        formula: "z = (x - μ) / σ",
        trick: "Convert scores to z-scores.",
        example: "Problem: Test scores are normally distributed with mean μ = 75 and standard deviation σ = 5. Find z-score for student scoring 85.\n1. Apply z-score formula: z = (85 - 75) / 5.\n2. Compute: z = 10 / 5 = +2.0 (Score is 2 standard deviations above mean)."
      },
      {
        unit: "19",
        title: "Trigonometric Functions and the Unit Circle",
        formula: "cos(θ) = x, sin(θ) = y",
        trick: "Use ASTC quadrant rules.",
        example: "Problem: Find exact value of sin(210°) and cos(210°)\n1. 210° is in Quadrant III with reference angle 210° - 180° = 30°.\n2. In QIII, both sine and cosine are negative.\n3. sin(210°) = -sin(30°) = -1/2.\n4. cos(210°) = -cos(30°) = -√3/2."
      },
      {
        unit: "20",
        title: "Graphing Sine, Cosine, and Tangent Functions",
        formula: "y = a sin(bx - c) + d",
        trick: "Period = 2π/b.",
        example: "Problem: Find amplitude, period, and phase shift for function y = 4 sin(2x - π)\n1. Amplitude = |a| = 4.\n2. Period = 2π / b = 2π / 2 = π.\n3. Phase shift = c / b = π / 2 units to the right."
      }
    ]
  },
  precalc: {
    title: "Pre-Calculus Curriculum",
    units: [
      {
        unit: "1",
        title: "Advanced Functions and Domain/Range Analysis",
        formula: "Function symmetry",
        trick: "Test even f(-x)=f(x) and odd f(-x)=-f(x).",
        example: "Problem: Determine if f(x) = x⁴ - 3x² is even, odd, or neither.\n1. Test f(-x): f(-x) = (-x)⁴ - 3(-x)².\n2. Simplify: f(-x) = x⁴ - 3x².\n3. Since f(-x) = f(x), function is Even (symmetric across y-axis)."
      },
      {
        unit: "2",
        title: "Transformations of Functions and Piecewise Functions",
        formula: "f(x - h) + k",
        trick: "Inside horizontal shifts move opposite sign.",
        example: "Problem: Evaluate piecewise function f(x) = { 2x + 1 if x < 2; x² - 3 if x ≥ 2 } at x = 2 and x = 0\n1. For x = 2, use second piece (x ≥ 2): f(2) = (2)² - 3 = 4 - 3 = 1.\n2. For x = 0, use first piece (x < 2): f(0) = 2(0) + 1 = 1."
      },
      {
        unit: "3",
        title: "Polynomial and Rational Functions (Asymptotes and End Behavior)",
        formula: "Asymptote analysis",
        trick: "Compare polynomial degrees.",
        example: "Problem: Find horizontal and vertical asymptotes for f(x) = (3x² - 6) / (x² - 4)\n1. Vertical asymptote: Set denominator = 0 ⇒ x² - 4 = 0 ⇒ x = 2 and x = -2.\n2. Horizontal asymptote: Numerator and denominator degrees match (degree 2).\n3. Ratio of leading coefficients: y = 3/1 = 3."
      },
      {
        unit: "4",
        title: "Exponential and Logarithmic Modeling",
        formula: "Pe^(rt) growth",
        trick: "Use natural logs for continuous growth.",
        example: "Problem: Bacteria population grows continuously at rate r = 0.05 per hour. How long to double initial population P₀?\n1. Set up equation: 2P₀ = P₀ · e^(0.05t).\n2. Divide by P₀: 2 = e^(0.05t).\n3. Take natural log: ln(2) = 0.05t ⇒ t = ln(2) / 0.05 ≈ 0.693 / 0.05 ≈ 13.86 hours."
      },
      {
        unit: "5",
        title: "Right Triangle Trigonometry and Radian Measure",
        formula: "s = rθ",
        trick: "Multiply degrees by π/180°.",
        example: "Problem: Convert 135° to radians and find arc length on circle of radius r = 8 cm.\n1. Convert to radians: 135° · (π / 180°) = 3π/4 radians.\n2. Arc length formula: s = rθ = 8 · (3π/4) = 6π cm (≈ 18.85 cm)."
      },
      {
        unit: "6",
        title: "The Unit Circle and Trigonometric Values",
        formula: "Special reference angles",
        trick: "Memorize quadrant coordinate signs.",
        example: "Problem: Find exact value of sec(5π/3)\n1. Identify cosine on unit circle: cos(5π/3) = 1/2.\n2. Secant is reciprocal of cosine: sec(5π/3) = 1 / cos(5π/3).\n3. Compute: 1 / (1/2) = 2."
      },
      {
        unit: "7",
        title: "Graphing Trigonometric Functions and Transformations",
        formula: "Amplitude & Frequency",
        trick: "Amplitude is peak height.",
        example: "Problem: Find max and min values of y = -3 cos(4x) + 2\n1. Cosine ranges between -1 and +1.\n2. Maximum y occurs when cos(4x) = -1: -3(-1) + 2 = 3 + 2 = 5.\n3. Minimum y occurs when cos(4x) = 1: -3(1) + 2 = -1.\n4. Range: [-1, 5]."
      },
      {
        unit: "8",
        title: "Inverse Trigonometric Functions",
        formula: "arcsin restricted range",
        trick: "Inverse sine output restricted to [-π/2, π/2].",
        example: "Problem: Evaluate exact value of arcsin(-√3/2)\n1. Inverse sine domain restricted to [-π/2, π/2] (Quadrants I and IV).\n2. Angle whose sine is -√3/2 in QIV is -π/3 (or -60°).\n3. Result: -π/3."
      },
      {
        unit: "9",
        title: "Trigonometric Identities and Verifications",
        formula: "sin²(θ) + cos²(θ) = 1",
        trick: "Convert everything to sine and cosine.",
        example: "Problem: Simplify expression: tan(x) · cos(x) + csc(x) · sin²(x)\n1. Convert tan and csc: [sin(x)/cos(x)] · cos(x) + [1/sin(x)] · sin²(x).\n2. Cancel terms: sin(x) + sin(x).\n3. Simplify: 2 sin(x)."
      },
      {
        unit: "10",
        title: "Sum, Difference, Double-Angle, and Half-Angle Formulas",
        formula: "sin(2θ) = 2sin(θ)cos(θ)",
        trick: "Use double-angle formulas.",
        example: "Problem: Given sin(θ) = 3/5 in Quadrant I, find sin(2θ)\n1. Find cos(θ) using Pythagorean identity: cos(θ) = 4/5.\n2. Apply double-angle formula: sin(2θ) = 2 sin(θ) cos(θ).\n3. Compute: 2 · (3/5) · (4/5) = 24/25."
      },
      {
        unit: "11",
        title: "Solving Trigonometric Equations",
        formula: "General solutions in [0, 2π)",
        trick: "Find all reference angle solutions.",
        example: "Problem: Solve 2 sin(x) + 1 = 0 on interval [0, 2π)\n1. Isolate sine: 2 sin(x) = -1 ⇒ sin(x) = -1/2.\n2. Reference angle is π/6. Sine is negative in Quadrants III and IV.\n3. Solutions: x = π + π/6 = 7π/6, and x = 2π - π/6 = 11π/6."
      },
      {
        unit: "12",
        title: "Law of Sines and Law of Cosines",
        formula: "a / sin(A) = b / sin(B)",
        trick: "Watch for ambiguous SSA triangle cases.",
        example: "Problem: Triangle ABC has side a = 7, b = 10, and included angle C = 60°. Find side c.\n1. Apply Law of Cosines: c² = a² + b² - 2ab cos(C).\n2. Substitute values: c² = 7² + 10² - 2(7)(10) cos(60°).\n3. Evaluate: c² = 49 + 100 - 140(0.5) = 149 - 70 = 79.\n4. Solve: c = √79 ≈ 8.89."
      },
      {
        unit: "13",
        title: "Vectors in Two Dimensions and Applications",
        formula: "||v|| = √(x² + y²)",
        trick: "Add corresponding vector components.",
        example: "Problem: Given vector u = <3, -4> and v = <1, 6>. Find magnitude of vector sum u + v.\n1. Add components: u + v = <3+1, -4+6> = <4, 2>.\n2. Compute magnitude: ||u + v|| = √(4² + 2²) = √(16 + 4) = √20 = 2√5."
      },
      {
        unit: "14",
        title: "Systems of Nonlinear Equations and Inequalities",
        formula: "Substitution graphs",
        trick: "Graph curves to find intersection points.",
        example: "Problem: Solve system: x² + y² = 25 and y = x + 1\n1. Substitute y into circle equation: x² + (x + 1)² = 25.\n2. Expand: x² + x² + 2x + 1 = 25 ⇒ 2x² + 2x - 24 = 0.\n3. Divide by 2: x² + x - 12 = 0 ⇒ (x + 4)(x - 3) = 0.\n4. Roots: x = 3 (y = 4) and x = -4 (y = -3). Points: (3, 4) and (-4, -3)."
      },
      {
        unit: "15",
        title: "Matrices, Inverses, and Matrix Transformations",
        formula: "A × A⁻¹ = I",
        trick: "Check if determinant is non-zero.",
        example: "Problem: Find inverse of 2x2 matrix A = [[4, 7], [1, 2]]\n1. Calculate det(A) = (4·2) - (7·1) = 8 - 7 = 1.\n2. Apply inverse formula: A⁻¹ = (1/det) · [[d, -b], [-c, a]].\n3. Swap main diagonal, negate off-diagonal: A⁻¹ = [[2, -7], [-1, 4]]."
      },
      {
        unit: "16",
        title: "Parametric Equations and Graphing",
        formula: "dy/dx = (dy/dt) / (dx/dt)",
        trick: "Eliminate parameter t.",
        example: "Problem: Eliminate parameter t for parametric equations x = 2t + 1 and y = t²\n1. Isolate t in x equation: t = (x - 1) / 2.\n2. Substitute into y equation: y = [ (x - 1) / 2 ]².\n3. Simplify Cartesian form: y = (1/4)(x - 1)²."
      },
      {
        unit: "17",
        title: "Polar Coordinates and Polar Graphs",
        formula: "r² = x² + y²",
        trick: "Polar curves include roses and cardioids.",
        example: "Problem: Convert polar coordinate (r, θ) = (4, 2π/3) to Cartesian coordinates (x, y)\n1. Apply conversion formulas: x = r cos(θ) and y = r sin(θ).\n2. x = 4 cos(2π/3) = 4 · (-1/2) = -2.\n3. y = 4 sin(2π/3) = 4 · (√3/2) = 2√3.\n4. Rectangular point: (-2, 2√3)."
      },
      {
        unit: "18",
        title: "Sequences, Series, and Mathematical Induction",
        formula: "Proof by induction",
        trick: "Verify base case n=1 first.",
        example: "Problem: Evaluate sum of infinite geometric series 12 + 6 + 3 + 1.5 + ...\n1. Identify first term a₁ = 12 and common ratio r = 6/12 = 1/2.\n2. Check convergence condition: |r| = 1/2 < 1 (Series converges).\n3. Apply sum formula: S_inf = a₁ / (1 - r) = 12 / (1 - 1/2) = 12 / (0.5) = 24."
      },
      {
        unit: "19",
        title: "Introduction to Limits and Continuity",
        formula: "lim (x → c) f(x) = L",
        trick: "Check direct substitution first.",
        example: "Problem: Evaluate limit: lim (x → 4) (x² - 16) / (x - 4)\n1. Direct substitution yields 0/0 (Indeterminate form).\n2. Factor numerator: (x - 4)(x + 4) / (x - 4).\n3. Cancel (x - 4): lim (x → 4) (x + 4).\n4. Substitute x = 4: 4 + 4 = 8."
      },
      {
        unit: "20",
        title: "Introduction to Derivatives (Slope of a curve preview)",
        formula: "Limit difference quotient",
        trick: "Derivatives measure instantaneous rates.",
        example: "Problem: Find derivative of f(x) = 3x² - 5x + 2 using power rule\n1. Apply power rule term-by-term: d/dx[3x²] = 3 · 2x = 6x.\n2. Derivative of -5x is -5; derivative of constant 2 is 0.\n3. Derivative function f'(x) = 6x - 5."
      }
    ]
  },
  statistics: {
    title: "Statistics / AP Statistics Curriculum",
    units: [
      {
        unit: "1",
        title: "Categorical Data and Displaying Distributions (Bar charts, pie charts)",
        formula: "Relative frequency charts",
        trick: "Use relative frequencies for unequal sizes.",
        example: "Problem: In a class of 40 students, 18 prefer Math, 14 prefer Science, and 8 prefer English. Calculate relative frequency of Math students.\n1. Relative frequency = count / total.\n2. Compute: 18 / 40 = 0.45.\n3. Convert to percentage: 45%."
      },
      {
        unit: "2",
        title: "Quantitative Data: Dot Plots, Stemplots, and Histograms",
        formula: "Shape, Center, Spread",
        trick: "Describe skewness before stats.",
        example: "Problem: Dataset of test scores: 60, 65, 70, 90, 95. Calculate Range and Interquartile Range (IQR).\n1. Range = Max - Min = 95 - 60 = 35.\n2. Median (Q2) = 70. Q1 = 62.5, Q3 = 92.5.\n3. IQR = Q3 - Q1 = 92.5 - 62.5 = 30."
      },
      {
        unit: "3",
        title: "Measuring Center (Mean, Median, Mode) and Spread (Variance, Standard Deviation)",
        formula: "Mean vs Median",
        trick: "Use median/IQR for skewed data.",
        example: "Problem: Compute mean for dataset: 4, 8, 12, 16, 20.\n1. Sum all values: 4 + 8 + 12 + 16 + 20 = 60.\n2. Count n = 5.\n3. Mean x̄ = 60 / 5 = 12."
      },
      {
        unit: "4",
        title: "Normal Distributions and the Empirical Rule (68-95-99.7)",
        formula: "68 - 95 - 99.7 rule",
        trick: "68% within 1 SD of mean.",
        example: "Problem: Exam scores are normal with mean μ = 70 and SD σ = 10. What percentage of students score between 50 and 90?\n1. 50 is 2 SDs below mean (70 - 2·10).\n2. 90 is 2 SDs above mean (70 + 2·10).\n3. By Empirical Rule, 95% of scores fall within ±2 SDs."
      },
      {
        unit: "5",
        title: "Scatterplots and Correlation Coefficients (r)",
        formula: "-1 ≤ r ≤ 1",
        trick: "Correlation does not equal causation.",
        example: "Problem: Interpreting correlation coefficient r = -0.92 between car age and resale price.\n1. Absolute value |r| = 0.92 is close to 1 (Strong relationship).\n2. Negative sign indicates inverse relationship.\n3. Interpretation: Strong negative linear association (as car age increases, resale price decreases)."
      },
      {
        unit: "6",
        title: "Least-Squares Regression Lines and Residuals",
        formula: "Residual = actual - predicted",
        trick: "Sum of residuals equals zero.",
        example: "Problem: Regression line is ŷ = 3 + 2x. For x = 4, observed actual value y = 14. Calculate residual.\n1. Compute predicted value ŷ: ŷ = 3 + 2(4) = 3 + 8 = 11.\n2. Apply residual formula: Residual = Actual y - Predicted ŷ.\n3. Compute: 14 - 11 = +3."
      },
      {
        unit: "7",
        title: "Transformations to Achieve Linearity (Log and power transformations)",
        formula: "Log scaling",
        trick: "Linearize exponential curves with logs.",
        example: "Problem: Exponential relationship fitted with log transformation yields log(ŷ) = 0.5 + 0.2x. Predict y when x = 10.\n1. Substitute x = 10: log(ŷ) = 0.5 + 0.2(10) = 0.5 + 2.0 = 2.5.\n2. Convert back from log (base 10): ŷ = 10^(2.5).\n3. Evaluate: ŷ ≈ 316.23."
      },
      {
        unit: "8",
        title: "Sampling Methods and Sources of Bias in Surveys",
        formula: "Random sampling vs bias",
        trick: "Avoid voluntary response bias.",
        example: "Problem: School asks first 20 students entering gym about sports preference. Identify sampling method and potential bias.\n1. Sampling method: Convenience sampling.\n2. Potential bias: Undercoverage bias (students going to gym may disproportionately favor athletics compared to general school population)."
      },
      {
        unit: "9",
        title: "Experimental Design (Control, Randomization, Replication, Blocking)",
        formula: "Control, Randomization, Replication",
        trick: "Use blocking to control confounding variables.",
        example: "Problem: Testing a new plant fertilizer. 100 plants divided into low-sunlight and high-sunlight groups before randomly assigning fertilizer.\n1. Experimental technique used: Randomized Block Design.\n2. Purpose: Controls for sunlight as a confounding variable."
      },
      {
        unit: "10",
        title: "Probability Rules (Complement, Addition, Multiplication)",
        formula: "P(A or B) = P(A) + P(B) - P(A and B)",
        trick: "Subtract overlapping intersections.",
        example: "Problem: P(A) = 0.6, P(B) = 0.5, and P(A and B) = 0.3. Find P(A or B).\n1. Apply General Addition Rule: P(A or B) = 0.6 + 0.5 - 0.3.\n2. Compute: 1.1 - 0.3 = 0.8 (or 80%)."
      },
      {
        unit: "11",
        title: "Conditional Probability and Independence",
        formula: "P(A|B) = P(A and B) / P(B)",
        trick: "Independent if P(A|B) = P(A).",
        example: "Problem: P(Study) = 0.7, P(Pass and Study) = 0.56. Find probability student passes given they studied: P(Pass | Study).\n1. Apply conditional probability formula: P(Pass | Study) = P(Pass and Study) / P(Study).\n2. Compute: 0.56 / 0.7 = 0.8 (or 80%)."
      },
      {
        unit: "12",
        title: "Discrete Random Variables and Probability Distributions",
        formula: "E(X) = Σ xP(x)",
        trick: "Probabilities must sum to 1.",
        example: "Problem: Game pays $0 (p=0.5), $5 (p=0.3), and $20 (p=0.2). Find Expected Value E(X).\n1. Multiply outcomes by probabilities: (0 · 0.5) + (5 · 0.3) + (20 · 0.2).\n2. Sum products: 0 + 1.5 + 4.0 = $5.50 expected payout."
      },
      {
        unit: "13",
        title: "Binomial Probability Distributions",
        formula: "P(X = k) = nCk p^k (1-p)^(n-k)",
        trick: "Check binary trials and independence.",
        example: "Problem: Flip a fair coin 4 times (n=4, p=0.5). Find probability of getting exactly 3 heads.\n1. Compute combinations: ₄C₃ = 4.\n2. Apply formula: P(X = 3) = 4 · (0.5)³ · (0.5)¹ = 4 · 0.125 · 0.5.\n3. Compute: 4 · 0.0625 = 0.25 (or 25%)."
      },
      {
        unit: "14",
        title: "Geometric Probability Distributions",
        formula: "P(X = k) = (1-p)^(k-1)p",
        trick: "Trials until first success.",
        example: "Problem: Probability of rolling a 6 on fair die is p = 1/6. Find probability first 6 occurs on 3rd roll.\n1. Failures on first 2 rolls: (5/6)² = 25/36.\n2. Success on 3rd roll: (25/36) · (1/6).\n3. Compute: 25 / 216 ≈ 0.1157 (or 11.57%)."
      },
      {
        unit: "15",
        title: "Sampling Distributions for Proportions",
        formula: "SE_p̂ = √(p(1-p)/n)",
        trick: "Check large counts np ≥ 10.",
        example: "Problem: Population proportion p = 0.40, sample size n = 100. Calculate Standard Error of sample proportion p̂.\n1. Apply formula: SE = √[ (0.40 · 0.60) / 100 ].\n2. Compute numerator inside root: 0.24 / 100 = 0.0024.\n3. Take square root: √0.0024 ≈ 0.0489."
      },
      {
        unit: "16",
        title: "Sampling Distributions for Means and Central Limit Theorem",
        formula: "SE = σ / √n",
        trick: "CLT applies when n ≥ 30.",
        example: "Problem: Population standard deviation σ = 15, sample size n = 36. Find standard error of sample mean x̄.\n1. Apply Central Limit Theorem formula: SE = 15 / √36.\n2. Evaluate square root: √36 = 6.\n3. Compute: 15 / 6 = 2.5."
      },
      {
        unit: "17",
        title: "Confidence Intervals for a Single Proportion",
        formula: "p̂ ± z* SE",
        trick: "Higher confidence widens interval.",
        example: "Problem: Sample proportion p̂ = 0.50 from n = 100. Construct 95% Confidence Interval (z* = 1.96).\n1. Compute SE: √[(0.5·0.5)/100] = √0.0025 = 0.05.\n2. Margin of Error = 1.96 · 0.05 = 0.098.\n3. Interval: 0.50 ± 0.098 = (0.402, 0.598) or (40.2%, 59.8%)."
      },
      {
        unit: "18",
        title: "Confidence Intervals for a Single Mean",
        formula: "x̄ ± t* (s / √n)",
        trick: "Use t-distribution with n - 1 degrees of freedom.",
        example: "Problem: Sample mean x̄ = 80, sample SD s = 10, n = 25 (df = 24). Critical t* for 95% confidence is 2.064. Find interval.\n1. Compute SE: 10 / √25 = 10 / 5 = 2.\n2. Margin of Error = 2.064 · 2 = 4.128.\n3. Interval: 80 ± 4.128 = (75.872, 84.128)."
      },
      {
        unit: "19",
        title: "Significance Testing (Hypothesis Testing) for Proportions",
        formula: "z = (p̂ - p₀) / SE",
        trick: "Reject H₀ if p-value < α.",
        example: "Problem: Test H₀: p = 0.50 vs Hₐ: p > 0.50. Sample yields p̂ = 0.58 with SE = 0.04. Find test statistic z.\n1. Apply z-test formula: z = (0.58 - 0.50) / 0.04.\n2. Compute: 0.08 / 0.04 = +2.00.\n3. Conclusion: z = 2.00 yields p-value ≈ 0.0228 < 0.05 (Reject H₀)."
      },
      {
        unit: "20",
        title: "Significance Testing (Hypothesis Testing) for Means, Chi-Square, and Slope",
        formula: "Chi-square goodness of fit",
        trick: "Evaluates categorical frequency counts.",
        example: "Problem: Die rolled 60 times. Expected count for each face = 10. Face '1' observed 16 times. Calculate component of Chi-Square statistic for face '1'.\n1. Component formula: (Observed - Expected)² / Expected.\n2. Substitute values: (16 - 10)² / 10 = (6)² / 10 = 36 / 10 = 3.6."
      }
    ]
  },
  calculus: {
    title: "Calculus (AB / BC) Curriculum",
    units: [
      {
        unit: "1",
        title: "Limits and Intuitive Notion of Limits",
        formula: "lim (x → c) f(x) = L",
        trick: "Check behavior from both left and right sides.",
        example: "Problem: Evaluate lim (x → 2) (x² + 3x - 2)\n1. Check direct substitution: Plug in x = 2.\n2. Compute: (2)² + 3(2) - 2 = 4 + 6 - 2 = 8.\n3. Limit exists and equals 8."
      },
      {
        unit: "2",
        title: "Finding Limits Analytically (Algebraic simplification and squeeze theorem)",
        formula: "Algebraic simplification",
        trick: "Factor 0/0 indeterminate forms.",
        example: "Problem: Evaluate lim (x → 3) (x² - 9) / (x - 3)\n1. Direct substitution gives 0/0.\n2. Factor numerator: (x - 3)(x + 3) / (x - 3).\n3. Cancel (x - 3): lim (x → 3) (x + 3).\n4. Direct substitution: 3 + 3 = 6."
      },
      {
        unit: "3",
        title: "Continuity, Intermediate Value Theorem, and Asymptotic Behavior",
        formula: "f(c) defined and limit exists",
        trick: "IVT guarantees roots across y=0 crossings.",
        example: "Problem: Show f(x) = x³ - 2x - 5 has root on interval [2, 3] using IVT.\n1. Function f(x) is continuous polynomial.\n2. Evaluate endpoint 1: f(2) = (2)³ - 2(2) - 5 = 8 - 4 - 5 = -1 (Negative).\n3. Evaluate endpoint 2: f(3) = (3)³ - 2(3) - 5 = 27 - 6 - 5 = 16 (Positive).\n4. By IVT, since f(2) < 0 < f(3), there exists c ∈ (2, 3) where f(c) = 0."
      },
      {
        unit: "4",
        title: "Definition of the Derivative and Tangent Line Problems",
        formula: "Limit difference quotient",
        trick: "Derivative gives instantaneous slope.",
        example: "Problem: Find slope of tangent line to f(x) = x² at x = 3 using difference quotient definition.\n1. Set up limit: lim (h → 0) [ (3 + h)² - 3² ] / h.\n2. Expand numerator: lim (h → 0) [ (9 + 6h + h²) - 9 ] / h = lim (h → 0) (6h + h²) / h.\n3. Factor out h: lim (h → 0) (6 + h) = 6."
      },
      {
        unit: "5",
        title: "Basic Differentiation Rules (Power, Constant, Sum, Difference)",
        formula: "d/dx [x^n] = n·x^(n-1)",
        trick: "Apply power rule term by term.",
        example: "Problem: Find derivative of f(x) = 4x⁵ - 3x³ + 2x - 7\n1. d/dx[4x⁵] = 4 · 5x⁴ = 20x⁴.\n2. d/dx[-3x³] = -3 · 3x² = -9x².\n3. d/dx[2x] = 2; d/dx[-7] = 0.\n4. Result: f'(x) = 20x⁴ - 9x² + 2."
      },
      {
        unit: "6",
        title: "Product, Quotient, and Chain Rules",
        formula: "f'g + fg' & Chain rule",
        trick: "Outer derivative times inner derivative.",
        example: "Problem: Differentiate f(x) = (3x² + 1)⁴ using Chain Rule\n1. Let u = 3x² + 1 (inner), outer function is u⁴.\n2. Derivative of outer function: 4u³ = 4(3x² + 1)³.\n3. Multiply by derivative of inner function: d/dx[3x² + 1] = 6x.\n4. Product: f'(x) = 4(3x² + 1)³ · 6x = 24x(3x² + 1)³."
      },
      {
        unit: "7",
        title: "Implicit Differentiation and Inverse Trigonometric Derivatives",
        formula: "d/dx [y] = dy/dx",
        trick: "Append dy/dx for y terms.",
        example: "Problem: Find dy/dx for x² + y² = 25 at point (3, 4)\n1. Differentiate implicitly: 2x + 2y(dy/dx) = 0.\n2. Isolate dy/dx: 2y(dy/dx) = -2x ⇒ dy/dx = -x / y.\n3. Substitute (3, 4): dy/dx = -3 / 4."
      },
      {
        unit: "8",
        title: "Related Rates of Change",
        formula: "d/dt [Equation] via Chain Rule",
        trick: "Differentiate with respect to time t.",
        example: "Problem: Radius of circle expands at rate dr/dt = 2 cm/s. Find rate of area increase dA/dt when r = 5 cm.\n1. Area formula: A = πr².\n2. Differentiate with respect to t: dA/dt = 2πr (dr/dt).\n3. Substitute values: dA/dt = 2π(5)(2) = 20π cm²/s (≈ 62.83 cm²/s)."
      },
      {
        unit: "9",
        title: "Extrema on an Interval and Mean Value Theorem",
        formula: "f'(c) = (f(b)-f(a))/(b-a)",
        trick: "Set first derivative to zero for critical points.",
        example: "Problem: Find c on interval [0, 4] satisfying MVT for f(x) = x².\n1. Average rate of change: [f(4) - f(0)] / (4 - 0) = (16 - 0) / 4 = 4.\n2. Find derivative: f'(x) = 2x.\n3. Set f'(c) equal to average rate: 2c = 4 ⇒ c = 2."
      },
      {
        unit: "10",
        title: "First and Second Derivative Tests for Graph Shape (Concavity and Inflection Points)",
        formula: "Concavity via f''(x)",
        trick: "Second derivative sign determines concavity.",
        example: "Problem: Determine concavity of f(x) = x³ - 6x² at x = 1 and x = 3\n1. First derivative: f'(x) = 3x² - 12x.\n2. Second derivative: f''(x) = 6x - 12.\n3. At x = 1: f''(1) = 6(1) - 12 = -6 < 0 (Concave Down).\n4. At x = 3: f''(3) = 6(3) - 12 = +6 > 0 (Concave Up). Inflection point at x = 2."
      },
      {
        unit: "11",
        title: "Optimization Problems and Applied Maximum/Minimum",
        formula: "Set f'(x) = 0 for extrema",
        trick: "Test boundary endpoints alongside critical values.",
        example: "Problem: Find two positive numbers whose sum is 20 and whose product is maximized.\n1. Let numbers be x and (20 - x).\n2. Product function P(x) = x(20 - x) = 20x - x².\n3. Take derivative and set to zero: P'(x) = 20 - 2x = 0 ⇒ x = 10.\n4. Numbers are 10 and 10 (Max product = 100)."
      },
      {
        unit: "12",
        title: "Linear Approximation and L'Hôpital's Rule",
        formula: "lim f/g = lim f'/g'",
        trick: "Verify 0/0 indeterminate form first.",
        example: "Problem: Evaluate lim (x → 0) sin(3x) / x using L'Hôpital's Rule\n1. Direct substitution gives sin(0)/0 = 0/0 (Indeterminate).\n2. Differentiate numerator: d/dx[sin(3x)] = 3 cos(3x).\n3. Differentiate denominator: d/dx[x] = 1.\n4. Evaluate limit: lim (x → 0) [3 cos(3x) / 1] = 3 cos(0) / 1 = 3(1) = 3."
      },
      {
        unit: "13",
        title: "Riemann Sums and Definite Integrals",
        formula: "∫ f(x)dx = Net Area",
        trick: "Integrals accumulate signed area under curves.",
        example: "Problem: Evaluate right Riemann sum for f(x) = 2x on [0, 4] using n = 4 equal subintervals.\n1. Width Δx = (4 - 0) / 4 = 1. Endpoints: x = 1, 2, 3, 4.\n2. Evaluate function at right endpoints: f(1)=2, f(2)=4, f(3)=6, f(4)=8.\n3. Sum areas: Δx · Σ f(x) = 1 · (2 + 4 + 6 + 8) = 20."
      },
      {
        unit: "14",
        title: "The Fundamental Theorem of Calculus (Parts 1 and 2)",
        formula: "∫_a^b f(x)dx = F(b) - F(a)",
        trick: "Connects derivatives and integrals as inverses.",
        example: "Problem: Evaluate definite integral ∫₁³ (3x² - 2) dx\n1. Find antiderivative: F(x) = x³ - 2x.\n2. Apply FTC Part 2: F(3) - F(1).\n3. F(3) = 3³ - 2(3) = 27 - 6 = 21.\n4. F(1) = 1³ - 2(1) = -1.\n5. Compute: 21 - (-1) = 22."
      },
      {
        unit: "15",
        title: "Integration Rules and U-Substitution",
        formula: "∫ f(g(x))g'(x)dx = ∫ f(u)du",
        trick: "Choose u as inner function.",
        example: "Problem: Evaluate indefinite integral ∫ 2x(x² + 3)⁴ dx\n1. Let u = x² + 3, then du = 2x dx.\n2. Substitute: ∫ u⁴ du.\n3. Integrate: (1/5)u⁵ + C.\n4. Substitute back u: (1/5)(x² + 3)⁵ + C."
      },
      {
        unit: "16",
        title: "Integration by Parts and Advanced Integration Techniques (BC)",
        formula: "∫ u dv = uv - ∫ v du",
        trick: "Use LIATE priority rule to choose u.",
        example: "Problem: Evaluate ∫ x e^x dx\n1. Let u = x (so du = dx) and dv = e^x dx (so v = e^x).\n2. Apply formula: x e^x - ∫ e^x dx.\n3. Integrate remaining part: x e^x - e^x + C."
      },
      {
        unit: "17",
        title: "Differential Equations and Slope Fields",
        formula: "dy/dx = f(x)g(y)",
        trick: "Separate variables on opposite sides.",
        example: "Problem: Solve differential equation dy/dx = 3x²y given initial condition y(0) = 4\n1. Separate variables: (1/y) dy = 3x² dx.\n2. Integrate both sides: ln|y| = x³ + C.\n3. Exponentiate: y = C e^(x³).\n4. Apply y(0) = 4: 4 = C e⁰ ⇒ C = 4. Solution: y = 4e^(x³)."
      },
      {
        unit: "18",
        title: "Applications of Integration (Area between curves, Volume by disks/washers/shells)",
        formula: "V = π ∫ [R(x)]² - [r(x)]² dx",
        trick: "Choose disk, washer, or shell methods.",
        example: "Problem: Find area bounded between curves y = x² and y = x on [0, 1].\n1. Top curve is y = x, bottom curve is y = x².\n2. Set up integral: ∫₀¹ (x - x²) dx.\n3. Antiderivative: [ (1/2)x² - (1/3)x³ ] from 0 to 1.\n4. Evaluate: (1/2 - 1/3) - 0 = 1/6."
      },
      {
        unit: "19",
        title: "Parametric, Polar, and Vector Calculus (BC)",
        formula: "dy/dx = (dy/dt) / (dx/dt)",
        trick: "Divide parametric derivatives for slopes.",
        example: "Problem: Find slope of curve dy/dx defined parametrically by x = t³ and y = t² at t = 2\n1. dx/dt = 3t² and dy/dt = 2t.\n2. Slope dy/dx = (dy/dt) / (dx/dt) = 2t / (3t²) = 2 / (3t).\n3. Evaluate at t = 2: 2 / (3·2) = 1/3."
      },
      {
        unit: "20",
        title: "Infinite Sequences, Series, and Taylor/Maclaurin Polynomials (BC)",
        formula: "Taylor polynomial expansion",
        trick: "Use ratio tests to check convergence intervals.",
        example: "Problem: Find 3rd-degree Maclaurin polynomial for f(x) = e^(2x)\n1. Derivatives: f(0)=1, f'(0)=2, f''(0)=4, f'''(0)=8.\n2. Apply Maclaurin formula: P₃(x) = f(0) + f'(0)x + [f''(0)/2!]x² + [f'''(0)/3!]x³.\n3. Compute: 1 + 2x + (4/2)x² + (8/6)x³ = 1 + 2x + 2x² + (4/3)x³."
      }
    ]
  }
};

const subjectNames = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  'pre-algebra': 'Pre-Algebra',
  algebra: 'Algebra 1',
  algebra2: 'Algebra 2',
  geometry: 'Geometry',
  precalc: 'Pre-Calculus',
  calculus: 'Calculus',
  statistics: 'Statistics'
};

export default function LearnPage() {
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState('addition');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Email Request Widget State
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [emailRequestText, setEmailRequestText] = useState('');

  useEffect(() => {
    setMounted(true);
    async function checkProStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .maybeSingle();
      if (profile && profile.is_pro) {
        setIsPro(true);
      }
    }
    checkProStatus();
  }, []);

  const currentGuide = mathGuides[activeSubject] || mathGuides.addition;

  const filteredUnits = currentGuide.units.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.trick.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.example.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHelperAction = () => {
    if (isPro) {
      router.push('/helper');
    } else {
      router.push('/subscription');
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailRequestText.trim()) return;

    const emailTo = 'matharoundapp@gmail.com';
    const emailSubject = `Formula Request: Missing Formula in ${subjectNames[activeSubject] || activeSubject}`;
    const emailBody = `Hi MathAround Team,\n\nI couldn't find the formula or topic I was looking for. Here is what I need:\n\n${emailRequestText}\n\nThanks!`;

    // Opens Gmail composer directly in a new browser tab with pre-filled details
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');

    setShowEmailBox(false);
    setEmailRequestText('');
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 6rem', maxWidth: '960px', minHeight: '100dvh', margin: '0 auto', color: 'var(--text-main)' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#18a300', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Knowledge Base
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
          Formula & Strategy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '0.6rem', fontWeight: '500' }}>
          Master key formulas, pro tips, and detailed step-by-step problem walkthroughs behind every unit.
        </p>
      </div>

      {/* SEARCH BAR & ACTION BUTTONS CONTAINER */}
      <div style={{ maxWidth: '560px', margin: '0 auto 2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search formulas, concepts, or problem examples..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px 12px 42px',
              borderRadius: '18px',
              backgroundColor: 'var(--bg-card, rgba(128, 128, 128, 0.05))',
              border: '1px solid var(--border-color, rgba(128, 128, 128, 0.2))',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}
          />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '1rem' }}>
            🔍
          </span>
        </div>

        {/* UTILITY BUTTONS (Helper / Pro & Email Request) */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleHelperAction}
            style={{
              padding: '10px 16px',
              borderRadius: '14px',
              border: '1px solid #18a300',
              background: 'rgba(24, 163, 0, 0.12)',
              color: '#18a300',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(24,163,0,0.15)'
            }}
          >
            <span>✨</span> {isPro ? 'Go to Helper AI' : 'Upgrade to Pro for Helper'}
          </button>

          <button
            onClick={() => setShowEmailBox(!showEmailBox)}
            style={{
              padding: '10px 16px',
              borderRadius: '14px',
              border: '1px solid var(--border-color, rgba(128, 128, 128, 0.25))',
              background: 'var(--bg-card, rgba(128, 128, 128, 0.05))',
              color: 'var(--text-main)',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✉️</span> Can't find your formula? Request it
          </button>
        </div>

        {/* EMAIL REQUEST TOGGLE BOX */}
        {showEmailBox && (
          <form
            onSubmit={handleSendEmail}
            style={{
              backgroundColor: 'var(--bg-card, rgba(128, 128, 128, 0.08))',
              border: '1px solid var(--border-color, rgba(128, 128, 128, 0.25))',
              borderRadius: '18px',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              animation: 'fadeIn 0.2s ease-in-out'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Request a Missing Formula or Topic
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Type what formula or problem walkthrough you need below. Clicking send will open a pre-filled Gmail tab addressed to <code style={{ color: '#18a300' }}>matharoundapp@gmail.com</code>.
            </p>
            <textarea
              rows={3}
              placeholder="E.g., I'm looking for a step-by-step example for quadratic regression residuals..."
              value={emailRequestText}
              onChange={(e) => setEmailRequestText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card, rgba(0,0,0,0.1))',
                border: '1px solid var(--border-color, rgba(128,128,128,0.2))',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowEmailBox(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#18a300',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(24,163,0,0.3)'
                }}
              >
                Send Email
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SUBJECT PILL TABS */}
      <div style={{ 
        display: 'flex', 
        gap: '0.6rem', 
        marginBottom: '2.5rem', 
        flexWrap: 'wrap', 
        justifyContent: 'center' 
      }}>
        {Object.keys(mathGuides).map((subj) => {
          const isActive = activeSubject === subj;
          return (
            <button
              key={subj}
              onClick={() => {
                setActiveSubject(subj);
                setSearchQuery('');
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '14px',
                border: isActive ? '1px solid #18a300' : '1px solid var(--border-color, rgba(128, 128, 128, 0.2))',
                backgroundColor: isActive ? 'rgba(24, 163, 0, 0.12)' : 'var(--bg-card, rgba(128, 128, 128, 0.05))',
                color: isActive ? '#18a300' : 'var(--text-main)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 4px 14px rgba(24, 163, 0, 0.25)' : 'none'
              }}
            >
              {subjectNames[subj] || subj}
            </button>
          );
        })}
      </div>

      {/* ACTIVE SUBJECT TITLE BANNER */}
      <div style={{ 
        marginBottom: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color, rgba(128, 128, 128, 0.15))',
        paddingBottom: '0.75rem'
      }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          {currentGuide.title}
        </h2>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#18a300', background: 'rgba(24, 163, 0, 0.1)', padding: '4px 12px', borderRadius: '12px' }}>
          {filteredUnits.length} Units Listed
        </span>
      </div>

      {/* UNIT CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredUnits.length > 0 ? (
          filteredUnits.map((u, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-card, rgba(128, 128, 128, 0.05))',
                border: '1px solid var(--border-color, rgba(128, 128, 128, 0.15))',
                borderRadius: '20px',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              {/* Unit Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#18a300', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Unit {u.unit}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: '700' }}>
                  Guide
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, letterSpacing: '-0.01em', color: 'var(--text-main)', lineHeight: '1.3' }}>
                {u.title}
              </h3>

              {/* Formula Badge Callout */}
              <div style={{
                backgroundColor: 'rgba(24, 163, 0, 0.06)',
                borderLeft: '3px solid #18a300',
                padding: '8px 12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                fontWeight: '600',
                overflowX: 'auto'
              }}>
                {u.formula}
              </div>

              {/* Strategy / Pro-Tip */}
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '500' }}>
                <strong style={{ color: '#18a300', fontWeight: '700' }}>Pro Tip: </strong>
                {u.trick}
              </p>

              {/* Detailed Step-by-Step Example Box */}
              <div style={{
                backgroundColor: 'rgba(128, 128, 128, 0.04)',
                border: '1px dashed var(--border-color, rgba(128, 128, 128, 0.2))',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                fontWeight: '500',
                lineHeight: '1.4',
                whiteSpace: 'pre-line'
              }}>
                <strong style={{ color: '#18a300', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Walkthrough Example:</strong>
                {u.example}
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No matching formulas, strategies, or examples found for "{searchQuery}".
          </div>
        )}
      </div>

    </div>
  );
}