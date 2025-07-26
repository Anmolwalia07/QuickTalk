import { Request,Response } from "express"
import { registerInputValidation } from "../common/validation";
import {prisma} from "../db/db"
import bcrypt from "bcrypt"

export const handleRegister=async(req:Request,res:Response)=>{
    const data=req.body;
    const result=registerInputValidation(data);
    if(result.error){
        return res.status(401).json({message:"Invaild Input details"})
    }
    const {name,email,password}=result.data;
    // const existUser=await prisma.user.findFirst({
    //     where:{
    //         email
    //     }
    // })

    // if(existUser){
    //     return res.status(401).json({message:"Email already exists"})
    // }

    const hashPassword=await bcrypt.hash(password,10);
    try{
        await prisma.user.create({
            data:{
                name,
                email,
                password:hashPassword
            }
        })

        return res.status(201).json({message:"Register successfully"})
    }catch(err){
        console.log(err)
       return res.status(401).json({message:err})
    }
}