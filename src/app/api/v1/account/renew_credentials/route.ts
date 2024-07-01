import { NextRequest, NextResponse } from "next/server";
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import * as jwt from "jose";
import { account } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import 'dotenv/config'
import { cookies } from "next/headers";

// Necessary for being able to perform a POST request and then getting data
export async function POST(req: NextRequest) {
    try {
        let data = await req.json()
        // Got the credentials
        let [current_password, new_password, confirm_new_password] = [data.current_password, data.new_password, data.confirm_new_password]

        // Get the email through JWTVerify
        let token = cookies().get('horizon_token')
        // @ts-ignore
        let jwt_token = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let email = jwt_token.payload.email
        // @ts-ignore
        let s  = await db.select().from(account).where(eq(account.email, email))
        if (s.length == 0) {
            return NextResponse.json({
                'status': 'Account doesnt exist.',
                'HORIZON_STATUS': 'FAILED_TO_RENEW_CREDENTIALS'
            }, {
                'status': 404
            })
        } else {
            // @ts-ignore
            let hashed_password = await crypto.createHash('sha512').update(`${s[0].saltA}${current_password}${await crypto.createHash('sha256').update(email).digest('hex')}${s[0].saltB}`).digest('hex');
            if (hashed_password == s[0].password && new_password == confirm_new_password) {
                let [saltA, saltB] = [await bcrypt.genSalt(20),await bcrypt.genSalt(20)]
                // @ts-ignore
                let new_password_hash = await crypto.createHash('sha512').update(`${saltA}${new_password}${await crypto.createHash('sha256').update(email).digest('hex')}${saltB}`).digest('hex');
                await db.update(account).set({
                    'password': new_password_hash,
                    'saltA': saltA,
                    'saltB': saltB
                    // @ts-ignore
                }).where(eq(account.email, email))
                return NextResponse.json({
                    'HORIZON_STATUS': 'RENEWED_CREDENTIALS'
                })
            } else {
                return NextResponse.json({
                    'status': 'Incorrect password.',
                    'HORIZON_STATUS': 'FAILED_TO_RENEW_CREDENTIALS'
                }, {
                    'status': 403
                })
            }
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            'status': 'Invalid token.',
            'HORIZ_STAT': 'FAILED_TO_RENEW_CREDENTIALS'
        }, {
            'status': 500
        })       
    }
}