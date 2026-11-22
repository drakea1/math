// geometry.js - Comprehensive High School Geometry Curriculum Generator (Units 1-20)

const GEOMETRY_UNITS = {
  1: "Points, Lines, Planes, and Angles",
  2: "Logical Reasoning and Conditional Statements",
  3: "Parallel and Perpendicular Lines",
  4: "Triangle Classifications and Angle Sums",
  5: "Congruent Triangles and Postulates",
  6: "Relationships within Triangles (Medians, Altitudes, Bisectors)",
  7: "Polygons and Quadrilaterals",
  8: "Similar Polygons and Transformations",
  9: "Right Triangles and Pythagorean Theorem",
  10: "Trigonometric Ratios (Sine, Cosine, Tangent)",
  11: "Area and Perimeter of 2D Figures",
  12: "Circles, Chords, Secants, and Tangents",
  13: "Arc Lengths and Sector Areas in Circles",
  14: "Surface Area of Three-Dimensional Solids",
  15: "Volume of Prisms, Cylinders, Pyramids, and Cones",
  16: "Spheres and Hemispheres",
  17: "Coordinate Geometry and Distance Formula",
  18: "Equations of Circles in the Coordinate Plane",
  19: "Transformations (Translations, Reflections, Rotations, Dilations)",
  20: "Geometric Probability and Constructions"
};

export function generateGeometry(unit, level, problemIndex = 0) {
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
    case 1: problemObj = generateGeomUnit1(lvl, variant, seed, randInt); break;
    case 2: problemObj = generateGeomUnit2(lvl, variant, seed, randInt); break;
    case 3: problemObj = generateGeomUnit3(lvl, variant, seed, randInt); break;
    case 4: problemObj = generateGeomUnit4(lvl, variant, seed, randInt); break;
    case 5: problemObj = generateGeomUnit5(lvl, variant, seed, randInt); break;
    case 6: problemObj = generateGeomUnit6(lvl, variant, seed, randInt); break;
    case 7: problemObj = generateGeomUnit7(lvl, variant, seed, randInt); break;
    case 8: problemObj = generateGeomUnit8(lvl, variant, seed, randInt); break;
    case 9: problemObj = generateGeomUnit9(lvl, variant, seed, randInt); break;
    case 10: problemObj = generateGeomUnit10(lvl, variant, seed, randInt); break;
    case 11: problemObj = generateGeomUnit11(lvl, variant, seed, randInt); break;
    case 12: problemObj = generateGeomUnit12(lvl, variant, seed, randInt); break;
    case 13: problemObj = generateGeomUnit13(lvl, variant, seed, randInt); break;
    case 14: problemObj = generateGeomUnit14(lvl, variant, seed, randInt); break;
    case 15: problemObj = generateGeomUnit15(lvl, variant, seed, randInt); break;
    case 16: problemObj = generateGeomUnit16(lvl, variant, seed, randInt); break;
    case 17: problemObj = generateGeomUnit17(lvl, variant, seed, randInt); break;
    case 18: problemObj = generateGeomUnit18(lvl, variant, seed, randInt); break;
    case 19: problemObj = generateGeomUnit19(lvl, variant, seed, randInt); break;
    case 20:
    default: problemObj = generateGeomUnit20(lvl, variant, seed, randInt); break;
  }

  const finalAnswer = String(problemObj.answer);
  const numericAns = Number(finalAnswer);

  let rawChoices;
  if (Array.isArray(problemObj.choices) && problemObj.choices.length > 0) {
    rawChoices = problemObj.choices.map(String);
  } else if (Number.isFinite(numericAns)) {
    const step1 = variant % 2 === 0 ? 4 : -4;
    const step2 = variant % 3 === 0 ? 10 : -10;
    const step3 = variant % 5 === 0 ? 18 : -18;
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
    const set = new Set([finalAnswer, "0", "90", "180"]);
    let extra = 1;
    while (set.size < 4) {
      set.add(String(extra * 45));
      extra++;
    }
    rawChoices = Array.from(set).slice(0, 4);
  }

  return {
    unit: u,
    unitName: GEOMETRY_UNITS[u] || "Geometry",
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

function generateGeomUnit1(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const evenAngle = randInt(8, 37, 1) * 2;
  const a = Math.min(84, evenAngle) * (f > 1 ? 1 : 1);
  const ab = randInt(2, 8, 2) * f;
  const bc = randInt(3, 9, 3) * f;
  if (variant === 0) return { question: `Angle A and Angle B are supplementary. If Angle A measures ${a}°, find the measure of Angle B in degrees:`, answer: String(180 - a), explanation: "Supplementary angles sum to 180°." };
  if (variant === 1) return { question: `Angle X and Angle Y are complementary. If Angle X measures ${a}°, find Angle Y in degrees:`, answer: String(90 - a), explanation: "Complementary angles sum to 90°." };
  if (variant === 2) return { question: `Two lines intersect. If one angle measures ${a}°, what is the degree measure of its vertical angle?`, answer: String(a), explanation: "Vertical angles are congruent." };
  if (variant === 3) return { question: `Point B lies between points A and C on a line segment. If AB = ${ab} and BC = ${bc}, find AC:`, answer: String(ab + bc), explanation: "Segment Addition Postulate: AB + BC = AC." };
  if (variant === 4) return { question: `Point B lies between A and C. If AC = ${ab + bc} and AB = ${ab}, find BC:`, answer: String(bc), explanation: "Segment Addition Postulate: BC = AC - AB." };
  if (variant === 5) return { question: `Ray BD bisects Angle ABC. If Angle ABD measures ${a}°, what is the degree measure of Angle ABC?`, answer: String(2 * a), explanation: "An angle bisector divides an angle into two equal parts." };
  if (variant === 6) return { question: `Angles 1 and 2 form a linear pair. If Angle 1 measures ${a}°, find the degree measure of Angle 2:`, answer: String(180 - a), explanation: "Angles forming a linear pair are supplementary." };
  if (variant === 7) return { question: `Point M is the midpoint of segment PQ. If PM = ${ab * 2}, find the total length of segment PQ:`, answer: String(ab * 4), explanation: "The midpoint divides a segment into two equal segments." };
  if (variant === 8) return { question: `Point M is the midpoint of segment ST. If ST = ${bc * 4}, find the length of SM:`, answer: String(bc * 2), explanation: "Midpoint divides length in half." };
  if (variant === 9) return { question: `If an angle measures ${a}° and its complement is 2x°, solve for x:`, answer: String((90 - a) / 2), explanation: "Set 2x = 90 - angle." };
  if (variant === 10) return { question: `Find the supplement of an angle measuring ${a}°:`, answer: String(180 - a), explanation: "Subtract angle from 180°." };
  if (variant === 11) return { question: `Two adjacent angles on a straight line measure (3x)° and ${a}°. If they form a linear pair, find 3x:`, answer: String(180 - a), explanation: "Linear pair sum equals 180°." };
  if (variant === 12) return { question: `How many distinct rays sharing a common endpoint are needed to form 3 non-overlapping adjacent angles?`, answer: "4", explanation: "4 rays sharing a vertex form 3 adjacent angles." };
  if (variant === 13) return { question: `Find the angle measure in degrees that is equal to twice its own complement:`, answer: "60", explanation: "x = 2(90 - x) -> 3x = 180 -> x = 60°." };
  return { question: `Find the angle measure in degrees that is equal to its own supplement:`, answer: "90", explanation: "x = 180 - x -> 2x = 180 -> x = 90°." };
}

function generateGeomUnit2(lvl, variant, seed, randInt) {
  const nVars = randInt(2, 4, 1);
  if (variant === 0) return { question: `If a conditional statement 'If p, then q' is true, how many true statements are in its contrapositive pair?`, answer: "2", explanation: "A conditional and its contrapositive share the same truth value." };
  if (variant === 1) return { question: `How many counterexamples are required to prove a geometric conjecture false?`, answer: "1", explanation: "A single counterexample invalidates a conjecture." };
  if (variant === 2) return { question: `How many truth table rows exist for a compound statement with ${nVars} independent variables?`, answer: String(Math.pow(2, nVars)), explanation: `2^${nVars} = ${Math.pow(2, nVars)} rows.` };
  if (variant === 3) return { question: `Given conditional 'If x = 4, then 2x = 8', what value of 2x follows by Law of Detachment when x = 4?`, answer: "8", explanation: "Law of Detachment confirms 2(4) = 8." };
  if (variant === 4) return { question: `Given 'If a polygon has 5 sides, it is a pentagon' and 'If a shape is a pentagon, its exterior angles sum to 360°', what is the exterior angle sum of a 5-sided polygon by Law of Syllogism?`, answer: "360", explanation: "Law of Syllogism links the chain to 360°." };
  if (variant === 5) return { question: `How many conditional statements (the original and its converse) make up a biconditional statement?`, answer: "2", explanation: "A biconditional combines a conditional and its converse." };
  if (variant === 6) return { question: `If a square has side length ${randInt(3, 9, 2)}, how many sides does it have according to the rule 'If it is a square, it has 4 sides'?`, answer: "4", explanation: "A square always has 4 sides." };
  if (variant === 7) return { question: `How many total truth table rows exist for a logical compound statement involving 3 independent variables (p, q, r)?`, answer: "8", explanation: "2³ = 8 rows." };
  if (variant === 8) return { question: `How many rows in a 2-variable truth table for 'p AND q' are true?`, answer: "1", explanation: "Conjunction 'p AND q' is true only when both p and q are true." };
  if (variant === 9) return { question: `How many rows in a 2-variable truth table for 'p OR q' are true?`, answer: "3", explanation: "Disjunction 'p OR q' is true in 3 of the 4 rows." };
  if (variant === 10) return { question: `If a conditional statement is false, how many of its truth values (hypothesis = true, conclusion = false) occur in that case?`, answer: "2", explanation: "A conditional is false only when hypothesis is true and conclusion is false." };
  if (variant === 11) return { question: `How many conditional statements form a biconditional statement (p <-> q)?`, answer: "2", explanation: "A conditional and its converse." };
  if (variant === 12) return { question: `How many directions of implication ('if p then q' and 'if q then p') must hold for a biconditional to be true?`, answer: "2", explanation: "Both directions must hold." };
  if (variant === 13) return { question: `If angle A measures ${randInt(20, 70, 3)}°, what is the measure of an angle congruent to angle A?`, answer: String(randInt(20, 70, 3)), explanation: "Congruent angles have equal measure." };
  return { question: `How many truth values (True or False) can a single logical statement take in classical logic?`, answer: "2", explanation: "True or False." };
}

function generateGeomUnit3(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const a = randInt(35, 85, 1);
  const m = randInt(2, 6, 2) * f;
  const xTarget = randInt(10, 35, 4);
  if (variant === 0) return { question: `Two parallel lines are cut by a transversal. If one alternate interior angle measures ${a}°, find the other in degrees:`, answer: String(a), explanation: "Alternate interior angles are congruent." };
  if (variant === 1) return { question: `Two parallel lines are cut by a transversal. If one corresponding angle measures ${a}°, find its corresponding angle in degrees:`, answer: String(a), explanation: "Corresponding angles are congruent." };
  if (variant === 2) return { question: `Two parallel lines are cut by a transversal. If a consecutive interior angle is ${a}°, find the other consecutive interior angle in degrees:`, answer: String(180 - a), explanation: "Consecutive interior angles are supplementary." };
  if (variant === 3) return { question: `Two parallel lines are cut by a transversal. If one alternate exterior angle measures ${a}°, find its alternate exterior angle in degrees:`, answer: String(a), explanation: "Alternate exterior angles are congruent." };
  if (variant === 4) return { question: `What is the slope of a line parallel to y = ${m}x - 8?`, answer: String(m), explanation: "Parallel lines have equal slopes." };
  if (variant === 5) return { question: `Line 1 has slope 1. What is the slope of a line perpendicular to Line 1?`, answer: "-1", explanation: "Negative reciprocal of 1 is -1." };
  if (variant === 6) return { question: `If line A has equation y = ${m}x + 2 and line B has equation y = ${m}x - 15, how many intersection points do they share?`, answer: "0", explanation: "Parallel lines never intersect." };
  if (variant === 7) return { question: `Two parallel lines are cut by a transversal. If consecutive exterior angles are supplementary and one is ${a}°, find the other:`, answer: String(180 - a), explanation: "Consecutive exterior angles sum to 180°." };
  if (variant === 8) return { question: `If a transversal is perpendicular to line L1, what angle in degrees does it form with line L2 parallel to L1?`, answer: "90", explanation: "Perpendicular Transversal Theorem." };
  if (variant === 9) return { question: `How many total angles are formed when 2 parallel lines are intersected by 1 transversal?`, answer: "8", explanation: "2 intersections * 4 angles = 8 angles." };
  if (variant === 10) return { question: `If a line has slope 4, what is the product of its slope and the slope of a line perpendicular to it?`, answer: "-1", explanation: "Perpendicular slopes always have a product of -1." };
  if (variant === 11) return { question: `Find x if alternate interior angles measure (2x)° and ${2 * xTarget}°:`, answer: String(xTarget), explanation: `2x = ${2 * xTarget} -> x = ${xTarget}.` };
  if (variant === 12) return { question: `Find x if corresponding angles measure (3x)° and ${3 * xTarget}°:`, answer: String(xTarget), explanation: `3x = ${3 * xTarget} -> x = ${xTarget}.` };
  if (variant === 13) return { question: `If a transversal intersects two parallel lines and one angle is ${a}°, find the sum of one acute and one obtuse angle formed:`, answer: "180", explanation: "Adjacent angles along a line or transversal sum to 180°." };
  return { question: `What is the sum of consecutive interior angles in degrees when parallel lines are cut by a transversal?`, answer: "180", explanation: "Consecutive interior angles are supplementary." };
}

function generateGeomUnit4(lvl, variant, seed, randInt) {
  const evenA = randInt(18, 36, 1) * 2;
  const a = Math.min(72, evenA);
  const b = randInt(35, 75, 2);
  const c = 180 - a - b;
  if (variant === 0) return { question: `In Triangle ABC, Angle A = ${a}° and Angle B = ${b}°. Find the measure of Angle C in degrees:`, answer: String(c), explanation: "Triangle Angle Sum Theorem: sum = 180°." };
  if (variant === 1) return { question: `What is the interior angle measure of each angle in an equiangular triangle in degrees?`, answer: "60", explanation: "180 / 3 = 60°." };
  if (variant === 2) return { question: `In an isosceles triangle, the vertex angle measures ${a}°. Find the degree measure of one base angle:`, answer: String((180 - a) / 2), explanation: "Base angles = (180 - vertex) / 2." };
  if (variant === 3) return { question: `In an isosceles triangle, each base angle measures ${a}°. Find the vertex angle in degrees:`, answer: String(180 - 2 * a), explanation: "Vertex angle = 180 - 2(base angle)." };
  if (variant === 4) return { question: `An exterior angle of a triangle measures ${a + b}°. If one remote interior angle measures ${a}°, find the other remote interior angle:`, answer: String(b), explanation: "Exterior Angle Theorem: Exterior = sum of remote interior angles." };
  if (variant === 5) return { question: `In a right triangle, one acute angle measures ${a}°. Find the other acute angle in degrees:`, answer: String(90 - a), explanation: "Acute angles of a right triangle are complementary." };
  if (variant === 6) return { question: `Two sides of a triangle measure 4 and 7. What is the maximum whole number length for the third side?`, answer: "10", explanation: "x < 4 + 7 = 11 -> max integer is 10." };
  if (variant === 7) return { question: `Two sides of a triangle measure 6 and 10. What is the minimum whole number length for the third side?`, answer: "5", explanation: "10 - 6 < x -> x > 4 -> min integer is 5." };
  if (variant === 8) return { question: `Two sides of a triangle measure 6 and 10. What is the maximum whole number length for the third side?`, answer: "15", explanation: "x < 6 + 10 -> x < 16 -> max integer is 15." };
  if (variant === 9) return { question: `In Triangle ABC, AB = 5, BC = 8, and AC = 10. Find the sum of the two shorter side lengths:`, answer: "13", explanation: "5 + 8 = 13." };
  if (variant === 10) return { question: `If the ratio of interior angles in a triangle is 1:2:3, find the largest angle in degrees:`, answer: "90", explanation: "x + 2x + 3x = 180 -> 6x = 180 -> 3x = 90°." };
  if (variant === 11) return { question: `What is the degree sum of all exterior angles (one per vertex) of any triangle?`, answer: "360", explanation: "Exterior angle sum of any convex polygon is 360°." };
  if (variant === 12) return { question: `How many obtuse angles can a single triangle contain at most?`, answer: "1", explanation: "If a triangle had two obtuse angles, the sum would exceed 180°." };
  if (variant === 13) return { question: `In a right isosceles triangle, what is the degree measure of each acute angle?`, answer: "45", explanation: "(180 - 90) / 2 = 45°." };
  return { question: `Find the perimeter of an equilateral triangle with side length ${randInt(4, 15, 3)}:`, answer: String(3 * randInt(4, 15, 3)), explanation: "Equilateral triangle has 3 equal sides." };
}

function generateGeomUnit5(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const s1 = 5 * f;
  const s2 = 8 * f;
  if (variant === 0) return { question: `If Triangle ABC ≅ Triangle DEF, and AB = ${s1}, what is the length of segment DE?`, answer: String(s1), explanation: "CPCTC: Corresponding parts of congruent triangles are congruent." };
  if (variant === 1) return { question: `If Triangle ABC ≅ Triangle DEF, Angle A = 50°, Angle B = 60°, find Angle F in degrees:`, answer: "70", explanation: "Angle C = 180 - 50 - 60 = 70°. Angle F = Angle C = 70°." };
  if (variant === 2) return { question: `If two congruent triangles have side lengths 6, 8, and 10, what is their perimeter?`, answer: "24", explanation: "6 + 8 + 10 = 24." };
  if (variant === 3) return { question: `In congruent triangles ABC and DEF, if BC = ${s2} and EF = (2x) when s2 = 8, find x for s2 = 8:`, answer: "4", explanation: "2x = 8 -> x = 4." };
  if (variant === 4) return { question: `If Angle D = 45° and Angle E = 65° in Triangle DEF, find Angle F in degrees:`, answer: "70", explanation: "180 - 45 - 65 = 70°." };
  if (variant === 5) return { question: `An isosceles triangle has two congruent sides of length ${s1} and a base of ${f * 4}. Find its perimeter:`, answer: String(2 * s1 + f * 4), explanation: "Perimeter = 5f + 5f + 4f = 14f." };
  if (variant === 6) return { question: `How many sides does a triangle have?`, answer: "3", explanation: "A triangle has 3 sides." };
  if (variant === 7) return { question: `If two triangles are congruent by SAS and one included angle is ${f * 30}°, what is the corresponding included angle in the other triangle?`, answer: String(f * 30), explanation: "Corresponding angles of congruent triangles are equal." };
  if (variant === 8) return { question: `In a right triangle with hypotenuse 13 and one leg 5, find the other leg:`, answer: "12", explanation: "sqrt(13² - 5²) = 12." };
  if (variant === 9) return { question: `If Triangle XYZ is equilateral with perimeter ${s1 * 3}, what is the length of XY?`, answer: String(s1), explanation: "Equilateral triangle sides are equal: perimeter / 3." };
  if (variant === 10) return { question: `If Triangle ABC ≅ Triangle XYZ, AC = ${s2}, find XZ:`, answer: String(s2), explanation: "Corresponding sides AC and XZ are equal." };
  if (variant === 11) return { question: `How many minimum corresponding parts must be shown congruent to apply SSS, SAS, ASA, or AAS?`, answer: "3", explanation: "Three corresponding parts." };
  if (variant === 12) return { question: `In an isosceles triangle with vertex angle 40°, what is the measure of each base angle in degrees?`, answer: "70", explanation: "(180 - 40) / 2 = 70°." };
  if (variant === 13) return { question: `If the leg of a right triangle is 6 and hypotenuse is 10, what is the other leg?`, answer: "8", explanation: "sqrt(100 - 36) = 8." };
  return { question: `If two triangles are congruent, what is the ratio of their perimeters?`, answer: "1", explanation: "Congruent triangles have equal perimeters (ratio 1:1)." };
}

function generateGeomUnit6(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const m = 6 * f;
  if (variant === 0) return { question: `How many medians does a triangle have?`, answer: "3", explanation: "Every triangle has 3 medians." };
  if (variant === 1) return { question: `How many angle bisectors does a triangle have?`, answer: "3", explanation: "Every triangle has 3 angle bisectors." };
  if (variant === 2) return { question: `How many perpendicular bisectors does a triangle have?`, answer: "3", explanation: "Every triangle has 3 perpendicular bisectors." };
  if (variant === 3) return { question: `How many altitudes does a triangle have?`, answer: "3", explanation: "Every triangle has 3 altitudes." };
  if (variant === 4) return { question: `The centroid divides a median in a 2:1 ratio. If the shorter segment is ${f * 4}, find the longer segment:`, answer: String(f * 8), explanation: "Longer segment = 2 * shorter segment." };
  if (variant === 5) return { question: `If a median has a total length of ${m}, find the distance from the vertex to the centroid:`, answer: String((2 / 3) * m), explanation: "Distance from vertex to centroid is 2/3 of total median." };
  if (variant === 6) return { question: `If the distance from the centroid to the midpoint of a side is ${f * 3}, what is the total length of the median?`, answer: String(f * 9), explanation: "Total median = 3 * (short segment)." };
  if (variant === 7) return { question: `A midsegment of a triangle connects the midpoints of two sides. If the third side is ${m * 2}, find the midsegment length:`, answer: String(m), explanation: "Midsegment Theorem: midsegment is half the third side." };
  if (variant === 8) return { question: `If a triangle midsegment length is ${m}, find the length of the parallel base:`, answer: String(m * 2), explanation: "Base = 2 * midsegment." };
  if (variant === 9) return { question: `If a midsegment of a triangle has length ${f * 7}, find the sum of the midsegment and the parallel third side:`, answer: String(f * 21), explanation: "Midsegment is 7f and third side is 14f -> sum = 21f." };
  if (variant === 10) return { question: `If a median has total length ${f * 12}, find the shorter segment from centroid to side midpoint:`, answer: String(f * 4), explanation: "Shorter segment = (1/3) * total median." };
  if (variant === 11) return { question: `In a right triangle with legs 6 and 8, what is the length of the hypotenuse (where circumcenter sits at its midpoint)?`, answer: "10", explanation: "Hypotenuse = sqrt(6² + 8²) = 10." };
  if (variant === 12) return { question: `If the hypotenuse of a right triangle is ${f * 14}, what is the distance from its midpoint to each vertex?`, answer: String(f * 7), explanation: "Half of hypotenuse = 7f." };
  if (variant === 13) return { question: `How many midsegments can be drawn inside a single triangle?`, answer: "3", explanation: "Three midsegments." };
  return { question: `In an equilateral triangle, how many of the 4 points of concurrency coincide at the exact same point?`, answer: "4", explanation: "All 4 points (centroid, incenter, circumcenter, orthocenter) coincide." };
}

function generateGeomUnit7(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const n = randInt(5, 12, 1);
  if (variant === 0) return { question: `Find the sum of interior angles of a convex polygon with ${n} sides in degrees:`, answer: String((n - 2) * 180), explanation: "Interior Angle Sum = (n - 2) * 180°." };
  if (variant === 1) return { question: `What is the sum of exterior angles (one at each vertex) of a convex polygon with ${n} sides in degrees?`, answer: "360", explanation: "Exterior angle sum is always 360° for any convex polygon." };
  if (variant === 2) return { question: `Find the measure of each interior angle of a regular hexagon (6 sides) in degrees:`, answer: "120", explanation: "(6 - 2)*180 / 6 = 720 / 6 = 120°." };
  if (variant === 3) return { question: `Find the measure of each exterior angle of a regular octagon (8 sides) in degrees:`, answer: "45", explanation: "360 / 8 = 45°." };
  if (variant === 4) return { question: `If each exterior angle of a regular polygon is 30°, how many sides does the polygon have?`, answer: "12", explanation: "n = 360 / 30 = 12." };
  if (variant === 5) return { question: `If the sum of interior angles of a polygon is 1080°, how many sides does it have?`, answer: "8", explanation: "(n - 2)*180 = 1080 -> n - 2 = 6 -> n = 8." };
  if (variant === 6) return { question: `In a parallelogram, if one angle measures 70°, find the measure of a consecutive angle in degrees:`, answer: "110", explanation: "Consecutive angles in a parallelogram are supplementary (180 - 70 = 110°)." };
  if (variant === 7) return { question: `In a parallelogram, if one angle measures 70°, find the measure of its opposite angle in degrees:`, answer: "70", explanation: "Opposite angles in a parallelogram are congruent." };
  if (variant === 8) return { question: `If the diagonals of a rhombus are 12 and 16, find the side length of the rhombus:`, answer: "10", explanation: "Half diagonals are 6 and 8. Side = sqrt(6² + 8²) = 10." };
  if (variant === 9) return { question: `If the bases of a trapezoid measure ${f * 6} and ${f * 10}, find the length of the midsegment:`, answer: String(f * 8), explanation: "Trapezoid Midsegment = (base1 + base2) / 2." };
  if (variant === 10) return { question: `If a diagonal of a rectangle has length ${f * 10}, what is the length of the other diagonal?`, answer: String(f * 10), explanation: "Diagonals of a rectangle are congruent." };
  if (variant === 11) return { question: `What is the angle in degrees at which the diagonals of a kite intersect?`, answer: "90", explanation: "Diagonals of a kite are perpendicular (90°)." };
  if (variant === 12) return { question: `How many total diagonals can be drawn in a pentagon (5 sides)?`, answer: "5", explanation: "Diagonals = n(n - 3) / 2 = 5(2) / 2 = 5." };
  if (variant === 13) return { question: `How many total diagonals can be drawn in a hexagon (6 sides)?`, answer: "9", explanation: "6(3) / 2 = 9." };
  return { question: `What is the degree measure of each interior angle of a regular pentagon?`, answer: "108", explanation: "(5 - 2)*180 / 5 = 540 / 5 = 108°." };
}

function generateGeomUnit8(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const k = randInt(2, 5, 1);
  const a = 4 * f;
  if (variant === 0) return { question: `Triangle ABC is similar to Triangle DEF with a scale factor of 1:${k}. If AB = ${a}, find DE:`, answer: String(a * k), explanation: "DE = AB * scale factor." };
  if (variant === 1) return { question: `If a triangle has perimeter ${a * 3} and a similar triangle has scale factor ${k}, find the new perimeter:`, answer: String(a * 3 * k), explanation: "Perimeter scales by the scale factor k." };
  if (variant === 2) return { question: `If a square has area 9 and a similar square has scale factor ${k}, find the new area:`, answer: String(9 * k * k), explanation: "Area scales by k²." };
  if (variant === 3) return { question: `If a cube has volume 8 and a similar cube has scale factor ${k}, find the new volume:`, answer: String(8 * k * k * k), explanation: "Volume scales by k³." };
  if (variant === 4) return { question: `If a rectangle has side 4 and a similar rectangle with scale factor 3 has corresponding side x, find x:`, answer: "12", explanation: "4 * 3 = 12." };
  if (variant === 5) return { question: `If two similar spheres have radius ratio 1:4, what is their volume ratio (enter the larger number in 1:N)?`, answer: "64", explanation: "4³ = 64, so volume ratio is 1:64." };
  if (variant === 6) return { question: `A 6-foot tall person casts an 8-foot shadow. At the same time, a tree casts a 32-foot shadow. Find tree height in feet:`, answer: "24", explanation: "h / 32 = 6 / 8 -> h = 24 feet." };
  if (variant === 7) return { question: `In similar triangles ABC and DEF, if Angle A = 55° and Angle B = 65°, find Angle E in degrees:`, answer: "65", explanation: "Corresponding angles of similar triangles are congruent." };
  if (variant === 8) return { question: `Point P(3, 4) is dilated from origin by scale factor ${k}. Find new x-coordinate:`, answer: String(3 * k), explanation: "x' = 3 * k." };
  if (variant === 9) return { question: `Point P(3, 4) is dilated from origin by scale factor ${k}. Find new y-coordinate:`, answer: String(4 * k), explanation: "y' = 4 * k." };
  if (variant === 10) return { question: `Point P(6, 8) is dilated from origin by scale factor 0.5. Find new x-coordinate:`, answer: "3", explanation: "6 * 0.5 = 3." };
  if (variant === 11) return { question: `Point P(6, 8) is dilated from origin by scale factor 0.5. Find new y-coordinate:`, answer: "4", explanation: "8 * 0.5 = 4." };
  if (variant === 12) return { question: `A circle of radius ${a} is dilated by scale factor ${k}. Find the new radius:`, answer: String(a * k), explanation: "New radius = r * k." };
  if (variant === 13) return { question: `A square of side ${a} is dilated by scale factor ${k}. Find the new perimeter:`, answer: String(4 * a * k), explanation: "New perimeter = 4 * a * k." };
  return { question: `If Triangle ABC ~ Triangle XYZ, AB = 6, BC = 9, XY = 10, find YZ:`, answer: "15", explanation: "6 / 10 = 9 / YZ -> 6 * YZ = 90 -> YZ = 15." };
}

function generateGeomUnit9(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const a = 3 * f;
  const b = 4 * f;
  const c = 5 * f;
  if (variant === 0) return { question: `In a right triangle, leg a = ${a} and leg b = ${b}. Find hypotenuse c:`, answer: String(c), explanation: "Pythagorean Theorem: c = sqrt(a² + b²)." };
  if (variant === 1) return { question: `In a right triangle, hypotenuse c = ${c} and leg a = ${a}. Find leg b:`, answer: String(b), explanation: "b = sqrt(c² - a²)." };
  if (variant === 2) return { question: `In a 45°-45°-90° right triangle, if a leg is ${f * 7}, what is hypotenuse squared?`, answer: String(2 * (f * 7) * (f * 7)), explanation: "Hypotenuse = leg * sqrt(2). Square = 2 * leg²." };
  if (variant === 3) return { question: `In a 30°-60°-90° right triangle, if shorter leg is ${f * 5}, find hypotenuse:`, answer: String(f * 10), explanation: "Hypotenuse = 2 * (shorter leg)." };
  if (variant === 4) return { question: `In a 30°-60°-90° right triangle, if hypotenuse is ${f * 12}, find shorter leg:`, answer: String(f * 6), explanation: "Shorter leg = hypotenuse / 2." };
  if (variant === 5) return { question: `In a right triangle with legs 5 and 12, find the hypotenuse:`, answer: "13", explanation: "5² + 12² = 25 + 144 = 169 = 13²." };
  if (variant === 6) return { question: `For a triangle with sides 6, 8, and 11, find c² (11²):`, answer: "121", explanation: "11² = 121 (greater than 6² + 8² = 100, so obtuse)." };
  if (variant === 7) return { question: `For a triangle with sides 6, 8, and 9, find a² + b² (6² + 8²):`, answer: "100", explanation: "6² + 8² = 36 + 64 = 100." };
  if (variant === 8) return { question: `Find the diagonal length of a rectangle with width ${a} and height ${b}:`, answer: String(c), explanation: "Diagonal = sqrt(w² + h²)." };
  if (variant === 9) return { question: `Find altitude to hypotenuse if geometric mean segments on hypotenuse are 4 and 9:`, answer: "6", explanation: "h = sqrt(4 * 9) = 6." };
  if (variant === 10) return { question: `In a right triangle, if leg is 8 and hypotenuse is 17, find the other leg:`, answer: "15", explanation: "sqrt(17² - 8²) = sqrt(289 - 64) = sqrt(225) = 15." };
  if (variant === 11) return { question: `In a right triangle, if leg is 9 and hypotenuse is 41, find the other leg:`, answer: "40", explanation: "sqrt(41² - 9²) = sqrt(1681 - 81) = sqrt(1600) = 40." };
  if (variant === 12) return { question: `What is the perimeter of a right triangle with legs 9 and 12?`, answer: "36", explanation: "c = sqrt(81 + 144) = 15. Perimeter = 9 + 12 + 15 = 36." };
  if (variant === 13) return { question: `Find the square of the altitude height of an equilateral triangle with side length ${f * 2}:`, answer: String(3 * f * f), explanation: "Altitude = side * sqrt(3)/2. Square = 3 * f²." };
  return { question: `In a 45°-45°-90° right triangle, what is (hypotenuse / leg)²?`, answer: "2", explanation: "(sqrt(2))² = 2." };
}

function generateGeomUnit10(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  if (variant === 0) return { question: `In right Triangle ABC with right angle C, opposite leg = ${3 * f} and hypotenuse = ${5 * f}. Find opposite leg length:`, answer: String(3 * f), explanation: "Opposite leg length is 3f." };
  if (variant === 1) return { question: `In right Triangle ABC with right angle C, adjacent leg = ${4 * f} and hypotenuse = ${5 * f}. Find adjacent leg length:`, answer: String(4 * f), explanation: "Adjacent leg length is 4f." };
  if (variant === 2) return { question: `In right Triangle ABC with right angle C, opposite leg = ${3 * f} and adjacent leg = ${4 * f}. Find opposite leg length:`, answer: String(3 * f), explanation: "Opposite leg length is 3f." };
  if (variant === 3) return { question: `In a 30°-60°-90° triangle with hypotenuse ${f * 10}, find the side opposite the 30° angle:`, answer: String(f * 5), explanation: "sin(30°) = 1/2 -> opposite = (1/2) * hypotenuse = 5f." };
  if (variant === 4) return { question: `In a 30°-60°-90° triangle with hypotenuse ${f * 10}, find the side adjacent to the 60° angle:`, answer: String(f * 5), explanation: "cos(60°) = 1/2 -> adjacent = (1/2) * hypotenuse = 5f." };
  if (variant === 5) return { question: `In a 45°-45°-90° right triangle with leg ${f * 8}, find the other leg:`, answer: String(f * 8), explanation: "tan(45°) = 1 -> opposite = adjacent = 8f." };
  if (variant === 6) return { question: `If acute angle A in a right triangle measures 30°, find 90° - A in degrees:`, answer: "60", explanation: "90° - 30° = 60°." };
  if (variant === 7) return { question: `If tan(A) = 1, what is the degree measure of acute angle A?`, answer: "45", explanation: "arctan(1) = 45°." };
  if (variant === 8) return { question: `If sin(A) = 0.5, what is the degree measure of acute angle A?`, answer: "30", explanation: "arcsin(0.5) = 30°." };
  if (variant === 9) return { question: `If cos(A) = 0.5, what is the degree measure of acute angle A?`, answer: "60", explanation: "arccos(0.5) = 60°." };
  if (variant === 10) return { question: `In a right triangle, if angle of elevation is 45° and adjacent ground distance is ${f * 10}, find height:`, answer: String(f * 10), explanation: "height = distance * tan(45°) = distance * 1." };
  if (variant === 11) return { question: `In a right triangle where tan(A) = 3, if the adjacent leg is ${f * 4}, find the opposite leg:`, answer: String(f * 12), explanation: "opposite = tan(A) * adjacent = 3 * 4f = 12f." };
  if (variant === 12) return { question: `In a right triangle where sin(A) = 0.6, if the hypotenuse is ${f * 10}, find the opposite leg:`, answer: String(f * 6), explanation: "opposite = 0.6 * 10f = 6f." };
  if (variant === 13) return { question: `In a right triangle where cos(A) = 0.8, if the hypotenuse is ${f * 10}, find the adjacent leg:`, answer: String(f * 8), explanation: "adjacent = 0.8 * 10f = 8f." };
  return { question: `In any right triangle, (sin A)² + (cos A)² equals what integer value?`, answer: "1", explanation: "Pythagorean Trigonometric Identity." };
}

function generateGeomUnit11(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const w = 4 * f;
  const h = 6 * f;
  if (variant === 0) return { question: `Find the area of a rectangle with width ${w} and height ${h}:`, answer: String(w * h), explanation: "Area = width * height." };
  if (variant === 1) return { question: `Find the perimeter of a rectangle with width ${w} and height ${h}:`, answer: String(2 * (w + h)), explanation: "Perimeter = 2(w + h)." };
  if (variant === 2) return { question: `Find the area of a triangle with base ${w * 2} and height ${h}:`, answer: String(w * h), explanation: "Area = (1/2) * base * height." };
  if (variant === 3) return { question: `Find the area of a parallelogram with base ${w} and height ${h}:`, answer: String(w * h), explanation: "Area = base * height." };
  if (variant === 4) return { question: `Find the area of a trapezoid with bases ${w} and ${w + 6} and height ${f * 4}:`, answer: String((2 * w + 6) * 2 * f), explanation: "Area = (1/2)*(b1 + b2)*h." };
  if (variant === 5) return { question: `Find the area of a rhombus with diagonal lengths 12 and ${f * 10}:`, answer: String(60 * f), explanation: "Area = (1/2) * d1 * d2 = (1/2)*12*10f = 60f." };
  if (variant === 6) return { question: `Find the area coefficient of pi for a circle with radius ${f * 7}:`, answer: String(49 * f * f), explanation: "Area = pi * r² -> coefficient = r²." };
  if (variant === 7) return { question: `Find the circumference coefficient of pi for a circle with radius ${f * 7}:`, answer: String(14 * f), explanation: "Circumference = 2 * pi * r -> coefficient = 2r." };
  if (variant === 8) return { question: `Find the area of a square with side length ${f * 9}:`, answer: String(81 * f * f), explanation: "Area = side²." };
  if (variant === 9) return { question: `Find the perimeter of a regular hexagon with side length ${f * 5}:`, answer: String(30 * f), explanation: "Perimeter = 6 * side." };
  if (variant === 10) return { question: `Find the area of a kite with diagonals 8 and 14:`, answer: "56", explanation: "(1/2) * 8 * 14 = 56." };
  if (variant === 11) return { question: `If the area of a square is 144, find its perimeter:`, answer: "48", explanation: "side = sqrt(144) = 12. Perimeter = 4 * 12 = 48." };
  if (variant === 12) return { question: `If the perimeter of a square is 40, find its area:`, answer: "100", explanation: "side = 40 / 4 = 10. Area = 10² = 100." };
  if (variant === 13) return { question: `Find area of right triangle with legs 10 and 24:`, answer: "120", explanation: "(1/2) * 10 * 24 = 120." };
  return { question: `Find perimeter of an equilateral triangle with side length ${f * 8}:`, answer: String(24 * f), explanation: "Perimeter = 3 * side." };
}

function generateGeomUnit12(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const r = 6 * f;
  if (variant === 0) return { question: `If a circle has radius ${r}, find its diameter length:`, answer: String(2 * r), explanation: "Diameter = 2 * radius." };
  if (variant === 1) return { question: `A line tangent to a circle intersects the radius at the point of tangency at what degree angle?`, answer: "90", explanation: "Tangent Radius Theorem: angle is 90°." };
  if (variant === 2) return { question: `If a central angle of a circle measures 80°, what is the degree measure of its intercepted arc?`, answer: "80", explanation: "Central angle degree measure equals intercepted arc measure." };
  if (variant === 3) return { question: `If an inscribed angle of a circle measures 40°, what is the degree measure of its intercepted arc?`, answer: "80", explanation: "Inscribed angle is half the intercepted arc measure (Arc = 2 * 40 = 80°)." };
  if (variant === 4) return { question: `If an inscribed angle intercepts a semicircle, what is its degree measure?`, answer: "90", explanation: "Thales's Theorem: angle inscribed in semicircle is 90°." };
  if (variant === 5) return { question: `If two chords intersect inside a circle, creating vertical angles that intercept arcs of 40° and 80°, find the vertical angle measure:`, answer: "60", explanation: "Angle = (arc1 + arc2) / 2 = (40 + 80) / 2 = 60°." };
  if (variant === 6) return { question: `Two secants intersect outside a circle intercepting arcs of 100° and 30°. Find the exterior angle degree measure:`, answer: "35", explanation: "Angle = (far arc - near arc) / 2 = (100 - 30) / 2 = 35°." };
  if (variant === 7) return { question: `If a chord of length 16 is 6 units from the center of a circle, find the circle radius:`, answer: "10", explanation: "Half chord = 8. Radius = sqrt(8² + 6²) = 10." };
  if (variant === 8) return { question: `If two intersecting chords satisfy 3 * x = 4 * 6, find x:`, answer: "8", explanation: "Intersecting Chords Theorem: 3x = 24 -> x = 8." };
  if (variant === 9) return { question: `If two tangent segments are drawn to a circle from the same exterior point and one has length ${r}, find the other tangent length:`, answer: String(r), explanation: "Tangent segments from the same exterior point are congruent." };
  if (variant === 10) return { question: `What is the measure of a full circle arc in degrees?`, answer: "360", explanation: "360°." };
  if (variant === 11) return { question: `If a circle has radius ${r}, what is the length of its longest chord (diameter)?`, answer: String(2 * r), explanation: "Longest chord is the diameter = 2r." };
  if (variant === 12) return {question: `In a cyclic quadrilateral inscribed in a circle, if one angle measures ${f * 70}°, what is the measure of its opposite angle?`, answer: String(180 - f * 70), explanation: "Opposite angles of an inscribed quadrilateral are supplementary."};
  if (variant === 13) return { question: `If intercepted arc is 140°, find its inscribed angle degree measure:`, answer: "70", explanation: "140 / 2 = 70°." };
  return { question: `How many points of intersection does a tangent line share with a circle?`, answer: "1", explanation: "A tangent line touches a circle at exactly 1 point." };
}

function generateGeomUnit13(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const r = 6 * f;
  if (variant === 0) return { question: `Find the arc length coefficient of pi for a 60° arc in a circle of radius ${r}:`, answer: String((60 / 360) * 2 * r), explanation: "Arc Length = (theta / 360) * 2 * pi * r." };
  if (variant === 1) return { question: `Find the sector area coefficient of pi for a 60° sector in a circle of radius ${r}:`, answer: String((60 / 360) * r * r), explanation: "Sector Area = (theta / 360) * pi * r²." };
  if (variant === 2) return { question: `Find the arc length coefficient of pi for a 90° arc in a circle of radius ${r}:`, answer: String((90 / 360) * 2 * r), explanation: "Arc Length = (1/4) * 2 * pi * r." };
  if (variant === 3) return { question: `Find the sector area coefficient of pi for a 90° sector in a circle of radius ${r}:`, answer: String((90 / 360) * r * r), explanation: "Sector Area = (1/4) * pi * r²." };
  if (variant === 4) return { question: `Find the arc length coefficient of pi for a 180° semicircle arc in a circle of radius ${r}:`, answer: String(r), explanation: "(1/2) * 2 * pi * r = pi * r." };
  if (variant === 5) return { question: `Find the sector area coefficient of pi for a 180° semicircle sector in a circle of radius ${r}:`, answer: String((1 / 2) * r * r), explanation: "(1/2) * pi * r²." };
  if (variant === 6) return { question: `How many 45° sectors fit inside a full 360° circle?`, answer: "8", explanation: "360 / 45 = 8." };
  if (variant === 7) return { question: `How many 120° sectors fit inside a full 360° circle?`, answer: "3", explanation: "360 / 120 = 3." };
  if (variant === 8) return { question: `If sector area coefficient of pi is 25 in a 90° sector, find radius r:`, answer: "10", explanation: "(1/4) * r² = 25 -> r² = 100 -> r = 10." };
  if (variant === 9) return { question: `If arc length coefficient of pi is 4 in a 90° arc, find radius r:`, answer: "8", explanation: "(1/4) * 2r = 4 -> r/2 = 4 -> r = 8." };
  if (variant === 10) return { question: `Find central angle degree measure if sector area is (1/6) of total circle area:`, answer: "60", explanation: "360 / 6 = 60°." };
  if (variant === 11) return { question: `Find central angle degree measure if arc length is (1/3) of total circumference:`, answer: "120", explanation: "360 / 3 = 120°." };
  if (variant === 12) return { question: `How many 30° sectors fit inside a complete circle without overlap?`, answer: "12", explanation: "360 / 30 = 12." };
  if (variant === 13) return { question: `If circle radius is 12, find area coefficient of pi for a 30° sector:`, answer: "12", explanation: "(30 / 360) * 144 = (1/12) * 144 = 12." };
  return { question: `If circle radius is 12, find arc length coefficient of pi for a 30° arc:`, answer: "2", explanation: "(30 / 360) * 24 = (1/12) * 24 = 2." };
}

function generateGeomUnit14(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const s = 4 * f;
  if (variant === 0) return { question: `Find the total surface area of a cube with edge length ${s}:`, answer: String(6 * s * s), explanation: "Surface Area = 6 * side²." };
  if (variant === 1) return { question: `Find the lateral surface area of a cube with edge length ${s}:`, answer: String(4 * s * s), explanation: "Lateral Area = 4 * side²." };
  if (variant === 2) return { question: `Find total surface area of a rectangular prism with length 3, width 4, height ${f * 5}:`, answer: String(2 * (12 + 15 * f + 20 * f)), explanation: "SA = 2(lw + lh + wh)." };
  if (variant === 3) return { question: `Find lateral area coefficient of pi for a cylinder with radius ${f * 3} and height ${f * 5}:`, answer: String(30 * f * f), explanation: "Lateral Area = 2 * pi * r * h -> coefficient = 30f²." };
  if (variant === 4) return { question: `Find total surface area coefficient of pi for a cylinder with radius ${f * 3} and height ${f * 5}:`, answer: String(48 * f * f), explanation: "SA = 2πrh + 2πr² -> coefficient = 30f² + 18f² = 48f²." };
  if (variant === 5) return { question: `Find surface area coefficient of pi for a sphere with radius ${f * 5}:`, answer: String(100 * f * f), explanation: "SA = 4 * pi * r² -> coefficient = 100f²." };
  if (variant === 6) return { question: `Find total surface area of a regular square pyramid with base edge 6 and slant height 10:`, answer: "156", explanation: "Base area = 36. Lateral area = 4 * (1/2 * 6 * 10) = 120. Total SA = 36 + 120 = 156." };
  if (variant === 7) return { question: `How many total faces does a triangular prism possess?`, answer: "5", explanation: "2 triangular bases + 3 rectangular sides = 5 faces." };
  if (variant === 8) return { question: `How many total vertices does a rectangular prism possess?`, answer: "8", explanation: "8 vertices." };
  if (variant === 9) return { question: `How many total edges does a cube possess?`, answer: "12", explanation: "12 edges." };
  if (variant === 10) return { question: `Find total surface area of a cube if its volume is 64:`, answer: "96", explanation: "side = 4. SA = 6 * 4² = 96." };
  if (variant === 11) return { question: `Find lateral area coefficient of pi for a cone with radius 6 and slant height 10:`, answer: "60", explanation: "Lateral Area = pi * r * l = 60pi." };
  if (variant === 12) return { question: `Find total surface area coefficient of pi for a cone with radius 6 and slant height 10:`, answer: "96", explanation: "SA = pi*r*l + pi*r² = 60pi + 36pi = 96pi." };
  if (variant === 13) return { question: `How many lateral faces does a pentagonal pyramid possess?`, answer: "5", explanation: "5 triangular lateral faces." };
  return { question: `How many dimensions does surface area measure?`, answer: "2", explanation: "Surface area is 2-dimensional." };
}

function generateGeomUnit15(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const w = 3 * f;
  const h = 4 * f;
  const l = 5 * f;
  if (variant === 0) return { question: `Find volume of a rectangular prism with width ${w}, length ${l}, height ${h}:`, answer: String(w * l * h), explanation: "Volume = length * width * height." };
  if (variant === 1) return { question: `Find volume of a cube with edge length ${f * 4}:`, answer: String(64 * f * f * f), explanation: "Volume = edge³." };
  if (variant === 2) return { question: `Find volume coefficient of pi for a cylinder with radius ${f * 3} and height ${f * 5}:`, answer: String(45 * f * f * f), explanation: "Volume = pi * r² * h -> coefficient = 45f³." };
  if (variant === 3) return { question: `Find volume coefficient of pi for a cone with radius ${f * 3} and height ${f * 6}:`, answer: String(18 * f * f * f), explanation: "Volume = (1/3) * pi * r² * h -> (1/3) * 9 * 6 * f³ = 18f³." };
  if (variant === 4) return { question: `Find volume of a square pyramid with base side ${f * 6} and height ${f * 5}:`, answer: String(60 * f * f * f), explanation: "Volume = (1/3) * base_area * h = 60f³." };
  if (variant === 5) return { question: `If a rectangular prism has volume 120 and base area 24, find its height:`, answer: "5", explanation: "Height = Volume / base_area = 120 / 24 = 5." };
  if (variant === 6) return { question: `If a cone has volume coefficient of pi = 48 and height 9, find radius r:`, answer: "4", explanation: "(1/3) * r² * 9 = 48 -> r² = 16 -> r = 4." };
  if (variant === 7) return { question: `If scale factor of two similar prisms is 3, what is their volume ratio?`, answer: "27", explanation: "Volume ratio = scale_factor³ = 3³ = 27." };
  if (variant === 8) return { question: `If volume of a cube is 125, find its edge length:`, answer: "5", explanation: "edge = cbrt(125) = 5." };
  if (variant === 9) return { question: `Find volume coefficient of pi for a cylinder with radius 4 and height 10:`, answer: "160", explanation: "r² * h = 16 * 10 = 160." };
  if (variant === 10) return { question: `Find volume of a triangular prism with right triangle base legs 6, 8 and prism height 10:`, answer: "240", explanation: "Base area = (1/2)*6*8 = 24. Volume = 24 * 10 = 240." };
  if (variant === 11) return { question: `Find volume coefficient of pi for a cone with radius 6 and height 8:`, answer: "96", explanation: "(1/3) * 36 * 8 = 96." };
  if (variant === 12) return { question: `If height of a cylinder is doubled while radius remains constant, by what factor does volume increase?`, answer: "2", explanation: "Volume scales linearly with height." };
  if (variant === 13) return { question: `If radius of a cylinder is doubled while height remains constant, by what factor does volume increase?`, answer: "4", explanation: "Volume scales with r² -> 2² = 4." };
  return { question: `How many dimensions does volume measure?`, answer: "3", explanation: "Volume is 3-dimensional." };
}

function generateGeomUnit16(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const r = 3 * f;
  if (variant === 0) return { question: `Find volume coefficient of pi for a sphere with radius ${r}:`, answer: String(36 * f * f * f), explanation: "Volume = (4/3) * pi * r³ -> coefficient = 36f³." };
  if (variant === 1) return { question: `Find surface area coefficient of pi for a sphere with radius ${r}:`, answer: String(36 * f * f), explanation: "Surface Area = 4 * pi * r² -> coefficient = 36f²." };
  if (variant === 2) return { question: `Find volume coefficient of pi for a hemisphere with radius ${r}:`, answer: String(18 * f * f * f), explanation: "Volume = (2/3) * pi * r³ -> coefficient = 18f³." };
  if (variant === 3) return { question: `Find curved surface area coefficient of pi for a hemisphere with radius ${r}:`, answer: String(18 * f * f), explanation: "Curved SA = 2 * pi * r² -> coefficient = 18f²." };
  if (variant === 4) return { question: `Find total surface area coefficient of pi (including base) for a hemisphere with radius ${r}:`, answer: String(27 * f * f), explanation: "Total SA = 3 * pi * r² -> coefficient = 27f²." };
  if (variant === 5) return { question: `If sphere surface area coefficient of pi is 144, find radius r:`, answer: "6", explanation: "4 * r² = 144 -> r² = 36 -> r = 6." };
  if (variant === 6) return { question: `If sphere volume coefficient of pi is 288, find radius r:`, answer: "6", explanation: "(4/3) * r³ = 288 -> r³ = 216 -> r = 6." };
  if (variant === 7) return { question: `If sphere radius is doubled, by what factor does its surface area increase?`, answer: "4", explanation: "2² = 4." };
  if (variant === 8) return { question: `If sphere radius is doubled, by what factor does its volume increase?`, answer: "8", explanation: "2³ = 8." };
  if (variant === 9) return { question: `If a great circle of a sphere has radius ${r}, find the diameter of that great circle:`, answer: String(2 * r), explanation: "Diameter = 2 * radius." };
  if (variant === 10) return { question: `Find diameter of a sphere if its surface area coefficient of pi is 100:`, answer: "10", explanation: "4r² = 100 -> r = 5 -> diameter = 10." };
  if (variant === 11) return { question: `Find radius of a sphere if its volume coefficient of pi is 36:`, answer: "3", explanation: "(4/3)r³ = 36 -> r³ = 27 -> r = 3." };
  if (variant === 12) return { question: `What is the Euler Characteristic (V - E + F) for a convex polyhedron?`, answer: "2", explanation: "Euler's formula gives V - E + F = 2." };
  if (variant === 13) return { question: `If hemisphere radius is 6, find its volume coefficient of pi:`, answer: "144", explanation: "(2/3) * 216 = 144." };
  return { question: `If hemisphere radius is 6, find its curved surface area coefficient of pi:`, answer: "72", explanation: "2 * 36 = 72." };
}

function generateGeomUnit17(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const x1 = 2 * f;
  const y1 = 3 * f;
  const x2 = 8 * f;
  const y2 = 11 * f;
  if (variant === 0) return { question: `Find distance between points (0, 0) and (${3 * f}, ${4 * f}):`, answer: String(5 * f), explanation: "Distance = sqrt((3f)² + (4f)²) = 5f." };
  if (variant === 1) return { question: `Find midpoint x-coordinate for points (${x1}, ${y1}) and (${x2}, ${y2}):`, answer: String((x1 + x2) / 2), explanation: "Midpoint x = (x1 + x2) / 2." };
  if (variant === 2) return { question: `Find midpoint y-coordinate for points (${x1}, ${y1}) and (${x2}, ${y2}):`, answer: String((y1 + y2) / 2), explanation: "Midpoint y = (y1 + y2) / 2." };
  if (variant === 3) return { question: `Find slope of line passing through points (2, 5) and (6, 17):`, answer: "3", explanation: "Slope = (17 - 5) / (6 - 2) = 12 / 4 = 3." };
  if (variant === 4) return { question: `Find distance between points (1, 2) and (7, 10):`, answer: "10", explanation: "sqrt((7-1)² + (10-2)²) = sqrt(36 + 64) = 10." };
  if (variant === 5) return { question: `Find distance between points (-3, -4) and (3, 4):`, answer: "10", explanation: "sqrt(6² + 8²) = 10." };
  if (variant === 6) return { question: `Find midpoint x-coordinate between (-6, 8) and (10, -2):`, answer: "2", explanation: "(-6 + 10) / 2 = 2." };
  if (variant === 7) return { question: `Find midpoint y-coordinate between (-6, 8) and (10, -2):`, answer: "3", explanation: "(8 + -2) / 2 = 3." };
  if (variant === 8) return { question: `Find x-intercept of line 2x - 3y = 12 when y = 0:`, answer: "6", explanation: "2x = 12 -> x = 6." };
  if (variant === 9) return { question: `Find y-intercept of line 2x - 3y = 12 when x = 0:`, answer: "-4", explanation: "-3y = 12 -> y = -4." };
  if (variant === 10) return { question: `Find slope of horizontal line y = ${f * 4}:`, answer: "0", explanation: "Horizontal lines have slope 0." };
  if (variant === 11) return { question: `What quadrant number (1-4) contains point (-4, 5)?`, answer: "2", explanation: "Quadrant II (-x, +y)." };
  if (variant === 12) return { question: `What quadrant number (1-4) contains point (4, -5)?`, answer: "4", explanation: "Quadrant IV (+x, -y)." };
  if (variant === 13) return { question: `Find distance between points (5, 9) and (5, 20):`, answer: "11", explanation: "|20 - 9| = 11." };
  return { question: `Find distance between points (4, 7) and (19, 7):`, answer: "15", explanation: "|19 - 4| = 15." };
}

function generateGeomUnit18(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const h = 3 * f;
  const k = 4 * f;
  const r = 5 * f;
  if (variant === 0) return { question: `Find radius r of circle with equation (x - ${h})² + (y - ${k})² = ${r * r}:`, answer: String(r), explanation: "Radius = sqrt(r²)." };
  if (variant === 1) return { question: `Find center x-coordinate of circle with equation (x - ${h})² + (y - ${k})² = ${r * r}:`, answer: String(h), explanation: "Center h." };
  if (variant === 2) return { question: `Find center y-coordinate of circle with equation (x - ${h})² + (y - ${k})² = ${r * r}:`, answer: String(k), explanation: "Center k." };
  if (variant === 3) return { question: `Find center x-coordinate of circle with equation (x + ${h})² + (y + ${k})² = 36:`, answer: String(-h), explanation: "Equation (x - h)² -> center x = -h." };
  if (variant === 4) return { question: `Find center y-coordinate of circle with equation (x + ${h})² + (y + ${k})² = 36:`, answer: String(-k), explanation: "Equation (y - k)² -> center y = -k." };
  if (variant === 5) return { question: `Find r² value for circle centered at origin passing through point (3, 4):`, answer: "25", explanation: "3² + 4² = 25." };
  if (variant === 6) return { question: `For circle x² + y² = 25, what is x² + y² at point (3, 4)?`, answer: "25", explanation: "3² + 4² = 25." };
  if (variant === 7) return { question: `For circle x² + y² = 25, what is x² + y² at point (2, 5)?`, answer: "29", explanation: "2² + 5² = 29." };
  if (variant === 8) return { question: `Find area coefficient of pi for circle (x - 2)² + (y - 5)² = 49:`, answer: "49", explanation: "Area = pi * r² = 49pi." };
  if (variant === 9) return { question: `Find circumference coefficient of pi for circle (x - 2)² + (y - 5)² = 49:`, answer: "14", explanation: "r = 7. Circumference = 2 * pi * r = 14pi." };
  if (variant === 10) return { question: `Find radius of circle given by equation x² + y² = 81:`, answer: "9", explanation: "sqrt(81) = 9." };
  if (variant === 11) return { question: `Find radius of standard unit circle x² + y² = 1:`, answer: "1", explanation: "sqrt(1) = 1." };
  if (variant === 12) return { question: `Find center x-coordinate for standard unit circle x² + y² = 1:`, answer: "0", explanation: "Origin (0,0)." };
  if (variant === 13) return { question: `Find diameter of circle with equation (x - 1)² + (y - 1)² = 36:`, answer: "12", explanation: "r = 6 -> diameter = 12." };
  return { question: `Find r² for circle centered at (2, 3) with radius 8:`, answer: "64", explanation: "r² = 8² = 64." };
}

function generateGeomUnit19(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const x = 3 * f;
  const y = 4 * f;
  if (variant === 0) return { question: `If point (${x}, ${y}) is translated by vector (2, 5), find new x-coordinate:`, answer: String(x + 2), explanation: "x' = x + 2." };
  if (variant === 1) return { question: `If point (${x}, ${y}) is translated by vector (2, 5), find new y-coordinate:`, answer: String(y + 5), explanation: "y' = y + 5." };
  if (variant === 2) return { question: `Reflect point (${x}, ${y}) across the x-axis. Find new y-coordinate:`, answer: String(-y), explanation: "(x, y) -> (x, -y)." };
  if (variant === 3) return { question: `Reflect point (${x}, ${y}) across the y-axis. Find new x-coordinate:`, answer: String(-x), explanation: "(x, y) -> (-x, y)." };
  if (variant === 4) return { question: `Reflect point (${x}, ${y}) across line y = x. Find new x-coordinate:`, answer: String(y), explanation: "(x, y) -> (y, x)." };
  if (variant === 5) return { question: `Rotate point (${x}, ${y}) 180° counterclockwise about origin. Find new x-coordinate:`, answer: String(-x), explanation: "(x, y) -> (-x, -y)." };
  if (variant === 6) return { question: `Rotate point (${x}, ${y}) 180° counterclockwise about origin. Find new y-coordinate:`, answer: String(-y), explanation: "(x, y) -> (-x, -y)." };
  if (variant === 7) return { question: `Rotate point (4, 0) 90° counterclockwise about origin. Find new y-coordinate:`, answer: "4", explanation: "(4, 0) -> (0, 4)." };
  if (variant === 8) return { question: `Dilate point (${x}, ${y}) from origin by scale factor 3. Find new x-coordinate:`, answer: String(x * 3), explanation: "x' = 3 * x." };
  if (variant === 9) return { question: `Dilate point (${x}, ${y}) from origin by scale factor 3. Find new y-coordinate:`, answer: String(y * 3), explanation: "y' = 3 * y." };
  if (variant === 10) return { question: `How many lines of symmetry does a regular pentagon possess?`, answer: "5", explanation: "Regular n-gon has n lines of symmetry." };
  if (variant === 11) return { question: `How many lines of symmetry does a regular hexagon possess?`, answer: "6", explanation: "6 lines of symmetry." };
  if (variant === 12) return { question: `What is the order of rotational symmetry for a regular square?`, answer: "4", explanation: "360 / 90 = 4." };
  if (variant === 13) return { question: `Point (${x}, ${y}) is translated by vector (-${x}, -${y}). Find new x-coordinate:`, answer: "0", explanation: "x - x = 0." };
  return { question: `Dilate point (${x}, ${y}) from origin by scale factor 2. Find new x-coordinate:`, answer: String(x * 2), explanation: "x' = 2 * x." };
}

function generateGeomUnit20(lvl, variant, seed, randInt) {
  const f = 1 + Math.floor((lvl - 1) / 3);
  const segLen = 20 * f;
  const subLen = 5 * f;
  if (variant === 0) return { question: `A point is selected randomly on a segment of length ${segLen}. If a subsegment has length ${subLen}, find probability percentage:`, answer: "25", explanation: "(5f / 20f) * 100 = 25%." };
  if (variant === 1) return { question: `A point is selected randomly inside a square target of side 10 (area 100) with shaded square region of side 4 (area 16). Find probability percentage:`, answer: "16", explanation: "(16 / 100) * 100 = 16%." };
  if (variant === 2) return { question: `How many non-collinear points are required to uniquely define a plane?`, answer: "3", explanation: "Three non-collinear points determine a plane." };
  if (variant === 3) return { question: `How many distinct points are required to uniquely define a straight line?`, answer: "2", explanation: "Two points determine a line." };
  if (variant === 4) return { question: `If a line segment has length ${f * 16}, what is half its length?`, answer: String(f * 8), explanation: "Half of 16f is 8f." };
  if (variant === 5) return { question: `If a circle has a 90° arc, how many 90° arcs make up a full circle?`, answer: "4", explanation: "360 / 90 = 4." };
  if (variant === 6) return { question: `What is the probability of selecting an even number from integers 1 through 10 in percentage?`, answer: "50", explanation: "5 / 10 = 50%." };
  if (variant === 7) return { question: `What is the probability of selecting a prime number from integers 1 through 10 in percentage?`, answer: "40", explanation: "Primes: 2, 3, 5, 7 (4 / 10 = 40%)." };
  if (variant === 8) return { question: `If a spinner is divided into 10 equal sectors, what is the probability percentage of landing on a single target sector?`, answer: "10", explanation: "1 / 10 = 10%." };
  if (variant === 9) return { question: `What is the geometric probability percentage of landing inside a central 90° sector of a full 360° target circle?`, answer: "25", explanation: "(90 / 360) * 100 = 25%." };
  if (variant === 10) return { question: `What is the probability percentage of an impossible geometric event?`, answer: "0", explanation: "0% probability." };
  if (variant === 11) return { question: `What is the probability percentage of a certain geometric event?`, answer: "100", explanation: "100% probability." };
  if (variant === 12) return { question: `A segment AB has length ${f * 12}. What is the length of each half when bisected?`, answer: String(f * 6), explanation: "12f / 2 = 6f." };
  if (variant === 13) return { question: `If a point is randomly dropped on a line segment of length 12, what is probability percentage of landing on a 3-unit section?`, answer: "25", explanation: "(3 / 12) * 100 = 25%." };
  return { question: `How many parallel lines can be drawn through a given point not on a line in Euclidean Geometry?`, answer: "1", explanation: "Playfair's Axiom: exactly 1 parallel line." };
}

export { GEOMETRY_UNITS, generateGeometry };