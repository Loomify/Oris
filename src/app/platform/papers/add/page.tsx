import '@/css/platform/papers/add.css'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as jwt from "jose"
import * as crypto from "crypto"
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PlatformNavbar } from '@/components/platform/PlatformNavbar'
import { PlatformSidebar } from '@/components/platform/PlatformSidebar'
import { Button, Checkbox, FileInput, TextInput } from '@mantine/core'
import { UploadPaper } from '@/components/platform/papers/UploadPaper'
import { uploadFiles } from '@/lib/uploadFiles'

export default async function Profile(args: any) {
    // file upload handler
    async function fileUploadHandler(data: FormData) {
        'use server'
        let response = await uploadFiles(data)
        // @ts-ignore
        if (response['HORIZON_STATUS'] == 'SUCCESS') {
            // @ts-ignore
            redirect(response['FILE_URL'])
        } else {
            return
        }
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
                    <div className='page_headers'>
                        <h1>Upload a Paper</h1>
                        <p>Welcome to the upload wizard!</p>
                    </div>
                    {/* @ts-ignore */}
                    <form action={fileUploadHandler} method='post'>
                        <TextInput label='Title' name='title' placeholder='Title' required />
                        <TextInput label='Authors' name='authors' placeholder='Authors' required />
                        <TextInput label='Field' name='paper_field' placeholder='Field' required />
                        <UploadPaper />
                        <div className='file_settings'>
                            <div className='row'>
                                <Checkbox name='protect_paper' label='Protect this Paper' />
                                <Checkbox name="preprint_paper" label='This paper is a preprint' />
                                <Checkbox name='peer_reviewed' label='This paper needs to be peer reviewed' />
                            </div>
                        </div>
                        <Checkbox name='academic_honesty' label="By checking this box, I agree that the work is my intellectual property and isn't plagarized." required />
                        <Checkbox name='terms_of_service' label="By checking this box, I agree to provide a license to Oris to be able to host and distribute this paper." required />
                        <Button type='submit'>Finalize Upload</Button>
                    </form>
                </main>
            </div>
        </div>
    )
}