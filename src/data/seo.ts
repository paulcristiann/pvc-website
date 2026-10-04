// ─────────────────────────────────────────────────────────────
//  Search and AI-agent metadata. Nothing here renders on the page:
//  it feeds <meta> tags, JSON-LD, the sitemap and /llms.txt.
//  The stack keywords live here because the visible site
//  deliberately shows no tech stacks.
// ─────────────────────────────────────────────────────────────
import { profile, experience, education, certifications } from './portfolio';
import { caseStudies } from './work';

export const site = 'https://paulcristian.ro';
export const personId = `${site}/#person`;

export const homeTitle = `${profile.name} · Fullstack Engineer | Web, backend and mobile`;
export const homeDescription =
  'Fullstack engineer in Bucharest with 10+ years shipping web platforms, backends and mobile apps that teams rely on. Top 3% on Toptal, open to new projects.';

export const knowsAbout = [
  'Fullstack development',
  'Web platforms',
  'Backend development',
  'Mobile app development',
  'iOS development',
  'Software architecture',
  'Application security',
  'Mobile security',
  'Cybersecurity',
  'GDPR compliance',
  'Generative AI products',
  'AI-powered development workflow',
  'Next.js',
  'React',
  'TypeScript',
  'PostgreSQL',
  'Supabase',
  'Docker',
  'Swift',
  'SwiftUI',
  'GraphQL',
  'Stripe',
  'Plaid',
];

export const person = {
  '@type': 'Person',
  '@id': personId,
  name: profile.name,
  givenName: 'Paul',
  familyName: 'Vasile',
  jobTitle: profile.role,
  description: homeDescription,
  url: `${site}/`,
  image: `${site}/og.png`,
  email: `mailto:${profile.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bucharest',
    addressCountry: 'RO',
  },
  knowsAbout,
  alumniOf: [...new Set(education.map((e) => e.school))].map((name) => ({
    '@type': 'CollegeOrUniversity',
    name,
  })),
  hasCredential: certifications.map((name) => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'certification',
    name,
  })),
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Fullstack Engineer',
    occupationLocation: { '@type': 'City', name: 'Bucharest' },
    skills: knowsAbout.join(', '),
  },
  sameAs: profile.socials.map((s) => s.href),
};

export const website = {
  '@type': 'WebSite',
  '@id': `${site}/#website`,
  url: `${site}/`,
  name: profile.name,
  description: homeDescription,
  inLanguage: 'en',
  publisher: { '@id': personId },
};

export function caseStudyGraph(slug: string) {
  const c = caseStudies.find((x) => x.slug === slug)!;
  const url = `${site}/work/${c.slug}/`;
  const isApp = c.kind.toLowerCase().includes('app');
  return [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: `${c.name}: ${c.headline}`,
      description: c.pitch,
      url,
      image: `${site}/og.png`,
      inLanguage: 'en',
      author: { '@id': personId },
      publisher: { '@id': personId },
      isPartOf: { '@id': `${site}/#website` },
      keywords: c.tags.join(', '),
      about: {
        '@type': isApp ? 'MobileApplication' : 'WebApplication',
        name: c.name,
        url: c.url,
        applicationCategory: c.sector,
        operatingSystem: isApp ? 'iOS' : 'Web browser',
        description: c.headline,
        creator: { '@id': personId },
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Work', item: `${site}/#work` },
        { '@type': 'ListItem', position: 2, name: c.name, item: url },
      ],
    },
  ];
}

// Plain-text profile for AI agents (/llms.txt), generated from the same
// data as the site so it never drifts.
export function llmsText() {
  const lines: string[] = [];
  lines.push(`# ${profile.name}`, '');
  lines.push(`> ${homeDescription}`, '');
  lines.push(profile.about, '');
  lines.push(`- Role: ${profile.role}`);
  lines.push(`- Location: ${profile.location}`);
  lines.push(`- Email: ${profile.email}`);
  for (const s of profile.socials) lines.push(`- ${s.label}: ${s.href}`);
  lines.push(`- Skills: ${knowsAbout.join(', ')}`, '');
  lines.push('## Case studies', '');
  for (const c of caseStudies) {
    lines.push(`- [${c.name}: ${c.headline}](${site}/work/${c.slug}/): ${c.pitch} Live product: ${c.url}`);
  }
  lines.push('', '## Experience', '');
  for (const e of experience) {
    lines.push(`- ${e.role}, ${e.company}: ${e.summary}`);
  }
  lines.push('', '## Education and certifications', '');
  for (const e of education) lines.push(`- ${e.degree}, ${e.field}, ${e.school}`);
  for (const c of certifications) lines.push(`- ${c}`);
  lines.push('', '## Contact', '');
  lines.push(`For new projects, email ${profile.email} or use the contact section at ${site}/#contact.`, '');
  return lines.join('\n');
}
