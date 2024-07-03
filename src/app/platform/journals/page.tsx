import '@/css/platform/journals/journals.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account, journal, paper } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import Link from 'next/link'
import { Button } from '@mantine/core'

export default async function Journals(args: any) {
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
    let journal_information = await db.select().from(journal)
    console.log(journal_information)
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
                <main className='platform_content_journals'>
                    {journal_information.length >0 ? (
                        <>
                            <div className='journals'>
                                {journal_information.map((journal_entry: any) => (
                                    <Link href={''} key={journal_entry} className='journal_card' style={{backgroundImage: `url("${journal_entry.image_url}")`, backgroundSize: 'cover'}}>
                                        <h1></h1>
                                    </Link>
                                ))}
                            </div>
                        </>
                        ) : (
                            <div className='journals_not_found'>
                                <h1>Journals could not be found.</h1>
                                <p>Why not create one?</p>
                                <Button component={Link} href={'/platform/journals/create'} className='create_journal'>
                                    Create Journal
                                </Button>
                            </div>
                        )
                    }
                </main>
            </div>
        </div>
    )
}