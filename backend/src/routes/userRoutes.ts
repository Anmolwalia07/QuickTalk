import express from "express";
import { acceptRequest, addFriend, declineRequest, getContacts, getDetails, getFriendsRequest, getSentRequest, getUserDetails, getUsersname, handleLogin, handleRegister } from "../controller/userController";
import { logSessionToken } from "../middleware/auth";

const router=express.Router();

router.post('/register',handleRegister)

router.post('/login',handleLogin)

router.get('/:email',getDetails)

router.get('/alluser/name',getUsersname)

router.get('/details/:email',getUserDetails)

router.post('/addFriend',logSessionToken,addFriend)

router.post('/acceptRequest',logSessionToken,acceptRequest)

router.post('/declineRequest',logSessionToken,declineRequest)

router.get('/getContacts/:id',logSessionToken,getContacts)

router.get('/getFriendRequestRecievced/:id',logSessionToken,getFriendsRequest)

router.get('/getSentRequest/:id',logSessionToken,getSentRequest)


export default router