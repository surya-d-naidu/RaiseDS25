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

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  AuthorSchema: () => AuthorSchema,
  abstracts: () => abstracts,
  accommodationRequests: () => accommodationRequests,
  committeeMembers: () => committeeMembers,
  insertAbstractSchema: () => insertAbstractSchema,
  insertAccommodationRequestSchema: () => insertAccommodationRequestSchema,
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
import { z } from "zod";
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
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  role: true
});
var AuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  affiliation: z.string().min(1, "Author affiliation is required"),
  category: z.enum(["Delegate (Keynote speaker)", "Delegate (Invited speaker)", "Presenter", "Participant"]),
  email: z.string().email("Invalid email")
});
var abstracts = pgTable("abstracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  authors: json("authors").$type(),
  // Updated to use JSON for structured authors
  keywords: text("keywords").notNull(),
  referenceId: text("reference_id"),
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected
  fileUrl: text("file_url"),
  fullPaperUrl: text("full_paper_url"),
  // URL for full-length paper upload
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAbstractSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  authors: z.array(AuthorSchema).min(1, "At least one author is required").refine((authors) => {
    const presenters = authors.filter((author) => author.category === "Presenter");
    return presenters.length === 1;
  }, {
    message: "Exactly one author must be designated as the Presenter"
  }),
  keywords: z.string().min(1, "Keywords are required"),
  referenceId: z.string().optional(),
  fileUrl: z.string().optional(),
  fullPaperUrl: z.string().optional()
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
}).extend({
  expiresAt: z.union([
    z.string().transform((val) => val ? new Date(val) : null),
    z.date(),
    z.null()
  ]).optional()
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
  profileLink: text("profile_link"),
  // Link to member's profile page
  image: text("image")
  // Path to member's image
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
var accommodationRequests = pgTable("accommodation_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalPlace: text("arrival_place").notNull(),
  // airport, bus stand, railway station, etc.
  accommodationType: text("accommodation_type"),
  // single, double, shared, etc.
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAccommodationRequestSchema = createInsertSchema(accommodationRequests).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true
}).extend({
  arrivalDate: z.union([z.string(), z.date()]).transform((val) => typeof val === "string" ? new Date(val) : val),
  departureDate: z.union([z.string(), z.date()]).transform((val) => typeof val === "string" ? new Date(val) : val)
});

// server/db-storage.ts
import session from "express-session";

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/db-storage.ts
import { eq, gt, or, and, desc, asc, like } from "drizzle-orm";
import ConnectPgSimple from "connect-pg-simple";
import { Pool as Pool2 } from "pg";
var DbStorage = class {
  sessionStore;
  constructor() {
    const PgSession = ConnectPgSimple(session);
    this.sessionStore = new PgSession({
      pool: new Pool2({ connectionString: process.env.DATABASE_URL }),
      tableName: "sessions",
      createTableIfMissing: true
    });
  }
  // Helper function to generate category code
  getCategoryCode(category) {
    const categoryCodeMap = {
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
  // ----- Users -----
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  async createUser(userData) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }
  async updateUser(id, data) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }
  async deleteUser(id) {
    try {
      await db.delete(profiles).where(eq(profiles.userId, id));
      await db.delete(abstracts).where(eq(abstracts.userId, id));
      const result = await db.delete(users).where(eq(users.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
  async getAllUsers() {
    return db.select().from(users);
  }
  // ----- Profiles -----
  async getProfile(userId) {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }
  async createProfile(profileData) {
    const result = await db.insert(profiles).values(profileData).returning();
    return result[0];
  }
  async updateProfile(userId, data) {
    const existingProfile = await this.getProfile(userId);
    if (!existingProfile) return void 0;
    const result = await db.update(profiles).set(data).where(eq(profiles.userId, userId)).returning();
    return result[0];
  }
  // ----- Abstracts -----
  async getAbstract(id) {
    const result = await db.select().from(abstracts).where(eq(abstracts.id, id)).limit(1);
    return result[0];
  }
  async getAbstractsByUser(userId) {
    return db.select().from(abstracts).where(eq(abstracts.userId, userId));
  }
  async getAllAbstracts() {
    return db.select().from(abstracts).orderBy(desc(abstracts.createdAt));
  }
  async createAbstract(abstractData) {
    const now = /* @__PURE__ */ new Date();
    const categoryCode = this.getCategoryCode(abstractData.category);
    const existingRefs = await db.select({ referenceId: abstracts.referenceId }).from(abstracts).where(like(abstracts.referenceId, `${categoryCode}-%`));
    let nextNum = 1;
    if (existingRefs.length > 0) {
      const numbers = existingRefs.map((ref) => {
        const match = ref.referenceId?.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      }).filter((num) => num > 0);
      if (numbers.length > 0) {
        nextNum = Math.max(...numbers) + 1;
      }
    }
    const referenceId = `${categoryCode}-${String(nextNum).padStart(4, "0")}`;
    const result = await db.insert(abstracts).values({
      ...abstractData,
      referenceId,
      status: "pending",
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }
  async updateAbstract(id, data) {
    const result = await db.update(abstracts).set({
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(abstracts.id, id)).returning();
    return result[0];
  }
  async updateAbstractStatus(id, status) {
    const result = await db.update(abstracts).set({
      status,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(abstracts.id, id)).returning();
    return result[0];
  }
  async deleteAbstract(id) {
    const result = await db.delete(abstracts).where(eq(abstracts.id, id)).returning();
    return result.length > 0;
  }
  // ----- Invitations -----
  async getInvitation(id) {
    const result = await db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
    return result[0];
  }
  async getInvitationByToken(token) {
    const result = await db.select().from(invitations).where(eq(invitations.token, token)).limit(1);
    return result[0];
  }
  async getAllInvitations() {
    return db.select().from(invitations).orderBy(desc(invitations.createdAt));
  }
  async createInvitation(invitationData) {
    const result = await db.insert(invitations).values(invitationData).returning();
    return result[0];
  }
  async updateInvitationStatus(token, status) {
    const result = await db.update(invitations).set({ status }).where(eq(invitations.token, token)).returning();
    return result[0];
  }
  async deleteInvitation(id) {
    const result = await db.delete(invitations).where(eq(invitations.id, id)).returning();
    return result.length > 0;
  }
  async deleteAllInvitations() {
    const result = await db.delete(invitations).returning();
    return result.length;
  }
  // ----- Notifications -----
  async getNotification(id) {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }
  async getActiveNotifications() {
    const now = /* @__PURE__ */ new Date();
    return db.select().from(notifications).where(
      and(
        eq(notifications.isActive, true),
        or(
          eq(notifications.expiresAt, null),
          gt(notifications.expiresAt, now)
        )
      )
    ).orderBy(desc(notifications.createdAt));
  }
  async getAllNotifications() {
    return db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }
  async createNotification(notificationData) {
    const result = await db.insert(notifications).values(notificationData).returning();
    return result[0];
  }
  async updateNotification(id, data) {
    const result = await db.update(notifications).set(data).where(eq(notifications.id, id)).returning();
    return result[0];
  }
  async deleteNotification(id) {
    const result = await db.delete(notifications).where(eq(notifications.id, id)).returning();
    return result.length > 0;
  }
  // ----- Committee Members -----
  async getCommitteeMember(id) {
    const result = await db.select().from(committeeMembers).where(eq(committeeMembers.id, id)).limit(1);
    return result[0];
  }
  async getCommitteeMembersByCategory(category) {
    return db.select().from(committeeMembers).where(eq(committeeMembers.category, category)).orderBy(asc(committeeMembers.order));
  }
  async getAllCommitteeMembers() {
    try {
      return await db.select().from(committeeMembers).orderBy(asc(committeeMembers.order));
    } catch (error) {
      console.error("Error fetching committee members:", error);
      return [];
    }
  }
  async createCommitteeMember(memberData) {
    try {
      const result = await db.insert(committeeMembers).values(memberData).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating committee member:", error);
      throw error;
    }
  }
  async updateCommitteeMember(id, data) {
    const result = await db.update(committeeMembers).set(data).where(eq(committeeMembers.id, id)).returning();
    return result[0];
  }
  async deleteCommitteeMember(id) {
    const result = await db.delete(committeeMembers).where(eq(committeeMembers.id, id)).returning();
    return result.length > 0;
  }
  // ----- Research Awards -----
  async getResearchAward(id) {
    const result = await db.select().from(researchAwards).where(eq(researchAwards.id, id)).limit(1);
    return result[0];
  }
  async getActiveResearchAwards() {
    return db.select().from(researchAwards).where(eq(researchAwards.isActive, true));
  }
  async getAllResearchAwards() {
    return db.select().from(researchAwards);
  }
  async createResearchAward(awardData) {
    const result = await db.insert(researchAwards).values(awardData).returning();
    return result[0];
  }
  async updateResearchAward(id, data) {
    const result = await db.update(researchAwards).set(data).where(eq(researchAwards.id, id)).returning();
    return result[0];
  }
  async deleteResearchAward(id) {
    const result = await db.delete(researchAwards).where(eq(researchAwards.id, id)).returning();
    return result.length > 0;
  }
  // ----- Email Verification -----
  async setEmailVerificationToken(userId, token) {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    await db.update(users).set({
      emailVerificationToken: token,
      emailVerificationExpires: expiresAt
    }).where(eq(users.id, userId));
  }
  async verifyEmail(token) {
    const now = /* @__PURE__ */ new Date();
    const result = await db.select().from(users).where(
      and(
        eq(users.emailVerificationToken, token),
        gt(users.emailVerificationExpires, now)
      )
    ).limit(1);
    if (result.length === 0) {
      return void 0;
    }
    const user = result[0];
    await db.update(users).set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    }).where(eq(users.id, user.id));
    return user;
  }
  async resendVerificationToken(email) {
    const user = await this.getUserByEmail(email);
    if (!user || user.emailVerified) {
      return void 0;
    }
    return user;
  }
  // ----- Password Reset -----
  async setPasswordResetToken(email, token) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return void 0;
    }
    const expiresAt = new Date(Date.now() + 60 * 60 * 1e3);
    const result = await db.update(users).set({
      passwordResetToken: token,
      passwordResetExpires: expiresAt
    }).where(eq(users.id, user.id)).returning();
    return result[0];
  }
  async verifyPasswordResetToken(token) {
    const now = /* @__PURE__ */ new Date();
    const result = await db.select().from(users).where(
      and(
        eq(users.passwordResetToken, token),
        gt(users.passwordResetExpires, now)
      )
    ).limit(1);
    return result[0];
  }
  async updatePassword(userId, newPassword) {
    const result = await db.update(users).set({
      password: newPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  // ----- Accommodation Requests -----
  async getAccommodationRequest(userId) {
    const result = await db.select().from(accommodationRequests).where(eq(accommodationRequests.userId, userId)).limit(1);
    return result[0];
  }
  async getAllAccommodationRequests() {
    return await db.select().from(accommodationRequests).orderBy(desc(accommodationRequests.createdAt));
  }
  async createAccommodationRequest(request) {
    const result = await db.insert(accommodationRequests).values(request).returning();
    return result[0];
  }
  async updateAccommodationRequest(id, data) {
    const result = await db.update(accommodationRequests).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(accommodationRequests.id, id)).returning();
    return result[0];
  }
  async deleteAccommodationRequest(id) {
    const result = await db.delete(accommodationRequests).where(eq(accommodationRequests.id, id)).returning();
    return result.length > 0;
  }
};
var storage = new DbStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/email-utils.ts
import nodemailer from "nodemailer";
function generateOTP() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function createBaseEmailTemplate(title, content, footerText) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - RAISE DS 2025</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #334155;
          background-color: #f8fafc;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }
        
        .header .subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .content p {
          font-size: 16px;
          color: #475569;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        
        .otp-box {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 12px;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 4px 14px 0 rgba(30, 64, 175, 0.3);
        }
        
        .warning-box {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: white;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 12px;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
        }
        
        .info-box {
          background: #f1f5f9;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .info-box p {
          margin: 0;
          color: #475569;
          font-size: 14px;
        }
        
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin: 20px 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(30, 64, 175, 0.3);
        }
        
        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(30, 64, 175, 0.4);
        }
        
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 10px;
        }
        
        .footer .contact-info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer .contact-info p {
          margin-bottom: 5px;
        }
        
        .footer .social-links {
          margin-top: 15px;
        }
        
        .footer .social-links a {
          color: #3b82f6;
          text-decoration: none;
          margin: 0 10px;
          font-weight: 500;
        }
        
        @media (max-width: 640px) {
          .container {
            margin: 0 10px;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .otp-box, .warning-box {
            font-size: 28px;
            letter-spacing: 8px;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px 0;">
        <div class="container">
          <div class="header">
            <h1>RAISE DS 2025</h1>
            <div class="subtitle">45th Annual Convention of Indian Society for Probability and Statistics</div>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="footer">
            <p>&copy; 2025 RAISE DS Conference. All rights reserved.</p>
            <p>${footerText || "Thank you for being part of RAISE DS 2025!"}</p>
            
            <div class="contact-info">
              <p><strong>Conference Contact:</strong></p>
              <p>Email: raiseds25@vitap.ac.in</p>
              <p>Website: www.raiseds25.com</p>
              <p>Phone: +91-7673944853</p>
            </div>
            
            <div class="social-links">
              <a href="https://www.raiseds25.com">Conference Website</a>
              <a href="mailto:raiseds25@vitap.ac.in">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
async function sendEmail(to, subject, html) {
  try {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    await transporter.sendMail({
      from: `"RAISE DS 2025 Conference" <${process.env.GMAIL_USER}>`,
      to,
      subject: `${subject} - RAISE DS 2025`,
      html
    });
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
async function sendOTPEmail(email, otp, name) {
  const subject = "Email Verification Required";
  const content = `
    <h2>Email Verification</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for registering for RAISE DS 2025. To complete your registration, please verify your email address using the OTP below:</p>
    
    <div class="otp-box">${otp}</div>
    
    <div class="info-box">
      <p><strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.</p>
    </div>
    
    <p>If you didn't create an account with us, please ignore this email and your information will be automatically removed from our system.</p>
  `;
  const html = createBaseEmailTemplate("Email Verification", content, "Secure your account by verifying your email address.");
  return sendEmail(email, subject, html);
}
async function sendPasswordResetEmail(email, otp, name) {
  const subject = "Password Reset Request";
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>You have requested to reset your password for your RAISE DS 2025 account. Use the following OTP to proceed with resetting your password:</p>
    
    <div class="warning-box">${otp}</div>
    
    <div class="info-box">
      <p><strong>Security Notice:</strong> This OTP will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
    
    <p>For your security, never share this OTP with anyone. Our team will never ask for your OTP via phone or email.</p>
  `;
  const html = createBaseEmailTemplate("Password Reset", content, "Keep your account secure with a strong password.");
  return sendEmail(email, subject, html);
}
async function sendAttendanceInvitationEmail(email, name, message, attendanceUrl) {
  const subject = "Invitation to Attend RAISE DS 2025";
  const content = `
    <h2>You're Invited to RAISE DS 2025!</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>You are cordially invited to attend the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in conjunction with the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS).</p>
    
    <div class="info-box">
      <p><strong>Conference Details:</strong><br>
      \u{1F4C5} December 22-24, 2025<br>
      \u{1F4CD} VIT-AP University, Vijayawada<br>
      \u{1F3AF} Theme: Recent Advances and Innovative Statistics with Enhancing Data Science
      </p>
    </div>
    
    ${message ? `<p><strong>Personal Message:</strong></p><p style="font-style: italic; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>` : ""}
    
    <p>Please confirm your attendance by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${attendanceUrl}" class="button">Respond to Invitation</a>
    </div>
    
    <p>We look forward to your participation in this prestigious conference!</p>
  `;
  const html = createBaseEmailTemplate("Conference Invitation", content, "Join us for an exceptional academic experience!");
  return sendEmail(email, subject, html);
}
async function sendAccountInvitationEmail(email, name, message, registerUrl) {
  const subject = "Invitation to Join RAISE DS 2025 Platform";
  const content = `
    <h2>Join the RAISE DS 2025 Community!</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>You have been invited to join the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) conference platform.</p>
    
    <div class="info-box">
      <p><strong>Platform Benefits:</strong><br>
      \u{1F52C} Submit research abstracts<br>
      \u{1F4CB} Register for the conference<br>
      \u{1F4DA} Access conference materials<br>
      \u{1F91D} Connect with fellow researchers
      </p>
    </div>
    
    ${message ? `<p><strong>Personal Message:</strong></p><p style="font-style: italic; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>` : ""}
    
    <p>Click the button below to create your account and get started:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${registerUrl}" class="button">Create Account</a>
    </div>
    
    <p>Welcome to the RAISE DS 2025 community!</p>
  `;
  const html = createBaseEmailTemplate("Platform Invitation", content, "Start your journey with RAISE DS 2025!");
  return sendEmail(email, subject, html);
}

// server/auth.ts
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
  passport.serializeUser((user, done) => {
    if (!user || !user.id) {
      console.warn("Cannot serialize undefined or invalid user");
      return done(null, false);
    }
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    if (!id) {
      console.warn("No ID provided for deserialization");
      return done(null, false);
    }
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.warn(`User with ID ${id} not found during deserialization`);
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      return done(null, false);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName, institution, invitationToken } = req.body;
      if (invitationToken) {
        const invitation = await storage.getInvitationByToken(invitationToken);
        if (!invitation) {
          return res.status(400).json({ message: "Invalid invitation token" });
        }
        if (invitation.expiresAt && /* @__PURE__ */ new Date() > invitation.expiresAt) {
          return res.status(400).json({ message: "Invitation has expired" });
        }
        if (invitation.type !== "account") {
          return res.status(400).json({ message: "This invitation is not for account creation" });
        }
        if (invitation.email !== email) {
          return res.status(400).json({ message: "Email must match the invitation email" });
        }
        if (invitation.status !== "pending") {
          return res.status(400).json({ message: `This invitation has already been ${invitation.status}` });
        }
      }
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
        password: await hashPassword(password),
        emailVerified: false
      });
      await storage.createProfile({
        userId: user.id,
        bio: "",
        isPresenter: false,
        isCommitteeMember: false,
        socialLinks: {}
      });
      if (invitationToken) {
        await storage.updateInvitationStatus(invitationToken, "accepted");
      }
      const otp = generateOTP();
      await storage.setEmailVerificationToken(user.id, otp);
      try {
        await sendOTPEmail(email, otp, firstName);
        console.log(`OTP sent to ${email}: ${otp}`);
        res.status(201).json({
          message: invitationToken ? "Registration successful via invitation. Please check your email for verification code." : "Registration successful. Please check your email for verification code.",
          requiresVerification: true,
          email,
          fromInvitation: !!invitationToken
        });
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        res.status(201).json({
          message: invitationToken ? "Registration successful via invitation but failed to send verification email. Please contact support." : "Registration successful but failed to send verification email. Please contact support.",
          requiresVerification: false,
          email,
          fromInvitation: !!invitationToken
        });
      }
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
      if (!user.emailVerified) {
        return res.status(403).json({
          message: "Please verify your email address before logging in.",
          requiresVerification: true,
          email: user.email
        });
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
  app2.post("/api/verify-email", async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
      const user = await storage.verifyEmail(otp);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Auto-login error after verification:", err);
          return res.status(200).json({
            message: "Email verified successfully. Please log in.",
            verified: true
          });
        }
        const safeUser = { ...user };
        delete safeUser.password;
        res.status(200).json({
          message: "Email verified successfully",
          verified: true,
          user: safeUser
        });
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Error verifying email" });
    }
  });
  app2.post("/api/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.resendVerificationToken(email);
      if (!user) {
        return res.status(400).json({ message: "User not found or already verified" });
      }
      const otp = generateOTP();
      await storage.setEmailVerificationToken(user.id, otp);
      try {
        await sendOTPEmail(email, otp, user.firstName);
        console.log(`New OTP sent to ${email}: ${otp}`);
        res.status(200).json({ message: "New verification code sent to your email" });
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        res.status(500).json({ message: "Failed to send verification email" });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ message: "Error resending verification code" });
    }
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          message: "No account found with this email address. Please check your email or create a new account."
        });
      }
      const otp = generateOTP();
      await storage.setPasswordResetToken(email, otp);
      try {
        await sendPasswordResetEmail(email, otp, user.firstName);
        console.log(`Password reset OTP sent to ${email}: ${otp}`);
        res.status(200).json({
          message: "Password reset code has been sent to your email.",
          email
        });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        res.status(500).json({ message: "Failed to send password reset email. Please try again." });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Error processing password reset request" });
    }
  });
  app2.post("/api/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      const user = await storage.verifyPasswordResetToken(otp);
      if (!user || user.email !== email) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updatePassword(user.id, hashedPassword);
      res.status(200).json({
        message: "Password reset successfully. You can now log in with your new password."
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
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
import { ZodError as ZodError2 } from "zod";
import multer2 from "multer";
import path3 from "path";
import fs2 from "fs";

// server/auth-middleware.ts
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

// server/routes/abstracts.ts
import { ZodError } from "zod";
import path2 from "path";
import fs from "fs";
import multer from "multer";
var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      const dir = path2.join(process.cwd(), "uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path2.extname(file.originalname));
    }
  })
});
function formatZodError(err) {
  return err.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message
  }));
}
function registerAbstractRoutes(app2) {
  app2.get("/api/abstracts", isAuthenticated, async (req, res) => {
    try {
      const abstracts2 = await storage.getAbstractsByUser(req.user.id);
      res.json(abstracts2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching abstracts" });
    }
  });
  app2.post("/api/abstracts", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      const { title, category, content, keywords } = req.body;
      let authors;
      try {
        authors = JSON.parse(req.body.authors);
      } catch (e) {
        return res.status(400).json({
          errors: [{ path: "authors", message: "Invalid authors data format" }]
        });
      }
      try {
        insertAbstractSchema.parse({
          title,
          category,
          content,
          authors,
          keywords,
          fileUrl: req.file ? `/uploads/${req.file.filename}` : void 0
        });
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ errors: formatZodError(validationError) });
        }
        throw validationError;
      }
      const newAbstract = await storage.createAbstract({
        userId: req.user.id,
        title,
        category,
        content,
        authors,
        // Now contains structured author data with categories
        keywords,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : void 0
      });
      const authorDisplay = authors.map((a) => a.name).join(", ");
      try {
        await sendEmail(
          req.user.email,
          `Abstract Submission Confirmation - RAISE DS 2025`,
          `<p>Dear ${req.user.firstName},</p>
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
      let updateData = { ...req.body };
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
        if (abstract.fileUrl) {
          const oldFilePath = path2.join(process.cwd(), abstract.fileUrl.replace(/^\/uploads\//, "uploads/"));
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
        const filePath = path2.join(process.cwd(), abstract.fileUrl.replace(/^\/uploads\//, "uploads/"));
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
  app2.post("/api/abstracts/:id/full-paper", isAuthenticated, upload.single("fullPaper"), async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const abstract = await storage.getAbstract(abstractId);
      if (!abstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      if (abstract.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (abstract.status !== "accepted") {
        return res.status(400).json({ message: "Full paper can only be uploaded for accepted abstracts" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      if (req.file.mimetype !== "application/pdf") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Only PDF files are allowed for full papers" });
      }
      if (abstract.fullPaperUrl) {
        const oldFilePath = path2.join(process.cwd(), abstract.fullPaperUrl.replace(/^\/uploads\//, "uploads/"));
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      const updatedAbstract = await storage.updateAbstract(abstractId, {
        fullPaperUrl: fileUrl
      });
      res.json({
        message: "Full paper uploaded successfully",
        abstract: updatedAbstract
      });
    } catch (error) {
      console.error("Error uploading full paper:", error);
      res.status(500).json({ message: "Error uploading full paper" });
    }
  });
  app2.get("/api/abstracts/:id/full-paper", isAuthenticated, async (req, res) => {
    try {
      const abstractId = parseInt(req.params.id);
      const abstract = await storage.getAbstract(abstractId);
      if (!abstract) {
        return res.status(404).json({ message: "Abstract not found" });
      }
      if (!abstract.fullPaperUrl) {
        return res.status(404).json({ message: "Full paper not found" });
      }
      if (abstract.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const filePath = path2.join(process.cwd(), abstract.fullPaperUrl.replace(/^\/uploads\//, "uploads/"));
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on server" });
      }
      res.download(filePath);
    } catch (error) {
      console.error("Error downloading full paper:", error);
      res.status(500).json({ message: "Error downloading full paper" });
    }
  });
}

// server/routes.ts
var upload2 = multer2({
  storage: multer2.diskStorage({
    destination: function(req, file, cb) {
      const dir = path3.join(process.cwd(), "uploads");
      if (!fs2.existsSync(dir)) {
        fs2.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path3.extname(file.originalname));
    }
  })
});
function formatZodError2(err) {
  return err.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message
  }));
}
async function registerRoutes(app2) {
  setupAuth(app2);
  const uploadsDir = path3.join(process.cwd(), "uploads");
  if (!fs2.existsSync(uploadsDir)) {
    fs2.mkdirSync(uploadsDir, { recursive: true });
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
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
      }
      res.status(500).json({ message: "Error creating notification" });
    }
  });
  app2.put("/api/admin/notifications/:id", isAdmin, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.updateNotification(notificationId, validatedData);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
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
      res.json(members || []);
    } catch (error) {
      console.error("Error fetching committee members:", error);
      res.json([]);
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
      console.error("Error in committee member creation:", error);
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
      }
      res.status(500).json({ message: "Error creating committee member" });
    }
  });
  app2.post("/api/admin/committee/:id/image", isAdmin, upload2.single("image"), async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const imagePath = `/uploads/${req.file.filename}`;
      const updatedMember = await storage.updateCommitteeMember(memberId, { image: imagePath });
      if (!updatedMember) {
        return res.status(404).json({ message: "Committee member not found" });
      }
      res.json({ imagePath, member: updatedMember });
    } catch (error) {
      console.error("Error uploading committee member image:", error);
      res.status(500).json({ message: "Error uploading image" });
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
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
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
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
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
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
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
  app2.delete("/api/admin/invitations/:id", isAdmin, async (req, res) => {
    try {
      const invitationId = parseInt(req.params.id);
      const success = await storage.deleteInvitation(invitationId);
      if (!success) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      res.json({ message: "Invitation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting invitation" });
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
        await sendAttendanceInvitationEmail(
          invitation.email,
          invitation.name,
          invitation.message || "",
          attendanceUrl
        );
      } else {
        const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;
        const registerUrl = `${clientUrl}/register?token=${token}`;
        await sendAccountInvitationEmail(
          invitation.email,
          invitation.name,
          invitation.message || "",
          registerUrl
        );
      }
      res.status(201).json(invitation);
    } catch (error) {
      if (error instanceof ZodError2) {
        return res.status(400).json({ errors: formatZodError2(error) });
      }
      res.status(500).json({ message: "Error creating invitation" });
    }
  });
  app2.post("/api/invitations/bulk", isAdmin, async (req, res) => {
    try {
      const { emails, role, type, message, expiresAt, institution, position } = req.body;
      if (!emails || typeof emails !== "string") {
        return res.status(400).json({ message: "Email list is required" });
      }
      const emailList = emails.split(/[,;\n]/).map((email) => email.trim()).filter((email) => email.length > 0 && email.includes("@"));
      if (emailList.length === 0) {
        return res.status(400).json({ message: "No valid email addresses found" });
      }
      const results = {
        success: 0,
        failed: 0,
        errors: []
      };
      for (const email of emailList) {
        try {
          const name = email.split("@")[0].replace(/[._-]/g, " ");
          const invitationData = {
            name,
            email,
            role: role || "user",
            type: type || "account",
            message: message || "",
            institution: institution || "",
            position: position || ""
          };
          const validatedData = insertInvitationSchema.parse(invitationData);
          const token = randomBytes2(32).toString("hex");
          const expiry = /* @__PURE__ */ new Date();
          expiry.setDate(expiry.getDate() + 14);
          const invitation = await storage.createInvitation({
            ...validatedData,
            token,
            senderId: req.user.id,
            expiresAt: expiresAt ? new Date(expiresAt) : expiry
          });
          if (validatedData.type === "attendance") {
            const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;
            const attendanceUrl = `${clientUrl}/attendance?token=${token}`;
            await sendAttendanceInvitationEmail(
              invitation.email,
              invitation.name,
              invitation.message || "",
              attendanceUrl
            );
          } else {
            const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;
            const registerUrl = `${clientUrl}/register?token=${token}`;
            await sendAccountInvitationEmail(
              invitation.email,
              invitation.name,
              invitation.message || "",
              registerUrl
            );
          }
          results.success++;
        } catch (error) {
          results.failed++;
          let errorMessage = "Unknown error";
          if (error instanceof ZodError2) {
            errorMessage = error.errors.map((e) => e.message).join(", ");
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          results.errors.push({
            email,
            error: errorMessage
          });
        }
      }
      res.status(201).json(results);
    } catch (error) {
      res.status(500).json({ message: "Error processing bulk invitations" });
    }
  });
  app2.delete("/api/admin/invitations/delete-all", isAdmin, async (req, res) => {
    try {
      const deletedCount = await storage.deleteAllInvitations();
      res.json({ deletedCount, message: `Successfully deleted ${deletedCount} invitation(s)` });
    } catch (error) {
      console.error("Error deleting all invitations:", error);
      res.status(500).json({ error: "Failed to delete all invitations" });
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
  app2.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (req.user && req.user.id === userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found or could not be deleted" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  });
  app2.get("/api/brochure", (req, res) => {
    const brochurePath = path3.join(process.cwd(), "uploads", "brochure.pdf");
    if (fs2.existsSync(brochurePath)) {
      res.download(brochurePath, "RAISE-DS-2025-Brochure.pdf");
    } else {
      res.status(404).json({ message: "Brochure not available" });
    }
  });
  app2.post("/api/admin/brochure", isAdmin, upload2.single("brochure"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const oldPath = req.file.path;
    const newPath = path3.join(process.cwd(), "uploads", "brochure.pdf");
    if (fs2.existsSync(newPath)) {
      fs2.unlinkSync(newPath);
    }
    fs2.renameSync(oldPath, newPath);
    res.status(201).json({ message: "Brochure uploaded successfully" });
  });
  app2.get("/api/accommodation-request", isAuthenticated, async (req, res) => {
    try {
      const request = await storage.getAccommodationRequest(req.user.id);
      res.json(request || null);
    } catch (error) {
      console.error("Error fetching accommodation request:", error);
      res.status(500).json({ error: "Failed to fetch accommodation request" });
    }
  });
  app2.post("/api/accommodation-request", isAuthenticated, async (req, res) => {
    try {
      const existingRequest = await storage.getAccommodationRequest(req.user.id);
      if (existingRequest) {
        return res.status(400).json({ error: "You have already submitted an accommodation request" });
      }
      const validatedData = insertAccommodationRequestSchema.parse(req.body);
      const request = await storage.createAccommodationRequest({
        ...validatedData,
        userId: req.user.id
      });
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError2) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      console.error("Error creating accommodation request:", error);
      res.status(500).json({ error: "Failed to create accommodation request" });
    }
  });
  app2.get("/api/admin/accommodation-requests", isAdmin, async (req, res) => {
    try {
      const requests = await storage.getAllAccommodationRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching accommodation requests:", error);
      res.status(500).json({ error: "Failed to fetch accommodation requests" });
    }
  });
  app2.put("/api/admin/accommodation-requests/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Valid status is required" });
      }
      const request = await storage.updateAccommodationRequest(parseInt(id), { status });
      if (!request) {
        return res.status(404).json({ error: "Accommodation request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error updating accommodation request:", error);
      res.status(500).json({ error: "Failed to update accommodation request" });
    }
  });
  registerAbstractRoutes(app2);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs3 from "fs";
import path5 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path4 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2 } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
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
      "@": path4.resolve(__dirname2, "client", "src"),
      "@shared": path4.resolve(__dirname2, "shared"),
      "@assets": path4.resolve(__dirname2, "attached_assets")
    }
  },
  root: path4.resolve(__dirname2, "client"),
  build: {
    outDir: path4.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath3 } from "url";
import { dirname as dirname3 } from "path";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname3(__filename3);
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
      const clientTemplate = path5.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
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
  const distPath = path5.resolve(__dirname3, "..", "dist", "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  const publicPath2 = path5.resolve(__dirname3, "..", "public");
  app2.use("/public", express2.static(publicPath2));
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv2 from "dotenv";
import { fileURLToPath as fileURLToPath4 } from "url";
import path6 from "path";
import { dirname as dirname4 } from "path";
import https from "https";
import fs4 from "fs";
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = dirname4(__filename4);
dotenv2.config({ path: path6.resolve(__dirname4, "../.env") });
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.enable("trust proxy");
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  const hostHeader = req.headers.host || "";
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_HTTPS === "true" && hostHeader.includes("raiseds25") && // Only redirect domain traffic
  !isHttps) {
    const host = hostHeader.split(":")[0];
    return res.redirect(301, `https://${host}${req.url}`);
  }
  next();
});
var publicPath = process.env.NODE_ENV === "production" ? path6.join(__dirname4, "public") : path6.join(__dirname4, "../public");
app.use("/public", express3.static(publicPath));
app.use((req, res, next) => {
  const start = Date.now();
  const path7 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path7.startsWith("/api")) {
      let logLine = `${req.method} ${path7} ${res.statusCode} in ${duration}ms`;
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
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_HTTPS === "true") {
    try {
      const privateKey = fs4.readFileSync("/etc/letsencrypt/live/raiseds25.com/privkey.pem", "utf8");
      const certificate = fs4.readFileSync("/etc/letsencrypt/live/raiseds25.com/fullchain.pem", "utf8");
      const credentials = {
        key: privateKey,
        cert: certificate
      };
      const httpsServer = https.createServer(credentials, app);
      httpsServer.listen(443, "0.0.0.0", () => {
        log(`HTTPS server running on port 443`);
      }).on("error", (err) => {
        if (err.code === "EACCES") {
          log(`Error: Permission denied to bind to port 443. Make sure the process has the right permissions or is run with sudo.`);
        } else if (err.code === "EADDRINUSE") {
          log(`Error: Port 443 is already in use. Make sure no other service is running on this port.`);
        } else {
          log(`HTTPS server error: ${err.message}`);
        }
      });
      log("HTTPS server successfully configured");
    } catch (error) {
      log(`Failed to set up HTTPS server: ${error.message}`);
      if (error.code === "ENOENT") {
        log("SSL certificate files not found. Please check the path to your certificate files.");
      } else if (error.code === "EACCES") {
        log("Permission denied when reading certificate files. Please check file permissions.");
      }
    }
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`HTTP server running on port ${port}`);
  }).on("error", (err) => {
    if (err.code === "EACCES") {
      log(`Error: Permission denied to bind to port ${port}. Make sure the process has the right permissions or is run with sudo.`);
    } else if (err.code === "EADDRINUSE") {
      log(`Error: Port ${port} is already in use. Make sure no other service is running on this port.`);
    } else {
      log(`HTTP server error: ${err.message}`);
    }
  });
})();
