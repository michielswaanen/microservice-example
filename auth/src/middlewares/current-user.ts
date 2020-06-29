import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

// Augment already defined interfaces
// Add currentUser that might be defined in the Request from Express
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } finally {
        next();
    }
};