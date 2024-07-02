import { db } from "@/db/db";
import { account } from "@/db/schema";
import * as crypto from "crypto";
import { eq } from "drizzle-orm";
import * as jwt from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        let data = await (req.json())
        let [profile_picture] = [data['profile_picture']]
        // @ts-ignore
        let token = cookies().get('horizon_token')
        if (!token) {
            return NextResponse.json({
                'status': 'Not authorized'
            }, {
                'status': 403
            })
        } else {
            // Grab our JWT Information
            // @ts-ignore
            let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))        
            let email = token_info['payload']['email']
            // @ts-ignore
            let account_info = await db.select().from(account).where(eq(account.email, email))
            // @ts-ignore
            if (account_info.length != 0) {
                await db.update(account).set({
                    'image_url': profile_picture,
                // @ts-ignore
                }).where(eq(account.email, account_info[0].email))

                return NextResponse.json({
                    'status': 'success',
                    'HORIZON_STATUS': "UPDATED_PROFILE_PICTURE"
                })              
            } else {
                return NextResponse.json({
                    'status': 'error',
                    'HORIZON_STATUS': "ERROR_UPDATING_PROFILE_PICTURE"
                }, {
                    'status': 500
                })
            }
        }
    } catch (e) {
        return NextResponse.json({
            'status': 'error',
            'HORIZON_STATUS': "ERROR_CREATING_PROFILE"
        }, {
            'status': 500
        })
    }
}