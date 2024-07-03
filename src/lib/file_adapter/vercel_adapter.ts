import { db } from '@/db/db'
import { paper } from '@/db/schema'
import {put} from '@vercel/blob'
import { eq } from 'drizzle-orm'

export async function vercelStorageAdapter(file: File, title: String) {
    // @ts-ignore
    // use vercel blob
    const blob = await put(`${title}${file.name}`, Buffer.from(await file.arrayBuffer()), {
        access: 'public'
    })
    return blob
}