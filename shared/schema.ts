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
  profilePictureUrl: text("profile_picture_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  role: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Author type for structured author data
export const AuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  affiliation: z.string().min(1, "Author affiliation is required"),
  category: z.enum(["Delegate (Keynote speaker)", "Delegate (Invited speaker)", "Presenter", "Participant"]),
  email: z.string().email("Invalid email")
});

export type Author = z.infer<typeof AuthorSchema>;

// Abstracts
export const abstracts = pgTable("abstracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  authors: json("authors").$type<Author[]>(), // Updated to use JSON for structured authors
  keywords: text("keywords").notNull(),
  referenceId: text("reference_id"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  fileUrl: text("file_url"),
  fullPaperUrl: text("full_paper_url"), // URL for full-length paper upload
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Override the automatically generated schema to handle the authors field properly
export const insertAbstractSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  authors: z.array(AuthorSchema)
    .min(1, "At least one author is required")
    .refine((authors) => {
      const presenters = authors.filter(author => author.category === "Presenter");
      return presenters.length === 1;
    }, {
      message: "Exactly one author must be designated as the Presenter"
    }),
  keywords: z.string().min(1, "Keywords are required"),
  referenceId: z.string().optional(),
  fileUrl: z.string().optional(),
  fullPaperUrl: z.string().optional().or(z.literal(""))
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
}).extend({
  expiresAt: z.union([
    z.string().transform((val) => val ? new Date(val) : null),
    z.date(),
    z.null()
  ]).optional()
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

// Accommodation requests
export const accommodationRequests = pgTable("accommodation_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalPlace: text("arrival_place").notNull(), // airport, bus stand, railway station, etc.
  accommodationType: text("accommodation_type"), // single, double, shared, etc.
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // male, female, other, prefer-not-to-say
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAccommodationRequestSchema = createInsertSchema(accommodationRequests).omit({ 
  id: true, 
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true
}).extend({
  arrivalDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  departureDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  age: z.number().min(1, "Age is required").max(120, "Please enter a valid age"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Gender selection is required"
  }),
});

export type InsertAccommodationRequest = z.infer<typeof insertAccommodationRequestSchema>;
export type AccommodationRequest = typeof accommodationRequests.$inferSelect;

// Invited speakers
export const invitedSpeakers = pgTable("invited_speakers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(), // Dr., Prof., etc.
  position: text("position").notNull(), // Professor, Director, etc.
  institution: text("institution").notNull(),
  country: text("country").notNull(),
  bio: text("bio"), // Speaker biography
  expertise: text("expertise"), // Areas of expertise
  image: text("image"), // Path to speaker's image
  linkedinUrl: text("linkedin_url"),
  websiteUrl: text("website_url"),
  talkTitle: text("talk_title"), // Title of their talk/presentation
  talkAbstract: text("talk_abstract"), // Abstract of their talk
  isKeynote: boolean("is_keynote").default(false), // Keynote vs regular invited speaker
  displayOrder: integer("display_order").default(0), // Order for display
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvitedSpeakerSchema = createInsertSchema(invitedSpeakers).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export type InsertInvitedSpeaker = z.infer<typeof insertInvitedSpeakerSchema>;
export type InvitedSpeaker = typeof invitedSpeakers.$inferSelect;

// Full Papers
export const fullPapers = pgTable("full_papers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  abstractId: integer("abstract_id"), // Link to original abstract if exists
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  keywords: text("keywords").notNull(),
  authors: json("authors").$type<Author[]>(), // Using same Author type as abstracts
  correspondingAuthor: text("corresponding_author").notNull(),
  paperFile: text("paper_file").notNull(), // File path or URL
  originalFilename: text("original_filename").notNull(),
  fileSize: integer("file_size"), // File size in bytes
  mimeType: text("mime_type"), // application/pdf, etc.
  trackId: integer("track_id"),
  status: text("status").notNull().default("pending"), // pending, under_review, accepted, rejected
  submissionDate: timestamp("submission_date").defaultNow(),
  lastModified: timestamp("last_modified").defaultNow(),
});

export const insertFullPaperSchema = z.object({
  abstractId: z.number().optional(),
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  abstract: z.string().min(50, "Abstract must be at least 50 characters").max(5000, "Abstract too long"),
  keywords: z.string().min(1, "Keywords are required").max(500, "Keywords too long"),
  authors: z.array(AuthorSchema)
    .min(1, "At least one author is required")
    .refine((authors) => {
      const presenters = authors.filter(author => author.category === "Presenter");
      return presenters.length === 1;
    }, {
      message: "Exactly one author must be designated as the Presenter"
    }),
  correspondingAuthor: z.string().email("Invalid corresponding author email format"),
  paperFile: z.string().min(1, "Paper file is required"),
  originalFilename: z.string().min(1, "Original filename is required"),
  fileSize: z.number().positive().optional(),
  mimeType: z.string().optional(),
  trackId: z.number().positive().optional(),
});

export type InsertFullPaper = z.infer<typeof insertFullPaperSchema>;
export type FullPaper = typeof fullPapers.$inferSelect;
