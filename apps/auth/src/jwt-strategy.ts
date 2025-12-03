import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtRequest } from "./jwt-request.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(){
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET must be set");
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: JwtRequest) => {
                    return request?.jwt ?? null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    async validate(payload: any){
        return { ...payload };
    }
}