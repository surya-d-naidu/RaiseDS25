import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { randomBytes } from "crypto";
import { insertAbstractSchema, insertInvitationSchema, insertNotificationSchema, insertCommitteeMemberSchema, insertResearchAwardSchema } from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

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

// Email sending function
async function sendEmail(to: string, subject: string, html: string) {
  try {
    // In production, you'd use a proper SMTP service
    // For development, we'll just log the email
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    
    // If you have SMTP settings, use this:
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"RAISE DS 2025" <noreply@raiseds25.com>',
        to,
        subject,
        html,
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

function isAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && req.user?.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Serve uploads
  app.use("/uploads", express.static(uploadsDir));
  
  // Profile routes
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.getProfile(req.user!.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });
  
  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.user!.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  
  // Abstract routes
  app.get("/api/abstracts", isAuthenticated, async (req, res) => {
    try {
      const abstracts = await storage.getAbstractsByUser(req.user!.id);
      res.json(abstracts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching abstracts" });
    }
  });
    app.post("/api/abstracts", isAuthenticated, async (req, res) => {
    try {
      const { title, category, content, authors, keywords } = req.body;
      const newAbstract = await storage.createAbstract({
        userId: req.user.id,
        title,
        category,
        content,
        authors, // Include authors in the request body
        keywords,
      });
      
      // Send confirmation email with abstract ID
      try {
        await sendEmail(
          req.user.email,
          `Abstract Submission Confirmation - RAISE DS 2025`,
          `<p>Dear ${req.user.firstName},</p>
          <p>Thank you for submitting your abstract to RAISE DS 2025.</p>
          <p>Your abstract has been received and is pending review.</p>
          <p><strong>Abstract ID:</strong> ${newAbstract.referenceId}</p>
          <p><strong>Title:</strong> ${newAbstract.title}</p>
          <p>You can check the status of your submission in the "My Abstracts" section of your account.</p>
          <p>RAISE DS 2025 Team</p>`
        );
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      
      res.status(201).json(newAbstract);
    } catch (error) {
      res.status(500).json({ message: "Error creating abstract" });
    }
  });
  
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
      
      const updateData = {
        ...req.body
      };
      
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
  
  // Admin abstract routes
  app.get("/api/admin/abstracts", isAdmin, async (req, res) => {
    try {
      const abstracts = await storage.getAllAbstracts();
      res.json(abstracts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching abstracts" });
    }
  });
  
  app.put("/api/admin/abstracts/:id/status", isAdmin, async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedAbstract = await storage.updateAbstractStatus(abstractId, status);
      
      if (!updatedAbstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      
      // Get user info to send notification
      const user = await storage.getUser(updatedAbstract.userId);
      if (user) {
        const statusMap = {
          accepted: "Congratulations! Your abstract has been accepted",
          rejected: "We regret to inform you that your abstract was not accepted",
          pending: "Your abstract status has been updated to pending review"
        };
          await sendEmail(
          user.email,
          `Abstract ${status} - RAISE DS 2025`,
          `<p>Dear ${user.firstName},</p>          <p>${statusMap[status as keyof typeof statusMap]}</p>
          <p><strong>Abstract ID:</strong> ${updatedAbstract.referenceId || `${storage.getCategoryCode(updatedAbstract.category)}-${updatedAbstract.id.toString().padStart(4, '0')}`}</p>
          <p><strong>Abstract Title:</strong> ${updatedAbstract.title}</p>
          <p>Thank you for your submission.</p>
          <p>RAISE DS 2025 Team</p>`
        );
      }
      
      res.json(updatedAbstract);
    } catch (error) {
      res.status(500).json({ message: "Error updating abstract status" });
    }
  });
  
  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getActiveNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  
  // Admin notification routes
  app.get("/api/admin/notifications", isAdmin, async (req, res) => {
    try {
      const notifications = await storage.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  
  app.post("/api/admin/notifications", isAdmin, async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error creating notification" });
    }
  });
  
  app.put("/api/admin/notifications/:id", isAdmin, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.updateNotification(notificationId, req.body);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(notification);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error updating notification" });
    }
  });
  
  app.delete("/api/admin/notifications/:id", isAdmin, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.deleteNotification(notificationId);
      
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting notification" });
    }
  });
  
  // Committee member routes
  app.get("/api/committee", async (req, res) => {
    try {
      const members = await storage.getAllCommitteeMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching committee members" });
    }
  });
  
  app.get("/api/committee/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const members = await storage.getCommitteeMembersByCategory(category);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching committee members" });
    }
  });
  
  // Admin committee routes
  app.post("/api/admin/committee", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCommitteeMemberSchema.parse(req.body);
      const member = await storage.createCommitteeMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error creating committee member" });
    }
  });
  
  app.put("/api/admin/committee/:id", isAdmin, async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const member = await storage.updateCommitteeMember(memberId, req.body);
      
      if (!member) {
        return res.status(404).json({ message: "Committee member not found" });
      }
      
      res.json(member);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error updating committee member" });
    }
  });
  
  app.delete("/api/admin/committee/:id", isAdmin, async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const success = await storage.deleteCommitteeMember(memberId);
      
      if (!success) {
        return res.status(404).json({ message: "Committee member not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting committee member" });
    }
  });
  
  // Research awards routes
  app.get("/api/awards", async (req, res) => {
    try {
      const awards = await storage.getActiveResearchAwards();
      res.json(awards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching research awards" });
    }
  });
  
  // Admin research awards routes
  app.get("/api/admin/awards", isAdmin, async (req, res) => {
    try {
      const awards = await storage.getAllResearchAwards();
      res.json(awards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching research awards" });
    }
  });
  
  app.post("/api/admin/awards", isAdmin, async (req, res) => {
    try {
      const validatedData = insertResearchAwardSchema.parse(req.body);
      const award = await storage.createResearchAward(validatedData);
      res.status(201).json(award);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error creating research award" });
    }
  });
  
  app.put("/api/admin/awards/:id", isAdmin, async (req, res) => {
    try {
      const awardId = parseInt(req.params.id);
      const award = await storage.updateResearchAward(awardId, req.body);
      
      if (!award) {
        return res.status(404).json({ message: "Research award not found" });
      }
      
      res.json(award);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error updating research award" });
    }
  });
  
  app.delete("/api/admin/awards/:id", isAdmin, async (req, res) => {
    try {
      const awardId = parseInt(req.params.id);
      const success = await storage.deleteResearchAward(awardId);
      
      if (!success) {
        return res.status(404).json({ message: "Research award not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting research award" });
    }
  });
  
  // Invitation routes
  app.get("/api/invitations", isAdmin, async (req, res) => {
    try {
      const invitations = await storage.getAllInvitations();
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invitations" });
    }
  });
  
  app.post("/api/invitations", isAdmin, async (req, res) => {
    try {
      const validatedData = insertInvitationSchema.parse(req.body);
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14); // Expires in 14 days
      
      const invitation = await storage.createInvitation({
        ...validatedData,
        token,
        senderId: req.user!.id,
        expiresAt
      });
      
      // Send invitation email based on type
      if (validatedData.type === "attendance") {
        // For attendance confirmation invitations
        const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
        const attendanceUrl = `${clientUrl}/attendance?token=${token}`;
        
        await sendEmail(
          invitation.email,
          `Invitation to Attend RAISE DS 2025 Conference`,
          `<p>Dear ${invitation.name},</p>
          <p>You are cordially invited to attend the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in conjunction with the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS).</p>
          <p>${invitation.message || ""}</p>
          <p>Please click the link below to confirm your attendance:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${attendanceUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Respond to Invitation</a>
          </p>
          <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
          <p>${attendanceUrl}</p>
          <p>We look forward to your participation.</p>
          <p>Thank you,</p>
          <p>RAISE DS 2025 Team</p>`
        );
      } else {
        // For account registration invitations
        const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
        const registerUrl = `${clientUrl}/register?token=${token}`;
        
        await sendEmail(
          invitation.email,
          `Invitation to Join RAISE DS 2025 Conference Platform`,
          `<p>Dear ${invitation.name},</p>
          <p>You have been invited to join the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in conjunction with the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS).</p>
          <p>${invitation.message || ""}</p>
          <p>Please click the link below to register on our platform:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${registerUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Register Now</a>
          </p>
          <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
          <p>${registerUrl}</p>
          <p>Thank you,</p>
          <p>RAISE DS 2025 Team</p>`
        );
      }
      
      res.status(201).json(invitation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      res.status(500).json({ message: "Error creating invitation" });
    }
  });
  
  app.get("/api/invitations/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      
      // Check if expired
      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }
      
      res.json(invitation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invitation" });
    }
  });
  
  app.put("/api/invitations/:token/status", async (req, res) => {
    try {
      const token = req.params.token;
      const { status } = req.body;
      
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      
      // Check if expired
      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }
      
      // Check if already responded
      if (invitation.status !== "pending") {
        return res.status(400).json({ message: `Invitation already ${invitation.status}` });
      }
      
      const updatedInvitation = await storage.updateInvitationStatus(token, status);
      
      // Notify sender
      const sender = await storage.getUser(invitation.senderId);
      if (sender) {
        await sendEmail(
          sender.email,
          `Invitation ${status} - RAISE DS 2025`,
          `<p>Dear ${sender.firstName},</p>
          <p>${invitation.name} has ${status} your invitation.</p>
          <p>RAISE DS 2025 Team</p>`
        );
      }
      
      res.json(updatedInvitation);
    } catch (error) {
      res.status(500).json({ message: "Error updating invitation status" });
    }
  });
  
  // Verify invitation for attendance response
  app.get("/api/invitations/verify", async (req, res) => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        return res.status(400).json({ message: "Invalid token" });
      }
      
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      
      res.json(invitation);
    } catch (error) {
      res.status(500).json({ message: "Error verifying invitation" });
    }
  });
  
  // Handle attendance response
  app.post("/api/invitations/attendance-response", async (req, res) => {
    try {
      const { token, accept } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Invalid token" });
      }
      
      if (typeof accept !== 'boolean') {
        return res.status(400).json({ message: "Invalid response" });
      }
      
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      
      if (invitation.type !== "attendance") {
        return res.status(400).json({ message: "Invalid invitation type" });
      }
      
      if (invitation.status !== "pending") {
        return res.status(400).json({ message: "Invitation already responded to" });
      }
      
      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }
      
      const status = accept ? "accepted" : "rejected";
      const updatedInvitation = await storage.updateInvitationStatus(token, status);
      
      // Notify sender
      const sender = await storage.getUser(invitation.senderId);
      if (sender) {
        await sendEmail(
          sender.email,
          `Attendance ${accept ? 'Confirmed' : 'Declined'} - RAISE DS 2025`,
          `<p>Dear ${sender.firstName},</p>
          <p>${invitation.name} has ${accept ? 'confirmed' : 'declined'} attendance to the conference.</p>
          <p>Position: ${invitation.position || 'Not specified'}</p>
          <p>Institution: ${invitation.institution || 'Not specified'}</p>
          <p>RAISE DS 2025 Team</p>`
        );
      }
      
      res.json({
        message: accept ? "Attendance confirmed" : "Response recorded",
        accept,
        invitation: updatedInvitation
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing attendance response" });
    }
  });
  
  // Admin user management
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
  app.put("/api/admin/users/:id/role", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.updateUser(userId, { role });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user role" });
    }
  });
  
  // Brochure download
  app.get("/api/brochure", (req, res) => {
    const brochurePath = path.join(process.cwd(), "uploads", "brochure.pdf");
    if (fs.existsSync(brochurePath)) {
      res.download(brochurePath, "RAISE-DS-2025-Brochure.pdf");
    } else {
      res.status(404).json({ message: "Brochure not available" });
    }
  });
  
  // Upload brochure (admin only)
  app.post("/api/admin/brochure", isAdmin, upload.single("brochure"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const oldPath = req.file.path;
    const newPath = path.join(process.cwd(), "uploads", "brochure.pdf");
    
    // If file already exists, delete it
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    }
    
    // Rename the file
    fs.renameSync(oldPath, newPath);
    
    res.status(201).json({ message: "Brochure uploaded successfully" });
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
