import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    cookies().delete('horizon_token')
    return NextResponse.json({
        'HORIZON_STATUS': 'logged_out'
    })   
}