import { defineArrayMember, defineField, defineType } from 'sanity';

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings & homepage',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', title: 'Business name', type: 'string' }),
    defineField({ name: 'phoneDisplay', title: 'Phone display', type: 'string' }),
    defineField({ name: 'phoneHref', title: 'Phone international format', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'hours', title: 'Hours', type: 'text', rows: 2 }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps URL', type: 'url' }),
    defineField({ name: 'facebookUrl', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'tiktokUrl', title: 'TikTok URL', type: 'url' }),
    defineField({ name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string' }),
    defineField({ name: 'heroTitle', title: 'Hero headline', type: 'string' }),
    defineField({ name: 'heroCopy', title: 'Hero text', type: 'text' }),
    defineField({ name: 'heroVideoId', title: 'YouTube video ID', type: 'string' }),
    defineField({ name: 'warrantyTitle', title: 'Warranty headline', type: 'string' }),
    defineField({ name: 'warrantyCopy', title: 'Warranty text', type: 'text' }),
    defineField({ name: 'comparisonEyebrow', title: 'Tint comparison eyebrow', type: 'string' }),
    defineField({ name: 'comparisonTitle', title: 'Tint comparison heading', type: 'string' }),
    defineField({ name: 'comparisonInstruction', title: 'Tint comparison instruction', type: 'text' }),
    defineField({ name: 'comparisonInstructionMobile', title: 'Tint comparison mobile instruction', type: 'text' }),
  ],
});

const tintOption = defineType({
  name: 'tintOption',
  title: 'Tint option',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Short label', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
      ],
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
});

const review = defineType({
  name: 'review',
  title: 'Google review',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Reviewer name', type: 'string' }),
    defineField({ name: 'quote', title: 'Review text', type: 'text' }),
    defineField({ name: 'rating', title: 'Rating', type: 'number', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'featured', title: 'Show on homepage', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
});

const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery item',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, fields: [
      defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
    ] }),
    defineField({ name: 'service', title: 'Service', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
});

const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({ name: 'bodyHeading', title: 'Body heading', type: 'string' }),
    defineField({ name: 'bodyCopy', title: 'Body copy', type: 'text' }),
    defineField({
      name: 'image',
      title: 'Page image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'legalSections',
      title: 'Legal sections',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'heading', title: 'Heading', type: 'string' }),
          defineField({ name: 'copy', title: 'Copy', type: 'text' }),
        ],
      })],
    }),
    defineField({ name: 'seoDescription', title: 'SEO description', type: 'text' }),
  ],
});

export const schemaTypes = [siteSettings, tintOption, review, galleryItem, page];
