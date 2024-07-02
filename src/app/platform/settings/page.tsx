import '@/css/platform/settings.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from 'next/link'
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import { Button, TextInput } from '@mantine/core'
import { SettingsAccountDelete } from '@/components/platform/settings/SettingsAccountDelete'
import { EditProfilePicture } from '@/components/platform/settings/EditProfilePicture'


export default async function PlatformSettings(args: any) {
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
                    <EditProfilePicture profile_picture={account_info[0].image_url} />
                    <Link href={'/platform/settings/security'} className='profile_settings_lead'>
                        <strong>Important Actions</strong>
                    </Link>
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
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}