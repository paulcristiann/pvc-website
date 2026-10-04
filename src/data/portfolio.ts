// ─────────────────────────────────────────────────────────────
//  Site content — everything on the site is driven from here.
//  Edit the values below to update the site content.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Paul Vasile',
  role: 'Fullstack Engineer',
  eyebrow: 'AI-native fullstack engineer · Bucharest, Romania',
  tagline:
    'I design, build and run complete products, from web platforms and backends to mobile apps, for teams that can’t afford for them to fail. AI makes me fast. Engineering discipline makes it safe.',
  location: 'Bucharest, Romania',
  email: 'paulcristian04@proton.me',
  // WhatsApp click-to-chat: digits only, international format, no + or spaces.
  whatsappNumber: '40756850399',

  about:
    'My work spans security at a ' +
    'digital-native bank, fiscal compliance across European markets, retail and real ' +
    'estate apps used at scale, payments, and national-scale systems at Romania’s ' +
    'institute for informatics. I started on iOS and still ship ' +
    'there. Today I build whole products, from database to deployment, and I use AI ' +
    'as a force multiplier inside a process designed so that speed never costs ' +
    'reliability.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/paulcristiann' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paul-vasile' },
    { label: 'Toptal', href: 'https://www.toptal.com/developers/resume/paul-vasile' },
  ],
};

// Sourced from the Toptal profile or the repos only. Never add usage metrics
// here without a source.
export const stats: { value: string; label: string }[] = [
  { value: '9+', label: 'Years shipping software' },
  { value: 'Top 3%', label: 'Of global talent, vetted by Toptal' },
  { value: '10+', label: 'Client engagements, startups to enterprise' },
  { value: '6', label: 'Industries: banking, retail, real estate, compliance, education, health' },
];

export type Publication = {
  title: string;
  venue: string;
  href: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  publications?: Publication[];
};

// Roles and dates follow the Toptal profile.
export const experience: Experience[] = [
  {
    role: 'Fullstack Engineer',
    company: 'Independent · client platforms',
    period: '2026 – now',
    summary:
      'Designing, building and running complete platforms for clients, using AI to move fast and engineering discipline to keep them reliable.',
    highlights: [
      'An online enrollment platform for a national IT research institute, with signed official documents and ID-scan onboarding.',
      'An all-in-one platform for a veterinary clinic: public site, online booking, medical records, invoicing and payroll reports.',
    ],
    tags: ['Next.js', 'React', 'PostgreSQL', 'Supabase', 'Docker', 'AI-native engineering'],
  },
  {
    role: 'Senior iOS Engineer',
    company: 'Marks & Spencer',
    period: '2025 – now',
    summary: 'Building one of the UK’s largest retail apps alongside many teams shipping every week.',
    highlights: [
      'Core part of the product detail page rearchitecture; helped refactor the entire basket module in under two months.',
      'Accessible, polished UI (VoiceOver, Dynamic Type) and rendering performance work.',
      'GraphQL integration and asynchronous data flows, backed by unit and UI tests.',
    ],
    tags: ['SwiftUI', 'GraphQL', 'Performance', 'Accessibility'],
  },
  {
    role: 'Mobile Security Engineer',
    company: 'Salt Bank',
    period: '2025',
    summary: 'Helped lay the mobile security foundation of one of Romania’s first digital-native banks.',
    highlights: [
      'Runtime self-protection and jailbreak/root detection.',
      'Source code security reviews and MASVS-compliant penetration testing.',
      'Evaluated and selected the bank’s mobile security vendors.',
    ],
    tags: ['Mobile Security', 'Penetration Testing', 'Banking'],
  },
  {
    role: 'Freelance Engineer · Top 3%',
    company: 'Toptal',
    period: '2023 – now',
    summary:
      'Hand-picked into Toptal’s network of the top 3% of global engineering talent. Engagements for startups and enterprises across real estate, fintech, compliance and consumer apps.',
    highlights: [
      'Property Finder (MENA’s leading real-estate marketplace): principal iOS engineer; shipped remotely configurable SSL pinning and performance work.',
      'fiskaltrust: adapted point-of-sale compliance software for the Spanish and Italian markets, including a receipt-printing engine and a move to new hardware security modules.',
      'Payments and marketplaces: Stripe and Plaid cashback flows for an eco-products marketplace, and payments plus Apple/Google sign-in for a subscription product.',
      'Mobile and back-end lead on an MVP built on AWS and PostgreSQL, from product concept to scheduled launch; more fintech MVPs as lead architect.',
    ],
    tags: ['Fullstack', 'Stripe', 'AWS', 'PostgreSQL', 'Swift', 'React'],
  },
  {
    role: 'Senior Researcher · Head of Cybersecurity',
    company: 'National Institute for Research & Development in Informatics (ICI)',
    period: '2020 – 2025',
    summary:
      'Research and development on national and European Commission–funded projects, growing from engineer to leading the cybersecurity team.',
    highlights: [
      'Architected a scalable, microservice-based system with a cryptography provider that validates the authenticity of sales data from Romania’s next-generation cash registers.',
      'Led security audits and introduced a vulnerability-analysis method that made the work about 50% faster.',
      'Built a digital identity wallet with biometric authentication and encryption.',
      'Mentored junior researchers; co-authored research on AI-driven cybersecurity and verifiable credentials.',
    ],
    tags: ['Software Architecture', 'Cryptography', 'Cybersecurity', 'Docker', 'CI/CD'],
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

export const certifications = ['Certified Ethical Hacker (EC-Council)'];

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
