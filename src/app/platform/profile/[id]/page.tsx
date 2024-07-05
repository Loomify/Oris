import '@/css/platform/profile.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account, journal, paper } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from 'next/link'
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import { Button } from '@mantine/core'
import Image from 'next/image'
import { Briefcase, Edit2, HelpCircle } from 'react-feather'


export default async function ProfileIdentity(args: any) {
    try {
        // Get cookies
        let token = cookies().get('horizon_token')
        // @ts-ignore
        let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        // Since the payload has an email, the email is our identifier.
        let email = token_info['payload']['email']
        // Now we have account information.
        // @ts-ignore
        let account_info = await db.select().from(account).where(eq(account.email, email))
        // grab profile info
        // @ts-ignore
        let profile_info = await db.select().from(account).where(eq(account.id, parseInt(args.params.id)))
        let papers = await db.select().from(paper).where(eq(paper.owner_id, parseInt(args.params.id)))
        let journal_count = 0
        for (let i = 0; i < papers.length; i++) {
            let journal_info = await db.select().from(journal).where(eq(journal.id, papers[i].journal_id))
            if (journal_info.length != 0) {
                journal_count++
            }
        }
        if (profile_info.length == 0) {
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
                            <div className='could_not_find'>
                                <h1 className='question_couldntfind'>404</h1>
                                <h2>Profile could not be found.</h2>
                                <Button component={Link} href={'/platform/explore'}>Return to explore</Button>
                            </div>
                        </main>
                    </div>
                </div>
        )
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
                            <Image src={profile_info[0]['image_url'] || '/default_pfp.png'} className='profile_picture' alt='Profile picture' width={250} height={250} />
                            <div className='profile_info'>
                                <h1>{profile_info[0]['first_name']} {profile_info[0]['last_name']}</h1>
                                <p><Briefcase /> {profile_info[0]['organization']}</p>
                                {(account_info[0].id == profile_info[0].id) ? <Button className='edit_profile_button' color='rgb(75,75,75)' component={Link} href={'/platform/settings'}><span><Edit2 /> Edit Profile</span></Button> : null}
                            </div>
                        </div>
                        {/* <hr className='vertical_row' /> */}
                        <div className='profile_right'>
                            <h2>Research</h2>
                            <h3>Statistics:</h3>
                            <p>Published {papers.length} papers onto the platform in {journal_count} journals.</p>
                            <br />
                            <h3>Publications:</h3>
                            {(papers.length == 0) ? <h4>No papers were uploaded by {profile_info[0].first_name} onto the platform.</h4> : (<>
                                <div className='papers'>
                                    {papers.map((paper: any) => {
                                        return (
                                            <div className='paper' key={paper}>
                                                <h2>{paper.title}</h2>
                                                <p>By {paper.authors}</p>
                                                <Button color='blue' component={Link} href={`/platform/papers/${paper.id}`}>View</Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>)}
                        </div>
                    </main>
                </div>
            </div>
        )
    } catch {
        // @ts-ignore
        // @ts-ignore
        let profile_info = await db.select().from(account).where(eq(account.id, parseInt(args.params.id)))
        let papers = await db.select().from(paper).where(eq(paper.owner_id, parseInt(args.params.id)))
        let journal_count = 0
        for (let i = 0; i < papers.length; i++) {
            let journal_info = await db.select().from(journal).where(eq(journal.id, papers[i].journal_id))
            if (journal_info.length != 0) {
                journal_count++
            }
        }
        if (profile_info.length == 0) {
        return (
                    <div className="container">
                    <PlatformNavbar profileInfo={{
                        'profile_pic': '/default_pfp.png',
                        'first_name': 'unauthenticated',
                        'last_name': 'user',
                        'organization': 'guestService',
                        'user_role': 'guest'
                    }} />
                    <div className="platform_body">
                        <PlatformSidebar />
                        <main className='platform_content_profile'>
                            <div className='could_not_find'>
                                <h1 className='question_couldntfind'>404</h1>
                                <h2>Profile could not be found.</h2>
                                <Button component={Link} href={'/platform/explore'}>Return to explore</Button>
                            </div>
                        </main>
                    </div>
                </div>
        )
        }
        return (
            <div className="container">
                <PlatformNavbar profileInfo={{
                    'profile_pic': '/default_pfp.png',
                    'first_name': 'Unauthenticated',
                    'last_name': 'User',
                    'organization': 'Guest',
                    'user_role': 'guest'
                }} />
                <div className="platform_body">
                    <PlatformSidebar />
                    <main className='platform_content_profile'>
                        <div className='profile_left'>
                            <Image src={profile_info[0]['image_url'] || '/default_pfp.png'} className='profile_picture' alt='Profile picture' width={250} height={250} />
                            <div className='profile_info'>
                                <h1>{profile_info[0]['first_name']} {profile_info[0]['last_name']}</h1>
                                <p><Briefcase /> {profile_info[0]['organization']}</p>
                            </div>
                        </div>
                        {/* <hr className='vertical_row' /> */}
                        <div className='profile_right'>
                            <h2>Research</h2>
                            <h3>Statistics:</h3>
                            <p>Published {papers.length} papers onto the platform in {journal_count} journals.</p>
                            <br />
                            <h3>Publications:</h3>
                            {(papers.length == 0) ? <h4>No papers were uploaded by {profile_info[0].first_name} onto the platform.</h4> : (<>
                                <div className='papers'>
                                    {papers.map((paper: any) => {
                                        return (
                                            <div className='paper' key={paper}>
                                                <h2>{paper.title}</h2>
                                                <p>By {paper.authors}</p>
                                                <Button color='blue' component={Link} href={`/platform/papers/${paper.id}`}>View</Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>)}
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}