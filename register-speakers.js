#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Speaker data extracted from the image filenames
const speakers = [
  { name: "Aravindan", imageFile: "Aravindan.jpeg" },
  { name: "Azhar Ali", imageFile: "Azhar ali.jpg" },
  { name: "Biplob", imageFile: "Biplob.jpg" },
  { name: "EB", imageFile: "EB.jpg" },
  { name: "Ganesan", imageFile: "Ganesan.jpg" },
  { name: "Gobi", imageFile: "Gobi.jpeg" },
  { name: "Karthikeyan Sekar", imageFile: "Karthikeyan sekar.jpeg" },
  { name: "Maharaja", imageFile: "Maharaja.jpeg" },
  { name: "Meenakshi", imageFile: "Meenakshi.jpeg" },
  { name: "MGS", imageFile: "MGS.jpg" },
  { name: "Nagarajan", imageFile: "Nagarajan.jpeg" },
  { name: "Nirmala Grace", imageFile: "Nirmala Grace.jpeg" }, // Note: there are two files with this name
  { name: "Renga Rao", imageFile: "Renga rao.jpeg" },
  { name: "Roger Narayan", imageFile: "Roger-Narayan.jpg" },
  { name: "Sankar", imageFile: "Sankar.png" },
  { name: "Yugender Goud Kotagiri", imageFile: "Yugender Goud Kotagiri.jpg" }
];

async function createSpeakersDirectory() {
  const speakersDir = path.join(__dirname, 'public', 'speakers');
  if (!fs.existsSync(speakersDir)) {
    fs.mkdirSync(speakersDir, { recursive: true });
    console.log('Created speakers directory:', speakersDir);
  }
  return speakersDir;
}

async function copySpeakerImages() {
  const sourceDir = path.join(__dirname, 'Speakers list');
  const targetDir = await createSpeakersDirectory();
  
  for (const speaker of speakers) {
    const sourcePath = path.join(sourceDir, speaker.imageFile);
    const extension = path.extname(speaker.imageFile);
    const sanitizedName = speaker.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const targetFileName = `${sanitizedName}${extension}`;
    const targetPath = path.join(targetDir, targetFileName);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${speaker.name} -> ${targetFileName}`);
      
      // Update the speaker object with the new filename
      speaker.publicImagePath = `/speakers/${targetFileName}`;
    } else {
      console.warn(`Source file not found: ${sourcePath}`);
    }
  }
}

async function generateSpeakerData() {
  await copySpeakerImages();
  
  // Generate a JSON file with speaker data
  const speakerDataPath = path.join(__dirname, 'speakers-data.json');
  const speakerData = speakers.map((speaker, index) => ({
    id: index + 1,
    name: speaker.name,
    imageUrl: speaker.publicImagePath || null,
    title: "Conference Speaker", // Default title
    institution: "", // To be filled later
    bio: "", // To be filled later
    category: "keynote", // Default category
    order: index + 1
  }));
  
  fs.writeFileSync(speakerDataPath, JSON.stringify(speakerData, null, 2));
  console.log(`Generated speaker data file: ${speakerDataPath}`);
  
  return speakerData;
}

async function generateSpeakersSchema() {
  const schemaAddition = `
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
`;

  const schemaPath = path.join(__dirname, 'speakers-schema-addition.ts');
  fs.writeFileSync(schemaPath, schemaAddition);
  console.log(`Generated schema addition: ${schemaPath}`);
}

async function generateAPIRoutes() {
  const apiRoutes = `
// Speaker API routes (add these to your routes.ts file)

// Get all speakers
app.get("/api/speakers", async (req, res) => {
  try {
    const speakers = await storage.getAllSpeakers();
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching speakers" });
  }
});

// Get speakers by category
app.get("/api/speakers/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const speakers = await storage.getSpeakersByCategory(category);
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching speakers" });
  }
});

// Admin speaker routes
app.post("/api/admin/speakers", isAdmin, async (req, res) => {
  try {
    const validatedData = insertSpeakerSchema.parse(req.body);
    const speaker = await storage.createSpeaker(validatedData);
    res.status(201).json(speaker);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: formatZodError(error) });
    }
    res.status(500).json({ message: "Error creating speaker" });
  }
});

app.put("/api/admin/speakers/:id", isAdmin, async (req, res) => {
  try {
    const speakerId = parseInt(req.params.id);
    const speaker = await storage.updateSpeaker(speakerId, req.body);
    
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }
    
    res.json(speaker);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: formatZodError(error) });
    }
    res.status(500).json({ message: "Error updating speaker" });
  }
});

app.delete("/api/admin/speakers/:id", isAdmin, async (req, res) => {
  try {
    const speakerId = parseInt(req.params.id);
    const success = await storage.deleteSpeaker(speakerId);
    
    if (!success) {
      return res.status(404).json({ message: "Speaker not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting speaker" });
  }
});
`;

  const apiPath = path.join(__dirname, 'speakers-api-routes.ts');
  fs.writeFileSync(apiPath, apiRoutes);
  console.log(`Generated API routes: ${apiPath}`);
}

async function generateStorageMethods() {
  const storageMethods = `
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
`;

  const storagePath = path.join(__dirname, 'speakers-storage-methods.ts');
  fs.writeFileSync(storagePath, storageMethods);
  console.log(`Generated storage methods: ${storagePath}`);
}

async function generateSpeakersPage() {
  const speakersPageComponent = `import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Linkedin, Twitter, Mail } from "lucide-react";

interface Speaker {
  id: number;
  name: string;
  title?: string;
  institution?: string;
  country?: string;
  bio?: string;
  imageUrl?: string;
  category: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('/api/speakers');
        if (response.ok) {
          const data = await response.json();
          setSpeakers(data);
        }
      } catch (error) {
        console.error('Error fetching speakers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const speakersByCategory = speakers.reduce((acc, speaker) => {
    if (!acc[speaker.category]) {
      acc[speaker.category] = [];
    }
    acc[speaker.category].push(speaker);
    return acc;
  }, {} as Record<string, Speaker[]>);

  const categories = Object.keys(speakersByCategory);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading speakers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Conference Speakers</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet our distinguished speakers who will be sharing their expertise and insights
          at SuWatE+'26.
        </p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className={\`grid w-full grid-cols-\${Math.min(categories.length, 4)} mb-8\`}>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category.replace('_', ' ')} Speakers
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakersByCategory[category].map((speaker) => (
                <Card key={speaker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={speaker.imageUrl} alt={speaker.name} />
                      <AvatarFallback className="text-lg">
                        {speaker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{speaker.name}</CardTitle>
                    {speaker.title && (
                      <Badge variant="secondary" className="mt-2">
                        {speaker.title}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    {speaker.institution && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Institution:</strong> {speaker.institution}
                      </p>
                    )}
                    {speaker.country && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Country:</strong> {speaker.country}
                      </p>
                    )}
                    {speaker.bio && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {speaker.bio}
                      </p>
                    )}
                    {speaker.socialLinks && (
                      <div className="flex gap-2 justify-center">
                        {speaker.socialLinks.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={speaker.socialLinks.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={speaker.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={speaker.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={\`mailto:\${speaker.socialLinks.email}\`}>
                              <Mail className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}`;

  const speakersPagePath = path.join(__dirname, 'client', 'src', 'pages', 'speakers-page.tsx');
  fs.writeFileSync(speakersPagePath, speakersPageComponent);
  console.log(`Generated speakers page component: ${speakersPagePath}`);
}

async function main() {
  console.log('🎤 Starting speaker registration process...\n');
  
  try {
    // Step 1: Generate speaker data and copy images
    console.log('📸 Processing speaker images...');
    const speakerData = await generateSpeakerData();
    
    // Step 2: Generate database schema addition
    console.log('🗄️  Generating database schema...');
    await generateSpeakersSchema();
    
    // Step 3: Generate API routes
    console.log('🛠️  Generating API routes...');
    await generateAPIRoutes();
    
    // Step 4: Generate storage methods
    console.log('💾 Generating storage methods...');
    await generateStorageMethods();
    
    // Step 5: Generate speakers page component
    console.log('⚛️  Generating React component...');
    await generateSpeakersPage();
    
    console.log('\n✅ Speaker registration setup complete!\n');
    
    console.log('📋 Next steps:');
    console.log('1. Add the speakers table to your shared/schema.ts file (see speakers-schema-addition.ts)');
    console.log('2. Add the API routes to your server/routes.ts file (see speakers-api-routes.ts)');
    console.log('3. Add the storage methods to your server/storage.ts file (see speakers-storage-methods.ts)');
    console.log('4. Run database migration to create the speakers table');
    console.log('5. Add route to speakers page in your routing setup');
    console.log('6. Import and use the speakers data from speakers-data.json to populate the database');
    console.log('\n🎯 All speaker images have been processed and are ready for use!');
    
    // Display speaker count
    console.log(`\n📊 Processed ${speakerData.length} speakers:`);
    speakerData.forEach(speaker => {
      console.log(`   • ${speaker.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error during speaker registration setup:', error);
    process.exit(1);
  }
}

// Run the script
main();
