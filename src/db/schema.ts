import { serial, text, pgTable, pgSchema } from "drizzle-orm/pg-core";

export const orisSchema = pgSchema('oris_schema')

export const account = orisSchema.table('account', {
    id: serial('id').primaryKey(),
    email: text('email'),
    password: text('password'),
    saltA: text('saltA'),
    saltB: text('saltB')
})