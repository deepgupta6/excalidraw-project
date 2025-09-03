import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateroomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup",async (req,res)=>{
    //db call

    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    try { const user = await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            // hash the password
            password: parsedData.data.password,
            name: parsedData.data.name,
        }})
        res.json({
            userId: user.id
        })} catch(e) {
        res.status(411).json({
            message: "Username already exists"
        })
    }   
})

app.post("/signin",async (req,res)=>{

    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })

    if(!user) {
        res.status(403).json({
            message: "User does not exists"
        })
        return
    }

    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET);

    res.json({
        token
    })
    
})

app.post("/room",middleware, async (req,res)=>{
    // dbcall
    const parsedData = CreateroomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    //@ts-ignore : fix this later
    const userId = req.userId
    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
            
        }
    })

    res.json({
        roomId: room.id
    })
    
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})


app.listen(3001);