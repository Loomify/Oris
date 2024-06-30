import { serial, text, pgTable, pgSchema } from "drizzle-orm/pg-core";

export const orisSchema = pgSchema('orisSchema')


export const account = orisSchema.table('account', {
    id: serial('id').primaryKey(),
    email: text('email'),
    password: text('password'),
    saltA: text('saltA'),
    saltB: text('saltB'),
    image_url: text('image_url'),
    first_name: text('first_name'),
    last_name: text('last_name'),
    organization: text('organization'),
    user_role: text('user_role'),
})