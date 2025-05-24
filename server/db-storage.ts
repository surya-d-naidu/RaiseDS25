import { users, type User, type InsertUser, profiles, type Profile, type InsertProfile, 
  abstracts, type Abstract, type InsertAbstract, invitations, type Invitation, type InsertInvitation,
  notifications, type Notification, type InsertNotification, committeeMembers, type CommitteeMember, 
  type InsertCommitteeMember, researchAwards, type ResearchAward, type InsertResearchAward } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, gt, or, and, desc, asc } from "drizzle-orm";
import { IStorage } from "./storage";
import { randomBytes } from "crypto";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

export class DbStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    const PgSession = ConnectPgSimple(session);
    this.sessionStore = new PgSession({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      tableName: 'sessions',
      createTableIfMissing: true,
    });
  }

  // Helper function to generate category code
  getCategoryCode(category: string): string {
    const categoryCodeMap: Record<string, string> = {
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

  // ----- Users -----
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // ----- Profiles -----
  
  async getProfile(userId: number): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }
  
  async createProfile(profileData: InsertProfile & { userId: number }): Promise<Profile> {
    const result = await db.insert(profiles).values(profileData).returning();
    return result[0];
  }
  
  async updateProfile(userId: number, data: Partial<InsertProfile>): Promise<Profile | undefined> {
    // First check if profile exists
    const existingProfile = await this.getProfile(userId);
    if (!existingProfile) return undefined;
    
    const result = await db.update(profiles)
      .set(data)
      .where(eq(profiles.userId, userId))
      .returning();
    return result[0];
  }
  
  // ----- Abstracts -----
  
  async getAbstract(id: number): Promise<Abstract | undefined> {
    const result = await db.select().from(abstracts).where(eq(abstracts.id, id)).limit(1);
    return result[0];
  }
  
  async getAbstractsByUser(userId: number): Promise<Abstract[]> {
    return db.select().from(abstracts).where(eq(abstracts.userId, userId));
  }
  
  async getAllAbstracts(): Promise<Abstract[]> {
    return db.select().from(abstracts).orderBy(desc(abstracts.createdAt));
  }
  
  async createAbstract(abstractData: InsertAbstract & { userId: number }): Promise<Abstract> {
    const now = new Date();
    const categoryCode = this.getCategoryCode(abstractData.category);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `${categoryCode}-${randomNum}`;
    
    const result = await db.insert(abstracts).values({
      ...abstractData,
      referenceId,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    }).returning();
    
    return result[0];
  }
  
  async updateAbstract(id: number, data: Partial<InsertAbstract>): Promise<Abstract | undefined> {
    const result = await db.update(abstracts)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(abstracts.id, id))
      .returning();
    return result[0];
  }
  
  async updateAbstractStatus(id: number, status: string): Promise<Abstract | undefined> {
    const result = await db.update(abstracts)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(abstracts.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAbstract(id: number): Promise<boolean> {
    const result = await db.delete(abstracts).where(eq(abstracts.id, id)).returning();
    return result.length > 0;
  }
  
  // ----- Invitations -----
  
  async getInvitation(id: number): Promise<Invitation | undefined> {
    const result = await db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
    return result[0];
  }
  
  async getInvitationByToken(token: string): Promise<Invitation | undefined> {
    const result = await db.select().from(invitations).where(eq(invitations.token, token)).limit(1);
    return result[0];
  }
  
  async getAllInvitations(): Promise<Invitation[]> {
    return db.select().from(invitations).orderBy(desc(invitations.createdAt));
  }
  
  async createInvitation(invitationData: InsertInvitation & { senderId: number; token: string }): Promise<Invitation> {
    const result = await db.insert(invitations).values(invitationData).returning();
    return result[0];
  }
  
  async updateInvitationStatus(token: string, status: string): Promise<Invitation | undefined> {
    const result = await db.update(invitations)
      .set({ status })
      .where(eq(invitations.token, token))
      .returning();
    return result[0];
  }
  
  async deleteInvitation(id: number): Promise<boolean> {
    const result = await db.delete(invitations).where(eq(invitations.id, id)).returning();
    return result.length > 0;
  }
  
  // ----- Notifications -----
  
  async getNotification(id: number): Promise<Notification | undefined> {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }
  
  async getActiveNotifications(): Promise<Notification[]> {
    const now = new Date();
    return db.select().from(notifications)
      .where(
        and(
          eq(notifications.isActive, true),
          or(
            eq(notifications.expiresAt, null),
            gt(notifications.expiresAt, now)
          )
        )
      )
      .orderBy(desc(notifications.createdAt));
  }
  
  async getAllNotifications(): Promise<Notification[]> {
    return db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }
  
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notificationData).returning();
    return result[0];
  }
  
  async updateNotification(id: number, data: Partial<InsertNotification>): Promise<Notification | undefined> {
    const result = await db.update(notifications)
      .set(data)
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id)).returning();
    return result.length > 0;
  }
  
  // ----- Committee Members -----
  
  async getCommitteeMember(id: number): Promise<CommitteeMember | undefined> {
    const result = await db.select().from(committeeMembers).where(eq(committeeMembers.id, id)).limit(1);
    return result[0];
  }
  
  async getCommitteeMembersByCategory(category: string): Promise<CommitteeMember[]> {
    return db.select().from(committeeMembers)
      .where(eq(committeeMembers.category, category))
      .orderBy(asc(committeeMembers.order));
  }
  
  async getAllCommitteeMembers(): Promise<CommitteeMember[]> {
    return db.select().from(committeeMembers).orderBy(asc(committeeMembers.order));
  }
  
  async createCommitteeMember(memberData: InsertCommitteeMember): Promise<CommitteeMember> {
    const result = await db.insert(committeeMembers).values(memberData).returning();
    return result[0];
  }
  
  async updateCommitteeMember(id: number, data: Partial<InsertCommitteeMember>): Promise<CommitteeMember | undefined> {
    const result = await db.update(committeeMembers)
      .set(data)
      .where(eq(committeeMembers.id, id))
      .returning();
    return result[0];
  }
  
  async deleteCommitteeMember(id: number): Promise<boolean> {
    const result = await db.delete(committeeMembers).where(eq(committeeMembers.id, id)).returning();
    return result.length > 0;
  }
  
  // ----- Research Awards -----
  
  async getResearchAward(id: number): Promise<ResearchAward | undefined> {
    const result = await db.select().from(researchAwards).where(eq(researchAwards.id, id)).limit(1);
    return result[0];
  }
  
  async getActiveResearchAwards(): Promise<ResearchAward[]> {
    return db.select().from(researchAwards).where(eq(researchAwards.isActive, true));
  }
  
  async getAllResearchAwards(): Promise<ResearchAward[]> {
    return db.select().from(researchAwards);
  }
  
  async createResearchAward(awardData: InsertResearchAward): Promise<ResearchAward> {
    const result = await db.insert(researchAwards).values(awardData).returning();
    return result[0];
  }
  
  async updateResearchAward(id: number, data: Partial<InsertResearchAward>): Promise<ResearchAward | undefined> {
    const result = await db.update(researchAwards)
      .set(data)
      .where(eq(researchAwards.id, id))
      .returning();
    return result[0];
  }
  
  async deleteResearchAward(id: number): Promise<boolean> {
    const result = await db.delete(researchAwards).where(eq(researchAwards.id, id)).returning();
    return result.length > 0;
  }
}

// Create and export a single instance to be used across the application
export const storage = new DbStorage();