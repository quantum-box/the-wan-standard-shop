import { homeDogImages } from '@/lib/homepage-content'
import { PageShell } from '@/components/ui/PageShell'
import { EditorialHero } from '@/components/ui/EditorialHero'
import styles from '@/components/ui/storefront.module.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '店舗受け取り・アクセス | THE WAN STANDARD',
  description: 'バーナード・スクエアでのTHE WAN STANDARD商品受け取り方法とアクセスのご案内。',
}

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=%E3%80%92005-0831+%E5%8C%97%E6%B5%B7%E9%81%93%E6%9C%AD%E5%B9%8C%E5%B8%82%E5%8D%97%E5%8C%BA%E4%B8%AD%E3%83%8E%E6%B2%A21%E4%B8%81%E7%9B%AE11-17'

const pickupSteps = [
  {
    num: '01',
    title: 'オンラインで選ぶ',
    desc: 'THE WAN STANDARDのショップから商品を選び、ご注文ください。',
  },
  {
    num: '02',
    title: '受け取り準備を待つ',
    desc: '注文番号を控えておいてください。注文状況はオンラインから確認できます。',
  },
  {
    num: '03',
    title: 'バーナード・スクエアへ',
    desc: '店頭スタッフへオンライン注文であることを伝え、注文番号をご提示ください。',
  },
  {
    num: '04',
    title: '店頭で受け取る',
    desc: '商品をご確認いただき、店頭でお支払いのうえお受け取りください。',
  },
]

export default function PickupPage() {
  return (
    <PageShell variant="editorial">
        <EditorialHero eyebrow="PICK UP AT BERNARD SQUARE" title={<>受け取りも、<br />犬とのお出かけのひとつに。</>} lead="オンラインで選んだ一椀を、犬と人が集まる場所で。THE WAN STANDARDの商品は、札幌市南区のバーナード・スクエアで受け取れます。" image={homeDogImages.saintBernard} caption="暮らしのイメージ。受け取り店舗の写真ではありません。" />

        <section className={styles.editorialBody}>
          <div className={styles.sectionIntro}>
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] mb-5">HOW IT WORKS</p>
            <h2 className="font-serif-ja text-2xl md:text-4xl text-p2 mb-7">オンラインから、店頭まで。</h2>
            <p className="text-sm text-n1 leading-[2]">
              配送を待つのではなく、いつもの場所へ立ち寄って受け取る。
              現在のTHE WAN STANDARDは、店舗受け取りを中心に商品を届けています。
            </p>
          </div>

          <div className={`${styles.gridFour} mb-16`}>
            {pickupSteps.map((item) => (
              <article key={item.num} className={styles.card}>
                <span className="font-serif-en text-s2 text-4xl font-light">{item.num}</span>
                <h3 className="font-serif-ja text-lg text-p2 mt-5 mb-4">{item.title}</h3>
                <p className="text-sm text-n1 leading-[1.9]">{item.desc}</p>
              </article>
            ))}
          </div>

          <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-stretch mb-24">
            <figure>
            <div className={styles.splitPhoto}>
              <Image
                src={homeDogImages.shiba.src}
                alt={homeDogImages.shiba.alt}
                data-breed={homeDogImages.shiba.breed}
                fill
                className="object-cover"
              />
            </div>
            <figcaption className={styles.caption}>暮らしのイメージ。受け取り店舗の写真ではありません。</figcaption>
            </figure>

            <div className="border border-s2/40 bg-white p-8 md:p-10 flex flex-col justify-center">
              <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-5">BERNARD SQUARE</p>
              <h2 className="font-serif-ja text-2xl text-p2 mb-8">受け取り店舗</h2>
              <dl className="grid grid-cols-[7rem_1fr] gap-y-4 text-sm mb-8">
                <dt className="text-n1">住所</dt>
                <dd className="text-p2">〒005-0831 北海道札幌市南区中ノ沢1丁目11-17</dd>
                <dt className="text-n1">電話</dt>
                <dd className="text-p2">011-578-5576</dd>
                <dt className="text-n1">営業時間</dt>
                <dd className="text-p2">日・月・火 11:00–18:00 / 金・土 11:00–21:00</dd>
                <dt className="text-n1">定休日</dt>
                <dd className="text-p2">水・木</dd>
                <dt className="text-n1">駐車場</dt>
                <dd className="text-p2">14台</dd>
              </dl>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block self-start px-7 py-3 bg-p2 text-p1 text-xs tracking-widest hover:bg-p3 transition-colors"
              >
                地図を開く
              </a>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-5 mb-20">
            <article className="border-t border-s2/50 pt-7">
              <p className="font-serif-en text-s2 text-xs tracking-[0.3em] mb-4">BRING</p>
              <h2 className="font-serif-ja text-lg text-p2 mb-4">注文番号をお持ちください</h2>
              <p className="text-sm text-n1 leading-[1.9]">確認のため、ご注文時のお名前または電話番号をご提示いただく場合があります。</p>
            </article>
            <article className="border-t border-s2/50 pt-7">
              <p className="font-serif-en text-s2 text-xs tracking-[0.3em] mb-4">DEADLINE</p>
              <h2 className="font-serif-ja text-lg text-p2 mb-4">原則7日以内に受け取る</h2>
              <p className="text-sm text-n1 leading-[1.9]">注文日から7日以内のお受け取りをお願いします。難しい場合は事前にお問い合わせください。</p>
            </article>
            <article className="border-t border-s2/50 pt-7">
              <p className="font-serif-en text-s2 text-xs tracking-[0.3em] mb-4">OPENING DAYS</p>
              <h2 className="font-serif-ja text-lg text-p2 mb-4">営業日を確認してから</h2>
              <p className="text-sm text-n1 leading-[1.9]">定休日や臨時休業日は商品をお渡しできません。最新の営業状況をご確認のうえご来店ください。</p>
            </article>
          </section>

          <section className="bg-p2 text-p1 p-8 md:p-12 mb-16">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-4">BEFORE YOU GO</p>
                <h2 className="font-serif-ja text-2xl mb-5">注文状況を確認してから来店できます。</h2>
                <p className="text-sm text-p1/75 leading-[1.9]">注文番号と電話番号があれば、オンラインから注文状況を確認できます。</p>
              </div>
              <Link
                href="/shop/orders/lookup"
                className="inline-block border border-s2 text-s2 px-7 py-3 text-xs tracking-widest hover:bg-s2 hover:text-p3 transition-colors text-center"
              >
                注文を確認する
              </Link>
            </div>
          </section>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="bg-p2 text-p1 px-8 py-3 text-xs tracking-widest hover:bg-p3 transition-colors">商品を見る</Link>
            <Link href="/guide" className="border border-p2/40 text-p2 px-8 py-3 text-xs tracking-widest hover:border-p2 transition-colors">ショッピングガイド</Link>
            <Link href="/contact" className="border border-s2/40 text-n1 px-8 py-3 text-xs hover:border-p2 hover:text-p2 transition-colors">お問い合わせ</Link>
          </div>
        </section>
      </PageShell>
  )
}
