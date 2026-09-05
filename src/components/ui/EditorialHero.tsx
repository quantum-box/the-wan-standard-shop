import Image from 'next/image'
import type { ReactNode } from 'react'
import styles from './storefront.module.css'

type Props = {
  eyebrow: string
  title: ReactNode
  lead: string
  image: { src: string; alt: string; breed?: string }
  caption?: string
}

export function EditorialHero({ eyebrow, title, lead, image, caption = '写真はブランドの世界観を伝えるイメージです。' }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow} lang="en">{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.heroLead}>{lead}</p>
      </div>
      <figure className={styles.heroFigure}>
        <div className={styles.heroPhoto}>
          <Image src={image.src} alt={image.alt} data-breed={image.breed} fill priority unoptimized sizes="(max-width: 767px) calc(100vw - 40px), 50vw" />
        </div>
        <figcaption className={styles.caption}><span>{caption}</span>{image.breed && <span>{image.breed}</span>}</figcaption>
      </figure>
    </section>
  )
}
