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
        let horizon_first_last = cookies().get('horizon_profile')
        let [profile_picture, organization] = [data['profile_picture'], data['organization']]
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
            if (account_info[0].organization == null && account_info[0].image_url == null && account_info[0].first_name == null && account_info[0].last_name == null && account_info[0].user_role == null) {
                // @ts-ignore
                await db.update(account).set({
                    'organization': organization,
                    'image_url': profile_picture,
                    'first_name': first_name,
                    'last_name': last_name,
                    'user_role': 'user'
                // @ts-ignore
                }).where(eq(account.email, account_info[0].email))
                await cookies().delete('horizon_profile')

                return NextResponse.json({
                    'status': 'success',
                    'HORIZON_STATUS': "CREATED_PROFILE"
                })              
            }
        }
        return NextResponse.json({
            'status': 'success',
            'HORIZON_STATUS': "PROFILE_ALREADY_EXISTS"
        })
    } catch (e) {
        return NextResponse.json({
            'status': 'error',
            'HORIZON_STATUS': "ERROR_CREATING_PROFILE"
        }, {
            'status': 500
        })
    }
}