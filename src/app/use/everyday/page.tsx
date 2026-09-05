import { homeDogImages } from '@/lib/homepage-content'
import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

export const metadata: Metadata = {
  title: '毎日の一椀 | THE WAN STANDARD',
  description: '毎日の食事時間を、安心して選べる器と美しい暮らしの視点から整えるTHE WAN STANDARDの提案。',
}

export default function EverydayPage() {
  return (
    <UseCaseLanding
      eyebrow="Everyday"
      title="毎日の食事を、暮らしの景色に。"
      lead="朝も夜も、同じ場所で繰り返す食事の時間。だからこそ、愛犬にも飼い主にも気持ちよく続く器を選びたい。"
      heroImage={homeDogImages.husky.src}
      heroAlt={homeDogImages.husky.alt}
      heroBreed={homeDogImages.husky.breed}
      introTitle="日用品だからこそ、基準を上げる。"
      introBody="毎日使う器に必要なのは、特別な日の豪華さではなく、安心して繰り返し使えること。THE WAN STANDARDは、愛犬が口にする器としての品質と、生活空間に自然となじむ佇まいの両方を大切にします。"
      points={[
        { label: 'Daily Quality', title: '毎日使える品質', description: '食事のたびに使うものだから、素材や仕上げを曖昧にしない。日常に置くものとして安心できる基準から選びます。' },
        { label: 'Living', title: '部屋になじむ佇まい', description: '犬用品だけが暮らしから浮かないように。家具や食器と同じように、生活の景色として選べる器を目指します。' },
        { label: 'Care', title: '扱いやすく、続けやすく', description: '毎日の洗浄や片付けまで含めて食事の時間。使う人の負担が少なく、自然に続けられることを大切にします。' },
      ]}
      steps={[
        { number: '01', title: '食事の定位置を決める', description: '床やマット、スタンドとの組み合わせを含めて、器を置く場所をひとつの生活空間として考えます。' },
        { number: '02', title: '一食分に合う容量を選ぶ', description: 'フードや水が無理なく収まり、日々の量を把握しやすいサイズを基準にします。' },
        { number: '03', title: '毎日見ても好きなものを残す', description: '使いやすさを満たしたら、最後は佇まい。毎日の景色に残したい一椀を選びます。' },
      ]}
      secondaryImage="/assets/tws-hero/tws-hero-grok-1-overhead-ceramic-bowl.jpeg"
      secondaryAlt="陶器の器と食事を上から見たブランドイメージ"
      ctaTitle="いつもの食事に、いい基準を。"
      ctaBody="毎日使うものを変えると、暮らしの小さな景色も変わります。愛犬との日常に残したい一椀を探してください。"
    />
  )
}
