import Image from 'next/image'
import Link from 'next/link'
import { PageShell } from '@/components/ui/PageShell'
import { EditorialHero } from '@/components/ui/EditorialHero'
import styles from '@/components/ui/storefront.module.css'

type Point = { label: string; title: string; description: string }
type Step = { number: string; title: string; description: string }
type UseCaseLandingProps = {
  eyebrow: string
  title: string
  lead: string
  heroImage: string
  heroAlt?: string
  heroBreed?: string
  introTitle: string
  introBody: string
  points: Point[]
  steps: Step[]
  secondaryImage: string
  secondaryAlt: string
  ctaTitle: string
  ctaBody: string
}

export default function UseCaseLanding({
  eyebrow, title, lead, heroImage, heroAlt, heroBreed, introTitle, introBody,
  points, steps, secondaryImage, secondaryAlt, ctaTitle, ctaBody,
}: UseCaseLandingProps) {
  return (
    <PageShell variant="editorial">
      <EditorialHero eyebrow={eyebrow} title={title} lead={lead} image={{ src: heroImage, alt: heroAlt ?? title, breed: heroBreed }} />
      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow} lang="en">WHY THIS STANDARD</p>
          <h2>{introTitle}</h2>
          <p>{introBody}</p>
        </div>
        <div className={styles.gridThree}>
          {points.map((point) => (
            <article key={point.label} className={styles.card}>
              <span className={styles.eyebrow} lang="en">{point.label}</span>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.split}>
          <figure>
            <div className={styles.splitPhoto}>
              <Image src={secondaryImage} alt={secondaryAlt} fill sizes="(max-width: 767px) calc(100vw - 40px), 50vw" />
            </div>
            <figcaption className={styles.caption}>素材や暮らしのイメージです。販売商品は商品一覧をご確認ください。</figcaption>
          </figure>
          <div>
            <p className={styles.eyebrow} lang="en">HOW TO CHOOSE</p>
            <h2 className={styles.sectionTitle}>選ぶ時間も、丁寧に。</h2>
            <ol className={styles.steps}>
              {steps.map((step) => (
                <li key={step.number}>
                  <span className={styles.number} aria-hidden="true">{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
            <Link href="/guide/size" className={styles.textLink}>サイズ・商品の選び方を見る →</Link>
          </div>
        </div>
      </section>
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div><p className={styles.eyebrow} lang="en">FIND YOUR BOWL</p><h2>{ctaTitle}</h2></div>
          <div>
            <p>{ctaBody}</p>
            <div className={styles.actionRow}>
              <Link href="/shop" className={styles.primaryLink}>商品を見る <span aria-hidden="true">→</span></Link>
              <Link href="/contact" className={styles.textLink}>選び方を相談する</Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
