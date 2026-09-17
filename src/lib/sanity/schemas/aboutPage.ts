import { defineType, defineField } from 'sanity';

export default defineType({
	name: 'aboutPage',
	title: 'About Page',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string'
		}),
		defineField({
			name: 'body',
			title: 'Content',
			type: 'array',
			of: [{ type: 'block' }] // rich text
		})
	]
});
