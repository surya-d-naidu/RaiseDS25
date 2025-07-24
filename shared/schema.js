import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  institution: text("institution").notNull(),
  role: text("role").notNull().default("user"), // user, admin
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  role: true 
});

// Author type for structured author data
export const AuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  affiliation: z.string().min(1, "Author affiliation is required"),
  category: z.enum(["Delegate (Keynote speaker)", "Delegate (Invited speaker)", "Presenter", "Participant"]),
  email: z.string().email("Invalid email")
});

// Abstracts
export const abstracts = pgTable("abstracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  authors: json("authors"), // Updated to use JSON for structured authors
  keywords: text("keywords").notNull(),
  referenceId: text("reference_id"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Override the automatically generated schema to handle the authors field properly
export const insertAbstractSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  authors: z.array(AuthorSchema).min(1, "At least one author is required"),
  keywords: z.string().min(1, "Keywords are required"),
  referenceId: z.string().optional(),
  fileUrl: z.string().optional()
});

// Profiles
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  bio: text("bio"),
  position: text("position"),
  department: text("department"),
  country: text("country"),
  profilePictureUrl: text("profile_picture_url"),
  isPresenter: boolean("is_presenter").default(false),
  isCommitteeMember: boolean("is_committee_member").default(false),
  socialLinks: json("social_links"),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true, 
  userId: true 
});



// Invitations
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  token: text("token").notNull().unique(),
  role: text("role").notNull().default("user"),
  type: text("type").notNull().default("account"), // account, attendance
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  message: text("message"),
  senderId: integer("sender_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  institution: text("institution"),
  position: text("position"),
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({ 
  id: true, 
  token: true, 
  status: true, 
  senderId: true, 
  createdAt: true 
});



// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("general"), // general, important, deadline
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  expiresAt: z.union([
    z.string().transform((val) => val ? new Date(val) : null),
    z.date(),
    z.null()
  ]).optional()
});



// Committee members
export const committeeMembers = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  institution: text("institution"),
  country: text("country"),
  category: text("category").notNull(), // chief_patron, patron, organizing_committee, advisory_committee, etc.
  email: text("email"),
  phone: text("phone"),
  order: integer("order").default(0),
  profileLink: text("profile_link"), // Link to member's profile page
  image: text("image"), // Path to member's image
});

export const insertCommitteeMemberSchema = createInsertSchema(committeeMembers).omit({ 
  id: true 
});



// Research awards
export const researchAwards = pgTable("research_awards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eligibility: text("eligibility").notNull(),
  amount: text("amount"),
  deadline: timestamp("deadline"),
  isActive: boolean("is_active").default(true),
});

export const insertResearchAwardSchema = createInsertSchema(researchAwards).omit({ 
  id: true 
});


