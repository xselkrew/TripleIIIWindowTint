export const defaultSettings = {
  businessName: 'Triple III Window Tint',
  phoneDisplay: '(817) 617-1808',
  phoneHref: '+18176171808',
  address: '1275 N Main St #505, Mansfield, TX 76063',
  hours: 'Monday–Saturday: 9:00 AM–6:00 PM\nSunday: 10:00 AM–6:00 PM',
  googleMapsUrl: 'https://maps.app.goo.gl/uUeqE9SnnPaNhq7u5',
  facebookUrl: 'https://www.facebook.com/share/1F4LpffQsW/',
  instagramUrl: 'https://www.instagram.com/tripleiiiwindowtint?utm_source=qr&igsh=MWh6ZG5wbzRwazY3YQ==',
  tiktokUrl: 'https://www.tiktok.com/@triple.iii.window?_r=1&_t=ZT-98Pg3LAyE3x',
  heroEyebrow: 'Mansfield, Texas • Automotive Tint & Protection',
  heroTitle: 'Sharper style. Cooler drives. Tint built to last.',
  heroCopy:
    'Premium automotive, residential, and commercial window tint installed with precision in Mansfield, Texas.',
  heroVideoId: 'bCKiX-vZif4',
  warrantyTitle: 'Lifetime protection, backed with confidence.',
  warrantyCopy:
    'Lifetime warranty is available on qualifying window films and installations. Eligibility, care requirements, and exclusions apply.',
  comparisonEyebrow: 'Find your fit',
  comparisonTitle: 'Squeegee through the difference.',
  comparisonInstruction:
    'Drag the squeegee across the windshield to compare Ceramic, Premium, and Economy tint.',
  comparisonInstructionMobile:
    'Tap a section of the windshield to compare Ceramic, Premium, and Economy tint.',
};

export const defaultTintOptions = [
  {
    name: 'Ceramic Tint',
    label: 'Maximum performance',
    imageUrl: '/tint-options/ceramic-tint.webp',
    imageAlt: 'Dark ceramic-tinted vehicle windows reflecting bright sunlight',
    price: 380,
    description:
      'Our premium film delivers exceptional heat rejection, UV protection, clarity, and comfort without interfering with electronics.',
    features: ['Superior heat rejection', 'UV protection', 'Signal-friendly construction'],
  },
  {
    name: 'Color Stable Tint',
    label: 'Premium everyday value',
    imageUrl: '/tint-options/color-stable-tint.webp',
    imageAlt: 'Neutral charcoal tint on a silver vehicle',
    price: 289,
    description:
      'A rich, non-reflective finish engineered to resist fading while improving privacy, comfort, and vehicle appearance.',
    features: ['Fade-resistant color', 'Reduced glare', 'Clean factory-style finish'],
  },
  {
    name: 'Economy Tint',
    label: 'Essential protection',
    imageUrl: '/tint-options/economy-tint.webp',
    imageAlt: 'Privacy tint on a blue-gray everyday vehicle',
    price: 250,
    description:
      'A budget-conscious option for drivers who want dependable privacy, glare reduction, and a sharper look.',
    features: ['Affordable upgrade', 'Added privacy', 'Glare reduction'],
  },
];

export const defaultReviews = [
  {
    name: 'Brian Wilson',
    quote: 'Awesome service and great job! Great price! Recommend to anyone needing tinting!',
    rating: 5,
  },
  {
    name: 'Kayla Brown',
    quote: 'Very knowledgeable, quick & efficient. Would highly recommend.',
    rating: 5,
  },
  {
    name: 'Rex Paul',
    quote:
      'Great price, great service and excellent workmanship! I will definitely recommend your business to friends and family.',
    rating: 5,
  },
];

export const defaultPages: Record<string, any> = {
  'tint-options': {
    eyebrow: 'Window tint options',
    headline: 'The right film for every drive.',
    intro: 'Compare performance, appearance, and value. We’ll confirm the best legal shade and film for your vehicle.',
  },
  'residential-tint': {
    eyebrow: 'Residential window tint',
    headline: 'More comfort and privacy at home.',
    intro: 'Professional residential window film for Mansfield-area homes, designed to reduce glare, improve daytime privacy, and help control solar heat.',
    bodyHeading: 'A smarter layer for Texas windows.',
    bodyCopy: 'Residential film can soften harsh sunlight, block damaging UV exposure, and make bright rooms more comfortable without replacing your existing glass.',
    imageUrl: '/services/residential-tint.webp',
    imageAlt: 'Contemporary North Texas home with professionally tinted windows',
  },
  'commercial-tint': {
    eyebrow: 'Commercial window tint',
    headline: 'Sharper glass for better business spaces.',
    intro: 'Commercial window film for Mansfield storefronts, offices, and workspaces that need improved glare control, privacy, and a polished exterior.',
    bodyHeading: 'Built around the way your space works.',
    bodyCopy: 'We help local businesses select architectural film that supports occupant comfort, protects interiors from UV exposure, and creates a consistent professional appearance.',
    imageUrl: '/services/commercial-tint.webp',
    imageAlt: 'North Texas commercial building with reflective tinted windows',
  },
  gallery: {
    eyebrow: 'Our work',
    headline: 'Clean lines. Cooler glass. Professional results.',
    intro: 'Explore recent automotive, residential, and commercial tint projects completed for Mansfield-area customers.',
  },
  about: {
    eyebrow: 'About Triple III',
    headline: 'Vehicle protection without the runaround.',
    intro: 'We help Mansfield-area customers choose the right window film with honest guidance, careful preparation, and precise installation.',
    bodyHeading: 'Local work. High standards.',
    bodyCopy: 'Triple III Window Tint provides automotive, residential, and commercial film with straightforward recommendations, careful preparation, and a clean finished result.',
  },
  contact: {
    eyebrow: 'Call or text',
    headline: 'Let’s plan your vehicle.',
    intro: 'Call or text us to discuss your vehicle, choose a service, and reserve an installation time.',
  },
};
