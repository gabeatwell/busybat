import { defineType, defineField } from 'sanity';

export default defineType({
	name: 'blogPost',
	title: 'Blog Post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title' }
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published At',
			type: 'datetime'
		}),
		defineField({
			name: 'mainImage',
			title: 'Main Image',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'body',
			title: 'Content',
			type: 'array',
			of: [{ type: 'block' }, { type: 'image' }]
		})
	]
});
