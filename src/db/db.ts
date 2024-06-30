import { drizzle } from "drizzle-orm/node-postgres"
import {Client} from 'pg'
import * as schema from './schema'

// Database client
export const client = new Client({
    // @ts-ignore
    host: process.env.db_host!,
     // @ts-ignore
    port: Number(process.env.db_port),
    // @ts-ignore
    user: process.env.db_username,
    // @ts-ignore
    password: process.env.db_password,
    // @ts-ignore
    database: process.env.db_name,
    ssl: process.env.db_ssl_enabled?.toLowerCase() == 'true' ? true : false,
})

client.connect()

export const db = drizzle(client, {schema});