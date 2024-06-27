import { drizzle } from "drizzle-orm/node-postgres"
import {Client} from 'pg'
import * as schema from './schema'

export const client = new Client({
    // @ts-ignore
    host: process.env.db.host!,
     // @ts-ignore
    port: Number(process.env.db.port),
    // @ts-ignore
    user: process.env.db.username,
    // @ts-ignore
    password: process.env.db.password,
    // @ts-ignore
    database: process.env.db.database_name
})

export const db = drizzle(client, {schema});