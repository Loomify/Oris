import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { db } from "@/db/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE() {
    try {
        let token = await cookies().get('horizon_token')?.value
        // @ts-ignore
        let token_info = await jwt.jwtVerify(token, crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let email = token_info['payload']['email']
        // @ts-ignore     
        await db.delete(account).where(eq(account.email, email))
        
        return NextResponse.json({
            'message': 'Account deleted.',
            'HORIZON_STATUS': 'SUCCESS'
        }, {
            'status': 200,
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            'message': 'An error occurred.',
            'HORIZON_STATUS': 'ERROR'
        }, {
            'status': 500,
        })
    }
}