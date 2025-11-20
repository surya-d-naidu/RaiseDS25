
// Speaker storage methods (add these to your storage.ts file)

async getAllSpeakers(): Promise<Speaker[]> {
  return this.db
    .select()
    .from(speakers)
    .where(eq(speakers.isActive, true))
    .orderBy(speakers.order, speakers.name);
}

async getSpeakersByCategory(category: string): Promise<Speaker[]> {
  return this.db
    .select()
    .from(speakers)
    .where(and(eq(speakers.category, category), eq(speakers.isActive, true)))
    .orderBy(speakers.order, speakers.name);
}

async createSpeaker(data: InsertSpeaker): Promise<Speaker> {
  const [speaker] = await this.db
    .insert(speakers)
    .values(data)
    .returning();
  return speaker;
}

async updateSpeaker(id: number, data: Partial<InsertSpeaker>): Promise<Speaker | null> {
  const [speaker] = await this.db
    .update(speakers)
    .set(data)
    .where(eq(speakers.id, id))
    .returning();
  return speaker || null;
}

async deleteSpeaker(id: number): Promise<boolean> {
  const result = await this.db
    .delete(speakers)
    .where(eq(speakers.id, id));
  return result.rowCount > 0;
}

async bulkCreateSpeakers(speakersData: InsertSpeaker[]): Promise<Speaker[]> {
  return this.db
    .insert(speakers)
    .values(speakersData)
    .returning();
}
