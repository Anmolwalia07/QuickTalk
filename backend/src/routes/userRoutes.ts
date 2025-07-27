import express from "express";
import { acceptRequest, addFriend, getDetails, getUserDetails, handleLogin, handleRegister } from "../controller/userController";

const router=express.Router();

router.post('/register',handleRegister)

router.post('/login',handleLogin)

router.get('/:email',getDetails)

router.get('/details/:email',getUserDetails)

router.post('/addFriend',addFriend)

router.post('/acceptRequest',acceptRequest)

export default router