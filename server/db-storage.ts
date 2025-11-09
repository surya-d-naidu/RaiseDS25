import { users, type User, type InsertUser, profiles, type Profile, type InsertProfile, 
  abstracts, type Abstract, type InsertAbstract, invitations, type Invitation, type InsertInvitation,
  notifications, type Notification, type InsertNotification, committeeMembers, type CommitteeMember, 
  type InsertCommitteeMember, researchAwards, type ResearchAward, type InsertResearchAward,
  accommodationRequests, type AccommodationRequest, type InsertAccommodationRequest,
  invitedSpeakers, type InvitedSpeaker, type InsertInvitedSpeaker } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, gt, or, and, desc, asc, like } from "drizzle-orm";
import { IStorage } from "./storage";
import { randomBytes } from "crypto";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

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
  
  async deleteUser(id: number): Promise<boolean> {
    try {
      // First delete related data
      await db.delete(profiles).where(eq(profiles.userId, id));
      await db.delete(abstracts).where(eq(abstracts.userId, id));
      
      // Then delete the user
      const result = await db.delete(users).where(eq(users.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
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
    
    // Find all reference IDs for this category to determine the next sequential number
    const existingRefs = await db.select({ referenceId: abstracts.referenceId })
      .from(abstracts)
      .where(like(abstracts.referenceId, `${categoryCode}-%`));

    let nextNum = 1;
    if (existingRefs.length > 0) {
      // Extract all numbers from existing reference IDs and find the maximum
      const numbers = existingRefs
        .map(ref => {
          const match = ref.referenceId?.match(/-(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);
      
      if (numbers.length > 0) {
        nextNum = Math.max(...numbers) + 1;
      }
    }
    
    const referenceId = `${categoryCode}-${String(nextNum).padStart(4, '0')}`;

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

  async deleteAllInvitations(): Promise<number> {
    const result = await db.delete(invitations).returning();
    return result.length;
  }
  
  // ----- Notifications -----
  
  async getNotification(id: number): Promise<Notification | undefined> {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }
  
  async getActiveNotifications(): Promise<Notification[]> {
    const now = new Date();
    
    // Get all active notifications first, then filter in memory for expiry
    // This avoids the Drizzle ORM issue with null handling in OR conditions
    const allActiveNotifications = await db.select().from(notifications)
      .where(eq(notifications.isActive, true))
      .orderBy(desc(notifications.createdAt));
    
    // Filter for non-expired notifications
    const activeNotifications = allActiveNotifications.filter(notification => {
      return notification.expiresAt === null || new Date(notification.expiresAt) > now;
    });
    
    return activeNotifications;
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
    try {
      return await db.select().from(committeeMembers).orderBy(asc(committeeMembers.order));
    } catch (error) {
      console.error("Error fetching committee members:", error);
      return []; // Return empty array instead of throwing error
    }
  }
  
  async createCommitteeMember(memberData: InsertCommitteeMember): Promise<CommitteeMember> {
    try {
      // After migration, we can use all fields including profileLink and image
      const result = await db.insert(committeeMembers).values(memberData).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating committee member:", error);
      throw error;
    }
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
  
  // ----- Email Verification -----
  
  async setEmailVerificationToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await db.update(users)
      .set({
        emailVerificationToken: token,
        emailVerificationExpires: expiresAt
      })
      .where(eq(users.id, userId));
  }
  
  async verifyEmail(token: string): Promise<User | undefined> {
    const now = new Date();
    const result = await db.select().from(users)
      .where(
        and(
          eq(users.emailVerificationToken, token),
          gt(users.emailVerificationExpires, now)
        )
      )
      .limit(1);
    
    if (result.length === 0) {
      return undefined;
    }
    
    const user = result[0];
    
    // Mark email as verified and clear verification token
    await db.update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      })
      .where(eq(users.id, user.id));
    
    return user;
  }
  
  async resendVerificationToken(email: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user || user.emailVerified) {
      return undefined;
    }
    return user;
  }

  // ----- Password Reset -----
  
  async setPasswordResetToken(email: string, token: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return undefined;
    }
    
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const result = await db.update(users)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expiresAt
      })
      .where(eq(users.id, user.id))
      .returning();
    
    return result[0];
  }
  
  async verifyPasswordResetToken(token: string): Promise<User | undefined> {
    const now = new Date();
    const result = await db.select().from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          gt(users.passwordResetExpires, now)
        )
      )
      .limit(1);
    
    return result[0];
  }
  
  async updatePassword(userId: number, newPassword: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0];
  }

  // ----- Accommodation Requests -----

  async getAccommodationRequest(userId: number): Promise<AccommodationRequest | undefined> {
    const result = await db.select().from(accommodationRequests).where(eq(accommodationRequests.userId, userId)).limit(1);
    return result[0];
  }

  async getAllAccommodationRequests(): Promise<AccommodationRequest[]> {
    const result = await db
      .select({
        id: accommodationRequests.id,
        userId: accommodationRequests.userId,
        arrivalDate: accommodationRequests.arrivalDate,
        departureDate: accommodationRequests.departureDate,
        arrivalPlace: accommodationRequests.arrivalPlace,
        accommodationType: accommodationRequests.accommodationType,
        age: accommodationRequests.age,
        gender: accommodationRequests.gender,
        specialRequests: accommodationRequests.specialRequests,
        status: accommodationRequests.status,
        createdAt: accommodationRequests.createdAt,
        updatedAt: accommodationRequests.updatedAt,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userEmail: users.email,
      })
      .from(accommodationRequests)
      .leftJoin(users, eq(accommodationRequests.userId, users.id))
      .orderBy(desc(accommodationRequests.createdAt));
    
    // Transform the result to match the expected interface
    return result.map(row => ({
      id: row.id,
      userId: row.userId,
      arrivalDate: row.arrivalDate,
      departureDate: row.departureDate,
      arrivalPlace: row.arrivalPlace,
      accommodationType: row.accommodationType,
      age: row.age,
      gender: row.gender,
      specialRequests: row.specialRequests,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: row.userFirstName ? {
        firstName: row.userFirstName,
        lastName: row.userLastName,
        email: row.userEmail,
      } : undefined,
    })) as AccommodationRequest[];
  }

  async createAccommodationRequest(request: InsertAccommodationRequest & { userId: number }): Promise<AccommodationRequest> {
    const result = await db.insert(accommodationRequests).values(request).returning();
    return result[0];
  }

  async updateAccommodationRequest(id: number, data: Partial<InsertAccommodationRequest>): Promise<AccommodationRequest | undefined> {
    const result = await db.update(accommodationRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(accommodationRequests.id, id))
      .returning();
    return result[0];
  }

  async updateAccommodationRequestByUserId(userId: number, data: Partial<InsertAccommodationRequest>): Promise<AccommodationRequest | undefined> {
    const result = await db.update(accommodationRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(accommodationRequests.userId, userId))
      .returning();
    return result[0];
  }

  async deleteAccommodationRequest(id: number): Promise<boolean> {
    const result = await db.delete(accommodationRequests).where(eq(accommodationRequests.id, id)).returning();
    return result.length > 0;
  }

  // Invited Speakers
  async getInvitedSpeaker(id: number): Promise<InvitedSpeaker | undefined> {
    const result = await db.select().from(invitedSpeakers).where(eq(invitedSpeakers.id, id));
    return result[0];
  }

  async getActiveInvitedSpeakers(): Promise<InvitedSpeaker[]> {
    const result = await db.select()
      .from(invitedSpeakers)
      .where(eq(invitedSpeakers.isActive, true))
      .orderBy(asc(invitedSpeakers.displayOrder), asc(invitedSpeakers.name));
    return result;
  }

  async getAllInvitedSpeakers(): Promise<InvitedSpeaker[]> {
    const result = await db.select()
      .from(invitedSpeakers)
      .orderBy(desc(invitedSpeakers.createdAt));
    return result;
  }

  async createInvitedSpeaker(speaker: InsertInvitedSpeaker): Promise<InvitedSpeaker> {
    const result = await db.insert(invitedSpeakers).values(speaker).returning();
    return result[0];
  }

  async updateInvitedSpeaker(id: number, data: Partial<InsertInvitedSpeaker>): Promise<InvitedSpeaker | undefined> {
    const result = await db.update(invitedSpeakers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invitedSpeakers.id, id))
      .returning();
    return result[0];
  }

  async deleteInvitedSpeaker(id: number): Promise<boolean> {
    const result = await db.delete(invitedSpeakers).where(eq(invitedSpeakers.id, id)).returning();
    return result.length > 0;
  }
}

// Create and export a single instance to be used across the application
export const storage = new DbStorage();