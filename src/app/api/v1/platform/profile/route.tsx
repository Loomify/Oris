import { db } from "@/db/db";
import { account, accountInformation } from "@/db/schema";
import * as crypto from "crypto";
import { eq } from "drizzle-orm";
import * as jwt from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        let data = await (req.json())
        let horizon_first_last = cookies().get('horizon_profile')
        // @ts-ignore
        let [first_name, last_name] = [JSON.parse(horizon_first_last?.value).first_name, JSON.parse(horizon_first_last?.value).last_name]
        let token = cookies().get('horizon_token')
        if (!token) {
            return NextResponse.json({
                'status': 'Not authorized'
            }, {
                'status': 403
            })
        } else if (!horizon_first_last) {
            return NextResponse.json({
                'status': 'Supplemental Information Missing'
            }, {
                'status': 400
            })
        } else {
            // Grab our JWT Information
            // @ts-ignore
            let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))        
            let email = token_info['payload']['email']
            // @ts-ignore
            let account_info = await db.select().from(account).where(eq(account.email, email))
            // @ts-ignore
            let profile = await db.select().from(accountInformation).where(eq(accountInformation.acc_id, account_info[0]['id']))
            if (profile.length == 0) {
                // @ts-ignore
                await db.insert(accountInformation).values({
                    'profile_picture': data['profile_picture'],
                    'acc_id': account_info[0]['id'],
                    'organization': data['organization'],
                    'image_url': data['profile_picture'],
                    'first_name': first_name,
                    'last_name': last_name,
                    'user_role': 'user'
                })
                return NextResponse.json({
                    'status': 'success'
                })        
            }
        }
        return NextResponse.json({
            'status': 'testing',
        })
    } catch (e) {
        return NextResponse.json({
            'status': 'error',
        }, {
            'status': 500
        })
    }
}