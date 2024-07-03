/*
    Welcome to the loom file uploading system.
*/
"use server"

import { cookies } from "next/headers"
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { db } from "@/db/db"
import { account, paper } from "@/db/schema"
import { eq } from "drizzle-orm"
import { localStorageAdapter } from "./file_adapter/local_adapter"

export async function uploadFiles(form_information: FormData) {
    let token = cookies().get('horizon_token')
    if (token == undefined) {
        return {STATUS_MESSAGE: 'Unauthorized', HORIZON_STATUS: 'UNAUTHORIZED'}
    }
    // @ts-ignore
    let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
    let [title, authors, paper_field, file, protect_paper, academic_honesty, terms_of_service, peer_review] = [form_information.get('title'), form_information.get('authors'), form_information.get('paper_field'), form_information.get('file'), form_information.get('protect_paper'), form_information.get('academic_honesty'), form_information.get('terms_of_service'), form_information.get('peer_review')]
    // email is identifier
    let email = token_info['payload']['email']
    // grab db info
    let paper_peer_review, paper_protection;
    if (protect_paper == 'on') {
        paper_protection = true
    }
    if (peer_review == 'on') {
        paper_peer_review = true
    }
    // @ts-ignore
    let account_info = await db.select().from(account).where(eq(account.email, email))
    if (account_info.length == 0) {
        return {STATUS_MESSAGE: 'Account does not exist', HORIZON_STATUS: 'ACCOUNT_NOT_FOUND'}
    }
    //   Obtain the file
    // @ts-ignore
    let file_checks = await db.select().from(paper).where(eq(paper.file_name, file.name))
    if (file_checks.length > 0) {
        return {STATUS_MESSAGE: 'File already exists', HORIZON_STATUS: 'FILE_EXISTS'}
    }

    await db.insert(paper).values({
        // @ts-ignore
        title: title,
        authors: authors,
        paper_field: paper_field,
        // @ts-ignore
        file_name: file.name,
        // @ts-ignore
        file_url: `/papers/${file.title}${file.name}`,
        protect_paper: paper_protection,
        peer_review: paper_peer_review,
        academic_honesty: academic_honesty,
        terms_of_service: terms_of_service,
        owner_id: account_info[0].id        
    })
    // Utilize adapter
    if (process.env.file_storage_method?.toLowerCase() == 'local') {
        // @ts-ignore
        localStorageAdapter(file)
    }
}