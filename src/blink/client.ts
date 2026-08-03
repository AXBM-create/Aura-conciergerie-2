import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'landing-builder-html-esm6swh4',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_CYmUmxf1gLM6uuUuuFK17L2w15v-9cm7',
  authRequired: false,
  auth: { mode: 'managed' },
})
