import { EMAIL } from './links'

export interface LegalSection {
  id: string
  heading: string
  paragraphs: string[]
}

export interface LegalDoc {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

// Bump this whenever either document's wording changes.
export const LEGAL_LAST_UPDATED = '11 October 2026'

export const privacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  lastUpdated: LEGAL_LAST_UPDATED,
  intro:
    'This Privacy Policy explains how Ashterisk ("we", "us") handles information when you visit the-ashterisk.github.io (the "Site"). The short version: we don\'t collect any personal data. We count visits and Copy and Download clicks anonymously, without cookies, to see which resources are useful.',
  sections: [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      paragraphs: [
        "The Site is the home of Ashterisk, a YouTube channel documenting AI project builds, tool reviews, and one engineer's move from mobile to AI systems.",
        `You can reach us at ${EMAIL}.`,
      ],
    },
    {
      id: 'information-we-collect',
      heading: 'Information we collect',
      paragraphs: [
        'We do not collect, store, or sell any personal information through the Site. There are no accounts, sign-up forms, comment sections, or contact forms.',
      ],
    },
    {
      id: 'data-on-your-device',
      heading: 'Data stored on your device',
      paragraphs: [
        'The Site saves two small values in your own browser so it behaves the way you expect. They never leave your device and are not sent to us or anyone else.',
        'Your theme (light or dark) is saved in localStorage under the key "ashterisk-theme" so it stays the same between visits.',
        'A flag named "ashterisk-preloader-shown" is saved in sessionStorage so the intro animation plays only once per visit. Your browser deletes it when you close the tab.',
        "You can remove both at any time by clearing this Site's data in your browser settings.",
      ],
    },
    {
      id: 'cookies-and-tracking',
      heading: 'Cookies, analytics, and tracking',
      paragraphs: [
        'The Site does not use cookies or advertising pixels, and it stores nothing in your browser for analytics.',
        'We use PostHog to count visits anonymously. For each page you open, it records the page, the site or campaign link that sent you (for example a YouTube or Instagram link), your browser and device type, and whether you copied or downloaded a toolkit file.',
        "PostHog does not keep your IP address. To tell one visit from another without cookies, it turns your IP address and browser into a one-way code that changes every day and cannot be turned back into either. We never sell this data or use it for advertising. PostHog's privacy policy is at https://posthog.com/privacy.",
        'Fonts and images are served from the Site itself, so loading a page does not contact services such as Google Fonts. The only outside service a page contacts is PostHog, as described above.',
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting',
      paragraphs: [
        "The Site is hosted on GitHub Pages. Like most web hosts, GitHub may record technical information such as your IP address in server logs for security and operational purposes. That processing is handled by GitHub under the GitHub General Privacy Statement; we don't have access to those logs.",
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Links to other sites',
      paragraphs: [
        "The Site links to YouTube, Instagram, GitHub, and other external services. When you follow those links, the destination's own privacy policy applies. We are not responsible for how those services handle your data.",
      ],
    },
    {
      id: 'email',
      heading: 'If you email us',
      paragraphs: [
        `If you write to ${EMAIL}, we receive your email address and whatever you choose to include. We use it only to read and reply to your message, and we never sell or share it.`,
      ],
    },
    {
      id: 'children',
      heading: "Children's privacy",
      paragraphs: [
        'The Site is not directed at children under 13, and we do not knowingly collect personal information from children.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy from time to time. The "Last updated" date at the top of this page shows when it last changed.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      paragraphs: [`Questions about this policy? Email ${EMAIL}.`],
    },
  ],
}

export const termsOfUse: LegalDoc = {
  title: 'Terms of Use',
  lastUpdated: LEGAL_LAST_UPDATED,
  intro:
    'These Terms of Use govern your use of the-ashterisk.github.io (the "Site"), run by Ashterisk ("we", "us"). By using the Site, you agree to these terms.',
  sections: [
    {
      id: 'using-the-site',
      heading: 'Using the Site',
      paragraphs: [
        'You are welcome to browse the Site and share links to it. If you do not agree with these terms, please do not use the Site.',
      ],
    },
    {
      id: 'content-and-ip',
      heading: 'Content and intellectual property',
      paragraphs: [
        'Unless stated otherwise, the text, videos, graphics, logos, the Ashterisk name, and the Ash mascot on the Site belong to Ashterisk and may not be copied or reused without permission.',
        'Source code in our public GitHub repositories is governed by the license included in each repository, not by these terms.',
      ],
    },
    {
      id: 'informational-only',
      heading: 'Informational purposes only',
      paragraphs: [
        'Project breakdowns, tutorials, and tool reviews are shared for general information and education. They are not professional, legal, financial, or security advice.',
        'Code, tools, and techniques are provided as-is. Evaluate them yourself and use them at your own risk, especially before relying on them in production.',
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Third-party links',
      paragraphs: [
        'The Site links to third-party websites and services such as YouTube, Instagram, and GitHub. We do not control them and are not responsible for their content, policies, or availability.',
      ],
    },
    {
      id: 'liability',
      heading: 'Disclaimer and limitation of liability',
      paragraphs: [
        'The Site is provided "as is" and "as available", without warranties of any kind. To the fullest extent permitted by law, Ashterisk is not liable for any loss or damage arising from your use of the Site or reliance on its content.',
      ],
    },
    {
      id: 'governing-law',
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts of India.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms from time to time. The "Last updated" date at the top of this page shows when they last changed. Continuing to use the Site means you accept the updated terms.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      paragraphs: [`Questions about these terms? Email ${EMAIL}.`],
    },
  ],
}
