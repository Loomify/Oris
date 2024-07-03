/*
    Welcome to the loom file uploading system.
*/
"use server"

import { cookies } from "next/headers"
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { db } from "@/db/db"
import { account, journal, paper } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { localStorageAdapter } from "./file_adapter/local_adapter"
import { vercelStorageAdapter } from "./file_adapter/vercel_adapter"

export async function journalUploadHandler(form_information: FormData) {
    try {
        let token = cookies().get('horizon_token')
        if (token == undefined) {
            return {STATUS_MESSAGE: 'Unauthorized', HORIZON_STATUS: 'UNAUTHORIZED'}
        }
        // Get JWT
        // @ts-ignore
        let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let [journal_name, journal_description, journal_field, file] = [form_information.get('journal_name'), form_information.get('journal_description'), form_information.get('journal_field'), form_information.get('file')]
        // email is identifier
        let email = token_info['payload']['email']
        // @ts-ignore
        let account_info = await db.select().from(account).where(eq(account.email, email))
        if (account_info.length == 0) {
            return {STATUS_MESSAGE: 'Account does not exist', HORIZON_STATUS: 'ACCOUNT_NOT_FOUND'}
        }
        // add journal to db
        // @ts-ignore
        if (process.env.file_storage_method?.toLowerCase() == 'local') {
            await db.insert(journal).values({
                // @ts-ignore
                name: journal_name,
                description: journal_description,
                field: journal_field,
                // @ts-ignore
                image_url: `/images/${account_info[0].id}${file.size}`,
                owner_id: account_info[0].id
            })
            // @ts-ignore
            await localStorageAdapter(file, `${account_info[0].id}${file.size}`)
            // @ts-ignore
            return {STATUS_MESSAGE: 'File uploaded successfully', HORIZON_STATUS: 'SUCCESS', FILE_URL: `/platform/journals`}
        } else if (process.env.file_storage_method?.toLowerCase() == 'vercel') {
                // @ts-ignore
                let information = await vercelStorageAdapter(file, `${account_info[0].id}${file.size}`)
                await db.insert(journal).values({
                    // @ts-ignore
                    name: journal_name,
                    description: journal_description,
                    field: journal_field,
                    image_url: information.url,
                    owner_id: account_info[0].id
                })
                return {STATUS_MESSAGE: 'File uploaded successfully', HORIZON_STATUS: 'SUCCESS', FILE_URL: `/platform/journals`}            
        }
    } catch (e) {
        return {STATUS_MESSAGE: 'Internal Server Error', HORIZON_STATUS: 'INTERNAL_SERVER_ERROR'}
    }
}