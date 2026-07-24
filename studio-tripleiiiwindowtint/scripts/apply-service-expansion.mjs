import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})
const root = resolve(process.cwd(), '..')

const settings = {
  heroCopy:
    'Premium automotive, residential, and commercial window tint installed with precision in Mansfield, Texas.',
  warrantyCopy:
    'Lifetime warranty is available on qualifying window films and installations. Eligibility, care requirements, and exclusions apply.',
  comparisonInstruction:
    'Drag the squeegee across the windshield to compare Ceramic, Premium, and Economy tint.',
  comparisonInstructionMobile:
    'Tap a section of the windshield to compare Ceramic, Premium, and Economy tint.',
}

const pages = [
  {
    _id: 'page-residential-tint',
    title: 'Residential Tint',
    slug: {_type: 'slug', current: 'residential-tint'},
    eyebrow: 'Residential window tint',
    headline: 'More comfort and privacy at home.',
    intro:
      'Professional residential window film for Mansfield-area homes, designed to reduce glare, improve daytime privacy, and help control solar heat.',
    bodyHeading: 'A smarter layer for Texas windows.',
    bodyCopy:
      'Residential film can soften harsh sunlight, block damaging UV exposure, and make bright rooms more comfortable without replacing your existing glass.',
    seoDescription:
      'Residential window tint for glare, privacy, UV exposure, and solar heat control in Mansfield, Texas.',
    imagePath: 'public/services/residential-tint.webp',
    imageAlt: 'Contemporary North Texas home with professionally tinted windows',
  },
  {
    _id: 'page-commercial-tint',
    title: 'Commercial Tint',
    slug: {_type: 'slug', current: 'commercial-tint'},
    eyebrow: 'Commercial window tint',
    headline: 'Sharper glass for better business spaces.',
    intro:
      'Commercial window film for Mansfield storefronts, offices, and workspaces that need improved glare control, privacy, and a polished exterior.',
    bodyHeading: 'Built around the way your space works.',
    bodyCopy:
      'We help local businesses select architectural film that supports occupant comfort, protects interiors from UV exposure, and creates a consistent professional appearance.',
    seoDescription:
      'Commercial window tint for Mansfield storefronts, offices, glare control, privacy, and UV protection.',
    imagePath: 'public/services/commercial-tint.webp',
    imageAlt: 'North Texas commercial building with reflective tinted windows',
  },
]

const legalSections = [
  {
    _key: 'general',
    heading: 'General information',
    copy:
      'Website content is provided for general informational purposes and does not create a binding quote, warranty, or service agreement. Service availability, specifications, timing, and pricing may change.',
  },
  {
    _key: 'laws',
    heading: 'Window tint laws',
    copy:
      'Customers are responsible for ensuring their selected tint complies with laws applicable to their vehicle and jurisdiction. Recommendations are not legal advice. Medical or other exemptions must be documented and remain the customer’s responsibility.',
  },
  {
    _key: 'warranty',
    heading: 'Lifetime warranty',
    copy:
      'Lifetime warranty coverage is available only for qualifying products and services and is subject to the written warranty issued for the specific job. Coverage may be limited to the original purchaser or installation and may require proof of purchase, proper care, inspections, or maintenance. Damage caused by abuse, accidents, improper cleaning, environmental contamination, pre-existing defects, or third-party work may be excluded.',
  },
  {
    _key: 'architectural-film',
    heading: 'Architectural window film',
    copy:
      'Residential and commercial film performance varies with film selection, glass type, building orientation, existing glazing, installation conditions, and maintenance. Privacy levels change with interior and exterior lighting, and film is not represented as safety or security glazing unless expressly stated in written service terms.',
  },
  {
    _key: 'estimates',
    heading: 'Estimates and existing conditions',
    copy:
      'Telephone estimates are preliminary until the vehicle, glass, or property is inspected. Existing glass, frames, seals, electronics, accessories, contamination, damage, or prior film may affect scope, price, timing, and results.',
  },
  {
    _key: 'third-party',
    heading: 'Media and third-party services',
    copy:
      'Temporary third-party video content, Google reviews, maps, Sanity, and other linked services are governed by their respective owners and terms. Review excerpts are attributed to their authors and may be edited only for length or clarity without changing their meaning.',
  },
]

await client.patch('site-settings').set(settings).commit()

await Promise.all([
  client.patch('tint-ceramic').set({price: 380}).commit(),
  client.patch('tint-color-stable').set({price: 289}).commit(),
  client.patch('tint-economy').set({price: 250}).commit(),
])

for (const page of pages) {
  const asset = await client.assets.upload('image', createReadStream(resolve(root, page.imagePath)), {
    filename: page.imagePath.split('/').at(-1),
  })
  const {imagePath, imageAlt, ...document} = page
  await client.createIfNotExists({_id: document._id, _type: 'page', title: document.title})
  await client
    .patch(document._id)
    .set({
      ...document,
      image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
        alt: imageAlt,
      },
    })
    .commit()
}

await client
  .patch('page-gallery')
  .set({
    headline: 'Clean lines. Cooler glass. Professional results.',
    intro:
      'Explore recent automotive, residential, and commercial tint projects completed for Mansfield-area customers.',
    seoDescription: 'Recent automotive, residential, and commercial window tint work.',
  })
  .commit()

await client
  .patch('page-about')
  .set({
    headline: 'Window tint without the runaround.',
    intro:
      'We help Mansfield-area customers choose the right window film with honest guidance, careful preparation, and precise installation.',
    bodyCopy:
      'Triple III Window Tint provides automotive, residential, and commercial film with straightforward recommendations, careful preparation, and a clean finished result.',
  })
  .commit()

await client.patch('page-disclaimers').set({legalSections}).commit()

const ceramicIds = await client.fetch(
  `*[_type == "ceramicCoating" || slug.current == "ceramic-coating"]._id`,
)
if (ceramicIds.length) {
  let transaction = client.transaction()
  for (const id of ceramicIds) transaction = transaction.delete(id)
  await transaction.commit()
}

console.log('Applied tint prices, architectural pages, images, and ceramic-service cleanup.')
