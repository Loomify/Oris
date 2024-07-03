import '@/css/platform/papers/paper.css'
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

export default async function Paper(args: any) {
    async function DeletePaper() {
        "use server"
        await db.delete(paper).where(eq(paper.id, args.params.id))
        redirect('/platform/papers')
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
        if (args['searchParams']['welcome'] == undefined) {
            redirect('/platform/?welcome=true')
        }
    }
    let papers = await db.select().from(paper).where(eq(paper.id, args.params.id))
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
                <main className='platform_content_paper'>
                    <div className='paper_left' style={{backgroundImage: `url(${((await db.select().from(journal).where(eq(journal.id, papers[0].journal_id))).length != 0) ? (await db.select().from(journal).where(eq(journal.id, papers[0].journal_id)))[0].image_url : ("/not_in_a_journal.png")})`}}>
                    </div>
                    <div className='paper_meta'>
                        <h1>{papers[0]['title']}</h1>
                        <p>By {papers[0]['authors']}</p>
                        <p>Field(s): {papers[0]['paper_field']}</p>
                        <Button color='green' component={Link} href={`${papers[0]['file_url']}`}>View PDF</Button>
                        {(papers[0]['owner_id'] == account_info[0]['id']) ? (
                            <>
                               <form action={DeletePaper}>
                                    <Button color="cyan" type='submit'>Delete Paper</Button>
                                </form>                              
                            </>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    )
}