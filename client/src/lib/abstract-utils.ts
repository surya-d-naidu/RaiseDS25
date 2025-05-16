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
    "Probability Theory": "PT",
    "Statistical Inference": "SI",
    "Statistical Computing": "SC", 
    "Biostatistics": "BS",
    "Data Science": "DS",
    "Machine Learning": "ML",
    "Big Data Analytics": "BD",
    "Time Series Analysis": "TS",
    "Statistical Quality Control": "SQ",
    "Statistical Methods": "SM",
    "Data Visualization": "DV",
    "Computational Statistics": "CS",
    "Bayesian Analysis": "BA",
    "Applied Statistics": "AS",
    "Other": "OT"
  };
  
  return categoryCodeMap[category] || "XX";
}
