import express from "express";
import { acceptRequest, addFriend, declineRequest, getContacts, getDetails, getFriendsRequest, getUserDetails, handleLogin, handleRegister } from "../controller/userController";

const router=express.Router();

router.post('/register',handleRegister)

router.post('/login',handleLogin)

router.get('/:email',getDetails)

router.get('/details/:email',getUserDetails)

router.post('/addFriend',addFriend)

router.post('/acceptRequest',acceptRequest)

router.post('/declineRequest',declineRequest)

router.get('/getContacts/:id',getContacts)

router.get('/getFriendRequestRecievced/:id',getFriendsRequest)

export default router