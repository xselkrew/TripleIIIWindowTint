import {createReadStream, existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})
const sourceFlag = process.argv.indexOf('--source-dir')
const sourceDir = resolve(
  sourceFlag >= 0 && process.argv[sourceFlag + 1]
    ? process.argv[sourceFlag + 1]
    : '/tmp/tripleiii-gallery-upload-20260724',
)

const projects = [
  {
    file: '20251004_152238.webp',
    title: 'Cybertruck window tint',
    alt: 'Silver angular pickup with newly tinted windows outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20250908_145241.webp',
    title: 'Motor coach window tint',
    alt: 'Large motor coach with tinted windshield and side windows in bright Texas sunlight',
    service: 'Specialty Vehicle Tint',
  },
  {
    file: '20251001_172528.webp',
    title: 'Classic pickup window tint',
    alt: 'Restored red classic pickup with dark window tint',
    service: 'Automotive Window Tint',
  },
  {
    file: '20250829_173209.webp',
    title: 'Tractor cab window tint',
    alt: 'Red tractor cab with professionally tinted curved glass',
    service: 'Specialty Vehicle Tint',
  },
  {
    file: '20260307_161508.webp',
    title: 'Black luxury SUV window tint',
    alt: 'Black luxury SUV with tinted windows outside the Triple III shop after rainfall',
    service: 'Automotive Window Tint',
  },
  {
    file: '20250810_175046.webp',
    title: 'Tesla crossover window tint',
    alt: 'Dark gray Tesla crossover with tinted side windows outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20251107_152559.webp',
    title: 'Bronco window tint',
    alt: 'White Ford Bronco with dark window tint in front of the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20250819_172713.webp',
    title: 'BMW window tint',
    alt: 'Black BMW with dark side-window tint outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20260316_170353.webp',
    title: 'Toyota pickup window tint',
    alt: 'Gray Toyota pickup with dark side-window tint outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20250927_172256.webp',
    title: 'White luxury SUV window tint',
    alt: 'White luxury SUV with dark window tint in front of the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20251002_162117.webp',
    title: 'Ford pickup window tint',
    alt: 'Dark Ford Super Duty pickup with tinted windows outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20251005_170421.webp',
    title: 'White Tesla window tint',
    alt: 'White Tesla crossover with newly tinted windows outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
  {
    file: '20250929_164449.webp',
    title: 'Cadillac SUV window tint',
    alt: 'Black Cadillac SUV with tinted windows outside the Triple III shop',
    service: 'Automotive Window Tint',
  },
]

for (const [index, project] of projects.entries()) {
  const sourcePath = resolve(sourceDir, project.file)
  if (!existsSync(sourcePath)) throw new Error(`Missing processed gallery image: ${sourcePath}`)

  const id = `gallery-${project.file.replace('.webp', '').replace('_', '-')}`
  const existing = await client.fetch(`*[_id == $id][0]{"assetRef": image.asset._ref}`, {id})
  let assetRef = existing?.assetRef

  if (!assetRef) {
    const asset = await client.assets.upload('image', createReadStream(sourcePath), {
      filename: project.file,
      contentType: 'image/webp',
    })
    assetRef = asset._id
  }

  await client.createIfNotExists({_id: id, _type: 'galleryItem', title: project.title})
  await client
    .patch(id)
    .set({
      title: project.title,
      service: project.service,
      description: '',
      order: index + 1,
      image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: assetRef},
        alt: project.alt,
      },
    })
    .commit()

  console.log(`Imported ${index + 1}/${projects.length}: ${project.title}`)
}
