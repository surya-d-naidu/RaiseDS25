
import { db } from '../server/db';
import { abstracts } from '../shared/schema';
import { eq, asc } from 'drizzle-orm';

// Inline category code map (same as in db-storage)
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
function getCategoryCode(category: string): string {
  return categoryCodeMap[category] || "XX";
}

async function main() {
  // Fetch all abstracts, ordered by createdAt
  const all = await db.select().from(abstracts).orderBy(asc(abstracts.createdAt));

  // Group by category code
  const grouped: Record<string, typeof all> = {};
  for (const abs of all) {
    const code = getCategoryCode(abs.category);
    if (!grouped[code]) grouped[code] = [];
    grouped[code].push(abs);
  }

  // Update referenceId for each, sequentially per category
  for (const code in grouped) {
    for (let idx = 0; idx < grouped[code].length; idx++) {
      const abs = grouped[code][idx];
      const newRef = `${code}-${String(idx + 1).padStart(4, '0')}`;
      await db.update(abstracts).set({ referenceId: newRef }).where(eq(abstracts.id, abs.id));
      console.log(`Updated abstract ${abs.id} to ${newRef}`);
    }
  }
  console.log('Done.');
}

main().catch(console.error);
