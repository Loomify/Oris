import { db } from "@/db/db";
import { paper } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let body = await request.json()
    
    if (body.paper_id == undefined) {
        return NextResponse.json({
            'error': 'paper_id is required'
        }, {
            status: 400
        })
    } else if (body.paper_mode != undefined && body.paper_mode == 'author' && body.author_id != undefined) {
        let papers_req = await db.select().from(paper).where(eq(paper.owner_id, body.author_id))
        return NextResponse.json({
            'data': papers_req
        })
    }
    
    let papers_response = await db.select().from(paper).where(eq(paper.id, body.paper_id))
    return NextResponse.json({
        'data': papers_response
    })
}