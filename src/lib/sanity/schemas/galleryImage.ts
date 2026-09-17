import { defineType, defineField } from 'sanity';

export default defineType({
	name: 'galleryImage',
	title: 'Gallery Image',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string'
		}),
		defineField({
			name: 'image',
			title: 'Photo',
			type: 'image',
			options: { hotspot: true },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'alt',
			title: 'Alt Text',
			type: 'string'
		})
	]
});
