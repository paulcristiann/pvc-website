// ─────────────────────────────────────────────────────────────
//  Case studies and the short "process" note.
//  Plain tone: say what it is and what it does, no sales lines,
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
  visit: { title: string; body: string; cta: string; secondary?: { label: string; url: string } };
  kind: string;
  sector: string;
  headline: string;
  /** One line for the homepage list */
  short: string;
  pitch: string;
  clientHeading?: string;
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
    visit: {
      title: 'See it live',
      body: 'Browse the live course catalog and walk through enrollment from the student’s side.',
      cta: 'Visit cursuri.ici.ro',
    },
    kind: 'Web platform',
    sector: 'Education · professional training',
    headline: 'Paperless enrollment for accredited courses',
    short: 'Paperless enrollment for accredited courses at ICI.',
    pitch:
      'A course platform that takes students from browsing to a signed, verified enrollment file, on any device. Built for a national research institute that wanted paper out of its accredited training for good.',
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
        title: 'Updates never put records at risk',
        body:
          'Every update starts with a full backup of student records and only goes live once the platform confirms it is healthy.',
      },
      {
        title: 'Enrollment keeps going when partners don’t',
        body:
          'If an outside service is unavailable, students continue on a manual path. No application gets stuck and no upload is lost.',
      },
      {
        title: 'Personal data under lock and key',
        body:
          'Staff see only the courses they manage, every upload is checked, and every view of an identity document is logged, so the client can show exactly who accessed what.',
      },
      {
        title: 'Privacy that stands up to GDPR',
        body:
          'Analytics are anonymous and cookie-free, and no personal data is shared with outside vendors.',
      },
    ],
    tags: ['Full-stack', 'Next.js', 'PostgreSQL', 'Docker', 'Education', 'GDPR', 'AI-powered workflow'],
  },
  {
    slug: 'wecare',
    name: 'wecarecompany.ro',
    nameClaim: 'wecareName',
    roleClaim: 'wecareRole',
    role: 'Designed, built and maintained end to end',
    url: 'https://www.wecarecompany.ro',
    linkLabel: 'wecarecompany.ro',
    visit: {
      title: 'See it live',
      body: 'Visit the clinic’s site and book an appointment the way pet owners do.',
      cta: 'Visit wecarecompany.ro',
    },
    kind: 'Web platform',
    sector: 'Healthcare · veterinary clinic',
    headline: 'All-in-one management for veterinary clinics',
    short: 'Booking, medical records and invoicing for a vet clinic.',
    pitch:
      'A platform that runs a clinic end to end: online booking, a shared doctor schedule, digital medical records, invoicing and payroll reports. Built for WeCare, a Bucharest veterinary clinic caring for pets since 2005.',
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
        title: 'No double bookings, ever',
        body:
          'The booking system itself refuses a clash, even if two pet owners pick the same slot at the same second.',
      },
      {
        title: 'Medical records stay with the clinic',
        body:
          'Only invited staff can sign in, and the database checks who is asking on every request, so patient data never reaches the wrong hands.',
      },
      {
        title: 'Problems found before the phone rings',
        body:
          'Errors are monitored across the platform, so issues reach me before they reach the front desk.',
      },
      {
        title: 'Looked after long after launch',
        body:
          'Security updates and dependency checks keep running, so the clinic’s system stays safe without anyone there having to think about it.',
      },
    ],
    tags: ['Full-stack', 'Next.js', 'React', 'TypeScript', 'Supabase', 'Healthcare', 'AI-powered workflow'],
  },
  {
    slug: 'ai-filter',
    name: 'ai-filter.aesthetic.me',
    role: 'Architecture, app and launch, end to end',
    url: 'https://ai-filter.aesthetic.me',
    linkLabel: 'ai-filter.aesthetic.me',
    visit: {
      title: 'Try it yourself',
      body: 'Download AI Filter on your iPhone and describe your first edit.',
      cta: 'Visit ai-filter.aesthetic.me',
      secondary: { label: 'App Store', url: 'https://apps.apple.com/ro/app/ai-filter/id6741488330' },
    },
    kind: 'iOS app',
    sector: 'Consumer AI · photo editing',
    headline: 'Generative photo editing, as simple as a filter',
    short: 'Edit photos by describing the change. Built for GlowUp.',
    pitch:
      'An iPhone app where people upload a photo, describe the change in plain words or pick a suggestion, and AI reimagines it in seconds. No sliders, no learning curve. Built for GlowUp and shipped from concept to the App Store.',
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
          'Dozens of suggested prompts for one-tap results.',
          'A personal gallery, high-resolution saving and direct sharing to social media.',
        ],
      },
      {
        title: 'For the business',
        items: [
          'Free, Pro and Ultra plans, with saving and sharing included on every plan.',
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
        title: 'Trusted by 10,000+ users',
        body: 'Reviews single out how easy it is to get a great result.',
      },
      {
        title: 'Concept to launch',
        body: 'Architecture, UI, AI integration and App Store release.',
      },
    ],
    howIBuild: [
      {
        title: 'Responsive while the AI works',
        body:
          'Uploads and AI processing run in the background, so the app stays usable instead of freezing on a spinner.',
      },
      {
        title: 'Ready for tomorrow’s models',
        body:
          'The AI provider sits behind a clean boundary, so GlowUp can adopt better models as they appear without rebuilding the app.',
      },
      {
        title: 'Earning from the first release',
        body:
          'Subscriptions, purchases and App Store review requirements were built in from day one.',
      },
    ],
    tags: ['iOS', 'macOS', 'SwiftUI', 'Generative AI', 'Subscriptions', 'AI-powered workflow'],
  },
  {
    slug: 'nearby',
    name: 'nearbychat.app',
    role: 'My own product: idea, design, build and release',
    url: 'https://apps.apple.com/app/nearby-p2p-mesh-chatting/id6789983060',
    linkLabel: 'App Store',
    visit: {
      title: 'Try it yourself',
      body: 'Get Nearby on your iPhone, switch on airplane mode and message a friend next to you.',
      cta: 'Get it on the App Store',
      secondary: { label: 'nearbychat.app', url: 'https://nearbychat.app' },
    },
    kind: 'iOS app',
    sector: 'Messaging · peer-to-peer',
    headline: 'Offline chat and games, phone to phone',
    short: 'Offline chat and games between nearby phones. My own app.',
    pitch:
      'A peer-to-peer app for chatting, group chats and games with people around you, with no internet, servers or accounts. My own product, made for flights, festivals and anywhere without signal.',
    clientHeading: 'The idea',
    client:
      'I built Nearby for the moments regular chat apps fail: on a flight, at a festival or abroad without data. The people you want to talk to are often right next to you, so Nearby connects your phones directly.',
    challenge: {
      intro: 'Building a chat app without the internet means solving everything a server normally does. Nearby had to:',
      needs: [
        'find people nearby and connect automatically, without accounts or phone numbers,',
        'support group chats and games directly between phones, with no server in the middle,',
        'keep running in the background without draining the battery,',
        'keep every conversation private, on the device and nowhere else.',
      ],
    },
    delivered: [
      {
        title: 'For people chatting',
        items: [
          'An inbox of people nearby, with requests to filter strangers.',
          'One-on-one and group chats with everyone in range.',
          'Photo sharing over a direct connection.',
          'Five built-in two-player games for when you’re offline anyway.',
          'Go invisible any time.',
        ],
      },
      {
        title: 'Under the hood',
        items: [
          'Direct peer-to-peer connections between phones in range.',
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
        title: 'Nothing to go down',
        body:
          'There is no server behind Nearby. Phones connect directly to each other, so it works where other chat apps can’t.',
      },
      {
        title: 'Private by design',
        body:
          'Messages travel directly between phones and never touch the cloud, so there is no central store of conversations to leak.',
      },
      {
        title: 'Built to run all day',
        body:
          'Low-energy connections keep it running in the background without draining the battery.',
      },
    ],
    tags: ['iOS', 'Peer-to-peer', 'Group chat', 'Games', 'Privacy', 'Offline-first'],
  },
];
// The homepage "Process" row.
export const process =
  'AI writes much of the code, under rules I set. Tests gate every change, I review every release, and I monitor and update what I ship.';
