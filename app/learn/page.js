'use client';
import { useState } from 'react';

const mathGuides = {
  addition: {
    title: "Addition & Aggregation",
    units: [
      { unit: "1-5", title: "Foundational Sums", formula: "a + b = c", trick: "Look for combinations that make 10 first (e.g., 7 + 3 + 5 = 10 + 5 = 15)." },
      { unit: "6-10", title: "Two-Digit Alignment", formula: "Tens + Ones grouping", trick: "Add the tens column first, then add the ones to speed up mental math." },
      { unit: "11-15", title: "Carrying & Multi-Digit", formula: "Align right-to-left columns", trick: "Round one number up to the nearest ten, add, then subtract the difference." },
      { unit: "16-20", title: "Advanced Aggregation", formula: "Macro-sum totals", trick: "Break large values down into hundreds, tens, and units separately before merging." }
    ]
  },
  subtraction: {
    title: "Subtraction & Difference",
    units: [
      { unit: "1-5", title: "Basic Takeaways", formula: "a - b = c", trick: "Think of subtraction as counting up: to find 12 - 9, count up from 9 to 12 (+3)." },
      { unit: "6-10", title: "Regrouping & Spans", formula: "Borrowing from tens place", trick: "Keep the difference constant by adding or subtracting the same amount from both numbers." },
      { unit: "11-15", title: "Multi-Digit Balances", formula: "Column subtraction", trick: "Subtract the nearest clean tens value first, then adjust for the leftover difference." },
      { unit: "16-20", title: "Expert Variances", formula: "High-magnitude delta calculation", trick: "Estimate the approximate range first to eliminate wild distractor choices." }
    ]
  },
  multiplication: {
    title: "Multiplication & Scaling",
    units: [
      { unit: "1-5", title: "Repeated Addition Arrays", formula: "a × b = Product", trick: "Use finger tricks for 9s and double the numbers for quick 4s." },
      { unit: "6-10", title: "Grid & Factor Splitting", formula: "Distributive: a × (b + c)", trick: "Break harder factors apart: 7 × 8 becomes (7 × 5) + (7 × 3) = 35 + 21." },
      { unit: "11-15", title: "Double-Digit Products", formula: "Cross-multiplication / Partitioning", trick: "Multiply by 5 by taking half of the number and multiplying by 10." },
      { unit: "16-20", title: "Macro-Scaling & Factors", formula: "Exponential growth tracking", trick: "Look for trailing zeros and compute the base digits first before appending scale." }
    ]
  },
  division: {
    title: "Division & Unit Rates",
    units: [
      { unit: "1-5", title: "Equal Distribution", formula: "dividend ÷ divisor = quotient", trick: "Think of division as reverse multiplication: if 4 × 3 = 12, then 12 ÷ 3 = 4." },
      { unit: "6-10", title: "Currencies & Units", formula: "Total Value / Group Count", trick: "Cancel out matching dimensional units before calculating the final rate." },
      { unit: "11-15", title: "Scientific Rates", formula: "Distance / Interval", trick: "Simplify the fraction by dividing top and bottom numbers by common factors first." },
      { unit: "16-20", title: "Expert Metrics & Physics", formula: "System Metric / Node Count", trick: "Break large numbers down using closest clean estimations to check scale bounds." }
    ]
  },
  'pre-algebra': {
    title: "Pre-Algebra Bridge",
    units: [
      { unit: "1", title: "Real Number Operations & Properties", formula: "Commutative, Associative, Distributive", trick: "Identify grouping structures and simplify signs before computing." },
      { unit: "2", title: "Integers & Absolute Value Applications", formula: "|x| = distance from zero", trick: "Remember that absolute value represents distance, so it is always non-negative." },
      { unit: "3", title: "Exponent Rules & Scientific Notation", formula: "x^a × x^b = x^(a+b)", trick: "Add exponents when multiplying like bases; subtract them when dividing." },
      { unit: "4", title: "Square Roots & Radical Expressions", formula: "√(a × b) = √a × √b", trick: "Factor out perfect squares from under the radical to simplify quickly." },
      { unit: "5", title: "Order of Operations with Grouping", formula: "PEMDAS / Grouping symbols", trick: "Work from the innermost parentheses outward to avoid sign errors." },
      { unit: "6", title: "Algebraic Expressions & Substitution", formula: "Evaluate f(x, y)", trick: "Always wrap substituted negative values in parentheses before squaring or multiplying." },
      { unit: "7", title: "Simplifying Polynomial Expressions", formula: "Combine like terms", trick: "Group variable terms by their exact degree before adding coefficients." },
      { unit: "8", title: "The Distributive Property & Binomials", formula: "FOIL: First, Outer, Inner, Last", trick: "Distribute every term in the first parenthesis across every term in the second." },
      { unit: "9", title: "Factoring Linear Expressions via GCF", formula: "ab + ac = a(b + c)", trick: "Find the greatest common factor of the coefficients first, then divide each term." },
      { unit: "10", title: "Solving Multi-Step Linear Equations", formula: "ax + b = c", trick: "Undo addition and subtraction before multiplication and division." },
      { unit: "11", title: "Variables on Both Sides", formula: "ax + b = cx + d", trick: "Gather all variable terms on one side and constant terms on the other." },
      { unit: "12", title: "Literal Equations & Formulas", formula: "Isolate target variable", trick: "Treat all other letters like constant numbers while isolating your variable." },
      { unit: "13", title: "Linear & Compound Inequalities", formula: "ax + b < c", trick: "Always flip the inequality sign whenever you multiply or divide by a negative number." },
      { unit: "14", title: "Ratios, Rates, & Proportions", formula: "a/b = c/d", trick: "Use cross-multiplication to solve for missing values in clean proportions." },
      { unit: "15", title: "Advanced Percents & Finance", formula: "Part = Percent × Whole", trick: "Convert percentages to decimals by moving the decimal point two places left." },
      { unit: "16", title: "Coordinate Plane & Distance", formula: "d = √((x₂ - x₁)² + (y₂ - y₁)²)", trick: "Think of the distance formula as a direct application of the Pythagorean theorem." },
      { unit: "17", title: "Slope & Slope-Intercept Form", formula: "y = mx + b", trick: "Rise over run: find the vertical change divided by the horizontal change." },
      { unit: "18", title: "Introduction to Functions", formula: "f(x) = mx + b", trick: "Treat function notation f(x) exactly like the output variable y." },
      { unit: "19", title: "Systems of Linear Equations", formula: "Substitution / Elimination", trick: "Use elimination when coefficients easily cancel out by adding or subtracting equations." },
      { unit: "20", title: "Exponent Laws & Scientific Ops", formula: "(x^a)^b = x^(a×b)", trick: "Multiply powers when raising an exponent to another power." }
    ]
  },
  algebra: {
    title: "High School Algebra",
    units: [
      { unit: "1", title: "Foundations of Algebra & Real Numbers", formula: "Real number axioms & order of ops", trick: "Simplify grouping symbols and absolute groupings carefully before outer calculations." },
      { unit: "2", title: "Solving Linear Equations in One Variable", formula: "ax + b = c", trick: "Isolate variable terms by clearing constants first via opposite operations." },
      { unit: "3", title: "Solving Linear Inequalities & Compound Inequalities", formula: "ax + b > c", trick: "Remember to reverse inequality directions whenever multiplying or dividing by a negative." },
      { unit: "4", title: "Graphing Linear Equations & Functions", formula: "y = mx + b", trick: "Identify the y-intercept first to anchor your line, then use the slope for rise-over-run." },
      { unit: "5", title: "Writing Linear Equations & Models", formula: "y - y₁ = m(x - x₁)", trick: "Calculate slope first using two points, then substitute into point-slope form." },
      { unit: "6", title: "Systems of Linear Equations & Inequalities", formula: "Substitution / Elimination", trick: "Add equations together directly when coefficients allow instant variable elimination." },
      { unit: "7", title: "Exponents, Radicals, & Scientific Notation", formula: "x^a × x^b = x^(a+b)", trick: "Add like-base exponents during multiplication and subtract them during division." },
      { unit: "8", title: "Polynomial Operations & Special Products", formula: "(x + a)(x + b)", trick: "Use the FOIL method systematically to expand binomial products without missing terms." },
      { unit: "9", title: "Factoring Polynomials Completely", formula: "x^2 + bx + c = (x+p)(x+q)", trick: "Find two factor integers that multiply to reach c and add up to b." },
      { unit: "10", title: "Quadratic Equations & Complex Numbers", formula: "x^2 = k ⇒ x = ±√k", trick: "Remember both positive and principal negative roots when solving pure square equations." },
      { unit: "11", title: "Solving Quadratics via Completing the Square & Formula", formula: "x = (-b ± √(b² - 4ac)) / 2a", trick: "Compute the discriminant (b² - 4ac) first to check how many real solutions exist." },
      { unit: "12", title: "Graphing Quadratic Functions & Transformations", formula: "f(x) = a(x - h)² + k", trick: "Identify vertex coordinates (h, k) directly from standard vertex form structure." },
      { unit: "13", title: "Radical Equations & Introduction to Rational Exponents", formula: "√(x - a) = b", trick: "Square both sides cleanly to eliminate radicals, checking for extraneous roots afterward." },
      { unit: "14", title: "Rational Expressions & Equations", formula: "Numerator/Denominator factoring", trick: "Factor both top and bottom completely to cancel common binomial expressions." },
      { unit: "15", title: "Exponential Functions, Growth, & Decay", formula: "y = a(1 + r)^t", trick: "Identify whether the multiplier represents growth (>1) or decay (<1) immediately." },
      { unit: "16", title: "Sequences & Series (Arithmetic & Geometric)", formula: "a_n = a_1 + (n - 1)d", trick: "Identify whether terms change by a common difference (addition) or ratio (multiplication)." },
      { unit: "17", title: "Statistics, Data Analysis, & Probability Distributions", formula: "Median & central tendency", trick: "Sort your dataset into ascending numerical order before finding position metrics." },
      { unit: "18", title: "Absolute Value Equations, Inequalities, & Piecewise Functions", formula: "|x - a| = 0", trick: "An absolute value equation equals zero only when its inner expression equals zero." },
      { unit: "19", title: "Introduction to Trigonometric Ratios & Right Triangles", formula: "tan(θ) = Opposite / Adjacent", trick: "Use SOH-CAH-TOA acronyms to quickly match side lengths to trigonometric functions." },
      { unit: "20", title: "Polynomial Functions & Fundamental Theorem of Algebra", formula: "Sum of roots = -b/a", trick: "Use Vieta's formulas to find root properties instantly without fully factoring equations." }
    ]
  },
  algebra2: {
    title: "Algebra II",
    units: [
      { unit: "1", title: "Equations and Inequalities", formula: "Absolute value & compound structures", trick: "Split absolute value equations into two distinct cases before isolating variables." },
      { unit: "2", title: "Linear Equations and Functions", formula: "y = mx + b & function notation", trick: "Identify slope and intercepts directly from slope-intercept form." },
      { unit: "3", title: "Systems of Linear Equations and Inequalities", formula: "Substitution / Elimination / Matrices", trick: "Eliminate the same variable from two different pairs of equations first to reduce dimensions." },
      { unit: "4", title: "Matrices and Determinants", formula: "Cramer's Rule & Matrix Multiplications", trick: "Check inner matrix dimensions carefully (m×n and n×p) before attempting multiplication." },
      { unit: "5", title: "Quadratic Functions and Equations", formula: "x = (-b ± √(b² - 4ac)) / 2a", trick: "Compute the discriminant first to determine the nature of the roots." },
      { unit: "6", title: "Polynomial Functions and Operations", formula: "Synthetic division & Remainder Theorem", trick: "Use synthetic division to quickly test potential rational roots." },
      { unit: "7", title: "Polynomial Equations and Factoring", formula: "Sum/Difference of Cubes", trick: "Memorize cube patterns: a³ ± b³ = (a ± b)(a² ∓ ab + b²)." },
      { unit: "8", title: "Rational Exponents and Radical Functions", formula: "x^(a/b) = root(b)(x^a)", trick: "Apply the root first before raising to the power to keep numbers small and manageable." },
      { unit: "9", title: "Exponential and Logarithmic Functions", formula: "log_b(x) = y ⇔ b^y = x", trick: "Convert between log and exponential forms whenever an equation feels stuck." },
      { unit: "10", title: "Rational Functions and Equations", formula: "Vertical/Horizontal asymptotes", trick: "Compare degrees of numerator and denominator to instantly spot horizontal asymptotes." },
      { unit: "11", title: "Sequences and Series", formula: "S_n = n/2(a_1 + a_n)", trick: "Expand the first few terms of sigma notation to understand the series pattern." },
      { unit: "12", title: "Quadratic Relations and Conic Sections", formula: "(x-h)² + (y-k)² = r²", trick: "Complete the square for both x and y terms to transform standard conic equations." },
      { unit: "13", title: "Counting Methods and Probability", formula: "nPr = n!/(n-r)!, nCr = n!/(r!(n-r)!)", trick: "Ask yourself if order matters: permutations when it does, combinations when it doesn't." },
      { unit: "14", title: "Data Analysis and Statistics", formula: "Empirical Rule (68-95-99.7)", trick: "Remember standard deviation intervals: 1, 2, and 3 standard deviations from the mean." },
      { unit: "15", title: "Trigonometric Ratios and Right Triangles", formula: "tan(θ) = Opposite / Adjacent", trick: "Use SOH-CAH-TOA acronyms to quickly match side lengths to trigonometric functions." },
      { unit: "16", title: "Trigonometric Functions and the Unit Circle", formula: "sin(θ) = y, cos(θ) = x", trick: "Memorize coordinate signs across all four quadrants using 'All Students Take Calculus'." },
      { unit: "17", title: "Graphing Trigonometric Functions", formula: "y = a sin(bx - c) + d", trick: "Calculate period using 2π/b and phase shift using c/b." },
      { unit: "18", title: "Trigonometric Identities and Equations", formula: "sin²(θ) + cos²(θ) = 1", trick: "Express all trigonometric terms in terms of sine and cosine when stuck on proofs." },
      { unit: "19", title: "Limits and Introduction to Calculus Concepts", formula: "lim (x→a) f(x) = L", trick: "Check for direct substitution first before factoring or rationalizing to evaluate limits." },
      { unit: "20", title: "Advanced Polynomial and Complex Number Theorems", formula: "Fundamental Theorem of Algebra", trick: "The degree of a polynomial matches the total count of its complex roots." }
    ]
  },
  geometry: {
    title: "High School Geometry",
    units: [
      { unit: "1", title: "Essentials of Geometry & Transformations", formula: "d = √((x₂ - x₁)² + (y₂ - y₁)₂)", trick: "Use the distance formula for coordinate proofs and segment lengths." },
      { unit: "2", title: "Angles and Parallel Lines", formula: "Supplementary = 180°, Complementary = 90°", trick: "Set up equations using alternate interior and corresponding angle relationships." },
      { unit: "3", title: "Congruent Triangles & Proofs", formula: "CPCTC (Corresponding Parts)", trick: "Prove triangles congruent using SSS, SAS, ASA, AAS, or HL before stating side equalities." },
      { unit: "4", title: "Relationships Within Triangles", formula: "Midsegment = ½(Third Side)", trick: "Remember that a midsegment is always parallel to and half the length of the opposite side." },
      { unit: "5", title: "Polygons and Quadrilaterals", formula: "Interior Sum = (n - 2) × 180°", trick: "Divide any convex polygon into triangles from a single vertex to find interior angle sums." },
      { unit: "6", title: "Similarity & Ratios", formula: "Proportional corresponding sides", trick: "Set up clean ratios between corresponding sides of similar figures." },
      { unit: "7", title: "Right Triangles and Trigonometry", formula: "a² + b² = c² & SOH-CAH-TOA", trick: "Check if you have a Pythagorean triple (like 3-4-5 or 5-12-13) to solve right triangles instantly." },
      { unit: "8", title: "Coordinate Geometry Proofs", formula: "Slope m = (y₂ - y₁) / (x₂ - x₁)", trick: "Parallel lines share identical slopes; perpendicular lines have negative reciprocal slopes." },
      { unit: "9", title: "Circles, Arcs, and Chords", formula: "Central Angle = Intercepted Arc", trick: "Central angles match their intercepted arc degrees directly." },
      { unit: "10", title: "Secants, Tangents, and Angle Measures", formula: "Inscribed Angle = ½(Intercepted Arc)", trick: "An inscribed angle is always half the measure of its corresponding intercepted arc." },
      { unit: "11", title: "Circumference, Area, and Sector Metrics", formula: "C = 2πr, A = πr²", trick: "Multiply total area or circumference by the fraction (central angle / 360°) to find sector metrics." },
      { unit: "12", title: "Two-Dimensional Area and Perimeter", formula: "Trapezoid Area = ½(b₁ + b₂)h", trick: "Break complex composite 2D shapes down into simple rectangles and triangles." },
      { unit: "13", title: "Three-Dimensional Solids & Surface Area", formula: "Prism SA = 2lw + 2lh + 2wh", trick: "Calculate individual face areas and sum them up to find total surface area." },
      { unit: "14", title: "Volume of Prisms, Cylinders, Pyramids, and Cones", formula: "V_cone = ⅓πr²h, V_prism = Bh", trick: "Remember that pointed solids (cones and pyramids) always include a ⅓ factor compared to base solids." },
      { unit: "15", title: "Spheres and Composite Solids", formula: "V_sphere = ₄⁄₃πr³", trick: "Cube the radius first when calculating sphere volumes before multiplying by fractions." },
      { unit: "16", title: "Rigid Transformations and Symmetry", formula: "Translation (x + dx, y + dy)", trick: "Rigid transformations preserve side lengths and angle measures perfectly." },
      { unit: "17", title: "Dilations and Scale Factor Proportions", formula: "(kx, ky) from origin", trick: "Multiply every coordinate by the scale factor k during origin-centered dilations." },
      { unit: "18", title: "Equations of Circles in the Coordinate Plane", formula: "(x - h)² + (y - k)² = r²", trick: "Identify center coordinates (h, k) and take the square root of the right side to find radius r." },
      { unit: "19", title: "Geometric Modeling and Design Applications", formula: "Scale factor volume ratio = k³", trick: "Remember that scaling a 3D object by scale factor k scales its volume by k³." },
      { unit: "20", title: "Advanced Geometric Proofs & Loci", formula: "Diagonals = n(n - 3) / 2", trick: "Visualize loci as paths of points satisfying a fixed distance or condition rule." }
    ]
  },
  precalc: {
    title: "Advanced Pre-Calculus",
    units: [
      { unit: "1", title: "Functions and Their Graphs", formula: "(f ∘ g)(x) = f(g(x))", trick: "Evaluate inner functions first before passing the result into the outer function." },
      { unit: "2", title: "Polynomial and Rational Functions", formula: "Remainder & Factor Theorem", trick: "Use synthetic division to test rational roots quickly and find depressed polynomials." },
      { unit: "3", title: "Exponential and Logarithmic Functions", formula: "log_b(xy) = log_b(x) + log_b(y)", trick: "Use log property expansions to break multiplication and division into manageable parts." },
      { unit: "4", title: "Trigonometric Functions & Unit Circle", formula: "sin(θ) = y, cos(θ) = x", trick: "Anchor exact reference angles to standard quadrant coordinates." },
      { unit: "5", title: "Analytic Trigonometry & Identities", formula: "sin²(θ) + cos²(θ) = 1", trick: "Convert all terms to sine and cosine when verifying complex trigonometric identities." },
      { unit: "6", title: "Additional Topics in Trigonometry", formula: "c² = a² + b² - 2ab cos(C)", trick: "Use Law of Cosines when you have SAS or SSS triangle information." },
      { unit: "7", title: "Systems of Equations and Inequalities", formula: "Cramer's Rule via Determinants", trick: "Compute the coefficient matrix determinant first to verify unique system solutions." },
      { unit: "8", title: "Matrices and Determinants", formula: "Matrix Product Trace", trick: "Sum the diagonal elements of a square matrix product to find its trace." },
      { unit: "9", title: "Conic Sections", formula: "(x/a)² - (y/b)² = 1", trick: "Identify hyperbola asymptote slopes using vertical and horizontal axis spans (±b/a)." },
      { unit: "10", title: "Sequences and Series", formula: "S_∞ = a / (1 - r)", trick: "Verify that the common ratio satisfies |r| < 1 before computing infinite geometric sums." },
      { unit: "11", title: "Counting and Probability", formula: "Binomial Coefficient nCr", trick: "Use combination formulas when order does not matter in selection sets." },
      { unit: "12", title: "Introduction to Calculus: Limits", formula: "lim (x → c) (x² - c²) / (x - c)", trick: "Factor 0/0 indeterminate forms to cancel terms before substituting the limit value." },
      { unit: "13", title: "Derivatives: Concept and Rate of Change", formula: "f'(x) = lim (h → 0) (f(x+h) - f(x)) / h", trick: "Apply power rules directly to polynomial terms for instant instantaneous rates." },
      { unit: "14", title: "Polar Coordinates and Complex Numbers", formula: "z = r(cos(θ) + i sin(θ))", trick: "Convert complex numbers to cis polar form for effortless power scaling." },
      { unit: "15", title: "Vectors in Two and Three Dimensions", formula: "v = <u₁, u₂, u₃>", trick: "Compute dot products by multiplying corresponding vector components and summing." },
      { unit: "16", title: "Parametric Equations", formula: "dy/dx = (dy/dt) / (dx/dt)", trick: "Take the derivative of y with respect to t and divide by the derivative of x." },
      { unit: "17", title: "Advanced Limits and Continuity", formula: "lim (x → 0) sin(x) / x = 1", trick: "Memorize fundamental trigonometric limits to quickly evaluate indeterminate ratios." },
      { unit: "18", title: "Inductive Reasoning and Mathematical Induction", formula: "P(k) ⇒ P(k+1)", trick: "Verify the base case n=1 first before assuming truth for k and proving k+1." },
      { unit: "19", title: "Logistic Models and Population Growth", formula: "P(t) = L / (1 + Ce^-kt)", trick: "Recognize that population growth rate peaks precisely at half of carrying capacity." },
      { unit: "20", title: "Comprehensive Pre-Calculus Synthesis", formula: "Optimization via derivatives", trick: "Set first derivatives equal to zero to locate critical points for maximum areas." }
    ]
  },
  calculus: {
    title: "College-Level Calculus",
    units: [
      { unit: "1", title: "Limits, Continuity, and IVT", formula: "lim (x → c) f(x) = L", trick: "Check direct substitution first before factoring or rationalizing to evaluate limits." },
      { unit: "2", title: "Rigorous Definitions of Limits", formula: "|f(x) - L| < ε when 0 < |x - c| < δ", trick: "Isolate delta in terms of epsilon by working backwards from the functional bound." },
      { unit: "3", title: "Definition of the Derivative", formula: "f'(x) = lim (h → 0) (f(x+h) - f(x)) / h", trick: "Expand numerator terms cleanly and cancel out h in the denominator before taking the limit." },
      { unit: "4", title: "Differentiation Rules", formula: "d/dx [x^n] = n·x^(n-1)", trick: "Apply power, product, quotient, and chain rules systematically term by term." },
      { unit: "5", title: "The Chain Rule & Implicit Differentiation", formula: "d/dx [f(g(x))] = f'(g(x)) · g'(x)", trick: "Treat y implicitly as a function of x, appending dy/dx whenever differentiating y terms." },
      { unit: "6", title: "Related Rates", formula: "d/dt [Equation] via Chain Rule", trick: "Differentiate all geometric variables with respect to time t before plugging in instant values." },
      { unit: "7", title: "Mean Value Theorem & Extrema", formula: "f'(c) = (f(b) - f(a)) / (b - a)", trick: "Locate critical numbers by setting first derivatives equal to zero or undefined points." },
      { unit: "8", title: "Curve Sketching & Inflection Points", formula: "Concavity sign via f''(x)", trick: "Use second derivatives to map exact concavity shifts and inflection coordinates." },
      { unit: "9", title: "Applied Optimization", formula: "Setting f'(x) = 0 for Max/Min", trick: "Test boundary points alongside critical numbers to guarantee absolute extrema." },
      { unit: "10", title: "L'Hôpital's Rule", formula: "lim f(x)/g(x) = lim f'(x)/g'(x)", trick: "Verify 0/0 or ∞/∞ indeterminate forms before differentiating top and bottom separately." },
      { unit: "11", title: "Riemann Sums & Definite Integrals", formula: "∫_a^b f(x) dx = lim Σ f(x_i) Δx", trick: "Interpret definite integrals directly as net accumulated signed area under curves." },
      { unit: "12", title: "Fundamental Theorem of Calculus", formula: "d/dx [∫_a^x f(t) dt] = f(x)", trick: "Use antiderivatives to evaluate net accumulation and definite bounds instantly." },
      { unit: "13", title: "Integration by Substitution", formula: "∫ f(g(x))g'(x) dx = ∫ f(u) du", trick: "Choose u as the inner composite function whose derivative is present as a factor." },
      { unit: "14", title: "Integration by Parts", formula: "∫ u dv = uv - ∫ v du", trick: "Use the LIATE priority rule (Log, Inverse Trig, Algebraic, Trig, Exponential) to choose u." },
      { unit: "15", title: "Trigonometric Integrals & Substitution", formula: "sin²(θ) + cos²(θ) = 1", trick: "Apply Pythagorean trig identities or triangle substitutions to clear radicals." },
      { unit: "16", title: "Partial Fractions Decomposition", formula: "P(x)/(Q₁(x)Q₂(x)) = A/Q₁(x) + B/Q₂(x)", trick: "Factor denominators completely into linear and irreducible quadratic factors first." },
      { unit: "17", title: "Improper Integrals", formula: "∫_a^∞ f(x) dx = lim (t → ∞) ∫_a^t f(x) dx", trick: "Replace infinite bounds with limits before evaluating antiderivatives." },
      { unit: "18", title: "Area & Volumes of Revolution", formula: "V = π ∫ [R(x)]² - [r(x)]² dx", trick: "Identify whether to use disk, washer, or cylindrical shell methods based on rotation axes." },
      { unit: "19", title: "Arc Length & Surface Area", formula: "L = ∫ √(1 + [f'(x)]²) dx", trick: "Square the derivative and add 1 under the radical before attempting integration." },
      { unit: "20", title: "Differential Equations & Logistic Growth", formula: "dP/dt = kP(1 - P/K)", trick: "Separate variables on opposite sides of the equals sign before integrating both halves." }
    ]
  },
  statistics: {
    title: "College-Level Statistics",
    units: [
      { unit: "1", title: "Descriptive Statistics: Center & Spread", formula: "s² = Σ(x - x̄)² / (n - 1)", trick: "Always use n - 1 in the denominator when calculating sample variance." },
      { unit: "2", title: "Probability Rules & Combinatorics", formula: "P(B|A) = P(A and B) / P(A)", trick: "Conditionals restrict your sample space to the given condition event only." },
      { unit: "3", title: "Discrete Probability Distributions", formula: "E(X) = Σ x·P(x)", trick: "Multiply each outcome value by its probability and sum the products." },
      { unit: "4", title: "Continuous Probability Distributions", formula: "Uniform P(X ≤ x) = (x - min) / (max - min)", trick: "Treat uniform distribution probabilities as proportions of interval lengths." },
      { unit: "5", title: "The Normal Distribution & Z-Scores", formula: "Z = (x - μ) / σ", trick: "Z-scores measure how many standard deviations an observation sits from the mean." },
      { unit: "6", title: "Sampling Distributions & CLT", formula: "SE = σ / √n", trick: "Standard error shrinks as sample size grows larger according to the square root." },
      { unit: "7", title: "Confidence Intervals for a Single Mean", formula: "ME = z*·(σ / √n)", trick: "Higher confidence levels require larger critical z-values, widening the interval." },
      { unit: "8", title: "Hypothesis Testing: Single Mean Z-Test", formula: "z = (x̄ - μ) / SE", trick: "Reject the null hypothesis when your test statistic falls in the rejection region." },
      { unit: "9", title: "Hypothesis Testing: Single Mean T-Test", formula: "df = n - 1", trick: "Use t-distributions instead of z when population standard deviation is unknown." },
      { unit: "10", title: "Two-Sample Inference: Independent Means", formula: "df = (n₁ - 1) + (n₂ - 1)", trick: "Pool variances together when population variances are assumed equal." },
      { unit: "11", title: "Paired Difference Experiments", formula: "d̄ = Σd / n", trick: "Reduce paired observations into single difference scores before testing." },
      { unit: "12", title: "One-Way ANOVA", formula: "N = k × n (Total Sample Size)", trick: "Compare variance between groups to variance within groups using F-ratios." },
      { unit: "13", title: "Two-Way ANOVA & Factorial Designs", formula: "df_interaction = (a - 1)(b - 1)", trick: "Multiply factor level degree differences to find interaction degrees of freedom." },
      { unit: "14", title: "Simple Linear Regression", formula: "b₁ = SP / SSxx", trick: "The slope represents the expected change in y per unit increase in x." },
      { unit: "15", title: "Correlation & Coefficient of Determination", formula: "r² = Explained Variation / Total Variation", trick: "Square the correlation coefficient r to find the percentage of explained variance." },
      { unit: "16", title: "Multiple Linear Regression", formula: "df_error = n - p - 1", trick: "Subtract the number of predictors and 1 from sample size for error degrees of freedom." },
      { unit: "17", title: "Chi-Square Goodness-of-Fit Test", formula: "χ² = Σ ((O - E)² / E)", trick: "Compare observed frequencies against expected model counts category by category." },
      { unit: "18", title: "Chi-Square Test for Independence", formula: "df = (r - 1)(c - 1)", trick: "Multiply row and column minus-one values for contingency table degrees of freedom." },
      { unit: "19", title: "Non-Parametric Statistics", formula: "Max U₁ = n₁ · n₂", trick: "Non-parametric tests evaluate rank orders rather than assuming normal distributions." },
      { unit: "20", title: "Advanced Statistical Quality Control", formula: "Process shift scaling", trick: "Monitor control limits to detect abnormal process variations quickly." }
    ]
  }
};

export default function LearnPage() {
  const [activeSubject, setActiveSubject] = useState('addition');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', minHeight: '160vh', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-neon)' }}>Formula & Strategy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Master the patterns and strategies behind every unit in MathAround.</p>

      {/* Subject Selector Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {Object.keys(mathGuides).map((subj) => (
          <button
            key={subj}
            onClick={() => setActiveSubject(subj)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: activeSubject === subj ? '2px solid var(--accent-neon)' : '1px solid var(--surface-border)',
              background: activeSubject === subj ? 'rgba(212, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              color: '#fff',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: '700'
            }}
          >
            {subj === 'pre-algebra' ? 'Pre-Algebra' : subj === 'algebra2' ? 'Algebra II' : subj === 'precalc' ? 'Pre-Calculus' : subj === 'calculus' ? 'Calculus' : subj === 'statistics' ? 'Statistics' : subj}
          </button>
        ))}
      </div>

      {/* Guides List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {mathGuides[activeSubject].units.map((item, index) => (
          <div key={index} className="subject-card" style={{ display: 'block', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-neon)', fontWeight: '700', marginBottom: '0.5rem' }}>
              UNIT {item.unit}: {item.title.toUpperCase()}
            </div>
            <div style={{ fontSize: '1rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem', display: 'inline-block' }}>
              Formula: {item.formula}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <strong style={{ color: '#fff' }}>Pro Strategy:</strong> {item.trick}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}