import { isAdmin } from "../auth";
import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";

const router = Router();

// Schema for validating committee member data
const committeeMemberSchema = z.object({
  name: z.string(),
  position: z.string(),
  category: z.string(),
  order: z.number().optional(),
});

// Get all committee members
router.get("/", async (req, res) => {
  try {
    const members = await storage.getAllCommitteeMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching committee members" });
  }
});

// Create a new committee member
router.post("/", isAdmin, async (req, res) => {
  try {
    const validatedData = committeeMemberSchema.parse(req.body);
    const member = await storage.createCommitteeMember(validatedData);
    res.status(201).json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error creating committee member" });
  }
});

// Update a committee member
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const validatedData = committeeMemberSchema.partial().parse(req.body);
    const updatedMember = await storage.updateCommitteeMember(memberId, validatedData);

    if (!updatedMember) {
      return res.status(404).json({ message: "Committee member not found" });
    }

    res.json(updatedMember);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error updating committee member" });
  }
});

// Delete a committee member
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const memberId = parseInt(req.params.id);
    const success = await storage.deleteCommitteeMember(memberId);

    if (!success) {
      return res.status(404).json({ message: "Committee member not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting committee member" });
  }
});

export default router;