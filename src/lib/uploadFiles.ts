/*
    Welcome to the loom file uploading system.
*/
"use server"

import { cookies } from "next/headers"
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { db } from "@/db/db"
import { account } from "@/db/schema"
import { eq } from "drizzle-orm"
import { localStorageAdapter } from "./file_adapter/local_adapter"

export async function uploadFiles(form_information: FormData) {
    let token = cookies().get('horizon_token')
    if (token == undefined) {
        return {STATUS_MESSAGE: 'Unauthorized', HORIZON_STATUS: 'UNAUTHORIZED'}
    }
    // @ts-ignore
    let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
    let [title, authors, paper_field, file, protect_paper, open_access, academic_honesty, terms_of_service] = [form_information.get('title'), form_information.get('authors'), form_information.get('paper_field'), form_information.get('file'), form_information.get('protect_paper'), form_information.get('open_access'), form_information.get('academic_honesty'), form_information.get('terms_of_service')]
    // email is identifier
    let email = token_info['payload']['email']
    // grab db info
    // @ts-ignore
    let account_info = await db.select().from(account).where(eq(account.email, email))
    //   Obtain the file
    // Utilize adapter
    if (process.env.file_storage_method?.toLowerCase() == 'local') {
        // @ts-ignore
        localStorageAdapter(file)
    }
}