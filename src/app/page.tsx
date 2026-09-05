import Image from 'next/image'
import Link from 'next/link'
import { BrandLockup } from '@/components/BrandLockup'
import { homeDogImages, homeSelections } from '@/lib/homepage-content'
import styles from './home.module.css'

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={styles.arrow}
    >
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const principles = [
  { kanji: '椀', title: '毎日を受けとめる、一椀。', body: '素材も、かたちも、佇まいも。毎日使うものだからこそ、理由をもって選びたい。' },
  { kanji: '腕', title: 'つくる人の、手と想い。', body: '器の向こうにいる作り手にも目を向けて。ものづくりの背景とともに、一椀を届けます。' },
  { kanji: '万', title: 'それぞれの犬、それぞれの暮らし。', body: '体の大きさも、食べ方も、一頭ずつ違うから。その子に合う心地よさを大切に。' },
] as const

export default function Home() {
  return (
    <div className={styles.page}>
      <a href="#main-content" className={styles.skipLink}>本文へスキップ</a>

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link href="/" aria-label="THE WAN STANDARD ホーム" className={styles.brand}>
            <BrandLockup tone="light" markSize={36} wordmarkClassName={styles.wordmark} />
          </Link>
          <nav aria-label="メインナビゲーション" className={styles.navigation}>
            <Link href="/about">私たちについて</Link>
            <Link href="/guide/size">選び方</Link>
            <Link href="/shop" className={styles.navShop}>商品を見る <Arrow /></Link>
            <Link href="/shop/cart" className={styles.cart} aria-label="カートを見る">
              <svg aria-hidden="true" focusable="false" width="21" height="23" viewBox="0 0 24 26" fill="none">
                <path d="M5 8h14l1 15H4L5 8Z" stroke="currentColor" strokeWidth="1.25" />
                <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className={`${styles.container} ${styles.hero}`} aria-labelledby="hero-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>FOR A LIFE SHARED</p>
            <h1 id="hero-heading" className={styles.heroTitle}>
              愛犬のための、<br />新しい基準。
            </h1>
            <p className={styles.heroDescription}>
              毎日使うものを、理由をもって選ぶ。<br />
              素材も、かたちも、暮らしになじむ佇まいも。<br />
              犬と人の心地よい毎日に、寄り添う一椀を。
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={styles.primaryLink}>一椀を探す <Arrow /></Link>
              <Link href="/about" className={styles.textLink}>私たちの想い <Arrow diagonal /></Link>
            </div>
            <p className={styles.heroNote}>DOGS, PEOPLE &amp; THE EVERYDAY.</p>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroPhoto}>
              <Image
                src={homeDogImages.shiba.src}
                alt={homeDogImages.shiba.alt}
                data-breed={homeDogImages.shiba.breed}
                fill
                sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1480px) 55vw, 760px"
                preload
                className={styles.photo}
              />
            </div>
            <figcaption className={styles.photoCaption}>
              <span>いつもの日々を、ともに。</span>
              <span lang="en">01 / {homeDogImages.shiba.label}</span>
            </figcaption>
          </figure>
        </section>

        <nav aria-label="お買いものガイド" className={`${styles.container} ${styles.quickLinks}`}>
          {[
            { label: '商品を探す', detail: 'SHOP', href: '/shop' },
            { label: '愛犬に合うサイズを知る', detail: 'SIZE GUIDE', href: '/guide/size' },
            { label: 'お店で受け取る', detail: 'STORE PICKUP', href: '/pickup' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <span><span className={styles.quickLabel}>{item.detail}</span>{item.label}</span>
              <Arrow diagonal />
            </Link>
          ))}
        </nav>

        <section className={`${styles.container} ${styles.section}`} aria-labelledby="selection-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>FIND YOUR EVERYDAY</p>
              <h2 id="selection-heading" className={styles.sectionTitle}>暮らしに合う、一椀を。</h2>
            </div>
            <Link href="/shop" className={styles.textLink}>すべての商品を見る <Arrow /></Link>
          </div>
          <div className={styles.selectionGrid}>
            {homeSelections.map((selection) => (
              <Link key={selection.href} href={selection.href} className={styles.selectionCard}>
                <div className={styles.selectionPhoto}>
                  <Image
                    src={selection.image}
                    alt={selection.alt}
                    fill
                    sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1480px) 31vw, 440px"
                    className={styles.photo}
                  />
                </div>
                <div className={styles.selectionTitleRow}>
                  <span className={styles.selectionNumber}>{selection.number}</span>
                  <h3>{selection.title}</h3>
                  <Arrow diagonal />
                </div>
                <p className={styles.selectionDescription}>{selection.description}</p>
              </Link>
            ))}
          </div>
          <p className={styles.selectionNote}>写真はブランドイメージです。販売中の商品・価格は商品一覧をご覧ください。</p>
        </section>

        <section className={styles.companions} aria-labelledby="companions-heading">
          <div className={styles.container}>
            <div className={styles.companionsHeading}>
              <div>
                <p className={styles.eyebrow}>THE DAYS WE SHARE</p>
                <h2 id="companions-heading" className={styles.sectionTitle}>犬と、人と。<br />いつもの暮らしを。</h2>
              </div>
              <p className={styles.bodyCopy}>
                散歩から帰ったあとの、一杯の水。<br />
                ごはんを待つ、いつもの顔。<br />
                何気ない時間こそ、大切にしたいから。
              </p>
            </div>
            <div className={styles.companionGrid}>
              {[homeDogImages.husky, homeDogImages.saintBernard].map((dog, index) => (
                <figure key={dog.breed}>
                  <div className={styles.companionPhoto}>
                    <Image
                      src={dog.src}
                      alt={dog.alt}
                      data-breed={dog.breed}
                      fill
                      sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1480px) 46vw, 680px"
                      className={styles.photo}
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <figcaption className={styles.photoCaption}>
                    <span>{dog.breed}</span>
                    <span lang="en">0{index + 2} / {dog.label}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className={styles.companionsFoot}>
              <p>大きさだけでなく、食べ方や姿勢にも目を向けて。</p>
              <Link href="/guide/size" className={styles.textLink}>その子に合う器の選び方 <Arrow /></Link>
            </div>
          </div>
        </section>

        <section className={`${styles.container} ${styles.section}`} aria-labelledby="philosophy-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>OUR STANDARD</p>
              <h2 id="philosophy-heading" className={styles.sectionTitle}>一椀に込める、三つの想い。</h2>
            </div>
            <Link href="/about" className={styles.textLink}>ブランドについて <Arrow diagonal /></Link>
          </div>
          <div className={styles.principles}>
            {principles.map((principle) => (
              <article key={principle.kanji}>
                <span className={styles.kanji} aria-hidden="true">{principle.kanji}</span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.pickup} aria-labelledby="pickup-heading">
          <div className={`${styles.container} ${styles.pickupInner}`}>
            <div>
              <p className={styles.eyebrow}>ONLINE TO OFFLINE</p>
              <h2 id="pickup-heading" className={styles.sectionTitle}>選ぶ時間も、<br />受け取る時間も、楽しみに。</h2>
            </div>
            <div className={styles.pickupCopy}>
              <p>オンラインで選んだ一椀を、バーナードスクエアで。<br />いつものお出かけに、お店で受け取る楽しみを。</p>
              <div className={styles.pickupActions}>
                <Link href="/pickup" className={styles.lightLink}>店舗受け取りについて <Arrow /></Link>
                <Link href="/shop" className={styles.textLink}>商品を見に行く <Arrow /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <div>
              <Link href="/" aria-label="THE WAN STANDARD ホーム" className={styles.brand}>
                <BrandLockup tone="light" markSize={32} wordmarkClassName={styles.wordmark} />
              </Link>
              <p>犬と、人と。心地よい毎日のために。</p>
            </div>
            <nav aria-label="フッターナビゲーション" className={styles.footerLinks}>
              <Link href="/shop">商品一覧</Link>
              <Link href="/about">私たちについて</Link>
              <Link href="/guide/size">器の選び方</Link>
              <Link href="/pickup">店舗受け取り</Link>
            </nav>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} THE WAN STANDARD</p>
        </div>
      </footer>
    </div>
  )
}
