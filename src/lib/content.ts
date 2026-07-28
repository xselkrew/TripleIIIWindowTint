import { createClient } from '@sanity/client';
import {
  defaultReviews,
  defaultSettings,
  defaultTintOptions,
  defaultPages,
} from '../content/defaults';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'o7039w6t';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2026-07-01';

const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : null;

function mergeSettings(settings: Record<string, any> | null | undefined) {
  const merged = { ...defaultSettings, ...(settings || {}) };
  if (merged.hours === 'Monday–Saturday, 9:00 AM–5:00 PM') {
    merged.hours = defaultSettings.hours;
  }
  return merged;
}

export async function getSiteContent() {
  if (!client) {
    return {
      settings: defaultSettings,
      tintOptions: defaultTintOptions,
      reviews: defaultReviews,
    };
  }

  try {
    const data = await client.fetch(`{
      "settings": *[_type == "siteSettings"][0],
      "tintOptions": *[_type == "tintOption"] | order(order asc){
        ...,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      "reviews": *[_type == "review" && featured == true] | order(order asc)
    }`);

    return {
      settings: mergeSettings(data.settings),
      tintOptions: data.tintOptions?.length ? data.tintOptions : defaultTintOptions,
      reviews: data.reviews?.length ? data.reviews : defaultReviews,
    };
  } catch {
    return {
      settings: defaultSettings,
      tintOptions: defaultTintOptions,
      reviews: defaultReviews,
    };
  }
}

export async function getPage(slug: string) {
  const fallback = defaultPages[slug] || {};
  if (!client) return fallback;
  try {
    const page = await client.fetch(
      `*[_type == "page" && slug.current == $slug][0]{
        eyebrow, headline, intro, bodyHeading, bodyCopy, seoTitle, seoDescription,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        legalSections[]{heading, copy}
      }`,
      { slug },
    );
    const publishedValues = Object.fromEntries(
      Object.entries(page || {}).filter(([, value]) => value !== null && value !== undefined),
    );
    return { ...fallback, ...publishedValues };
  } catch {
    return fallback;
  }
}

export async function getGallery() {
  if (!client) return [];
  try {
    const items = await client.fetch(
      `*[_type == "galleryItem"] | order(order asc){
        _id, title, service, description,
        "imageUrl": image.asset->url,
        "alt": coalesce(image.alt, title)
      }`,
    );
    return items.map((item: Record<string, any>) => ({
      ...item,
      carouselUrl: `${item.imageUrl}?w=1200&auto=format&q=80`,
      viewerUrl: `${item.imageUrl}?w=1920&auto=format&q=86`,
    }));
  } catch {
    return [];
  }
}
