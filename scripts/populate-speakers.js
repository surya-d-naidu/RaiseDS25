#!/usr/bin/env node

import { storage } from '../server/storage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateSpeakers() {
  try {
    // Read the generated speaker data
    const speakersDataPath = path.join(__dirname, '..', 'speakers-data.json');
    const speakersData = JSON.parse(fs.readFileSync(speakersDataPath, 'utf8'));
    
    console.log('🎤 Adding speakers to the database...\n');
    
    // Transform and add each speaker
    for (const speaker of speakersData) {
      const speakerData = {
        name: speaker.name,
        title: speaker.title || "Conference Speaker",
        institution: speaker.institution || null,
        bio: speaker.bio || null,
        imageUrl: speaker.imageUrl,
        category: speaker.category || "keynote",
        order: speaker.order || 0,
        country: null,
        socialLinks: null,
        isActive: true
      };
      
      const createdSpeaker = await storage.createSpeaker(speakerData);
      console.log(`✅ Added: ${createdSpeaker.name} (ID: ${createdSpeaker.id})`);
    }
    
    console.log(`\n🎯 Successfully added ${speakersData.length} speakers to the database!`);
    
  } catch (error) {
    console.error('❌ Error adding speakers:', error);
  }
}

// Run the script
populateSpeakers();
