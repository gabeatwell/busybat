import { defineType, defineField } from 'sanity';

export default defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Product Name',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'name' }
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text'
		}),
		defineField({
			name: 'category',
			title: 'Category',
			type: 'string'
		}),
		defineField({
			name: 'images',
			title: 'Product Photos',
			type: 'array',
			of: [{ type: 'image', options: { hotspot: true } }]
		}),
		defineField({
			name: 'inStock',
			title: 'In Stock',
			type: 'boolean',
			initialValue: true
		}),
		defineField({
			name: 'price',
			title: 'Price (optional)',
			type: 'number'
		})
	]
});
