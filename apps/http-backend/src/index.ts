import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateroomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";

const app = express();

app.post("/signup",(req,res)=>{
    //db call

    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    res.json({
        userId: "123"
    })
    
})

app.post("/signin",(req,res)=>{

    const data = SigninSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const user_Id = 1
    const token = jwt.sign({
        user_Id
    },JWT_SECRET);

    res.json({
        token
    })
    
})

app.post("/room",middleware, (req,res)=>{
    // dbcall
    const data = CreateroomSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    res.json({
        roomId: 123
    })
    
})

app.listen(3001);