// ─────────────────────────────────────────────────────────────
//  Claims that need Paul's confirmation before they go live.
//  Each one renders with a dashed "to confirm" marker, and the
//  production build refuses to run while any is still false.
//  Flip `confirmed` to true (or edit the copy) once cleared.
//  Local preview with markers: ALLOW_UNCONFIRMED=1 npm run build
// ─────────────────────────────────────────────────────────────

export const claims = {
  iciName: {
    confirmed: false,
    note: 'Client permission to name ICI / cursuri.ici.ro and describe the system publicly',
  },
  iciRole: {
    confirmed: true, // Paul, 2026-10-04
    note: 'Sole engineer on cursuri.ici.ro, and still running its production operations',
  },
  wecareName: {
    confirmed: true, // Paul, 2026-10-04
    note: 'Client permission to name WeCare / wecarecompany.ro and link the live site',
  },
  wecareRole: {
    confirmed: true, // Paul, 2026-10-04
    note: 'Sole developer on the WeCare platform, end to end (design, backend, DevOps)',
  },
} satisfies Record<string, { confirmed: boolean; note: string }>;

export type ClaimKey = keyof typeof claims;

export const pendingClaims = Object.entries(claims)
  .filter(([, c]) => !c.confirmed)
  .map(([key, c]) => ({ key, note: c.note }));
