import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageShell } from '@/components/ui/PageShell'
import { EditorialHero } from '@/components/ui/EditorialHero'
import { homeDogImages, homeSelections } from '@/lib/homepage-content'
import styles from '@/components/ui/storefront.module.css'

export const metadata: Metadata = {
  title: 'About | THE WAN STANDARD',
  description:
    'THE WAN STANDARDの哲学、選定基準、作り手との向き合い方。犬と暮らす道具に、人の暮らしと同じ基準を。',
  openGraph: {
    title: 'About | THE WAN STANDARD',
    description:
      'THE WAN STANDARDの哲学、選定基準、作り手との向き合い方。犬と暮らす道具に、人の暮らしと同じ基準を。',
    url: '/about',
    images: [
      {
        url: '/assets/og/tws-og-about.jpg',
        width: 1408,
        height: 768,
        alt: 'About THE WAN STANDARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | THE WAN STANDARD',
    description:
      'THE WAN STANDARDの哲学、選定基準、作り手との向き合い方。犬と暮らす道具に、人の暮らしと同じ基準を。',
    images: ['/assets/og/tws-og-about.jpg'],
  },
}

const standards = [
  {
    num: '01',
    en: 'SAFETY',
    title: '口に触れるものだから。',
    desc: '愛犬が毎日、直接口にする器。THE WAN STANDARDは、食品衛生法に準拠した素材・加工であることを、選定の出発点にします。',
  },
  {
    num: '02',
    en: 'FIT',
    title: 'その子の食べ方に合うこと。',
    desc: '犬種や体格だけでなく、食べ方や暮らし方も違う。サイズ、高さ、深さ、重さまで含めて、選びやすい基準をつくります。',
  },
  {
    num: '03',
    en: 'CRAFT',
    title: '作り手の顔が見えること。',
    desc: '誰が、どこで、どう作ったのか。工房や職人の技術と考え方を知り、自信を持って紹介できるものだけを選びます。',
  },
  {
    num: '04',
    en: 'LIFE',
    title: '人の暮らしにも、美しいこと。',
    desc: '犬のための道具だけれど、置かれるのは私たちの暮らしの中。長く使いたくなる佇まいまで、品質の一部だと考えます。',
  },
]

const curationSteps = [
  {
    num: '01',
    title: '探す',
    desc: '全国の工房、産地、作り手を自分たちで探します。既に有名かどうかより、確かな仕事をしているかを見ます。',
  },
  {
    num: '02',
    title: '話す',
    desc: '素材、釉薬、焼成、仕上げ。作り方だけでなく、その器をどう考えて作っているのかまで聞きます。',
  },
  {
    num: '03',
    title: '確かめる',
    desc: '愛犬が口にするものとして扱えるか。素材と製法、安全性、使い勝手をひとつずつ確認します。',
  },
  {
    num: '04',
    title: '使う',
    desc: '写真だけでは分からない重さや手触り、洗いやすさ、日々の扱いやすさまで、暮らしの目線で見ます。',
  },
  {
    num: '05',
    title: '届ける',
    desc: '難しい説明を増やすのではなく、選ぶ理由を分かりやすく。飼い主が迷わず選べる形にして届けます。',
  },
]

const meanings = [
  {
    kanji: '椀',
    sub: '碗',
    title: '器',
    desc: '毎日の食事を受け止める、暮らしの道具。',
  },
  {
    kanji: '腕',
    sub: '',
    title: '技',
    desc: '作り手が積み重ねてきた、確かな仕事。',
  },
  {
    kanji: '万',
    sub: '',
    title: 'すべての犬へ',
    desc: '一頭でも多くの犬に、選べる基準を。',
  },
  {
    kanji: '和',
    sub: '環',
    title: '暮らしと循環',
    desc: '日本の美意識を、犬と人の暮らしの中へ。',
  },
]

export default function AboutPage() {
  return (
    <PageShell variant="editorial">
      <EditorialHero
        eyebrow="ABOUT THE WAN STANDARD"
        title={<>犬と暮らす道具に、<br />人の暮らしと同じ基準を。</>}
        lead="私たちは、犬用品だからという理由で妥協しない。毎日口にするものだからこそ、安全で、使いやすく、美しくあるべきだと考えています。"
        image={homeDogImages.shiba}
      />
      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow} lang="en">WHY WE EXIST</p>
          <h2>「犬用だから、これでいい」を、終わらせたい。</h2>
          <p>食事は毎日繰り返される、小さくて大切な時間。素材や製法だけでなく、手に取ったときの感触、洗うときの扱いやすさ、部屋に置いたときの佇まいまで考える。THE WAN STANDARDは、愛犬との日常を少しずつ良くするための「選ぶ基準」をつくるブランドです。</p>
        </div>
        <div className={styles.gridTwo}>
          {standards.map((item) => (
            <article key={item.num} className={styles.card}>
              <span className={styles.eyebrow} lang="en">{item.num} / {item.en}</span>
              <h3>{item.title}</h3><p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow} lang="en">DOGS, PEOPLE & THE EVERYDAY</p>
          <h2>それぞれの犬、それぞれの暮らし。</h2>
          <p>朝のごはん。散歩から帰ったあとの水。特別な日ではなく、いつもの毎日のために。体の大きさだけでなく、その子の食べ方や暮らし方から、心地よい一椀を考えます。</p>
        </div>
        <div className={styles.gridThree}>
          {Object.values(homeDogImages).map((dog) => (
            <figure key={dog.breed}>
              <div className={styles.dogPhoto}>
                <Image src={dog.src} alt={dog.alt} data-breed={dog.breed} fill unoptimized sizes="(max-width: 767px) calc(100vw - 40px), 33vw" />
              </div>
              <figcaption className={styles.caption}><span>{dog.breed}</span><span lang="en">{dog.label}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className={styles.actionRow}><Link href="/guide/size" className={styles.textLink}>その子に合う器の選び方 →</Link></div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow} lang="en">THE MEANING OF WAN</p><h2>WANに込めた、四つの意味。</h2></div>
        <div className={styles.gridFour}>
          {meanings.map((item) => (
            <article key={item.kanji} className={styles.card}>
              <div className={styles.meaning}>{item.kanji}{item.sub && <small>{item.sub}</small>}</div>
              <h3>{item.title}</h3><p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.split}>
          <figure>
            <div className={styles.splitPhoto}><Image src="/assets/tws-creative/tws-mood-seal-stamp.jpeg" alt="作り手の仕事を象徴する印のブランドイメージ" fill sizes="(max-width: 767px) calc(100vw - 40px), 50vw" /></div>
            <figcaption className={styles.caption}>作り手への想いを伝えるブランドイメージ。</figcaption>
          </figure>
          <div>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow} lang="en">HOW WE CURATE</p><h2>売る前に、ちゃんと知る。</h2>
              <p>土を選ぶ人、釉薬を調合する人、窯の火を読む人。一つの器の向こうには、作り手がいます。その背景まで含めて、暮らしへ届けたいと考えています。</p>
            </div>
            <ol className={styles.steps}>
              {curationSteps.map((item) => <li key={item.num}><span className={styles.number} aria-hidden="true">{item.num}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div></li>)}
            </ol>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow} lang="en">FIND YOUR STANDARD</p><h2>暮らしから、選ぶ。</h2><p>最初の一椀も、毎日の器の見直しも、大切な人への贈りものも。</p></div>
        <div className={styles.gridThree}>
          {homeSelections.map((item) => (
            <Link key={item.href} href={item.href} className={styles.productCard}>
              <div className={styles.productPhoto}><Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) calc(100vw - 40px), 33vw" /></div>
              <div className={styles.card}><span className={styles.eyebrow}>{item.number}</span><h3>{item.title} <span aria-hidden="true">↗</span></h3><p>{item.description}</p></div>
            </Link>
          ))}
        </div>
        <p className={styles.caption}>写真はブランドイメージです。販売商品・価格は商品一覧をご覧ください。</p>
      </section>
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div><p className={styles.eyebrow} lang="en">FROM ONLINE TO EVERYDAY LIFE</p><h2>選ぶ時間も、<br />受け取る時間も、楽しみに。</h2></div>
          <div><p>オンラインで選んだ一椀を、バーナードスクエアで。犬と人が集まる場所につながりながら、毎日の暮らしへ届けます。</p><div className={styles.actionRow}><Link href="/shop" className={styles.primaryLink}>商品を見る →</Link><Link href="/pickup" className={styles.textLink}>店舗受け取りについて</Link></div></div>
        </div>
      </section>
    </PageShell>
  )
}
