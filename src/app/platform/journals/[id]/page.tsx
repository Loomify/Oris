import '@/css/platform/journals/journal.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account, journal, journal_edition, paper } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import Link from 'next/link'
import { Button, Menu, MenuDropdown, MenuTarget } from '@mantine/core'
import { Tool } from 'react-feather'
import { CreateJournalEditionComponent } from '@/components/platform/journals/CreateJournalEditionComponent'
import { JournalEditionMenu } from '@/components/platform/journals/JournalEditionMenu'

export default async function Journal(args: any) {
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
    let journal_information = await db.select().from(journal).where(eq(journal.id, args.params.id))
    if (journal_information.length == 0) {
        return redirect('/platform/journals')
    }
    let owner_id = (await db.select().from(account).where(eq(account.id, journal_information[0].owner_id)))[0]
    // @ts-ignore
    let editions = await db.select().from(journal_edition).where(eq(journal_edition.journal_id, journal_information[0].id))
    editions.sort((a: any, b: any) => {
        return new Date(b.edition_date).getTime() - new Date(a.edition_date).getTime()
    })

    if (journal_information[0].field == null || journal_information[0].image_url == null || journal_information[0].description == null || journal_information[0].name == null) {
        await db.delete(journal).where(eq(journal.id, args.params.id))
        redirect('/platform/journals')
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
                <main className='platform_content_journalr'>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', gap: '1em', marginBottom: '1em'}}> 
                        <div className='journal_image' style={{backgroundImage: `url(${journal_information[0].image_url})`}}>
                        </div>
                        <div className='journal'>
                            <div className='information'><h1>{journal_information[0].name}</h1>{(journal_information[0].owner_id == account_info[0].id) ?(<>
                                <Menu trigger='hover'openDelay={200} closeDelay={200} transitionProps={{transition: 'fade', duration: 150}}>
                                    <MenuTarget>
                                        <a><Tool className='icon'/></a>
                                    </MenuTarget>
                                    <MenuDropdown className='dropdown'>
                                        <JournalEditionMenu journalID={args.params.id}/>
                                    </MenuDropdown>
                                </Menu>
                            </>) : null}</div>
                            <h2>Created by {`${owner_id.first_name} ${owner_id.last_name}`}</h2>
                            <p>{journal_information[0].description}</p>
                            <h4>Tags: {journal_information[0].field}</h4>
                        </div>
                    </div>
                    <hr className='hr' />
                    <div className='journal_editions'>
                        <h1>Journal Editions</h1>
                        {(journal_information[0].owner_id == account_info[0].id) ? (
                            <div className='create_journal_edition'>
                                <CreateJournalEditionComponent journal_id={args.params.id} />
                            </div>
                        ) : null}
                        {editions.length == 0 ? <h2>No editions found, create one!</h2> : (<>
                            <br />
                            <div className='editions'>
                                {editions.map((edition: any) => {
                                    return (
                                        <div className='edition' key={edition}>
                                            <hr />
                                            <div>
                                                <h2>{edition.edition_name}</h2>
                                                <p>{edition.edition_description}</p>
                                                <h4>Released on {edition.edition_date}</h4>
                                            </div>
                                            {edition.paper_ids.split(',').map(async (paper_id: any) => {
                                                return (
                                                    <div key={paper_id}>
                                                    {(await db.select().from(paper).where(eq(paper.id, paper_id))).length == 0 ? null : (
                                                        <div className='paper'>
                                                            <h3>{(await db.select().from(paper).where(eq(paper.id, paper_id)))[0].title}</h3>
                                                            <p>{(await db.select().from(paper).where(eq(paper.id, paper_id)))[0].authors}</p>
                                                            <Link href={`/platform/papers/${paper_id}`}><Button>View Paper</Button></Link>
                                                        </div>
                                                    )}
                                                    </div>
                                                )
                                            })}
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