// Test full paper validation and fix common issues
import { z } from 'zod';

// Fixed validation patterns for full paper submission
const AuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  affiliation: z.string().min(1, "Author affiliation is required"), 
  category: z.enum(["Delegate (Keynote speaker)", "Delegate (Invited speaker)", "Presenter", "Participant"]),
  email: z.string().email("Invalid email")
});

const FixedFullPaperSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(500, "Title too long")
    .regex(/^[a-zA-Z0-9\s\-_.,!?():'"]+$/, "Title contains invalid characters"),
    
  abstract: z.string()
    .min(50, "Abstract must be at least 50 characters")
    .max(5000, "Abstract too long"),
    
  keywords: z.string()
    .min(1, "Keywords are required")
    .max(500, "Keywords too long")
    .regex(/^[a-zA-Z0-9\s,\-_]+$/, "Keywords contain invalid characters"),
    
  authors: z.union([
    z.string().transform((str, ctx) => {
      try {
        const parsed = JSON.parse(str);
        const result = z.array(AuthorSchema).safeParse(parsed);
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid authors format",
          });
          return z.NEVER;
        }
        return result.data;
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Authors must be valid JSON",
        });
        return z.NEVER;
      }
    }),
    z.array(AuthorSchema)
  ]).refine((authors) => {
    const presenters = authors.filter(author => author.category === "Presenter");
    return presenters.length === 1;
  }, {
    message: "Exactly one author must be designated as the Presenter"
  }),
  
  correspondingAuthor: z.string()
    .email("Invalid corresponding author email format")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email format not recognized"),
    
  paperFile: z.string()
    .min(1, "Paper file is required")
    .regex(/^\/uploads\/full-papers\/[a-zA-Z0-9\-_.]+\.pdf$/, "Invalid file path format"),
    
  originalFilename: z.string()
    .min(1, "Original filename is required")
    .regex(/^[a-zA-Z0-9\s\-_().]+\.pdf$/i, "Filename must be a PDF"),
    
  fileSize: z.number()
    .positive("File size must be positive")
    .max(10 * 1024 * 1024, "File size must be less than 10MB")
    .optional(),
    
  mimeType: z.string()
    .regex(/^application\/pdf$/, "File must be a PDF")
    .optional(),
    
  abstractId: z.union([
    z.string().transform(val => val ? parseInt(val) : undefined),
    z.number(),
    z.undefined()
  ]).optional(),
  
  trackId: z.union([
    z.string().transform(val => val ? parseInt(val) : undefined),
    z.number(), 
    z.undefined()
  ]).optional(),
});

// Test function to validate common problematic inputs
function testFullPaperValidation() {
  console.log('🧪 Testing full paper validation...');
  
  const testData = {
    title: "Advanced Quantum Computing Applications in Drug Discovery",
    abstract: "This paper presents a comprehensive analysis of quantum computing applications in pharmaceutical drug discovery. We explore novel algorithms for molecular simulation, optimization techniques for drug compound evaluation, and practical implementations using current quantum hardware. The research demonstrates significant improvements in computational efficiency compared to classical methods, with particular focus on activation energy calculations for AI-generated drug compounds. Our findings suggest that quantum-classical hybrid approaches can substantially accelerate the drug discovery pipeline while maintaining accuracy in molecular property predictions.",
    keywords: "quantum computing, drug discovery, molecular simulation, optimization",
    authors: JSON.stringify([
      {
        name: "Akula Medha",
        affiliation: "Quantum Research Lab",
        category: "Presenter",
        email: "akulamedha9@gmail.com"
      }
    ]),
    correspondingAuthor: "akulamedha9@gmail.com",
    paperFile: "/uploads/full-papers/fullpaper-1634567890123-456789012.pdf",
    originalFilename: "quantum_drug_discovery_paper.pdf",
    fileSize: 2548576, // ~2.5MB
    mimeType: "application/pdf"
  };
  
  const result = FixedFullPaperSchema.safeParse(testData);
  
  if (result.success) {
    console.log('✅ Validation passed successfully!');
    console.log('Parsed data:', JSON.stringify(result.data, null, 2));
  } else {
    console.log('❌ Validation failed:');
    result.error.errors.forEach(error => {
      console.log(`  - ${error.path.join('.')}: ${error.message}`);
    });
  }
  
  return result.success;
}

// Common validation fixes
export const validationFixes = {
  // Clean title to remove problematic characters
  cleanTitle: (title) => {
    return title.replace(/[^\w\s\-_.,!?():'"-]/g, '').trim();
  },
  
  // Clean keywords
  cleanKeywords: (keywords) => {
    return keywords.replace(/[^\w\s,\-_]/g, '').trim();
  },
  
  // Validate file path
  validateFilePath: (path) => {
    return /^\/uploads\/full-papers\/[a-zA-Z0-9\-_.]+\.pdf$/.test(path);
  },
  
  // Validate email format strictly
  validateEmail: (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  },
  
  // Fix common author format issues
  fixAuthorsFormat: (authors) => {
    if (typeof authors === 'string') {
      try {
        return JSON.parse(authors);
      } catch (e) {
        return null;
      }
    }
    return authors;
  }
};

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testFullPaperValidation();
}

export { FixedFullPaperSchema, testFullPaperValidation };