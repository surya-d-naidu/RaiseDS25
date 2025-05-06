import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../../db";
import { invitations } from "@shared/schema";
import { eq } from "drizzle-orm";

// Schema for attendance response
const attendanceResponseSchema = z.object({
  token: z.string(),
  accept: z.boolean(),
});

export async function attendanceResponse(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = attendanceResponseSchema.parse(req.body);
    const { token, accept } = validatedData;

    // Find the invitation
    const invitation = await db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token))
      .execute();

    if (invitation.length === 0) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const invitationData = invitation[0];

    // Check if the invitation is for attendance
    if (invitationData.type !== "attendance") {
      return res.status(400).json({ error: "Invalid invitation type" });
    }

    // Check if the invitation is still pending
    if (invitationData.status !== "pending") {
      return res.status(400).json({ error: "Invitation already responded to" });
    }

    // Check if the invitation has expired
    if (invitationData.expiresAt && new Date(invitationData.expiresAt) < new Date()) {
      return res.status(400).json({ error: "Invitation has expired" });
    }

    // Update the invitation status
    await db
      .update(invitations)
      .set({
        status: accept ? "accepted" : "rejected",
      })
      .where(eq(invitations.id, invitationData.id))
      .execute();

    // Return success response
    return res.status(200).json({
      message: accept ? "Attendance confirmed" : "Response recorded",
      accept,
    });
  } catch (error) {
    console.error("Error processing attendance response:", error);
    return res.status(400).json({ error: "Invalid request" });
  }
}