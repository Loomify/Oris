import { NextRequest, NextResponse } from "next/server";
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { account } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

// Necessary for being able to perform a POST request and then getting data
export async function POST(req: NextRequest) {
    // Obtain the data with username and password
    let data = await req.json()
    // Got the credentials
    let [email, password] = [data.email, data.password]
    console.log("Compilation Target")
    // Algorithm: Salts using Bcrypt + hashed email
    let s  = await db.select().from(account).where(eq(account.email, email))
    if (s.length == 0) {
        let [saltA, saltB] = [await bcrypt.genSalt(20),await bcrypt.genSalt(20)]
        let hashed_password = await crypto.createHash('sha512').update(`${saltA}${password}${await crypto.createHash('sha256').update(email).digest('hex')}${saltB}`).digest('hex');
        console.log('Signup Proceedure')
        await db.insert(account).values({
            'email': email,
            'password': hashed_password,
            'saltA': saltA,
            'saltB': saltB
        })
        return NextResponse.json({
            'status': 'account created'
        })
    } else {
    }
    // Our response
    return NextResponse.json({
        'status': 'test'
    })
}