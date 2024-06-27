import '@/css/platform/platform.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Button } from '@mantine/core'
import Link from 'next/link'

export default async function Platform() {
    // Get cookies
    let token = cookies().get('horizon_token')
    if (token == undefined) {
        return redirect('/platform/account')
    }
    // Grabs the JWT
    // @ts-ignore
    let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
    // Since the payload has an email, the email is our identifier.
    let email = token_info['payload']['email']
    // Now we have account information.
    // @ts-ignore
    let account_info = await db.select().from(account).where(eq(account.email, email))

    return (
        <>
            <h1>Welcome to oris!</h1>
            <p>Your token is: {token['value']}</p>
            {/* @ts-ignore */}
            <p>Your email is: {email}</p>
            <Button component={Link} href="/platform/logout">Logout</Button>
        </>
    )
}