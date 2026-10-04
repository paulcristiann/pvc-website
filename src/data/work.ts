// ─────────────────────────────────────────────────────────────
//  Case studies, "how I work" and reliability promises.
//  Marketing tone: outcomes first, light on technical detail,
//  no AI model or tool names. Every statement is backed by the
//  codebases or confirmed by Paul. Usage metrics stay out until
//  there is a real number. Client-confidential details (internal
//  system names, vendors, network setup, real data) stay out.
// ─────────────────────────────────────────────────────────────
import type { ClaimKey } from './confirm';

export type CaseStudy = {
  slug: string;
  name: string;
  nameClaim: ClaimKey;
  roleClaim: ClaimKey;
  role: string;
  url: string;
  sector: string;
  headline: string;
  pitch: string;
  visual: 'enrollment' | 'calendar';
  highlights: string[];
  client: string;
  challenge: { intro: string; needs: string[] };
  delivered: { title: string; items: string[] }[];
  results: { title: string; body: string }[];
  howIBuild: { title: string; body: string }[];
  quote?: string;
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'cursuri-ici',
    name: 'cursuri.ici.ro',
    nameClaim: 'iciName',
    roleClaim: 'iciRole',
    role: 'Designed, built and operated end to end',
    url: 'https://cursuri.ici.ro',
    sector: 'Education · national research institute',
    headline: 'Online enrollment for a national IT research institute',
    pitch:
      'From browsing an accredited course to a signed, archived enrollment file, entirely online. Running on the institute’s own servers, with the paperwork handled correctly every time.',
    visual: 'enrollment',
    highlights: ['Paper intake → self-service', 'Signed documents in-app', 'Runs on client infrastructure'],
    client:
      'Romania’s National Institute for Research & Development in Informatics runs around thirty accredited professional courses, from cybersecurity and AI to GDPR and programming, authorised by the Ministries of Labour and Education.',
    challenge: {
      intro:
        'Enrolling one student meant identity checks, several official forms, a training contract and a hand-off into the institute’s records system. Courses only start once a group fills up. The institute needed one system that:',
      needs: [
        'lets students enrol, sign and upload everything online, on a phone or a laptop,',
        'produces the official documents correctly, every time,',
        'keeps personal data strictly scoped and handled under GDPR,',
        'runs on the institute’s own infrastructure, not a third-party cloud.',
      ],
    },
    delivered: [
      {
        title: 'For students',
        items: [
          'A public course catalog with categories, rich course pages and online enrollment.',
          'Snap a photo of your ID card and the profile fills itself in, with every field checked before it’s used.',
          'Official forms signed on screen and delivered as finished PDFs.',
          'Camera-first uploads and full-screen signing on mobile.',
        ],
      },
      {
        title: 'For the institute',
        items: [
          'Course and group management, from forming to finalised and archived.',
          'Enrollment review, contracts and a clear history for every student.',
          'Approved students flow into the institute’s records system automatically.',
          'Course administrators see only their own courses.',
          'Self-service website content: banners, announcements, pages.',
        ],
      },
    ],
    results: [
      {
        title: 'Zero paper forms',
        body: 'Enrollment that used to be handled by hand now runs end to end online.',
      },
      {
        title: 'Correct documents, every time',
        body: 'Official forms are generated from approved templates and signed in the app.',
      },
      {
        title: 'Steady delivery',
        body: 'Around a hundred improvements shipped in six months, each one tested before release.',
      },
    ],
    howIBuild: [
      {
        title: 'Updates that can’t lose data',
        body: 'Every release backs up the database first and only goes live after a health check passes.',
      },
      {
        title: 'Partners can fail; enrollment won’t',
        body: 'If an outside service is down, students fall back to a manual path and nothing they uploaded is lost.',
      },
      {
        title: 'Locked down by default',
        body: 'Every action checks who you are, uploads are verified, access to personal documents is logged, and the server holds no long-lived credentials.',
      },
      {
        title: 'Privacy-first analytics',
        body: 'No cookies, no session recording, nothing personal sent to vendors.',
      },
    ],
    tags: ['Full-stack', 'Next.js', 'PostgreSQL', 'Docker', 'Education', 'GDPR', 'AI-powered workflow'],
  },
  {
    slug: 'wecare',
    name: 'WeCare',
    nameClaim: 'wecareName',
    roleClaim: 'wecareRole',
    role: 'Designed, built and maintained end to end',
    url: 'https://www.wecarecompany.ro',
    sector: 'Healthcare · veterinary clinic',
    headline: 'One platform. The whole clinic.',
    pitch:
      'From online booking to medical records, invoicing and payroll reports, one reliable system runs a veterinary practice that has been caring for pets since 2005.',
    visual: 'calendar',
    highlights: ['24/7 online booking', 'One system instead of many', 'Idea → launch in ~1 month'],
    client:
      'WeCare is a well-established veterinary clinic in Bucharest: open since 2005, 8 specialists, a 4.9 Google rating and more than 1,000 patients a year.',
    challenge: {
      intro:
        'Appointments came in by phone. Records, treatments, supplies and doctor payments were spread across separate tools. The clinic needed one reliable system that:',
      needs: [
        'lets pet owners book online at any hour, without ever double-booking a doctor,',
        'gives the team a single place to run their day,',
        'keeps sensitive medical records private and secure,',
        'shows the owner what the clinic is doing and what each doctor is owed.',
      ],
    },
    delivered: [
      {
        title: 'For pet owners',
        items: [
          'A modern public website with services, team, about and contact pages.',
          'Online booking in five simple steps: service, doctor, date and time, details, confirmed.',
          'Instant email confirmations.',
        ],
      },
      {
        title: 'For the clinic team',
        items: [
          'A shared weekly calendar, colour-coded by doctor, with phone bookings in the same view.',
          'Digital medical records: patients, owners, treatments, consultations, notes, files and full history.',
          'Supplier and invoice management, including partial payments.',
          'Doctor activity and payment reports in a few clicks.',
          'The clinic updates its own services and team pages.',
        ],
      },
    ],
    results: [
      {
        title: 'One system instead of many',
        body: 'Booking, records, billing and reporting live in one place.',
      },
      {
        title: 'Bookings around the clock',
        body: 'Pet owners book online at any time, no phone call needed.',
      },
      {
        title: 'Built fast',
        body: 'The core platform went from idea to launch in about one month.',
      },
    ],
    howIBuild: [
      {
        title: 'Double bookings are impossible',
        body: 'The system itself refuses a clash, not just the screen, even if two people click at the same moment.',
      },
      {
        title: 'Medical records stay private',
        body: 'Access is invite-only, and every layer, down to the database, checks who you are.',
      },
      {
        title: 'I hear about problems first',
        body: 'Errors are monitored across the whole platform, so issues reach me before the clinic calls.',
      },
      {
        title: 'Still improving after launch',
        body: 'Security updates and automated checks on every change keep the platform healthy long after go-live.',
      },
    ],
    quote:
      'AI lets me build in weeks what used to take months. The engineering discipline around it is what makes it safe to run a real business on.',
    tags: ['Full-stack', 'Next.js', 'React', 'TypeScript', 'Supabase', 'Healthcare', 'AI-powered workflow'],
  },
];

export type WorkflowStep = { n: string; title: string; body: string };

export const workflow: WorkflowStep[] = [
  {
    n: '01',
    title: 'Understand the stakes',
    body: 'We agree on what must never go wrong, like a double booking, a lost document or a leaked record, and write the plan down before any code.',
  },
  {
    n: '02',
    title: 'Build fast with AI',
    body: 'I use AI throughout development, working inside rules I write for it, so weeks of work land in days without cutting corners.',
  },
  {
    n: '03',
    title: 'Prove every change',
    body: 'Automated checks run on every change. If anything would break, it doesn’t ship. I review and approve every release myself.',
  },
  {
    n: '04',
    title: 'Run it and keep it healthy',
    body: 'Monitoring, safe releases and ongoing updates after launch. The product keeps working while your team gets on with theirs.',
  },
];

export type Promise = { title: string; body: string; how: string; where: string };

// Reliability, in plain language. `how` is revealed on hover / focus.
export const promises: Promise[] = [
  {
    title: 'No double bookings. Ever.',
    body: 'Two people can click the same slot at the same moment. Only one gets it.',
    how: 'The rule lives in the database itself, not only on the screen.',
    where: 'Clinic platform',
  },
  {
    title: 'Releases that can’t lose data',
    body: 'Every update backs up first, and nothing goes live until it proves it’s healthy.',
    how: 'Automatic backup before every release, then a health check gate.',
    where: 'Enrollment platform',
  },
  {
    title: 'Partners fail. Your product doesn’t.',
    body: 'When an outside service goes down, users get a fallback instead of an error.',
    how: 'Every integration has a safe default and a retry path.',
    where: 'Enrollment platform',
  },
  {
    title: 'Private by default',
    body: 'Medical and personal records are visible only to the people who should see them.',
    how: 'Invite-only access, checks at every layer, logged access to sensitive files.',
    where: 'Both platforms',
  },
  {
    title: 'Problems reach me first',
    body: 'If something breaks, I know before your customers do.',
    how: 'Error monitoring across browser, server and edge.',
    where: 'Both platforms',
  },
  {
    title: 'Fixed at the root',
    body: 'Hard-to-reproduce bugs get diagnosed and fixed for good, not patched over.',
    how: 'Fixes ship with automated tests so the same problem doesn’t come back.',
    where: 'Both platforms',
  },
];

export type MoreWork = { title: string; client: string; body: string; tags: string[] };

// Work beyond the two case studies, from the Toptal profile.
export const moreWork: MoreWork[] = [
  {
    title: 'Fiscal data validation',
    client: 'National scale · Romania',
    body: 'A microservice system with its own cryptography provider that checks the authenticity and integrity of sales data from the country’s next-generation cash registers.',
    tags: ['Architecture', 'Cryptography', 'Microservices'],
  },
  {
    title: 'Retail at enterprise scale',
    client: 'Marks & Spencer',
    body: 'Product page and basket rebuilds in one of the UK’s largest retail apps, with accessibility and performance built in.',
    tags: ['iOS', 'GraphQL', 'Accessibility'],
  },
  {
    title: 'Real-estate marketplace',
    client: 'Property Finder',
    body: 'Principal engineer on MENA’s leading property app: remotely configurable SSL pinning, performance tuning and new features.',
    tags: ['iOS', 'Security', 'Performance'],
  },
  {
    title: 'Point-of-sale compliance',
    client: 'fiskaltrust',
    body: 'Fiscal compliance software adapted for Spain and Italy, including a receipt-printing engine and a move to new hardware security modules.',
    tags: ['Compliance', 'CI/CD', 'Hardware security'],
  },
  {
    title: 'Digital banking security',
    client: 'Salt Bank',
    body: 'Runtime protection, jailbreak detection, code reviews and penetration testing for one of Romania’s first digital-native banks.',
    tags: ['Mobile security', 'Pentesting'],
  },
  {
    title: 'Payments & marketplaces',
    client: 'US startups',
    body: 'Stripe and Plaid cashback payments for an eco-products marketplace; payments and Apple/Google sign-in that lifted trial conversion for a subscription app.',
    tags: ['Fullstack', 'Stripe', 'Plaid'],
  },
  {
    title: 'AI photo products',
    client: 'AI Filter · GlowUp',
    body: 'Prompt-based generative photo editing, designed and launched end to end, plus new AI generation features and stability fixes on GlowUp.',
    tags: ['AI', 'iOS', 'App Store'],
  },
  {
    title: 'Digital identity wallet',
    client: 'Research & development',
    body: 'A mobile wallet for managing and verifying digital identities, secured with biometric authentication and encryption.',
    tags: ['Identity', 'Biometrics', 'Encryption'],
  },
];
