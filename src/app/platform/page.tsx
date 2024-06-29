import '@/css/platform/platform.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account, accountInformation } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Button, Input, TextInput } from '@mantine/core'
import Link from 'next/link'
import PreviewImage from '@/components/platform/PreviewImage'
import multer from 'multer'

export default async function Platform(args: any) {
    // Save profile info
    async function saveFirstLastName(info: FormData) {
        "use server"
        let [first_name, last_name] = [info.get('first_name'), info.get('last_name')]
        // Get cookies
        let token = cookies().get('horizon_token')
        if (token == undefined) {
            return redirect('/platform/account')
        }
        cookies().set('horizon_profile', JSON.stringify({
            'first_name': first_name,
            'last_name': last_name
        }), {
            'sameSite': 'strict',
        })
        return redirect('/platform/?welcome=true&stage=2')
    }
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
    let profile_info = await db.select().from(accountInformation).where(eq(accountInformation.account_id, account_info[0]['id']))
    if (profile_info.length == 0) {
        if (args['searchParams']['welcome'] == undefined) {
            return (
                <>
                    <div className='welcome'>
                        <h1>Welcome to Oris!</h1>
                        <p>We are so excited to have you here.</p>
                        <p>Click the button below to get started.</p>
                        <br />
                        <Button component={Link} href="/platform/?welcome=true&stage=1">Create your profile</Button>
                    </div>
                </>
            )
        } else {
            if (args['searchParams']['stage'] == '1') {
                return (
                    <>
                        <div className='profile'>
                            <div className='profile-header'>                                
                                <p>Step 1</p>
                                <h1>Profile</h1>
                                <p>Fill out your first and last name.</p>
                            </div>
                            <form method='POST' action={saveFirstLastName}>
                                <TextInput label='First Name' variant='filled' name='first_name' required />
                                <TextInput label='Last Name' variant='filled' name='last_name' required />
                                <br />
                                <Button type='submit'>Next</Button>
                            </form>
                        </div>
                    </>
                ) 
            } else if (args['searchParams']['stage'] == '2') {
                return (
                    <>
                        <div className='profile'>
                            <div className='profile-header'>                                
                                <p>Step 2</p>
                                <h1>Profile</h1>
                                <p>Fill out your organization and upload a profile picture!</p>
                            </div>
                            <PreviewImage />
                        </div>
                    </>
                ) 
            }
        }
    }
    console.log(profile_info)
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