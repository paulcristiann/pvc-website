// ─────────────────────────────────────────────────────────────
//  Case studies, "how I work" and more work.
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
  nameClaim?: ClaimKey;
  roleClaim?: ClaimKey;
  role: string;
  url: string;
  linkLabel: string;
  kind: string;
  sector: string;
  headline: string;
  pitch: string;
  visual: 'enrollment' | 'calendar' | 'ai' | 'mesh';
  clientHeading?: string;
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
    linkLabel: 'cursuri.ici.ro',
    kind: 'Web platform',
    sector: 'Education · professional training',
    headline: 'Paperless enrollment for accredited courses',
    pitch:
      'A course platform that takes students from browsing to a signed, verified enrollment file, on any device. Built for a national research institute that wanted paper out of its accredited training for good.',
    visual: 'enrollment',
    highlights: ['ID scan fills the forms', 'Signed on screen', 'Self-hosted, GDPR-first'],
    client:
      'ICI, Romania’s national institute for informatics research, runs around thirty accredited professional courses, from cybersecurity and AI to GDPR and programming. Their goal: move enrollment fully online, onto infrastructure they own, without cutting corners on compliance.',
    challenge: {
      intro:
        'Enrolling in an accredited course means identity checks, several official forms, a training contract and a hand-off into a records system, and a course only starts once its group fills up. The platform had to:',
      needs: [
        'let students enrol, sign and upload everything themselves, on a phone or a laptop,',
        'produce legally valid documents, correct every time,',
        'keep personal data strictly scoped and GDPR compliant,',
        'run on the client’s own servers, not a third-party cloud.',
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
        title: 'For the course team',
        items: [
          'Course and group management, from forming to finalised and archived.',
          'Enrollment review, contracts and a clear history for every student.',
          'Approved students flow into the client’s records system automatically.',
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
    linkLabel: 'wecarecompany.ro',
    kind: 'Web platform',
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
  {
    slug: 'ai-filter',
    name: 'AI Filter',
    role: 'Architecture, app and launch, end to end',
    url: 'https://apps.apple.com/ro/app/ai-filter/id6741488330',
    linkLabel: 'App Store',
    kind: 'iOS & Mac app',
    sector: 'Consumer AI · photo editing',
    headline: 'Describe the change. AI does the rest.',
    pitch:
      'A photo app where you upload a picture, type what you want, and generative AI transforms it in seconds. Built for GlowUp and shipped from concept to the App Store.',
    visual: 'ai',
    highlights: ['Prompt-based editing', 'Instant pre-made filters', 'Subscriptions built in'],
    client:
      'GlowUp makes AI photo and avatar apps. They wanted a new app that makes generative editing feel as simple as applying a filter.',
    challenge: {
      intro:
        'Generative image models are powerful but slow and unpredictable, and most people don’t know how to write a good prompt. The app had to:',
      needs: [
        'turn a photo and a sentence into a great result, with no learning curve,',
        'feel responsive while the AI works in the background,',
        'offer one-tap results for people who don’t want to type,',
        'earn its keep with subscriptions that feel fair.',
      ],
    },
    delivered: [
      {
        title: 'For people editing photos',
        items: [
          'Upload, preview and apply edits in a few taps.',
          'A custom mode: describe any change in plain words.',
          'Pre-made filters for instant results.',
          'Runs on iPhone and on Apple silicon Macs.',
        ],
      },
      {
        title: 'For the business',
        items: [
          'Pro and Ultra subscription tiers, monthly or yearly.',
          'An architecture that lets new AI services plug in without rewriting the app.',
          'A product lifecycle owned end to end, from first concept to App Store release and updates.',
        ],
      },
    ],
    results: [
      {
        title: 'Live on the App Store',
        body: 'Shipping regularly, with updates through 2025 and 2026.',
      },
      {
        title: 'Rated 4.9 on the App Store',
        body: 'Early reviews are close to perfect.',
      },
      {
        title: 'Concept to launch, one owner',
        body: 'Architecture, UI, AI integration and release, all handled by me.',
      },
    ],
    howIBuild: [
      {
        title: 'Fast while the AI thinks',
        body: 'Uploads, previews and AI processing run in the background so the app never freezes.',
      },
      {
        title: 'Ready for the next model',
        body: 'AI services sit behind a clean boundary, so better models can be adopted without a rebuild.',
      },
      {
        title: 'Built for the App Store',
        body: 'Purchases, subscriptions and review requirements handled from day one.',
      },
    ],
    tags: ['iOS', 'macOS', 'SwiftUI', 'Generative AI', 'Subscriptions', 'AI-powered workflow'],
  },
  {
    slug: 'nearby',
    name: 'Nearby',
    role: 'My own product: idea, design, build and release',
    url: 'https://apps.apple.com/app/nearby-p2p-mesh-chatting/id6789983060',
    linkLabel: 'App Store',
    kind: 'iOS app',
    sector: 'Messaging · peer-to-peer',
    headline: 'Chat with people around you. No internet needed.',
    pitch:
      'Nearby links phones into a peer-to-peer mesh, so messages travel directly from phone to phone, on a flight, at a festival or anywhere without signal.',
    visual: 'mesh',
    clientHeading: 'The idea',
    highlights: ['No servers, no accounts', 'Phone-to-phone relay', 'Works in airplane mode'],
    client:
      'Nearby is my own product. Some of the moments we most want to message each other, on a plane, on a train abroad, in a packed crowd, are exactly when there is no signal.',
    challenge: {
      intro: 'Building a chat app without the internet means solving everything a server normally does. Nearby had to:',
      needs: [
        'find people nearby and connect automatically, without accounts or phone numbers,',
        'carry messages further than one phone can reach by relaying them through others,',
        'keep running in the background without draining the battery,',
        'keep every conversation private, on the device and nowhere else.',
      ],
    },
    delivered: [
      {
        title: 'For people chatting',
        items: [
          'An inbox of people nearby, with requests to filter strangers.',
          'One-on-one and group chats, relayed phone to phone across the group.',
          'Photo sharing over a direct connection.',
          'Five built-in two-player games for when you’re offline anyway.',
          'Go invisible any time.',
        ],
      },
      {
        title: 'Under the hood',
        items: [
          'Peer-to-peer connections with a range of roughly 100 metres per hop.',
          'Chats stay on the device and resume automatically when people are back in range.',
          'Runs on iPhone, iPad, Mac and Apple Vision.',
          'Available in English, Spanish and Russian.',
        ],
      },
    ],
    results: [
      {
        title: 'Zero data collected',
        body: 'The App Store privacy label confirms it: no servers, no accounts, no tracking.',
      },
      {
        title: 'Shipped and updated',
        body: 'Live on the App Store as a one-time purchase, no subscription.',
      },
      {
        title: 'Four Apple platforms',
        body: 'Runs on iPhone, iPad, Mac and Apple Vision.',
      },
    ],
    howIBuild: [
      {
        title: 'No single point of failure',
        body: 'There is no server to go down. Every phone in range helps carry the conversation.',
      },
      {
        title: 'Private by architecture',
        body: 'Messages never touch the cloud, so there is nothing to leak.',
      },
      {
        title: 'Easy on the battery',
        body: 'Low-energy connections keep it running in the background all day.',
      },
    ],
    tags: ['iOS', 'Peer-to-peer', 'Mesh networking', 'Privacy', 'Offline-first', 'AI-powered workflow'],
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
