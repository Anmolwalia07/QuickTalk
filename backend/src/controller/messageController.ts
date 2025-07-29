import { Request, Response } from "express";
import { prisma } from "../db/db";

export const markMessagesAsSeen = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Sender and Receiver IDs are required" });
  }

  try {
    const result = await prisma.messages.updateMany({
      where: {
        senderId,
        receiverId,
        seen: false, 
      },
      data: {
        seen: true,
      },
    });

    return res.status(200).json({
      message: "Messages marked as seen",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export async function sendMessage({
  senderId,
  receiverId,
  message,
}: {
  senderId: string;
  receiverId: string;
  message: string;
}) {
  try {
    const savedMessage = await prisma.messages.create({
      data: {
        senderId,
        receiverId,
        message,
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    return { success: true, data: savedMessage };
  } catch (error) {
    console.error("Error saving message:", error);
    return { success: false, error: "Failed to save message." };
  }
}