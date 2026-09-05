/**
 * Editorial imagery only — never use these photographs as catalogue product images.
 * Keep the cast to Shiba Inu, Siberian Husky and Saint Bernard.
 * Photo sources and licensing are recorded in docs/brand/homepage.md.
 */
export const homeDogImages = {
  shiba: {
    src: '/assets/tws-hero/tws-hero-grok-2-shiba-goldenhour.jpeg',
    alt: '柔らかな光の中で過ごす柴犬',
    breed: '柴犬',
    label: 'SHIBA INU',
  },
  husky: {
    src: 'https://images.unsplash.com/photo-1551926273-f1e14a594f2e?auto=format&fit=max&w=1200&q=80',
    alt: '床に伏せてくつろぐシベリアンハスキー',
    breed: 'ハスキー',
    label: 'SIBERIAN HUSKY',
  },
  saintBernard: {
    src: 'https://images.unsplash.com/photo-1612599170017-de8c11bd5c21?auto=format&fit=max&w=1200&q=80',
    alt: '茶色と白の毛並みのセントバーナード',
    breed: 'セントバーナード',
    label: 'SAINT BERNARD',
  },
} as const

/** Guide entrances, not invented SKUs, prices or availability. */
export const homeSelections = [
  {
    number: '01',
    title: 'はじめての一椀',
    description: '何を基準に選べばいいか、迷ったら。',
    href: '/use/first-bowl',
    image: '/assets/tws-vi/tws-vi-photo-good-natural-light.jpeg',
    alt: '自然光で器の佇まいを伝えるブランドイメージ',
  },
  {
    number: '02',
    title: '毎日をともにする器',
    description: '食べる、飲む。いつもの時間を心地よく。',
    href: '/use/everyday',
    image: '/assets/tws-hero/tws-hero-grok-1-overhead-ceramic-bowl.jpeg',
    alt: '上から見た陶器のボウルのブランドイメージ',
  },
  {
    number: '03',
    title: '大切な誰かへの贈りもの',
    description: '犬と暮らすあの人へ、想いを込めて。',
    href: '/use/gift',
    image: '/assets/tws-creative/tws-mood-texture-collection.jpeg',
    alt: '素材の表情を集めたブランドイメージ',
  },
] as const
