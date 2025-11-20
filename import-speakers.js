#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importSpeakers() {
  try {
    // Read the generated speaker data
    const speakersDataPath = path.join(__dirname, 'speakers-data.json');
    const speakersData = JSON.parse(fs.readFileSync(speakersDataPath, 'utf8'));
    
    // Transform data to match the API format
    const speakersToImport = speakersData.map(speaker => ({
      name: speaker.name,
      title: speaker.title,
      institution: speaker.institution || null,
      bio: speaker.bio || null,
      imageUrl: speaker.imageUrl,
      category: speaker.category,
      order: speaker.order,
      country: null,
      socialLinks: null,
      isActive: true
    }));
    
    // Make API call to bulk import speakers
    const response = await fetch('http://localhost:5000/api/admin/speakers/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add authentication headers here
        // For now, assuming you're logged in as admin
      },
      body: JSON.stringify({
        speakers: speakersToImport
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully imported ${result.length} speakers!`);
      
      result.forEach(speaker => {
        console.log(`   • ${speaker.name} (ID: ${speaker.id})`);
      });
    } else {
      const error = await response.text();
      console.error('❌ Failed to import speakers:', error);
    }
    
  } catch (error) {
    console.error('❌ Error importing speakers:', error);
  }
}

console.log('🎤 Importing speakers to the database...\n');
importSpeakers();
