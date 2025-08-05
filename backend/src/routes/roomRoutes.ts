import express from "express";
import { roomCreated,validatedRoom } from "../controller/roomController";
const router=express.Router();

router.get("/:roomId", validatedRoom);
router.post("/create", roomCreated);


export default router