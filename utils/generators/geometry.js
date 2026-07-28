// geometry.js - High School Geometry Problem Generator (Units 1-20)

export function generateGeometryProblem(unit, level, index = 0) {
  let unitNum = parseInt(unit) || 1;
  let question = "";
  let answer = 0;

  switch (unitNum) {
    case 1: {
      // Essentials of Geometry & Transformations (Segment addition: AB + BC = AC)
      const ab = 5 + (index % 10) + level * 2;
      const bc = 7 + ((index * 3) % 8) + level;
      answer = ab + bc;
      question = `On a line segment AC, point B is between A and C. If segment AB = ${ab} and segment BC = ${bc}, what is the total length of segment AC?`;
      break;
    }
    case 2: {
      // Angles and Parallel Lines (Complementary/Supplementary/Vertical)
      const baseAngle = 30 + (index * 7) % 50;
      answer = 180 - baseAngle;
      question = `Two angles form a linear pair. If the measure of the first angle is ${baseAngle}°, what is the measure of the second angle?`;
      break;
    }
    case 3: {
      // Congruent Triangles & Proofs (Corresponding parts are congruent CPCTC)
      const sideVal = 12 + (index * 4) % 15;
      answer = sideVal;
      question = `Triangle ABC is congruent to Triangle DEF. If side AB = ${sideVal}, what is the length of the corresponding side DE?`;
      break;
    }
    case 4: {
      // Relationships Within Triangles (Triangle Midsegment Theorem)
      const baseSide = 20 + ((index * 6) % 20) * 2;
      answer = baseSide / 2;
      question = `In a triangle, a midsegment is parallel to the third side. If the length of the third side is ${baseSide}, what is the length of the midsegment?`;
      break;
    }
    case 5: {
      // Polygons and Quadrilaterals (Interior angle sum)
      const n = 5 + (index % 5); // Pentagon to octagon
      answer = (n - 2) * 180;
      question = `What is the sum of the interior angle measures of a convex polygon with ${n} sides?`;
      break;
    }
    case 6: {
      // Similarity & Ratios (Similar triangles ratio scaling)
      const scale = 2 + (index % 3);
      const smallSide = 6 + (index % 5);
      answer = smallSide * scale;
      question = `Two similar triangles have a scale factor of 1:${scale}. If a side length on the smaller triangle is ${smallSide}, what is the length of the corresponding side on the larger triangle?`;
      break;
    }
    case 7: {
      // Right Triangles and Trigonometry (Pythagorean Triples: 3-4-5 scaled)
      const multiplier = 2 + (index % 4);
      const a = 3 * multiplier;
      const b = 4 * multiplier;
      answer = 5 * multiplier;
      question = `In a right triangle, the two legs measure ${a} and ${b}. Find the length of the hypotenuse.`;
      break;
    }
    case 8: {
      // Coordinate Geometry Proofs (Perpendicular slopes)
      const slope = 2 + (index % 5);
      // Let's frame it as finding the negative reciprocal or checking parallel/perpendicular
      answer = -slope;
      question = `Line L has a slope of ${slope}. What is the slope of a line parallel to Line L?`;
      break;
    }
    case 9: {
      // Circles, Arcs, and Chords (Central angle equals arc measure)
      const centralAngle = 40 + (index * 11) % 100;
      answer = centralAngle;
      question = `A central angle of a circle measures ${centralAngle}°. What is the measure of its intercepted arc in degrees?`;
      break;
    }
    case 10: {
      // Secants, Tangents, and Angle Measures (Inscribed angle is half of arc)
      const arcMeasure = 60 + (index * 10) % 80;
      answer = arcMeasure / 2;
      question = `An inscribed angle in a circle intercepts an arc that measures ${arcMeasure}°. What is the measure of the inscribed angle?`;
      break;
    }
    case 11: {
      // Circumference, Area, and Sector Metrics (Circumference with pi = 3)
      const radius = 6 + (index % 5);
      answer = 2 * 3 * radius;
      question = `Find the circumference of a circle with a radius of ${radius}. (Use 3 for pi)`;
      break;
    }
    case 12: {
      // Two-Dimensional Area and Perimeter (Trapezoid or Parallelogram area)
      const base1 = 10 + (index % 6);
      const base2 = 6 + (index % 4);
      const height = 4 + (index % 3) * 2;
      answer = ((base1 + base2) / 2) * height;
      question = `Find the area of a trapezoid with parallel bases of ${base1} and ${base2}, and a height of ${height}.`;
      break;
    }
    case 13: {
      // Three-Dimensional Solids & Surface Area (Rectangular prism surface area)
      const l = 4 + (index % 3);
      const w = 3 + (index % 4);
      const h = 5 + (index % 2);
      answer = 2 * (l * w + l * h + w * h);
      question = `Find the total surface area of a rectangular prism with length ${l}, width ${w}, and height ${h}.`;
      break;
    }
    case 14: {
      // Volume of Prisms, Cylinders, Pyramids, and Cones (Rectangular prism volume)
      const l = 5 + (index % 4);
      const w = 4 + (index % 3);
      const h = 6 + (index % 5);
      answer = l * w * h;
      question = `Find the volume of a rectangular prism with length ${l}, width ${w}, and height ${h}.`;
      break;
    }
    case 15: {
      // Spheres and Composite Solids (Cylinder volume using pi = 3)
      const r = 3 + (index % 3);
      const h = 10 + (index % 4);
      answer = 3 * r * r * h;
      question = `Find the volume of a cylinder with radius ${r} and height ${h}. (Use 3 for pi)`;
      break;
    }
    case 16: {
      // Rigid Transformations and Symmetry (Translation coordinate sum)
      const x = 2 + (index % 5);
      const y = 3 + (index % 4);
      const dx = 4 + (index % 3);
      const dy = 5 + (index % 2);
      answer = x + dx;
      question = `A point at (${x}, ${y}) is translated right by ${dx} units and up by ${dy} units. What is the new x-coordinate?`;
      break;
    }
    case 17: {
      // Dilations and Scale Factor Proportions (Dilation coordinate product)
      const scale = 2 + (index % 3);
      const originalCoord = 4 + (index % 5);
      answer = originalCoord * scale;
      question = `A point at coordinate (${originalCoord}, 6) is dilated from the origin by a scale factor of ${scale}. What is the new x-coordinate?`;
      break;
    }
    case 18: {
      // Equations of Circles in the Coordinate Plane (Radius from r squared)
      const radiusVal = 5 + (index % 6);
      answer = radiusVal;
      question = `A circle has the equation x² + y² = ${radiusVal * radiusVal}. What is the radius of the circle?`;
      break;
    }
    case 19: {
      // Geometric Modeling and Design Applications (Scaling scale model length)
      const modelLen = 5 + (index % 5);
      const scaleFactor = 4 + (index % 4);
      answer = modelLen * scaleFactor;
      question = `An architectural model is built using a scale of 1 inch to ${scaleFactor} feet. If a wall measures ${modelLen} inches on the model, what is the actual length of the wall in feet?`;
      break;
    }
    case 20: {
      // Advanced Geometric Proofs & Loci (Polygon diagonal count)
      const sides = 6 + (index % 4); // Hexagon, heptagon, etc.
      // Number of diagonals formula: n(n-3)/2
      answer = (sides * (sides - 3)) / 2;
      question = `How many total diagonals can be drawn inside a convex polygon with ${sides} sides?`;
      break;
    }
  }

  // Generate close distractor choices (integer values tightly packed around the answer)
  const choices = [
    answer,
    answer + 2,
    answer > 3 ? answer - 2 : answer + 4,
    answer + 4
  ];

  return {
    unit: unitNum,
    unitName: "High School Geometry",
    question: question,
    correctAnswer: answer,
    choices: choices
  };
}