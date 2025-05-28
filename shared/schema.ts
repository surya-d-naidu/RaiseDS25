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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  role: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Abstracts
export const abstracts = pgTable("abstracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  authors: text("authors").notNull(), // New field for authors
  keywords: text("keywords").notNull(),
  referenceId: text("reference_id"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAbstractSchema = createInsertSchema(abstracts).omit({ 
  id: true, 
  userId: true, 
  status: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertAbstract = z.infer<typeof insertAbstractSchema>;
export type Abstract = typeof abstracts.$inferSelect;

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
  socialLinks: json("social_links").$type<{
    website?: string;
    linkedin?: string;
    twitter?: string;
    orcid?: string;
  }>(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true, 
  userId: true 
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

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

export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Invitation = typeof invitations.$inferSelect;

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
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

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

export type InsertCommitteeMember = z.infer<typeof insertCommitteeMemberSchema>;
export type CommitteeMember = typeof committeeMembers.$inferSelect;

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

export type InsertResearchAward = z.infer<typeof insertResearchAwardSchema>;
export type ResearchAward = typeof researchAwards.$inferSelect;
