/**
 * Utility functions for abstract formatting and display
 */

/**
 * Generates a 2-letter category code from the abstract category
 * @param category The category name
 * @returns The 2-letter code corresponding to the category
 */
export function getCategoryCode(category: string): string {
  const categoryCodeMap: Record<string, string> = {
    "Actuarial Statistics": "AS",
    "Agricultural Statistics": "AG",
    "AI & Machine Learning": "ML",
    "Applied Mathematics": "AM",
    "Applied Statistics": "AP",
    "Bayesian and Fuzzy Statistics": "BF",
    "Bio-Statistics": "BS",
    "Data Science Techniques": "DS",
    "Distribution Theory": "DT",
    "Econometrics": "EC",
    "Environmental Statistics": "ES",
    "Mathematical Modelling": "MM",
    "Multi-Disciplinary Research": "MD",
    "Multivariate Analysis": "MV",
    "Official Statistics": "OS",
    "Operations Research": "OR",
    "Planning and Experimental Designs": "PE",
    "Population Studies": "PS",
    "Probability Theory": "PT",
    "Reliability and Survival Analysis": "RS",
    "Spatial Statistics": "SP",
    "Statistical Inference": "SI",
    "Statistical Quality Control": "SQ",
    "Statistics in Management": "SM",
    "Stochastic Modelling": "ST",
    "Survey Sampling": "SS",
    "Time Series Analysis": "TS",
    "Other": "OT"
  };
  
  return categoryCodeMap[category] || "XX";
}
