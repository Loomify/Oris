import '@/css/platform/platform.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Button, Input, TextInput } from '@mantine/core'
import Link from 'next/link'
import PreviewImage from '@/components/platform/PreviewImage'
import multer from 'multer'
import Image from 'next/image'
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import { Plus, Settings } from 'react-feather'

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
    // @ts-ignore
    if (account_info[0].organization == null && account_info[0].image_url == null && account_info[0].first_name == null && account_info[0].last_name == null && account_info[0].user_role == null) {
        if (args['searchParams']['welcome'] == undefined || args['searchParams']['stage'] == undefined || args['searchParams']['welcome'] == true) {
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
                    <h1>Hello, {account_info[0]['first_name']}!</h1>
                    <div className='quick_actions'>
                        <h2>Quick Actions</h2>                   
                        <div className='platform_actions'>
                            <a className='platform_action'>
                                <Plus />
                                Add Paper
                            </a>
                            <Link href={'/platform/settings'} className='platform_action'>
                                <Settings />
                                Settings
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}