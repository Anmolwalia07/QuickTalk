import { Request,Response } from "express"
import { addFriendInput, loginInputValidation, registerInputValidation } from "../common/validation";
import {prisma} from "../db/db"
import bcrypt from "bcrypt"

export const handleRegister=async(req:Request,res:Response)=>{
    const data=req.body;
    const result=registerInputValidation(data);
    if(result.error){
        return res.status(401).json({message:"Invaild Input details"})
    }
    const {name,email,password}=result.data;
    

    const hashPassword=await bcrypt.hash(password,10);
    try{

        const existUser=await prisma.user.findFirst({
        where:{
            email
        }
        })

        if(existUser){
            return res.status(401).json({message:"Email already exists"})
        }

        await prisma.user.create({
            data:{
                name,
                email,
                password:hashPassword
            }
        })
        
        return res.status(201).json({message:"Register successfully"})
    }catch(err){
       return res.status(401).json({message:"Internal Server error"})
    }
}


export const handleLogin=async(req:Request,res:Response)=>{
    const data=req.body;
     const result=loginInputValidation(data);
    if(result.error){
        return res.status(401).json({message:"Invaild Input details"})
    }
    const {email,password}=result.data;

    try{
        const existUser=await prisma.user.findFirst({
        where:{
            email
        }
    })

    if(!existUser || !existUser.password){
        return res.status(401).json({message:"Invaild Email"})
    }

    const isMatch=await bcrypt.compare(password,existUser.password);
    if(!isMatch){
        return res.status(401).json({message:"Invaild password"});
    }

    return res.status(201).json({id:existUser.id,email:existUser.email});
    }catch(err){
        return res.status(401).json({message:"Internal Server error"})
    }
}


export const getDetails=async(req:Request,res:Response)=>{
    const email=req.params.email;
    if(!email){
        return res.status(401).json({message:"Invaild Input details"})
    }

    try{
        const response=await prisma.user.findFirst({
            where:{
                email
            }
        })
    if(!response){
     return res.status(401).json({message:"Invaild Email"})
    }

    return res.status(201).json({id:response.id})

    }catch(err){
        return res.status(401).json({message:"Internal Server error"})
    }
}


export const getUserDetails = async (req: Request, res: Response) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Invalid input details" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        bio: true,
        isOnline: true,
        sentMessages: true,
        receivedMessages: true,
        sentRequests: {
          where:{request:'Accepted'},
          select: {
            friend: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                isOnline: true,
                sentMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                  },
                },
                receivedMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                  },
                },
              },
            },
          },
        },
        receivedRequests: {
          where:{request:'Accepted'},
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                isOnline: true,
                sentMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                  },
                },
                receivedMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    const friendsRaw = [
      ...user.sentRequests.map((f) => f.friend),
      ...user.receivedRequests.map((f) => f.user),
    ];

    const contacts = friendsRaw.map((friend) => {
      const allMessages = [
        ...friend.sentMessages.filter(
          (m) => m.receiverId === user.id || m.senderId === user.id
        ),
        ...friend.receivedMessages.filter(
          (m) => m.receiverId === user.id || m.senderId === user.id
        ),
      ];

      const sortedMessages = allMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const lastMessage = sortedMessages[0];

      return {
        id: friend.id,
        name: friend.name,
        lastMessage: lastMessage ? lastMessage.message : "Start chatting",
        time: lastMessage
          ? new Date(lastMessage.createdAt).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              weekday: "short",
            })
          : "",
        unread: 0, 
        online: friend.isOnline,
      };
    });

    const { sentRequests, receivedRequests, ...userData } = user;

    return res.status(200).json({ user: user, contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export const addFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    return res.status(400).json({ message: "Invalid input details" });
  }

  try {
    const existingFriend = await prisma.friend.findFirst({
      where: {
        userId,
        friendId,
      },
    });

    if (existingFriend) {
      return res.status(409).json({ message: "Friend request already exists" });
    }

    const newRequest = await prisma.friend.create({
      data: {
        userId,
        friendId,
        request:"Pending",
      },
      include: {
        user: true,
        friend: true,
      },
    });

    return res.status(201).json({ message: "Friend request sent", data: newRequest });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const acceptRequest = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  try {
    const friendRequest = await prisma.friend.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const updatedRequest = await prisma.friend.update({
      where: { id: requestId },
      data: { request: "Accepted" },
      include: {
        user: true,
        friend: true,
      },
    });

    return res.status(200).json({
      message: "Friend request accepted successfully",
      data: updatedRequest,
    });

  } catch (err) {
    console.error("Error accepting request:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const declineRequest = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  try {
    const friendRequest = await prisma.friend.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const updatedRequest = await prisma.friend.update({
      where: { id: requestId },
      data: { request: "Rejected" },
      include: {
        user: true,
        friend: true,
      },
    });

    return res.status(200).json({
      message: "Friend request accepted successfully",
      data: updatedRequest,
    });

  } catch (err) {
    console.error("Error accepting request:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getContacts = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid input details" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        sentRequests: {
          where: { request: "Accepted" },
          select: {
            friend: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                isOnline: true,
                sentMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                    seen:true
                  },
                },
                receivedMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                    seen:true
                  },
                },
              },
            },
          },
        },
        receivedRequests: {
          where: { request: "Accepted" },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                isOnline: true,
                sentMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                     seen:true

                  },
                },
                receivedMessages: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    senderId: true,
                    receiverId: true,
                    seen:true
                  },
                },
              },
            },
          },
        },
      },
    });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendsRaw = [
      ...user.sentRequests.map((f) => f.friend),
      ...user.receivedRequests.map((f) => f.user),
    ];

    const contacts = friendsRaw.map((friend) => {
      const allMessages = [
        ...friend.sentMessages.filter(
          (m) => m.receiverId === user.id || m.senderId === user.id
        ),
        ...friend.receivedMessages.filter(
          (m) => m.receiverId === user.id || m.senderId === user.id
        ),
      ];


      const sortedMessages = allMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const lastMessage = sortedMessages[0];
      
      const unreadCount = friend.sentMessages.filter(
        (m) => m.receiverId === user.id && !m.seen
      ).length;
      return {
        id: friend.id,
        name: friend.name,
        lastMessage: lastMessage ? lastMessage.message : "Start chatting",
        time: lastMessage
          ? new Date(lastMessage.createdAt).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              weekday: "short",
            })
          : "",
        unread: unreadCount,
        online: friend.isOnline,
      };
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getFriendsRequest=async (req: Request, res: Response)=>{
  const id=req.params.id;

  if(!id) return res.status(401).json({message:"User id required"});

  try{
    const receivedFriendReq=await prisma.friend.findMany({
    where:{
      friendId:id,
      request:"Pending"
    },
    select:{
      user:{
        select:{
          name:true
        }
      },
      id:true
    }
  })

  return res.status(201).json({receivedFriendReq})
  }
  catch(err){
   return  res.status(401).json({message:"Internal server error"})
  }

}