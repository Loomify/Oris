import { NextRequest, NextResponse } from "next/server";

// Necessary for being able to perform a POST request and then getting data
export async function POST(req: NextRequest) {
    // Obtain the data with username and password
    let data = await req.json()
    // Got the credentials
    let [email, password] = [data.email, data.password]

    

    // Our response
    return NextResponse.json({
        'status': 'test'
    })
}