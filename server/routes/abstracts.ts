import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../auth-middleware";
import { insertAbstractSchema, Author } from "@shared/schema";
import { ZodError } from "zod";
import path from "path";
import fs from "fs";
import multer from "multer";
import { sendEmail } from "../email-utils";

// Setup file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

// Helper function to format ZodError for client
function formatZodError(err: ZodError) {
  return err.errors.map(e => ({
    path: e.path.join('.'),
    message: e.message
  }));
}

export function registerAbstractRoutes(app: Express) {
  // Get user abstracts
  app.get("/api/abstracts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const abstracts = await storage.getAbstractsByUser(req.user!.id);
      res.json(abstracts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching abstracts" });
    }
  });

  // Submit abstract
  app.post("/api/abstracts", isAuthenticated, upload.single("file"), async (req: Request, res: Response) => {
    try {
      // Extract fields from request body
      const { title, category, content, keywords } = req.body;
      
      // Parse authors as JSON since FormData sends everything as strings
      let authors: Author[];
      try {
        authors = JSON.parse(req.body.authors);
      } catch (e) {
        return res.status(400).json({ 
          errors: [{ path: "authors", message: "Invalid authors data format" }] 
        });
      }
      
      try {
        // Validate with zod schema
        insertAbstractSchema.parse({
          title,
          category, 
          content,
          authors,
          keywords,
          fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined
        });
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ errors: formatZodError(validationError) });
        }
        throw validationError;
      }
      
      // Create the abstract
      const newAbstract = await storage.createAbstract({
        userId: req.user!.id,
        title,
        category,
        content,
        authors, // Now contains structured author data with categories
        keywords,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined
      });
      
      // Get the corresponding author for email
      const correspondingAuthor = authors.find(author => author.isCorresponding);
      const authorDisplay = correspondingAuthor 
        ? `${correspondingAuthor.name} (Corresponding Author)` 
        : authors.map(a => a.name).join(", ");
      
      // Send confirmation email with abstract ID
      try {
        await sendEmail(
          req.user!.email,
          `Abstract Submission Confirmation - RAISE DS 2025`,
          `<p>Dear ${req.user!.firstName},</p>
          <p>Thank you for submitting your abstract to RAISE DS 2025.</p>
          <p>Your abstract has been received and is pending review.</p>
          <p><strong>Abstract ID:</strong> ${newAbstract.referenceId}</p>
          <p><strong>Title:</strong> ${newAbstract.title}</p>
          <p><strong>Authors:</strong> ${authorDisplay}</p>
          <p><strong>Category:</strong> ${newAbstract.category}</p>
          <p>You can check the status of your submission in the "My Abstracts" section of your account.</p>
          <p>RAISE DS 2025 Team</p>`
        );
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      
      res.status(201).json(newAbstract);
    } catch (error) {
      console.error("Error submitting abstract:", error);
      res.status(500).json({ message: "Error creating abstract" });
    }
  });

  // Update abstract
  app.put("/api/abstracts/:id", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const abstract = await storage.getAbstract(abstractId);
      
      if (!abstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      
      if (abstract.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Parse authors if provided
      let updateData: any = { ...req.body };
      
      if (req.body.authors) {
        try {
          updateData.authors = JSON.parse(req.body.authors);
        } catch (e) {
          return res.status(400).json({ 
            errors: [{ path: "authors", message: "Invalid authors data format" }] 
          });
        }
      }
      
      if (req.file) {
        updateData.fileUrl = `/uploads/${req.file.filename}`;
        
        // Delete old file if exists
        if (abstract.fileUrl) {
          const oldFilePath = path.join(process.cwd(), abstract.fileUrl.replace(/^\/uploads\//, "uploads/"));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
      
      const updatedAbstract = await storage.updateAbstract(abstractId, updateData);
      res.json(updatedAbstract);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error updating abstract" });
    }
  });

  // Delete abstract
  app.delete("/api/abstracts/:id", isAuthenticated, async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const abstract = await storage.getAbstract(abstractId);
      
      if (!abstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      
      if (abstract.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Delete file if exists
      if (abstract.fileUrl) {
        const filePath = path.join(process.cwd(), abstract.fileUrl.replace(/^\/uploads\//, "uploads/"));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      await storage.deleteAbstract(abstractId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting abstract" });
    }
  });
}
