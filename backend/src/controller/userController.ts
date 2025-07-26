import { Request,Response } from "express"
import { loginInputValidation, registerInputValidation } from "../common/validation";
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