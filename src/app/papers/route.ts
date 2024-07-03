import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({
        'about': "This is the paper storage route. It is used to serve papers or files that are stored on the server with the file storage method being local. If the method is local, then this route houses papers, you can check the method through the currentMedium method below.",
        'currentMedium': (process.env.file_storage_method?.toLowerCase() == 'local' ? 'local': 'not supported')
    })
}