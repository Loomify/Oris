import { NextRequest, NextResponse } from "next/server";
import * as crypto from 'crypto'

// Necessary for being able to perform a POST request and then getting data
export async function POST(req: NextRequest) {
    // Obtain the data with username and password
    let data = await req.json()
    // Got the credentials
    let [email, password] = [data.email, data.password]
    let [saltA,saltB] = [crypto.randomBytes(64).toString(),crypto.randomBytes(64).toString()]
    let [posA,posB] = [(Math.random() * (password.length * email.length * 128 * 3)),(Math.random() * (password.length * email.length * 128 * 3))]

    
    // Our response
    return NextResponse.json({
        'status': 'test'
    })
}