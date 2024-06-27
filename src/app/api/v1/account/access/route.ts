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
   
    // Obtain the data with username and password
    let data = await req.json()
    // Got the credentials
    let [email, password] = [data.email, data.password]
    
    // Algorithm: Salts using Bcrypt + hashed email
    let s  = await db.select().from(account).where(eq(account.email, email))
    if (s.length == 0) {
        // Made 2 salts for the password
        let [saltA, saltB] = [await bcrypt.genSalt(20),await bcrypt.genSalt(20)]
        // Hashes the password
        let hashed_password = await crypto.createHash('sha512').update(`${saltA}${password}${await crypto.createHash('sha256').update(email).digest('hex')}${saltB}`).digest('hex');
        // Creates the entry into the database
        await db.insert(account).values({
            'email': email,
            'password': hashed_password,
            'saltA': saltA,
            'saltB': saltB
        })
        // Below is the JWT token so we can authenticate the user and such.
        // @ts-ignore
        let client_jwt = await new jwt.SignJWT({'email': email}).setProtectedHeader({alg:'HS256'}).setExpirationTime('10 d').sign(crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        // We'll be calling the authentication service "horizon."
        cookies().set('horizon_token', client_jwt, {
            'sameSite': 'strict'
        })
        return NextResponse.json({
            'status': 'account created',
            'HORIZ_STAT': 'LOGGED_IN'
        })
    } else {
        let hashed_password = await crypto.createHash('sha512').update(`${s[0].saltA}${password}${await crypto.createHash('sha256').update(email).digest('hex')}${s[0].saltB}`).digest('hex');
        if (hashed_password == s[0].password) {
            // Below is the JWT token so we can authenticate the user and such.
            // @ts-ignore
            let client_jwt = await new jwt.SignJWT({'email': email}).setProtectedHeader({alg:'HS256'}).setExpirationTime('10 d').sign(crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
            // We'll be calling the authentication service "horizon."
            cookies().set('horizon_token', client_jwt, {
                'sameSite': 'strict'
            })

            return NextResponse.json({
                'status': 'Logging in',
                'HORIZ_STAT': 'LOGGED_IN'
            })
        } else {
            return NextResponse.json({
                'status': 'Incorrect password.',
                'HORIZ_STAT': 'FAILED_TO_LOG_IN'
            })
        }
    }
}