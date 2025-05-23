var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  userStore;
  profileStore;
  abstractStore;
  invitationStore;
  notificationStore;
  committeeMemberStore;
  researchAwardStore;
  currentId;
  sessionStore;
  constructor() {
    this.resetDatabase();
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
  }
  // Method to reset the database and recreate the admin user
  resetDatabase() {
    console.log("Resetting in-memory database...");
    this.userStore = /* @__PURE__ */ new Map();
    this.profileStore = /* @__PURE__ */ new Map();
    this.abstractStore = /* @__PURE__ */ new Map();
    this.invitationStore = /* @__PURE__ */ new Map();
    this.notificationStore = /* @__PURE__ */ new Map();
    this.committeeMemberStore = /* @__PURE__ */ new Map();
    this.researchAwardStore = /* @__PURE__ */ new Map();
    this.currentId = {
      user: 1,
      profile: 1,
      abstract: 1,
      invitation: 1,
      notification: 1,
      committeeMember: 1,
      researchAward: 1
    };
    console.log("Creating admin user...");
    const adminUser = {
      id: 1,
      username: "surya-d-naidu",
      email: "admin@raiseds25.com",
      // Using properly generated scrypt hash for "7075052734"
      password: "26f479b13979ed3a9b50e6bbd80f45037614379c8c6cd027f175424fc69569ff214c4c02d8e43e0763220a61a398bdd116ad3534ed65bad12d9a2bbf9c4132d2.7d213b9682355958cffb77ffe6688b00",
      firstName: "Surya",
      lastName: "Naidu",
      institution: "VIT-AP University",
      role: "admin",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.userStore.set(1, adminUser);
    const adminProfile = {
      id: 1,
      userId: 1,
      bio: "Conference administrator",
      position: "Administrator",
      department: "Conference Management",
      country: "India",
      isPresenter: false,
      isCommitteeMember: true,
      socialLinks: {}
    };
    this.profileStore.set(1, adminProfile);
    console.log("Admin user created successfully!");
    console.log("Username: surya-d-naidu");
    console.log("Password: 7075052734");
  }
  // Users
  async getUser(id) {
    return this.userStore.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.userStore.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.userStore.values()).find((user) => user.email === email);
  }
  async createUser(userData) {
    const id = this.currentId.user++;
    const now = /* @__PURE__ */ new Date();
    const user = {
      ...userData,
      id,
      role: "user",
      createdAt: now
    };
    this.userStore.set(id, user);
    return user;
  }
  async updateUser(id, data) {
    const user = this.userStore.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...data };
    this.userStore.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.userStore.values());
  }
  // Profiles
  async getProfile(userId) {
    return Array.from(this.profileStore.values()).find((profile) => profile.userId === userId);
  }
  async createProfile(profileData) {
    const id = this.currentId.profile++;
    const profile = {
      ...profileData,
      id
    };
    this.profileStore.set(id, profile);
    return profile;
  }
  async updateProfile(userId, data) {
    const profile = Array.from(this.profileStore.values()).find((profile2) => profile2.userId === userId);
    if (!profile) return void 0;
    const updatedProfile = { ...profile, ...data };
    this.profileStore.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  // Abstracts
  async getAbstract(id) {
    return this.abstractStore.get(id);
  }
  async getAbstractsByUser(userId) {
    return Array.from(this.abstractStore.values()).filter((abstract) => abstract.userId === userId);
  }
  async getAllAbstracts() {
    return Array.from(this.abstractStore.values());
  }
  async createAbstract(abstractData) {
    const id = this.currentId.abstract++;
    const now = /* @__PURE__ */ new Date();
    const categoryCode = this.getCategoryCode(abstractData.category);
    const randomNum = Math.floor(1e3 + Math.random() * 9e3);
    const referenceId = `${categoryCode}-${randomNum}`;
    const abstract = {
      ...abstractData,
      id,
      referenceId,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    this.abstractStore.set(id, abstract);
    return abstract;
  }
  // Helper function to generate category code from the abstract category
  getCategoryCode(category) {
    const categoryCodeMap = {
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
  async updateAbstract(id, data) {
    const abstract = this.abstractStore.get(id);
    if (!abstract) return void 0;
    const updatedAbstract = {
      ...abstract,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.abstractStore.set(id, updatedAbstract);
    return updatedAbstract;
  }
  async updateAbstractStatus(id, status) {
    const abstract = this.abstractStore.get(id);
    if (!abstract) return void 0;
    abstract.status = status;
    abstract.updatedAt = /* @__PURE__ */ new Date();
    this.abstractStore.set(id, abstract);
    return abstract;
  }
  async deleteAbstract(id) {
    return this.abstractStore.delete(id);
  }
  // Invitations
  async getInvitation(id) {
    return this.invitationStore.get(id);
  }
  async getInvitationByToken(token) {
    return Array.from(this.invitationStore.values()).find((invitation) => invitation.token === token);
  }
  async getAllInvitations() {
    return Array.from(this.invitationStore.values());
  }
  async createInvitation(invitationData) {
    const id = this.currentId.invitation++;
    const now = /* @__PURE__ */ new Date();
    const invitation = {
      ...invitationData,
      id,
      status: "pending",
      createdAt: now
    };
    this.invitationStore.set(id, invitation);
    return invitation;
  }
  async updateInvitationStatus(token, status) {
    const invitation = Array.from(this.invitationStore.values()).find((inv) => inv.token === token);
    if (!invitation) return void 0;
    invitation.status = status;
    this.invitationStore.set(invitation.id, invitation);
    return invitation;
  }
  async deleteInvitation(id) {
    return this.invitationStore.delete(id);
  }
  // Notifications
  async getNotification(id) {
    return this.notificationStore.get(id);
  }
  async getActiveNotifications() {
    const now = /* @__PURE__ */ new Date();
    return Array.from(this.notificationStore.values()).filter(
      (notification) => notification.isActive && (!notification.expiresAt || notification.expiresAt > now)
    );
  }
  async getAllNotifications() {
    return Array.from(this.notificationStore.values());
  }
  async createNotification(notificationData) {
    const id = this.currentId.notification++;
    const now = /* @__PURE__ */ new Date();
    const notification = {
      ...notificationData,
      id,
      createdAt: now
    };
    this.notificationStore.set(id, notification);
    return notification;
  }
  async updateNotification(id, data) {
    const notification = this.notificationStore.get(id);
    if (!notification) return void 0;
    const updatedNotification = { ...notification, ...data };
    this.notificationStore.set(id, updatedNotification);
    return updatedNotification;
  }
  async deleteNotification(id) {
    return this.notificationStore.delete(id);
  }
  // Committee Members
  async getCommitteeMember(id) {
    return this.committeeMemberStore.get(id);
  }
  async getCommitteeMembersByCategory(category) {
    return Array.from(this.committeeMemberStore.values()).filter((member) => member.category === category).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async getAllCommitteeMembers() {
    return Array.from(this.committeeMemberStore.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async createCommitteeMember(memberData) {
    const id = this.currentId.committeeMember++;
    const member = {
      ...memberData,
      id
    };
    this.committeeMemberStore.set(id, member);
    return member;
  }
  async updateCommitteeMember(id, data) {
    const member = this.committeeMemberStore.get(id);
    if (!member) return void 0;
    const updatedMember = { ...member, ...data };
    this.committeeMemberStore.set(id, updatedMember);
    return updatedMember;
  }
  async deleteCommitteeMember(id) {
    return this.committeeMemberStore.delete(id);
  }
  // Research Awards
  async getResearchAward(id) {
    return this.researchAwardStore.get(id);
  }
  async getActiveResearchAwards() {
    return Array.from(this.researchAwardStore.values()).filter((award) => award.isActive);
  }
  async getAllResearchAwards() {
    return Array.from(this.researchAwardStore.values());
  }
  async createResearchAward(awardData) {
    const id = this.currentId.researchAward++;
    const award = {
      ...awardData,
      id
    };
    this.researchAwardStore.set(id, award);
    return award;
  }
  async updateResearchAward(id, data) {
    const award = this.researchAwardStore.get(id);
    if (!award) return void 0;
    const updatedAward = { ...award, ...data };
    this.researchAwardStore.set(id, updatedAward);
    return updatedAward;
  }
  async deleteResearchAward(id) {
    return this.researchAwardStore.delete(id);
  }
};
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  try {
    if (!stored || !stored.includes(".")) {
      console.error("Invalid stored password format");
      return false;
    }
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.error("Invalid stored password components");
      return false;
    }
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    if (hashedBuf.length !== suppliedBuf.length) {
      console.error(`Buffer length mismatch: stored=${hashedBuf.length}, supplied=${suppliedBuf.length}`);
      return false;
    }
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "raise-ds-session-secret-2025",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      secure: process.env.NODE_ENV === "production"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const isEmail = username.includes("@");
        console.log(`Login attempt - ${isEmail ? "Email" : "Username"}: ${username}`);
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: "User not found" });
        }
        if (!user.password) {
          console.error("User has no password set");
          return done(new Error("User account is not properly configured"));
        }
        try {
          const passwordMatch = await comparePasswords(password, user.password);
          if (!passwordMatch) {
            console.log("Password mismatch");
            return done(null, false, { message: "Incorrect password" });
          }
          console.log("Login successful");
          return done(null, user);
        } catch (passwordError) {
          console.error("Error during password comparison:", passwordError);
          return done(new Error("Error verifying credentials"));
        }
      } catch (error) {
        console.error("Authentication error:", error);
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName, institution } = req.body;
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser({
        username,
        email,
        firstName,
        lastName,
        institution,
        password: await hashPassword(password)
      });
      await storage.createProfile({
        userId: user.id,
        bio: "",
        isPresenter: false,
        isCommitteeMember: false,
        socialLinks: {}
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const safeUser = { ...user };
        delete safeUser.password;
        res.status(201).json(safeUser);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ message: err.message || "Internal server error during authentication" });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Login session error:", loginErr);
          return res.status(500).json({ message: loginErr.message || "Error creating login session" });
        }
        const safeUser = { ...user };
        delete safeUser.password;
        return res.status(200).json(safeUser);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const safeUser = { ...req.user };
    delete safeUser.password;
    res.json(safeUser);
  });
}

// server/routes.ts
import { randomBytes as randomBytes2 } from "crypto";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  abstracts: () => abstracts,
  committeeMembers: () => committeeMembers,
  insertAbstractSchema: () => insertAbstractSchema,
  insertCommitteeMemberSchema: () => insertCommitteeMemberSchema,
  insertInvitationSchema: () => insertInvitationSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertProfileSchema: () => insertProfileSchema,
  insertResearchAwardSchema: () => insertResearchAwardSchema,
  insertUserSchema: () => insertUserSchema,
  invitations: () => invitations,
  notifications: () => notifications,
  profiles: () => profiles,
  researchAwards: () => researchAwards,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  institution: text("institution").notNull(),
  role: text("role").notNull().default("user"),
  // user, admin
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  role: true
});
var abstracts = pgTable("abstracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  authors: text("authors").notNull(),
  // New field for authors
  keywords: text("keywords").notNull(),
  referenceId: text("reference_id"),
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAbstractSchema = createInsertSchema(abstracts).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true
});
var profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  bio: text("bio"),
  position: text("position"),
  department: text("department"),
  country: text("country"),
  profilePictureUrl: text("profile_picture_url"),
  isPresenter: boolean("is_presenter").default(false),
  isCommitteeMember: boolean("is_committee_member").default(false),
  socialLinks: json("social_links").$type()
});
var insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true
});
var invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  token: text("token").notNull().unique(),
  role: text("role").notNull().default("user"),
  type: text("type").notNull().default("account"),
  // account, attendance
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected
  message: text("message"),
  senderId: integer("sender_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  institution: text("institution"),
  position: text("position")
});
var insertInvitationSchema = createInsertSchema(invitations).omit({
  id: true,
  token: true,
  status: true,
  senderId: true,
  createdAt: true
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("general"),
  // general, important, deadline
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at")
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var committeeMembers = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  institution: text("institution"),
  country: text("country"),
  category: text("category").notNull(),
  // chief_patron, patron, organizing_committee, advisory_committee, etc.
  email: text("email"),
  phone: text("phone"),
  order: integer("order").default(0),
  profileLink: text("profile_link")
  // Link to member's profile page
});
var insertCommitteeMemberSchema = createInsertSchema(committeeMembers).omit({
  id: true
});
var researchAwards = pgTable("research_awards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eligibility: text("eligibility").notNull(),
  amount: text("amount"),
  deadline: timestamp("deadline"),
  isActive: boolean("is_active").default(true)
});
var insertResearchAwardSchema = createInsertSchema(researchAwards).omit({
  id: true
});

// server/routes.ts
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      const dir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  })
});
function formatZodError(err) {
  return err.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message
  }));
}
async function sendEmail(to, subject, html) {
  try {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"RAISE DS 2025" <noreply@raiseds25.com>',
        to,
        subject,
        html
      });
    }
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user?.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}
async function registerRoutes(app2) {
  setupAuth(app2);
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app2.use("/uploads", express.static(uploadsDir));
  app2.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });
  app2.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.user.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  app2.get("/api/abstracts", isAuthenticated, async (req, res) => {
    try {
      const abstracts2 = await storage.getAbstractsByUser(req.user.id);
      res.json(abstracts2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching abstracts" });
    }
  });
  app2.post("/api/abstracts", isAuthenticated, async (req, res) => {
    try {
      const { title, category, content, authors, keywords } = req.body;
      const newAbstract = await storage.createAbstract({
        userId: req.user.id,
        title,
        category,
        content,
        authors,
        // Include authors in the request body
        keywords
      });
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
  app2.put("/api/abstracts/:id", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const abstract = await storage.getAbstract(abstractId);
      if (!abstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      if (abstract.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const updateData = {
        ...req.body
      };
      if (req.file) {
        updateData.fileUrl = `/uploads/${req.file.filename}`;
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
  app2.delete("/api/abstracts/:id", isAuthenticated, async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const abstract = await storage.getAbstract(abstractId);
      if (!abstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      if (abstract.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
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
  app2.get("/api/admin/abstracts", isAdmin, async (req, res) => {
    try {
      const abstracts2 = await storage.getAllAbstracts();
      res.json(abstracts2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching abstracts" });
    }
  });
  app2.put("/api/admin/abstracts/:id/status", isAdmin, async (req, res) => {
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
          `<p>Dear ${user.firstName},</p>          <p>${statusMap[status]}</p>
          <p><strong>Abstract ID:</strong> ${updatedAbstract.referenceId || `${storage.getCategoryCode(updatedAbstract.category)}-${updatedAbstract.id.toString().padStart(4, "0")}`}</p>
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
  app2.get("/api/notifications", async (req, res) => {
    try {
      const notifications2 = await storage.getActiveNotifications();
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  app2.get("/api/admin/notifications", isAdmin, async (req, res) => {
    try {
      const notifications2 = await storage.getAllNotifications();
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  app2.post("/api/admin/notifications", isAdmin, async (req, res) => {
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
  app2.put("/api/admin/notifications/:id", isAdmin, async (req, res) => {
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
  app2.delete("/api/admin/notifications/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/committee", async (req, res) => {
    try {
      const members = await storage.getAllCommitteeMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching committee members" });
    }
  });
  app2.get("/api/committee/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const members = await storage.getCommitteeMembersByCategory(category);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching committee members" });
    }
  });
  app2.post("/api/admin/committee", isAdmin, async (req, res) => {
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
  app2.put("/api/admin/committee/:id", isAdmin, async (req, res) => {
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
  app2.delete("/api/admin/committee/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/awards", async (req, res) => {
    try {
      const awards = await storage.getActiveResearchAwards();
      res.json(awards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching research awards" });
    }
  });
  app2.get("/api/admin/awards", isAdmin, async (req, res) => {
    try {
      const awards = await storage.getAllResearchAwards();
      res.json(awards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching research awards" });
    }
  });
  app2.post("/api/admin/awards", isAdmin, async (req, res) => {
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
  app2.put("/api/admin/awards/:id", isAdmin, async (req, res) => {
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
  app2.delete("/api/admin/awards/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/invitations", isAdmin, async (req, res) => {
    try {
      const invitations2 = await storage.getAllInvitations();
      res.json(invitations2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invitations" });
    }
  });
  app2.post("/api/invitations", isAdmin, async (req, res) => {
    try {
      const validatedData = insertInvitationSchema.parse(req.body);
      const token = randomBytes2(32).toString("hex");
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);
      const invitation = await storage.createInvitation({
        ...validatedData,
        token,
        senderId: req.user.id,
        expiresAt
      });
      if (validatedData.type === "attendance") {
        const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;
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
        const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;
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
  app2.get("/api/invitations/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const invitation = await storage.getInvitationByToken(token);
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      if (invitation.expiresAt && /* @__PURE__ */ new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }
      res.json(invitation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invitation" });
    }
  });
  app2.put("/api/invitations/:token/status", async (req, res) => {
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
      if (invitation.expiresAt && /* @__PURE__ */ new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }
      if (invitation.status !== "pending") {
        return res.status(400).json({ message: `Invitation already ${invitation.status}` });
      }
      const updatedInvitation = await storage.updateInvitationStatus(token, status);
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
  app2.get("/api/invitations/verify", async (req, res) => {
    try {
      const token = req.query.token;
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
  app2.post("/api/invitations/attendance-response", async (req, res) => {
    try {
      const { token, accept } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Invalid token" });
      }
      if (typeof accept !== "boolean") {
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
      if (invitation.expiresAt && /* @__PURE__ */ new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }
      const status = accept ? "accepted" : "rejected";
      const updatedInvitation = await storage.updateInvitationStatus(token, status);
      const sender = await storage.getUser(invitation.senderId);
      if (sender) {
        await sendEmail(
          sender.email,
          `Attendance ${accept ? "Confirmed" : "Declined"} - RAISE DS 2025`,
          `<p>Dear ${sender.firstName},</p>
          <p>${invitation.name} has ${accept ? "confirmed" : "declined"} attendance to the conference.</p>
          <p>Position: ${invitation.position || "Not specified"}</p>
          <p>Institution: ${invitation.institution || "Not specified"}</p>
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
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const safeUsers = users2.map((user) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  app2.put("/api/admin/users/:id/role", isAdmin, async (req, res) => {
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
  app2.get("/api/brochure", (req, res) => {
    const brochurePath = path.join(process.cwd(), "uploads", "brochure.pdf");
    if (fs.existsSync(brochurePath)) {
      res.download(brochurePath, "RAISE-DS-2025-Brochure.pdf");
    } else {
      res.status(404).json({ message: "Brochure not available" });
    }
  });
  app2.post("/api/admin/brochure", isAdmin, upload.single("brochure"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const oldPath = req.file.path;
    const newPath = path.join(process.cwd(), "uploads", "brochure.pdf");
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    }
    fs.renameSync(oldPath, newPath);
    res.status(201).json({ message: "Brochure uploaded successfully" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "..", "dist");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  const publicPath2 = path3.resolve(import.meta.dirname, "..", "public");
  app2.use("/public", express2.static(publicPath2));
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv2 from "dotenv";
import { fileURLToPath as fileURLToPath2 } from "url";
import path5 from "path";
import { dirname as dirname2 } from "path";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path4 from "path";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
dotenv.config({ path: path4.resolve(__dirname, "../.env") });
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/seed.ts
import { scrypt as scrypt2, randomBytes as randomBytes3 } from "crypto";
import { promisify as promisify2 } from "util";
import { sql } from "drizzle-orm";
var scryptAsync2 = promisify2(scrypt2);
async function createTables() {
  try {
    console.log("Creating database tables if they don't exist...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        institution TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS abstracts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        authors TEXT NOT NULL,
        keywords TEXT NOT NULL,
        reference_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        file_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        bio TEXT,
        position TEXT,
        department TEXT,
        country TEXT,
        profile_picture_url TEXT,
        is_presenter BOOLEAN DEFAULT FALSE,
        is_committee_member BOOLEAN DEFAULT FALSE,
        social_links JSONB
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'pending',
        message TEXT,
        sender_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'general',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS committee_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        institution TEXT,
        country TEXT,
        category TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        "order" INTEGER DEFAULT 0
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_awards (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        amount TEXT,
        deadline TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}
async function setupDatabase() {
  try {
    await createTables();
    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}
setupDatabase();

// server/index.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
dotenv2.config({ path: path5.resolve(__dirname2, "../.env") });
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
var publicPath = process.env.NODE_ENV === "production" ? path5.join(__dirname2, "public") : path5.join(__dirname2, "../public");
app.use("/public", express3.static(publicPath));
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
