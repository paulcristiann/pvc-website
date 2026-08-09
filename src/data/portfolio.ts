// ─────────────────────────────────────────────────────────────
//  Site content — everything on the site is driven from here.
//  Edit the values below to update the site content.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Paul Vasile',
  role: 'Engineer · Architect · Product Builder',
  tagline:
    'I build scalable, secure, high-performance mobile software — from architecture to App Store.',
  location: 'Bucharest, Romania',
  email: 'paulcristian04@proton.me',
  // WhatsApp click-to-chat: digits only, international format, no + or spaces.
  whatsappNumber: '40756850399',

  about:
    'Senior Software Engineer specializing in iOS with 9+ years of experience ' +
    'delivering mobile applications for startups, enterprise organizations, and ' +
    'fintech. As a Toptal engineer, I’ve partnered with international clients to ' +
    'build scalable, secure, and high-performance software. My expertise spans iOS ' +
    'development, software architecture, networking, application security, and ' +
    'modernizing complex codebases.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/paulcristiann' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paul-vasile' },
    { label: 'Toptal', href: 'https://www.toptal.com/developers/resume/paul-vasile' },
  ],
};

export const stats: { value: string; label: string }[] = [
  { value: '9+', label: 'Years of engineering experience' },
  { value: 'Top 3%', label: 'Of global talent, vetted by Toptal' },
  { value: '10+', label: 'Client engagements worldwide' },
];

export type Publication = {
  title: string;
  venue: string;
  href: string;
};

export type Experience = {
  role: string;
  company: string;
  summary: string;
  highlights: string[];
  tags: string[];
  publications?: Publication[];
};

export const experience: Experience[] = [
  {
    role: 'Senior Software Engineer',
    company: 'Toptal',
    summary:
      'Hand-picked into Toptal’s network of the top 3% of global engineering talent. 10+ engagements for startups and enterprise organizations, spanning iOS development, software architecture, application security, and networking.',
    highlights: [
      'Trusted by international clients including Property Finder, a leading real-estate marketplace, and fiskaly/fiskaltrust, specialists in fiscal compliance.',
      'Modernized complex legacy codebases into scalable, maintainable architectures.',
      'Delivered secure, high-performance software across real estate, fintech, and compliance domains.',
    ],
    tags: ['Swift', 'SwiftUI', 'Software Architecture', 'Application Security'],
  },
  {
    role: 'Senior iOS Engineer',
    company: 'Mindera · Marks & Spencer',
    summary:
      'Core contributor to one of the UK’s largest retail applications, engineering at enterprise scale.',
    highlights: [
      'Core part of the product detail page (PDP) rearchitecture and refactoring initiative.',
      'Helped refactor the entire basket module in under two months.',
      'Modernized legacy components with the latest Apple technologies.',
    ],
    tags: ['SwiftUI', 'GraphQL', 'Performance Optimization', 'Code Refactoring'],
  },
  {
    role: 'Mobile Security Engineer',
    company: 'Salt Bank',
    summary:
      'Helped lay the mobile security foundation of one of Romania’s first digital-native banks.',
    highlights: [
      'Researched and evaluated mobile security vendors to define the bank’s security stack.',
      'Balanced engineering trade-offs against security capabilities and integration complexity.',
    ],
    tags: ['Mobile Security', 'Application Security', 'Technology Strategy'],
  },
  {
    role: 'Software Engineer',
    company: 'ICI Bucharest',
    summary:
      'Software research & development at Romania’s national institute for informatics, contributing to national and European Commission–funded projects.',
    highlights: [
      'Built R&D software for European and national research programs.',
      'Grew from junior engineer to leading a cybersecurity team.',
    ],
    tags: ['Software R&D', 'European Projects', 'Cybersecurity'],
    publications: [
      {
        title:
          'AI-driven solutions for cybersecurity: comparative analysis and ethical aspects',
        venue: 'Romanian Journal of Information Technology and Automatic Control · 2024',
        href: 'https://rria.ici.ro/documents/1203/art._Dinu_Vasile_Georgescu.pdf',
      },
      {
        title:
          'Shaping the educational landscape: the rise and potential of Verifiable Credentials in higher education',
        venue: 'International Conference on Virtual Learning · 2023',
        href: 'https://icvl.eu/documents/51/art._10_S2_Dinu_Vasile2.pdf',
      },
      {
        title: 'eDIS — Electronic Diploma Integrity Service',
        venue: 'Romanian Cyber Security Journal · 2021',
        href: 'https://rocys.ici.ro/documents/19/2021_fall_article_6.pdf',
      },
      {
        title:
          'Validarea rapoartelor electronice emise de casele fiscale de marcat: Aplicația ExportValidator',
        venue: 'Research article · 2020',
        href: 'https://www.researchgate.net/publication/347734277_Validarea_rapoartelor_electronice_emise_de_casele_fiscale_de_marcat_Aplicatia_ExportValidator',
      },
      {
        title: 'ICI Learning: Platform Dedicated to Online Learning',
        venue: 'Romanian Cyber Security Journal · 2020',
        href: 'https://rocys.ici.ro/documents/38/2020_fall_article_6.pdf',
      },
    ],
  },
];

export type Project = {
  name: string;
  kind: 'Side project' | 'Client work';
  icon: string; // path under /public
  description: string;
  tags: string[];
  href?: string;
  website?: string;
  appStore?: string;
};

export const projects: Project[] = [
  {
    name: 'Nearby: P2P mesh chatting',
    kind: 'Side project',
    icon: '/icons/nearbychat.jpg',
    description:
      'Chat with people around you — no internet required. Nearby links nearby devices into a peer-to-peer mesh network, so conversations flow directly from phone to phone.',
    tags: ['P2P', 'Mesh Networking', 'Offline Chat'],
    website: 'https://nearbychat.app',
    appStore: 'https://apps.apple.com/app/nearby-p2p-mesh-chatting/id6789983060',
  },
  {
    name: 'AI Filter',
    kind: 'Client work',
    icon: '/icons/ai-filter.jpg',
    description:
      'AI magic for your photos. Upload a picture, describe the change you want, and let AI do the rest — pre-made filters for instant results or a fully custom mode for creative edits. Built for GlowUp.com.',
    tags: ['AI', 'Image Generation', 'In-App Purchases'],
    appStore: 'https://apps.apple.com/ro/app/ai-filter/id6741488330',
  },
];

export type ClientApp = {
  name: string;
  descriptor: string;
  icon: string; // path under /public
  href: string;
};

// Apps built together with client teams — shown as an icon showcase.
export const clientApps: ClientApp[] = [
  {
    name: 'Property Finder',
    descriptor: 'Leading real-estate marketplace in MENA',
    icon: '/icons/property-finder.jpg',
    href: 'https://apps.apple.com/ro/app/property-finder-real-estate/id897540233',
  },
  {
    name: 'M&S',
    descriptor: 'Marks & Spencer — fashion, food & homeware',
    icon: '/icons/ms.jpg',
    href: 'https://apps.apple.com/ro/app/m-s-fashion-food-homeware/id538410698',
  },
  {
    name: 'GlowUp',
    descriptor: 'AI photo generator & avatar maker',
    icon: '/icons/glowup.svg',
    href: 'https://glowup.com',
  },
  {
    name: 'Video Widget',
    descriptor: 'GIF, video & Live Photo widgets for iPhone',
    icon: '/icons/videowidget.svg',
    href: 'https://videowidget.com',
  },
];

export const education: { school: string; degree: string; field: string }[] = [
  {
    degree: 'Master’s degree',
    field: 'Software Engineering',
    school: 'University of Bucharest',
  },
  {
    degree: 'Bachelor’s degree',
    field: 'Computer Science',
    school: 'University of Bucharest',
  },
];
