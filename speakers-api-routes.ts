
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
