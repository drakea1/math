// statistics.js - College-Level Statistics Problem Generator (Units 1-20)

export function generateStatisticsProblem(unit, level, index = 0) {
  let unitNum = parseInt(unit) || 1;
  let question = "";
  let answer = 0;

  // Use index and level to scale variations vastly across units
  const seed = Math.abs((index * 37) + (level * 101)) % 1000;

  switch (unitNum) {
    case 1: {
      // Descriptive Statistics: Measures of Center & Spread (Dynamic Variance & SD calculation)
      const n = 5 + (seed % 10);
      const ss = 40 + (seed % 200) * 2;
      answer = Math.round((ss / (n - 1)) * 100) / 100;
      question = `A sample of ${n} observations has a sum of squared deviations from the mean (SS) equal to ${ss}. What is the sample variance s² (rounded to two decimal places)?`;
      break;
    }
    case 2: {
      // Probability Rules & Combinatorics (Conditional probability permutations)
      const pA = 0.3 + ((seed % 5) * 0.1);
      const pAandB = Math.round((pA * (0.2 + ((seed % 4) * 0.15))) * 100) / 100;
      answer = Math.round((pAandB / pA) * 100);
      question = `Given two events A and B where P(A) = ${pA} and P(A and B) = ${pAandB}, calculate the conditional probability P(B|A) expressed as a percentage (0 to 100).`;
      break;
    }
    case 3: {
      // Discrete Probability Distributions (Dynamic Expected value)
      const x1 = seed % 10;
      const x2 = 10 + (seed % 15);
      const x3 = 30 + (seed % 20);
      const p1 = 0.2;
      const p2 = 0.5;
      const p3 = 0.3;
      answer = Math.round((x1 * p1 + x2 * p2 + x3 * p3) * 10) / 10;
      question = `A discrete random variable X takes values ${x1}, ${x2}, and ${x3} with probabilities ${p1}, ${p2}, and ${p3} respectively. What is the expected value E(X)?`;
    }
    case 4: {
      // Continuous Probability Distributions (Uniform distribution probability bounds)
      const min = seed % 10;
      const max = min + 25 + (seed % 25);
      const targetVal = min + 5 + (seed % (max - min - 5));
      answer = Math.round(((targetVal - min) / (max - min)) * 100);
      question = `A continuous random variable X is uniformly distributed between ${min} and ${max}. What is the probability percentage P(X ≤ ${targetVal})?`;
      break;
    }
    case 5: {
      // The Normal Distribution & Empirical Rule (Z-score computation)
      const meanVal = 50 + (seed % 100);
      const sd = 5 + (seed % 15);
      const multiplier = 1 + (seed % 4);
      const xVal = meanVal + multiplier * sd;
      answer = multiplier;
      question = `For a normal distribution with mean ${meanVal} and standard deviation ${sd}, what is the Z-score corresponding to an observation of ${xVal}?`;
      break;
    }
    case 6: {
      // Sampling Distributions & Central Limit Theorem (Standard error)
      const popSD = 10 + (seed % 40);
      const nSize = [16, 25, 36, 49, 64, 81, 100][seed % 7];
      answer = Math.round((popSD / Math.sqrt(nSize)) * 100) / 100;
      question = `A population has a standard deviation of ${popSD}. If random samples of size ${nSize} are drawn, what is the standard error of the mean?`;
      break;
    }
    case 7: {
      // Confidence Intervals for a Single Mean (Margin of error calculation)
      const zCrit = [1.645, 1.96, 2.576][seed % 3];
      const sdVal = 5 + (seed % 20);
      const nVal = [25, 36, 64, 100][seed % 4];
      answer = Math.round((zCrit * (sdVal / Math.sqrt(nVal))) * 100) / 100;
      question = `Using a critical z-value of ${zCrit}, a population standard deviation of ${sdVal}, and a sample size of ${nVal}, calculate the margin of error (rounded to two decimal places).`;
      break;
    }
    case 8: {
      // Hypothesis Testing: Single Mean Z-Test (Test statistic calculation)
      const popMean = 100 + (seed % 50);
      const sampleMean = popMean + (1 + (seed % 6)) * 2;
      const se = 2 + (seed % 4);
      answer = Math.round(((sampleMean - popMean) / se) * 100) / 100;
      question = `In a hypothesis test where the sample mean is ${sampleMean}, hypothesized mean is ${popMean}, and standard error is ${se}, calculate the value of the test statistic z.`;
      break;
    }
    case 9: {
      // Hypothesis Testing: Single Mean T-Test (Degrees of freedom)
      const nObs = 10 + (seed % 90);
      answer = nObs - 1;
      question = `A single-sample t-test is conducted using a dataset containing ${nObs} independent observations. What are the degrees of freedom (df)?`;
      break;
    }
    case 10: {
      // Two-Sample Inference: Independent Means (Pooled degrees of freedom)
      const n1 = 10 + (seed % 20);
      const n2 = 10 + ((seed * 3) % 20);
      answer = (n1 - 1) + (n2 - 1);
      question = `For a two-sample pooled t-test with sample sizes n₁ = ${n1} and n₂ = ${n2}, what are the total degrees of freedom?`;
      break;
    }
    case 11: {
      // Paired Difference Experiments (Mean difference point estimate)
      const nPairs = 5 + (seed % 25);
      const sumDiff = nPairs * (2 + (seed % 15));
      answer = sumDiff / nPairs;
      question = `In a paired difference experiment with ${nPairs} matched pairs, the sum of the differences (Σd) equals ${sumDiff}. What is the point estimate of the mean difference (d̄)?`;
      break;
    }
    case 12: {
      // One-Way Analysis of Variance (ANOVA): Total Sample Size
      const kGroups = 3 + (seed % 6);
      const nPerGroup = 5 + (seed % 15);
      answer = kGroups * nPerGroup;
      question = `In a balanced One-Way ANOVA with ${kGroups} treatment groups and ${nPerGroup} observations per group, what is the total sample size (N)?`;
      break;
    }
    case 13: {
      // Two-Way ANOVA & Factorial Designs (Interaction degrees of freedom)
      const levelsA = 2 + (seed % 5);
      const levelsB = 2 + ((seed * 7) % 5);
      answer = (levelsA - 1) * (levelsB - 1);
      question = `In a Two-Way ANOVA with Factor A having ${levelsA} levels and Factor B having ${levelsB} levels, what are the degrees of freedom for the interaction effect (A × B)?`;
      break;
    }
    case 14: {
      // Simple Linear Regression: Least Squares Estimators (Slope b1)
      const ssx = 20 + (seed % 80);
      const sp = ssx * (1 + (seed % 10));
      answer = sp / ssx;
      question = `In simple linear regression, if the sum of products (SP) equals ${sp} and the sum of squares for x (SSxx) equals ${ssx}, what is the least-squares slope estimate b₁?`;
      break;
    }
    case 15: {
      // Correlation Coefficient & Coefficient of Determination ($r^2$)
      const rVal = 0.5 + ((seed % 5) * 0.1);
      answer = Math.round(rVal * rVal * 100);
      question = `If the Pearson correlation coefficient between two variables is r = ${rVal}, what percentage of the total variation is explained by the regression model (Coefficient of Determination r² expressed as a percentage 0-100)?`;
      break;
    }
    case 16: {
      // Multiple Linear Regression & Adjusted $R^2$ (Model parameter count)
      const pPredictors = 1 + (seed % 8);
      const nObsTotal = 30 + (seed % 70);
      answer = nObsTotal - pPredictors - 1;
      question = `In a multiple linear regression model with ${pPredictors} predictor variables and a sample size of ${nObsTotal}, what are the error (residual) degrees of freedom?`;
      break;
    }
    case 17: {
      // Chi-Square Goodness-of-Fit Test (Test statistic component)
      const chiVal = 5 + (seed % 40);
      answer = chiVal;
      question = `In a Chi-Square Goodness-of-Fit test across 5 categories, the computed test statistic χ² equals ${chiVal}. What is the value of the test statistic?`;
      break;
    }
    case 18: {
      // Chi-Square Test for Independence (Contingency table degrees of freedom)
      const rows = 2 + (seed % 5);
      const cols = 2 + ((seed * 3) % 5);
      answer = (rows - 1) * (cols - 1);
      question = `A contingency table has ${rows} rows and ${cols} columns. What are the degrees of freedom for the Chi-Square test of independence?`;
      break;
    }
    case 19: {
      // Non-Parametric Statistics: Mann-Whitney U Test
      const n1 = 5 + (seed % 10);
      const n2 = 5 + ((seed * 2) % 10);
      answer = n1 * n2;
      question = `In a Mann-Whitney U test comparing two independent groups of sizes n₁ = ${n1} and n₂ = ${n2}, what is the maximum possible value for the test statistic U₁?`;
      break;
    }
    case 20: {
      // Advanced Statistical Quality Control & Simulation
      const baseValue = 20 + (seed % 80);
      const multiplier = 2 + (seed % 4);
      answer = baseValue * multiplier;
      question = `In a statistical process control simulation, if a process parameter scales by a multiplier of ${multiplier}, what is the resulting metric value given a base scale of ${baseValue}?`;
      break;
    }
  }

  // Generate dynamic unique choices based on the computed answer and seed
  const offset1 = 2 + (seed % 5);
  const offset2 = 5 + ((seed * 3) % 7);
  const offset3 = 10 + ((seed * 7) % 11);

  const choices = [
    answer,
    Math.round((answer + offset1) * 100) / 100,
    Math.round((answer > offset2 ? answer - offset2 : answer + offset2 + 2) * 100) / 100,
    Math.round((answer + offset3) * 100) / 100
  ];

  return {
    unit: unitNum,
    unitName: "College Statistics",
    question: question,
    correctAnswer: answer,
    choices: choices
  };
}