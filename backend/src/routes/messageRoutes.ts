import express from "express";
import { markMessagesAsSeen } from "../controller/messageController";
const router=express.Router();

router.post("/markSeen", markMessagesAsSeen);

export default router