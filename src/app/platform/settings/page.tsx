import '@/css/platform/settings.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from 'next/link'
import * as bcrypt from 'bcrypt'
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import { Button, TextInput } from '@mantine/core'
import { SettingsAccountDelete } from '@/components/platform/settings/SettingsAccountDelete'

export default async function PlatformSettings(args: any) {
    async function changeAccountInformation(e: FormData) {
        "use server"
        // Gets all profile information
        let email = await e.get('email')
        let confirm_email = await e.get('confirm_email')
        let confirm_password = await e.get('confirm_password')
        if (email != confirm_email) {
            return redirect('/platform/settings/?error=email_mismatch')
        }
        let token = cookies().get('horizon_token')
        if (token == undefined) {
            return redirect('/platform/account')
        }
        // Grabs the JWT
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
            return redirect('/platform/settings/?error=email_exists')
        }
        if (account_info.length != 0) {
            // @ts-ignore
            let hashed_password = await crypto.createHash('sha512').update(`${account_info[0].saltA}${confirm_password}${await crypto.createHash('sha256').update(account_info[0]['email']).digest('hex')}${account_info[0].saltB}`).digest('hex');
            if (hashed_password != account_info[0].password) {
                return redirect('/platform/settings/?error=password_incorrect')
            }
            // @ts-ignore
            let new_password = await crypto.createHash('sha512').update(`${account_info[0].saltA}${confirm_password}${await crypto.createHash('sha256').update(email).digest('hex')}${account_info[0].saltB}`).digest('hex');
            // @ts-ignore
            await db.update(account).set({'email': email, 'password': new_password}).where(eq(account.id, account_info[0].id))
            console.log('Updated')
            return redirect('/platform/logout')
        }
    }
    async function changeProfileInformation(e: FormData) {
        "use server"
        // Gets all profile information
        let first_name = await e.get('first_name')
        let last_name = await e.get('last_name')
        let organization = await e.get('organization')
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
        if (account_info.length != 0) {
            // @ts-ignore
            await db.update(account).set({'first_name': first_name, 'last_name': last_name, 'organization': organization}).where(eq(account.email, email))
            return redirect('/platform/')
        }
    }
    // Save profile info
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
    // grab profile info
    // @ts-ignore
    if (account_info[0].organization == null && account_info[0].image_url == null && account_info[0].first_name == null && account_info[0].last_name == null && account_info[0].user_role == null) {
        if (args['searchParams']['welcome'] == undefined) {
            redirect('/platform/?welcome=true')
        }
    }
    return (
        <div className="container">
            <PlatformNavbar profileInfo={{
                'profile_pic': account_info[0]['image_url'] || '/default_pfp.png',
                'first_name': account_info[0]['first_name'],
                'last_name': account_info[0]['last_name'],
                'organization': account_info[0]['organization'],
                'user_role': account_info[0]['user_role']
            }} />
            <div className="platform_body">
                <PlatformSidebar />
                <main className='platform_content'>
                    <h1>Settings</h1>
                    <p>Update your account settings or adjust some things.</p>
                    <div className='profile_settings'>
                        <h2>Email Information</h2>
                        <form action={changeAccountInformation} className='change_section'>
                            <div className='change_email'>
                                {/* @ts-ignore */}
                                <TextInput label='Email:' name='email' defaultValue={account_info[0]['email']} required/>
                                {/* @ts-ignore */}
                                <TextInput label='Confirm Email:' name='confirm_email' defaultValue={account_info[0]['email']} required/>
                            </div>
                            {/* @ts-ignore */}
                            <TextInput label='Confirm Password:' type='password' name='confirm_password' placeholder='Password' required/>
                            <Button type='submit' formAction={changeAccountInformation}>Save</Button>
                        </form>

                    </div>
                    <div className='profile_settings'>
                        <h2>Profile</h2>
                        <form action={changeProfileInformation} className='change_section'>
                            <div className='change_fullname'>
                                {/* @ts-ignore */}
                                <TextInput label='First Name:' name='first_name' defaultValue={account_info[0]['first_name']} placeholder='Dylan J.' required />
                                {/* @ts-ignore */}
                                <TextInput label='Last Name:' name='last_name' defaultValue={account_info[0]['last_name']} placeholder='Freeman' required />
                            </div>
                            <div className='organization'>
                                {/* @ts-ignore */}
                                <TextInput label='Organization or current affiliation:' name='organization' defaultValue={account_info[0]['organization']} placeholder='Loom' required/>
                            </div>            
                            <div className='links'>
                                <Button type='submit' formAction={changeProfileInformation}>Save</Button>
                                <SettingsAccountDelete />
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}