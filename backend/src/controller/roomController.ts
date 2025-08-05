import { Request, Response } from "express";
import { prisma } from "../db/db";

export const roomCreated = async (req: Request, res: Response) => {
  const { roomId, userId } = req.body;
  if (!roomId || !userId) {
    return res.status(400).json({ message: "RoomID and User IDs are required" });
  }
  try {
    await prisma.room.create({
        data:{
            roomId,
            createdBy:userId,
        }
    })
    return res.status(200).json({
      message: "Room Created",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const validatedRoom=async (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    return res.status(400).json({ message: "Room Id is required" });
  }
  try {
    const room= await prisma.room.findFirst({
        where:{
            roomId,
        }
    })
    if(!room){
        return res.status(401).json({ message: "No room exist with this id" });
    }
    return res.status(200).json({
      message: "Room exists",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

