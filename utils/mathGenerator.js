import { generateAddition } from './generators/addition';
import { generateSubtraction } from './generators/subtraction';
import { generateMultiplication } from './generators/multiplication';
import { generateDivisionProblem } from './generators/division';
import { generatePrealgebra } from './generators/prealgebra';
import { generateAlgebraProblem } from './generators/algebra';
import { generateAlgebra2Problem } from './generators/algebra2';
import { generateGeometryProblem } from './generators/geometry';
import { generatePrecalcProblem } from './generators/precalc';
import { generateStatisticsProblem } from './generators/statistics';
import { generateCalculusProblem } from './generators/calculus';

export function generateProblem(subject, unit, level, index = 0) {
  let problemObj;

  if (subject === 'addition') {
    problemObj = generateAddition(unit, level, index);
  } else if (subject === 'subtraction') {
    problemObj = generateSubtraction(unit, level, index);
  } else if (subject === 'multiplication') {
    problemObj = generateMultiplication(unit, level, index);
  } else if (subject === 'division') {
    problemObj = generateDivisionProblem(unit, level, index);
  } else if (subject === 'prealgebra' || subject === 'pre-algebra') {
    problemObj = generatePrealgebra(unit, level, index);
  } else if (subject === 'algebra') {
    problemObj = generateAlgebraProblem(unit, level, index);
  } else if (subject === 'algebra2' || subject === 'algebra-2') {
    problemObj = generateAlgebra2Problem(unit, level, index);
  } else if (subject === 'geometry') {
    problemObj = generateGeometryProblem(unit, level, index);
  } else if (subject === 'precalc' || subject === 'pre-calculus') {
    problemObj = generatePrecalcProblem(unit, level, index);
  } else if (subject === 'statistics' || subject === 'stats') {
    problemObj = generateStatisticsProblem(unit, level, index);
  } else if (subject === 'calculus' || subject === 'calc') {
    problemObj = generateCalculusProblem(unit, level, index);
  } else {
    // Default fallback with index variation
    const fallbackAns = 3 + index;
    problemObj = { question: `${1 + index} + 2`, correctAnswer: fallbackAns, choices: [fallbackAns - 1, fallbackAns, fallbackAns + 1, fallbackAns + 2] };
  }

  const ans = problemObj.correctAnswer !== undefined ? problemObj.correctAnswer : problemObj.answer;
  const choices = problemObj.choices ? problemObj.choices : shuffleArray([
    ans,
    ans + 10,
    ans >= 20 ? ans - 20 : ans + 20,
    ans + 30
  ]);

  return {
    question: problemObj.question,
    correctAnswer: ans,
    unit: problemObj.unitName ? `Unit ${problemObj.unit}: ${problemObj.unitName}` : (problemObj.unit || ''),
    unitName: problemObj.unitName || '',
    displayString: problemObj.displayString || '',
    choices: shuffleArray(choices)
  };
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}