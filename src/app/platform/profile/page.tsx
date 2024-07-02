import '@/css/platform/profile.css'
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
import { Button } from '@mantine/core'
import Image from 'next/image'
import { Briefcase, Edit2 } from 'react-feather'


export default async function Profile(args: any) {
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
                <main className='platform_content_profile'>
                    <div className='profile_left'>
                        <Image src={account_info[0]['image_url'] || '/default_pfp.png'} className='profile_picture' alt='Profile picture' width={250} height={250} />
                        <div className='profile_info'>
                            <h1>{account_info[0]['first_name']} {account_info[0]['last_name']}</h1>
                            <p><Briefcase /> {account_info[0]['organization']}</p>
                            <Button className='edit_profile_button' color='rgb(75,75,75)' component={Link} href={'/platform/settings'}><span><Edit2 /> Edit Profile</span></Button>
                        </div>
                    </div>
                    {/* <hr className='vertical_row' /> */}
                    <div className='profile_right'>
                        <h2>Research</h2>
                    </div>
                </main>
            </div>
        </div>
    )
}