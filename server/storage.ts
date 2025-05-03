import { users, type User, type InsertUser, profiles, type Profile, type InsertProfile, 
  abstracts, type Abstract, type InsertAbstract, invitations, type Invitation, type InsertInvitation,
  notifications, type Notification, type InsertNotification, committeeMembers, type CommitteeMember, 
  type InsertCommitteeMember, researchAwards, type ResearchAward, type InsertResearchAward } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Profiles
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { userId: number }): Promise<Profile>;
  updateProfile(userId: number, data: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Abstracts
  getAbstract(id: number): Promise<Abstract | undefined>;
  getAbstractsByUser(userId: number): Promise<Abstract[]>;
  getAllAbstracts(): Promise<Abstract[]>;
  createAbstract(abstract: InsertAbstract & { userId: number }): Promise<Abstract>;
  updateAbstract(id: number, data: Partial<InsertAbstract>): Promise<Abstract | undefined>;
  updateAbstractStatus(id: number, status: string): Promise<Abstract | undefined>;
  deleteAbstract(id: number): Promise<boolean>;
  
  // Invitations
  getInvitation(id: number): Promise<Invitation | undefined>;
  getInvitationByToken(token: string): Promise<Invitation | undefined>;
  getAllInvitations(): Promise<Invitation[]>;
  createInvitation(invitation: InsertInvitation & { senderId: number; token: string }): Promise<Invitation>;
  updateInvitationStatus(token: string, status: string): Promise<Invitation | undefined>;
  deleteInvitation(id: number): Promise<boolean>;
  
  // Notifications
  getNotification(id: number): Promise<Notification | undefined>;
  getActiveNotifications(): Promise<Notification[]>;
  getAllNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, data: Partial<InsertNotification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Committee Members
  getCommitteeMember(id: number): Promise<CommitteeMember | undefined>;
  getCommitteeMembersByCategory(category: string): Promise<CommitteeMember[]>;
  getAllCommitteeMembers(): Promise<CommitteeMember[]>;
  createCommitteeMember(member: InsertCommitteeMember): Promise<CommitteeMember>;
  updateCommitteeMember(id: number, data: Partial<InsertCommitteeMember>): Promise<CommitteeMember | undefined>;
  deleteCommitteeMember(id: number): Promise<boolean>;
  
  // Research Awards
  getResearchAward(id: number): Promise<ResearchAward | undefined>;
  getActiveResearchAwards(): Promise<ResearchAward[]>;
  getAllResearchAwards(): Promise<ResearchAward[]>;
  createResearchAward(award: InsertResearchAward): Promise<ResearchAward>;
  updateResearchAward(id: number, data: Partial<InsertResearchAward>): Promise<ResearchAward | undefined>;
  deleteResearchAward(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private profileStore: Map<number, Profile>;
  private abstractStore: Map<number, Abstract>;
  private invitationStore: Map<number, Invitation>;
  private notificationStore: Map<number, Notification>;
  private committeeMemberStore: Map<number, CommitteeMember>;
  private researchAwardStore: Map<number, ResearchAward>;
  private currentId: {
    user: number;
    profile: number;
    abstract: number;
    invitation: number;
    notification: number;
    committeeMember: number;
    researchAward: number;
  };
  sessionStore: session.SessionStore;

  constructor() {
    this.userStore = new Map();
    this.profileStore = new Map();
    this.abstractStore = new Map();
    this.invitationStore = new Map();
    this.notificationStore = new Map();
    this.committeeMemberStore = new Map();
    this.researchAwardStore = new Map();
    this.currentId = {
      user: 1,
      profile: 1,
      abstract: 1,
      invitation: 1,
      notification: 1,
      committeeMember: 1,
      researchAward: 1
    };
    
    // Initialize with admin user
    const adminUser = {
      id: 1,
      username: 'admin',
      email: 'admin@raiseds25.com',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9Pm', // admin123
      firstName: 'Admin',
      lastName: 'User',
      institution: 'VIT-AP University',
      role: 'admin',
      createdAt: new Date()
    };
    this.userStore.set(1, adminUser);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId.user++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      role: 'user',
      createdAt: now
    };
    this.userStore.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.userStore.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.userStore.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.userStore.values());
  }

  // Profiles
  async getProfile(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profileStore.values()).find(profile => profile.userId === userId);
  }

  async createProfile(profileData: InsertProfile & { userId: number }): Promise<Profile> {
    const id = this.currentId.profile++;
    const profile: Profile = {
      ...profileData,
      id,
    };
    this.profileStore.set(id, profile);
    return profile;
  }

  async updateProfile(userId: number, data: Partial<InsertProfile>): Promise<Profile | undefined> {
    const profile = Array.from(this.profileStore.values()).find(profile => profile.userId === userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.profileStore.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // Abstracts
  async getAbstract(id: number): Promise<Abstract | undefined> {
    return this.abstractStore.get(id);
  }

  async getAbstractsByUser(userId: number): Promise<Abstract[]> {
    return Array.from(this.abstractStore.values()).filter(abstract => abstract.userId === userId);
  }

  async getAllAbstracts(): Promise<Abstract[]> {
    return Array.from(this.abstractStore.values());
  }

  async createAbstract(abstractData: InsertAbstract & { userId: number }): Promise<Abstract> {
    const id = this.currentId.abstract++;
    const now = new Date();
    const abstract: Abstract = {
      ...abstractData,
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
    this.abstractStore.set(id, abstract);
    return abstract;
  }

  async updateAbstract(id: number, data: Partial<InsertAbstract>): Promise<Abstract | undefined> {
    const abstract = this.abstractStore.get(id);
    if (!abstract) return undefined;
    
    const updatedAbstract = { 
      ...abstract, 
      ...data,
      updatedAt: new Date()
    };
    this.abstractStore.set(id, updatedAbstract);
    return updatedAbstract;
  }

  async updateAbstractStatus(id: number, status: string): Promise<Abstract | undefined> {
    const abstract = this.abstractStore.get(id);
    if (!abstract) return undefined;
    
    abstract.status = status;
    abstract.updatedAt = new Date();
    this.abstractStore.set(id, abstract);
    return abstract;
  }

  async deleteAbstract(id: number): Promise<boolean> {
    return this.abstractStore.delete(id);
  }

  // Invitations
  async getInvitation(id: number): Promise<Invitation | undefined> {
    return this.invitationStore.get(id);
  }

  async getInvitationByToken(token: string): Promise<Invitation | undefined> {
    return Array.from(this.invitationStore.values()).find(invitation => invitation.token === token);
  }

  async getAllInvitations(): Promise<Invitation[]> {
    return Array.from(this.invitationStore.values());
  }

  async createInvitation(invitationData: InsertInvitation & { senderId: number; token: string }): Promise<Invitation> {
    const id = this.currentId.invitation++;
    const now = new Date();
    const invitation: Invitation = {
      ...invitationData,
      id,
      status: 'pending',
      createdAt: now
    };
    this.invitationStore.set(id, invitation);
    return invitation;
  }

  async updateInvitationStatus(token: string, status: string): Promise<Invitation | undefined> {
    const invitation = Array.from(this.invitationStore.values()).find(inv => inv.token === token);
    if (!invitation) return undefined;
    
    invitation.status = status;
    this.invitationStore.set(invitation.id, invitation);
    return invitation;
  }

  async deleteInvitation(id: number): Promise<boolean> {
    return this.invitationStore.delete(id);
  }

  // Notifications
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notificationStore.get(id);
  }

  async getActiveNotifications(): Promise<Notification[]> {
    const now = new Date();
    return Array.from(this.notificationStore.values())
      .filter(notification => 
        notification.isActive && 
        (!notification.expiresAt || notification.expiresAt > now)
      );
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notificationStore.values());
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = this.currentId.notification++;
    const now = new Date();
    const notification: Notification = {
      ...notificationData,
      id,
      createdAt: now
    };
    this.notificationStore.set(id, notification);
    return notification;
  }

  async updateNotification(id: number, data: Partial<InsertNotification>): Promise<Notification | undefined> {
    const notification = this.notificationStore.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, ...data };
    this.notificationStore.set(id, updatedNotification);
    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notificationStore.delete(id);
  }

  // Committee Members
  async getCommitteeMember(id: number): Promise<CommitteeMember | undefined> {
    return this.committeeMemberStore.get(id);
  }

  async getCommitteeMembersByCategory(category: string): Promise<CommitteeMember[]> {
    return Array.from(this.committeeMemberStore.values())
      .filter(member => member.category === category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getAllCommitteeMembers(): Promise<CommitteeMember[]> {
    return Array.from(this.committeeMemberStore.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createCommitteeMember(memberData: InsertCommitteeMember): Promise<CommitteeMember> {
    const id = this.currentId.committeeMember++;
    const member: CommitteeMember = {
      ...memberData,
      id
    };
    this.committeeMemberStore.set(id, member);
    return member;
  }

  async updateCommitteeMember(id: number, data: Partial<InsertCommitteeMember>): Promise<CommitteeMember | undefined> {
    const member = this.committeeMemberStore.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...data };
    this.committeeMemberStore.set(id, updatedMember);
    return updatedMember;
  }

  async deleteCommitteeMember(id: number): Promise<boolean> {
    return this.committeeMemberStore.delete(id);
  }

  // Research Awards
  async getResearchAward(id: number): Promise<ResearchAward | undefined> {
    return this.researchAwardStore.get(id);
  }

  async getActiveResearchAwards(): Promise<ResearchAward[]> {
    return Array.from(this.researchAwardStore.values())
      .filter(award => award.isActive);
  }

  async getAllResearchAwards(): Promise<ResearchAward[]> {
    return Array.from(this.researchAwardStore.values());
  }

  async createResearchAward(awardData: InsertResearchAward): Promise<ResearchAward> {
    const id = this.currentId.researchAward++;
    const award: ResearchAward = {
      ...awardData,
      id
    };
    this.researchAwardStore.set(id, award);
    return award;
  }

  async updateResearchAward(id: number, data: Partial<InsertResearchAward>): Promise<ResearchAward | undefined> {
    const award = this.researchAwardStore.get(id);
    if (!award) return undefined;
    
    const updatedAward = { ...award, ...data };
    this.researchAwardStore.set(id, updatedAward);
    return updatedAward;
  }

  async deleteResearchAward(id: number): Promise<boolean> {
    return this.researchAwardStore.delete(id);
  }
}

export const storage = new MemStorage();
