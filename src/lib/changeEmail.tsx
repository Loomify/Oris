'use server'

import { redirect } from "next/dist/server/api-utils"
import { cookies } from "next/headers"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function changeAccountInformation(e: FormData) {
    // Gets all email information
    let email = await e.get('email')
    let token = cookies().get('horizon_token')
    let confirm_email = await e.get('confirm_email')
    let confirm_password = await e.get('confirm_password')
    // @ts-ignore
    let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
    // Since the payload has an email, the email is our identifier.
    let emailVerifier = token_info['payload']['email']
    // Now we have account information.
    // @ts-ignore
    let account_info = await db.select().from(account).where(eq(account.email, emailVerifier))
    // @ts-ignore
    let email_verification = await db.select().from(account).where(eq(account.email, email))
    if (email_verification.length != 0) {
        return {SIG: 'Email already exists.', HORIZON_STATUS: 'EMAIL_EXISTS'}
    }
    if (account_info.length != 0) {
        // @ts-ignore
        let hashed_password = await crypto.createHash('sha512').update(`${account_info[0].saltA}${confirm_password}${await crypto.createHash('sha256').update(account_info[0]['email']).digest('hex')}${account_info[0].saltB}`).digest('hex');
        if (hashed_password != account_info[0].password) {
            return  {SIG: 'Password is incorrect.', HORIZON_STATUS: 'PASSWORD_INCORRECT'}
        }
        // @ts-ignore
        let new_password = await crypto.createHash('sha512').update(`${account_info[0].saltA}${confirm_password}${await crypto.createHash('sha256').update(email).digest('hex')}${account_info[0].saltB}`).digest('hex');
        // @ts-ignore
        await db.update(account).set({'email': email, 'password': new_password}).where(eq(account.id, account_info[0].id))
        return  {SIG: 'LOGOUT', HORIZON_STATUS: 'LOGOUT'}
    }
}

