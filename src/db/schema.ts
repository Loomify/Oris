import { serial, text, pgTable, pgSchema, boolean } from "drizzle-orm/pg-core";

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

export const paper = orisSchema.table('paper', {
    id: serial('id').primaryKey(),
    title: text('title'),
    authors: text('authors'),
    paper_field: text('paper_field'),
    file_name: text('file_name'),
    file_url: text('file_url'),
    protect_paper: boolean('protect_paper'),
    journal_id: serial('journal_id'),
    peer_review: boolean('peer_review'),
    academic_honesty: text('academic_honesty'),
    terms_of_service: text('terms_of_service'),
    owner_id: serial('owner_id'),
})

export const paper_review = orisSchema.table('paper_review', {
    id: serial('id').primaryKey(),
    paper_id: serial('paper_id'),
    reviewer_id: serial('reviewer_id'),
    review: text('review'),
    score: serial('score'),
})

export const journal = orisSchema.table('journal', {
    id: serial('id').primaryKey(),
    name: text('name'),
    description: text('description'),
    field: text('field'),
    image_url: text('image_url'),
    owner_id: serial('owner_id'),
})

export const journal_edition = orisSchema.table('journal_edition', {
    id: serial('id').primaryKey(),
    journal_id: serial('journal_id'),
    edition_name: text('edition_name'),
    edition_description: text('edition_description'),
    edition_date: text('edition_date'),
    paper_ids: text('paper_ids'),
})