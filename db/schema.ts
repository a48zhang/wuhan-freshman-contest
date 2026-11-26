import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const registrations = sqliteTable('registrations', {
 id:text('id').primaryKey(),name:text('name').notNull(),school:text('school').notNull(),studentId:text('student_id').notNull(),year:text('year').notNull(),email:text('email').notNull(),nickname:text('nickname').notNull().default(''),createdAt:text('created_at').notNull()
},t=>[uniqueIndex('registrations_school_student').on(t.school,t.studentId)]);
