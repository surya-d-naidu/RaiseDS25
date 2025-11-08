import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Full paper upload fix
export function setupFullPaperUploadFix(app: express.Application, db: any, requireAuth: any) {
  
  // Ensure full-papers upload directory exists
  const fullPapersDir = path.join(process.cwd(), 'uploads', 'full-papers');
  if (!fs.existsSync(fullPapersDir)) {
    fs.mkdirSync(fullPapersDir, { recursive: true });
    console.log('✅ Created full-papers upload directory');
  }

  // Configure multer for full papers
  const fullPaperStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPapersDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `fullpaper-${uniqueSuffix}${ext}`);
    }
  });

  const fullPaperUpload = multer({
    storage: fullPaperStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Check file type
      if (file.mimetype !== 'application/pdf') {
        cb(new Error('Only PDF files are allowed'));
        return;
      }
      
      // Check file extension
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.pdf') {
        cb(new Error('Only PDF files are allowed'));
        return;
      }
      
      cb(null, true);
    }
  });

  // Fixed full paper validation schema
  const fullPaperValidationSchema = z.object({
    title: z.string().min(1, "Title is required").max(500),
    abstract: z.string().min(50, "Abstract must be at least 50 characters").max(5000),
    keywords: z.string().min(1, "Keywords are required").max(500),
    authors: z.string().transform((str, ctx) => {
      try {
        const parsed = JSON.parse(str);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one author is required",
          });
          return z.NEVER;
        }
        return parsed;
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid authors format",
        });
        return z.NEVER;
      }
    }),
    correspondingAuthor: z.string().email("Invalid email format"),
    abstractId: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
    trackId: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  });

  // Fixed full paper submission endpoint
  app.post('/api/full-papers/submit', requireAuth, (req, res) => {
    fullPaperUpload.single('paperFile')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size must be less than 10MB' });
          }
        }
        return res.status(400).json({ message: err.message || 'File upload failed' });
      }

      try {
        const file = req.file;
        
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        // Validate form data
        const validationResult = fullPaperValidationSchema.safeParse(req.body);
        
        if (!validationResult.success) {
          // Delete uploaded file if validation fails
          fs.unlinkSync(file.path);
          return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validationResult.error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          });
        }

        const formData = validationResult.data;
        const userId = req.user.id;

        // Prepare full paper data
        const fullPaperData = {
          userId,
          abstractId: formData.abstractId || null,
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords,
          authors: JSON.stringify(formData.authors),
          correspondingAuthor: formData.correspondingAuthor,
          paperFile: `/uploads/full-papers/${file.filename}`,
          originalFilename: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          trackId: formData.trackId || null,
          status: 'pending',
        };

        // Insert into database (you'll need to adapt this to your DB setup)
        console.log('Full paper data to insert:', fullPaperData);
        
        // For now, just return success - you'll need to add actual DB insertion
        res.status(201).json({ 
          message: 'Full paper submitted successfully',
          fileUrl: fullPaperData.paperFile,
          fileName: file.originalname
        });

      } catch (error) {
        console.error('Full paper submission error:', error);
        
        // Clean up uploaded file on error
        if (req.file) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
        
        res.status(500).json({ message: 'Failed to submit full paper' });
      }
    });
  });

  // Legacy endpoint for abstract full paper upload
  app.post('/api/abstracts/:id/full-paper', requireAuth, (req, res) => {
    fullPaperUpload.single('fullPaper')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size must be less than 10MB' });
          }
        }
        return res.status(400).json({ message: err.message || 'File upload failed' });
      }

      try {
        const { id } = req.params;
        const file = req.file;
        
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const fullPaperUrl = `/uploads/full-papers/${file.filename}`;

        // You'll need to update this with actual database operations
        console.log(`Updating abstract ${id} for user ${userId} with full paper URL: ${fullPaperUrl}`);

        res.json({ 
          message: 'Full paper uploaded successfully', 
          fullPaperUrl 
        });

      } catch (error) {
        console.error('Full paper upload error:', error);
        
        // Clean up uploaded file on error
        if (req.file) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
        
        res.status(500).json({ message: 'Failed to upload full paper' });
      }
    });
  });

  console.log('✅ Full paper upload endpoints configured');
}