import '@/css/platform/papers/papers_page.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account, paper } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import Link from 'next/link'
import { Button } from '@mantine/core'

export default async function Papers(args: any) {
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
    let papers = await db.select().from(paper)
    papers.sort((a: any, b: any) => {
        return  b.id - a.id
    })
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
                <main className='platform_content_add_paper'>
                    {/* {papers[0].authors} */}
                    {(papers.length == 0) ? <>
                        <div className='not_found_papers'>
                            <h1>Not found</h1>
                            <p>No papers have been uploaded.</p>
                            <Button color='blue' component={Link} href='/platform/papers/add'>Upload a paper</Button>
                        </div>
                    </> : <>
                        <div className='add_paper'>
                            {papers.map((paper: any) => {
                                return (
                                    <Link href={`/platform/papers/${paper.id}`} className="paper" key={paper}>
                                        <h1>{paper.title}</h1>
                                        <p>By {paper.authors}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </>}
                </main>
            </div>
        </div>
    )
}