// Content shaping shared by the 3D experiments (/3d/ and /cinematic/).
import { profile, experience, clientApps } from '../data/portfolio';
import { caseStudies } from '../data/work';

export const shortCompany = (company: string) =>
  company
    .replace('National Institute for Research & Development in Informatics (ICI)', 'ICI Bucharest')
    .replace(' · client platforms', '');

export const clientName = (name: string) => (name === 'M&S' ? 'Marks & Spencer' : name);

export const clip = (s: string, n = 30) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

export const publications = experience.flatMap((job) => job.publications ?? []);

export const contacts = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, cta: 'Write an email' },
  { label: 'WhatsApp', value: 'Message me directly', href: `https://wa.me/${profile.whatsappNumber}`, cta: 'Open WhatsApp' },
  ...profile.socials.map((s) => ({
    label: s.label,
    value: s.href.replace(/^https:\/\/(www\.)?/, ''),
    href: s.href,
    cta: `Open ${s.label}`,
  })),
];

export const groups = [
  { id: 'projects', label: 'Projects', color: '#7aa2ff', items: caseStudies.map((c) => c.name) },
  { id: 'clients', label: 'Client teams', color: '#5eead4', items: clientApps.map((a) => clientName(a.name)) },
  { id: 'experience', label: 'Experience', color: '#f6c177', items: experience.map((j) => shortCompany(j.company)) },
  { id: 'writing', label: 'Writing', color: '#c4a7e7', items: publications.map((p) => p.title) },
  { id: 'contact', label: 'Contact', color: '#ff8fab', items: contacts.map((c) => c.label) },
];
