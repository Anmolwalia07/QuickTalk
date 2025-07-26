import express from "express";
import { getDetails, handleLogin, handleRegister } from "../controller/userController";

const router=express.Router();

router.post('/register',handleRegister)

router.post('/login',handleLogin)

router.get('/:email',getDetails)

export default router