import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';

export function middleware(req: Request, res: Response, next:NextFunction){
    const token = req.headers["authorization"] ?? "" ;

    const decoded = jwt.verify(token,JWT_SECRET)

    if(decoded) {
        //@ts-ignore : fix this later
        req.user_Id =  decoded.user_Id;
        next();
    } else{
        res.status(403).json({
            message: "unauthorized"
        })
    }
}