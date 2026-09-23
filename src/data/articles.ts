export interface Article {
  slug: string;
  category: 'Funeral cover' | 'Tombstones' | 'Claims' | 'Family finances';
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  cta: { label: string; href: string };
}

export const articles: Article[] = [
  {
    slug: 'how-funeral-cover-works', category: 'Funeral cover', title: 'How does funeral cover work?', description: 'A clear introduction to choosing cover and understanding the next steps.', publishedAt: '2026-09-18', updatedAt: '2026-09-18', readTime: '4 min read',
    sections: [
      { heading: 'Start with the people you want to protect', paragraphs: ['Funeral cover is designed to help provide financial support when a covered person passes away. A good first step is to think about who you want to include: yourself, a partner, children, parents or extended family.', 'The people who can be included depend on the product rules. It is useful to compare the options and confirm those rules before you apply.'] },
      { heading: 'Choose with the full details in front of you', paragraphs: ['Look at the cover amount, monthly premium, waiting periods, exclusions and who can be added. These details should be clear before you decide.', 'A guided journey can help you organise your needs, but it does not replace the product terms or personalised financial advice.'] },
      { heading: 'Keep your policy information safe', paragraphs: ['Once cover is issued, make sure the people close to you know where to find the policy number and the claim process. Keep your contact details and beneficiary information current with the insurer.'] },
    ], cta: { label: 'Explore cover options', href: '/cover/discover/' },
  },
  {
    slug: 'how-to-choose-a-tombstone', category: 'Tombstones', title: 'How do I choose a tombstone?', description: 'A practical guide to choosing a memorial with confidence and care.', publishedAt: '2026-09-18', updatedAt: '2026-09-18', readTime: '5 min read',
    sections: [
      { heading: 'Start with the setting', paragraphs: ['The cemetery, available space and installation requirements shape what will work. Confirm the cemetery’s rules before choosing a design.', 'It also helps to ask about foundation, brickwork, delivery and transport needs early in the process.'] },
      { heading: 'Choose a design that feels right', paragraphs: ['Consider whether a headstone, full tombstone, double memorial or special shrine best suits the tribute you have in mind. The inscription, portrait option and decorative details can be discussed after you choose a base design.', 'A custom design takes longer to confirm because the material, craftsmanship and installation requirements need to be reviewed together.'] },
      { heading: 'Confirm what the price includes', paragraphs: ['Ask for a clear breakdown of the selected product, personalisation, delivery, installation and any extras. If a catalogue uses price abbreviations, confirm what each one means before placing an order.', 'Lay-by may help spread payments, but the terms should be confirmed with TIRO before you commit.'] },
    ], cta: { label: 'Browse tombstones', href: '/tombstones/' },
  },
  {
    slug: 'what-to-prepare-for-a-funeral-claim', category: 'Claims', title: 'What should I prepare for a funeral claim?', description: 'Simple steps to help make a claim conversation easier when the time comes.', publishedAt: '2026-09-18', updatedAt: '2026-09-18', readTime: '3 min read',
    sections: [
      { heading: 'Find the policy information', paragraphs: ['Keep the policy number, insurer contact details and the policyholder’s basic information somewhere a trusted person can find them. This can save valuable time when a family needs help.'] },
      { heading: 'Ask the insurer for the current claim requirements', paragraphs: ['Claim requirements can differ by policy and can change over time. Contact TIRO for the current list of documents and the correct way to submit them.', 'Do not send sensitive documents through an unverified channel. Use the contact details and process confirmed by TIRO.'] },
      { heading: 'Keep a note of the conversation', paragraphs: ['Write down the date, the person you spoke to and any reference number you receive. This gives your family a clear record of the next steps.'] },
    ], cta: { label: 'Get claims support', href: '/claims/' },
  },
];
