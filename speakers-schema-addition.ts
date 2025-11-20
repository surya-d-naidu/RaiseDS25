
// Speakers table (add this to your schema.ts file)
export const speakers = pgTable("speakers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"), // e.g., "Keynote Speaker", "Invited Speaker"
  institution: text("institution"),
  country: text("country"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  category: text("category").notNull().default("keynote"), // keynote, invited, panel
  order: integer("order").default(0),
  socialLinks: json("social_links").$type<{
    website?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  }>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSpeakerSchema = createInsertSchema(speakers).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertSpeaker = z.infer<typeof insertSpeakerSchema>;
export type Speaker = typeof speakers.$inferSelect;
