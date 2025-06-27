import { pgTable, unique, serial, integer, text, boolean, json, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const profiles = pgTable("profiles", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	bio: text(),
	position: text(),
	department: text(),
	country: text(),
	profilePictureUrl: text("profile_picture_url"),
	isPresenter: boolean("is_presenter").default(false),
	isCommitteeMember: boolean("is_committee_member").default(false),
	socialLinks: json("social_links"),
}, (table) => [
	unique("profiles_user_id_unique").on(table.userId),
]);

export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	type: text().default('general').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
});

export const committeeMembers = pgTable("committee_members", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	institution: text(),
	country: text(),
	category: text().notNull(),
	email: text(),
	phone: text(),
	order: integer().default(0),
	profileLink: text("profile_link"),
	image: text(),
});

export const researchAwards = pgTable("research_awards", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	eligibility: text().notNull(),
	amount: text(),
	deadline: timestamp({ mode: 'string' }),
	isActive: boolean("is_active").default(true),
});

export const abstracts = pgTable("abstracts", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: text().notNull(),
	category: text().notNull(),
	content: text().notNull(),
	keywords: text().notNull(),
	status: text().default('pending').notNull(),
	fileUrl: text("file_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	authors: json(),
	referenceId: text("reference_id"),
});

export const invitations = pgTable("invitations", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	token: text().notNull(),
	role: text().default('user').notNull(),
	status: text().default('pending').notNull(),
	message: text(),
	senderId: integer("sender_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	type: text().default('account').notNull(),
	institution: text(),
	position: text(),
}, (table) => [
	unique("invitations_token_unique").on(table.token),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	email: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	institution: text().notNull(),
	role: text().default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	emailVerified: boolean("email_verified").default(false),
	emailVerificationToken: text("email_verification_token"),
	emailVerificationExpires: timestamp("email_verification_expires", { mode: 'string' }),
	passwordResetToken: text("password_reset_token"),
	passwordResetExpires: timestamp("password_reset_expires", { mode: 'string' }),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);
