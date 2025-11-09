import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addSampleSpeakers() {
  const client = await pool.connect();
  try {
    console.log("Adding sample invited speakers...");
    
    const sampleSpeakers = [
      {
        name: "Sarah Johnson",
        title: "Prof.",
        position: "Professor of Statistics",
        institution: "Stanford University",
        country: "United States",
        bio: "Prof. Sarah Johnson is a leading expert in Bayesian statistics and machine learning. She has published over 100 papers in top-tier journals and has received numerous awards for her contributions to statistical methodology.",
        expertise: "Bayesian Statistics, Machine Learning, Data Science",
        talk_title: "Modern Bayesian Methods in Data Science",
        talk_abstract: "This talk will explore cutting-edge Bayesian methodologies and their applications in contemporary data science problems.",
        is_keynote: true,
        display_order: 1,
        is_active: true
      },
      {
        name: "Rajesh Kumar",
        title: "Dr.",
        position: "Senior Research Scientist",
        institution: "Indian Statistical Institute",
        country: "India",
        bio: "Dr. Rajesh Kumar specializes in probability theory and stochastic processes. His work has significant applications in finance and risk management.",
        expertise: "Probability Theory, Stochastic Processes, Financial Mathematics",
        talk_title: "Stochastic Models in Financial Risk Assessment",
        talk_abstract: "An overview of advanced stochastic modeling techniques for assessing and managing financial risks.",
        is_keynote: false,
        display_order: 2,
        is_active: true
      },
      {
        name: "Maria Rodriguez",
        title: "Prof.",
        position: "Director of Data Science Institute",
        institution: "University of Barcelona",
        country: "Spain",
        bio: "Prof. Maria Rodriguez is renowned for her work in computational statistics and big data analytics. She leads several international research collaborations.",
        expertise: "Computational Statistics, Big Data Analytics, Statistical Computing",
        talk_title: "Scalable Statistical Methods for Big Data",
        talk_abstract: "Discussing innovative approaches to handle massive datasets with efficient statistical computations.",
        is_keynote: false,
        display_order: 3,
        is_active: true
      }
    ];

    for (const speaker of sampleSpeakers) {
      await client.query(`
        INSERT INTO invited_speakers (
          name, title, position, institution, country, bio, expertise, 
          talk_title, talk_abstract, is_keynote, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        speaker.name, speaker.title, speaker.position, speaker.institution, 
        speaker.country, speaker.bio, speaker.expertise, speaker.talk_title, 
        speaker.talk_abstract, speaker.is_keynote, speaker.display_order, speaker.is_active
      ]);
      console.log(`Added speaker: ${speaker.name}`);
    }
    
    console.log("Sample invited speakers added successfully!");
    
  } catch (error) {
    console.error("Error adding sample speakers:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

addSampleSpeakers();
