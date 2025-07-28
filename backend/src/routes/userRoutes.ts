import express from "express";
import { acceptRequest, addFriend, getContacts, getDetails, getUserDetails, handleLogin, handleRegister } from "../controller/userController";

const router=express.Router();

router.post('/register',handleRegister)

router.post('/login',handleLogin)

router.get('/:email',getDetails)

router.get('/details/:email',getUserDetails)

router.post('/addFriend',addFriend)

router.post('/acceptRequest',acceptRequest)

router.get('/getContacts/:id',getContacts)

export default router