import { NextResponse } from "next/server";
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { account, journal, journal_edition, paper } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        let data = await req.json()
        let [name, description, release_date, papers, journal_id] = [data['name'], data['description'], data['release_date'], data['papers'], data['journal_id']]
        // Authenticate
        // @ts-ignore
        let token = cookies().get('horizon_token')
        if (!token == undefined) {
            return NextResponse.json({
                'status': 'Not authorized',
                'HORIZON_STATUS': 'UNAUTHORIZED'
            })
        }
        // @ts-ignore
        let token_info = await jwt.jwtVerify(token['value'], crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let email = token_info['payload']['email']
        
        // @ts-ignore
        let accountInfo = await db.select().from(account).where(eq(account.email, email))
        if (accountInfo.length == 0) {
            return NextResponse.json({
                'status': 'Not authorized',
                'HORIZON_STATUS': 'UNAUTHORIZED'
            })
        }
        let journalI = await db.select().from(journal).where(eq(journal.id, parseInt(journal_id)))
        if (journalI.length == 0) {
            return NextResponse.json({
                'status': 'Could not find',
                'HORIZON_STATUS': 'NOT_FOUND'
            })
        } else if (journalI[0].owner_id != accountInfo[0].id) {
            return NextResponse.json({
                'status': 'Not authorized',
                'HORIZON_STATUS': 'UNAUTHORIZED'
            })
        }
        let papers_list = papers.replace(" ", "").split(',')
        for (let paper_id of papers_list) {
            let paper_info = await db.select().from(paper).where(eq(paper.id, parseInt(paper_id)))
            if (paper_info.length == 0) {
                return NextResponse.json({
                    'status': 'Could not find',
                    'HORIZON_STATUS': 'NOT_FOUND'
                })
            }
            await db.update(paper).set({
                'journal_id': parseInt(journal_id)
            }).where(eq(paper.id, parseInt(paper_id)))
        }
        // Create edition
        await db.insert(journal_edition).values({
            'edition_name': name,
            'edition_description': description,
            'paper_ids': (papers.replace(" ", "")),
            'journal_id': parseInt(journal_id),
            'edition_date': new Date(release_date).toISOString().split('T')[0],
        })
        return NextResponse.json({
            'status': 'success',
            'HORIZON_STATUS': 'SUCCESS'
        })
    } catch {
        return NextResponse.json({
            'status': 'error',
            'HORIZON_STATUS': 'ERROR'
        })
    }
}