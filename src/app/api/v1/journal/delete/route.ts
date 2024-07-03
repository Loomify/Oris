import { db } from "@/db/db"
import { account, journal } from "@/db/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import * as jwt from 'jose'
import * as crypto from 'crypto'

export async function POST(req: Request) {
    try {
        let body = await req.json()
        // @ts-ignore
        let journal_id = body['journal_id']
        // @ts-ignore
        let token = cookies().get('horizon_token')
        if (!token == undefined) {
            // @ts-ignore
            return NextResponse.json({
                'status': 'Not authorized',
                'HORIZON_STATUS': 'UNAUTHORIZED'
            })
        }
        // @ts-ignore
        let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let email = token_info['payload']['email']
        // @ts-ignore
        let accountInfo = await db.select().from(account).where(eq(account.email, email))
        if (accountInfo.length == 0) {
            return NextResponse.json({
                'status': 'Not authorized',
                'HORIZON_STATUS': 'UNAUTHORIZED'
            })
        }
        let journalI = await db.select().from(journal).where(eq(journal.id, parseInt(journal_id)))
        if (journalI.length == 0) {
            return NextResponse.json({
                'status': 'Could not find',
                'HORIZON_STATUS': 'NOT_FOUND'
            })
        } else if (journalI[0].owner_id != accountInfo[0].id) {
            return NextResponse.json({
                'status': 'Not authorized',
                'HORIZON_STATUS': 'UNAUTHORIZED'
            })
        }
        // @ts-ignore
        await db.delete(journal).where(eq(journal.id, journal_id))
        return NextResponse.json({
            'status': 'success',
            'HORIZON_STATUS': 'SUCCESS'
        })
    } catch (e) {
        return NextResponse.json({
            'status': 'error',
            'HORIZON_STATUS': 'ERROR'
        }, {status: 500})
    }
}