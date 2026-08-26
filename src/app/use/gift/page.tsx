import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

export const metadata: Metadata = {
  title: '贈る一椀 | THE WAN STANDARD',
  description: '愛犬家への贈りものとして器を選ぶためのTHE WAN STANDARDのギフト提案。',
}

export default function GiftPage() {
  return (
    <UseCaseLanding
      eyebrow="Gift"
      title="犬を想う人へ、犬を想う贈りもの。"
      lead="犬用品を贈るのではなく、その人と愛犬が過ごす毎日の時間を贈る。長く使える一椀だからできるギフトがあります。"
      heroImage="/assets/tws-creative/tws-mood-texture-collection.jpeg"
      introTitle="好みだけで終わらない、実用品のギフト。"
      introBody="愛犬家への贈りものは、犬種やサイズ、普段の暮らしによって選び方が変わります。THE WAN STANDARDでは、見た目の特別感だけでなく、実際に毎日使えることを前提に選ぶことをおすすめします。"
      points={[
        { label: 'For Them', title: '相手の暮らしを思い浮かべる', description: '犬種だけではなく、普段どんな場所で食事をしているか、どんなものを大切にしているかまで想像して選びます。' },
        { label: 'Useful', title: '使えるものを贈る', description: '飾るためではなく、毎日の食事に使えること。長く使うほど贈った人の気持ちが暮らしに残ります。' },
        { label: 'Story', title: '選んだ理由も一緒に', description: '素材や作り手、選定基準など、その一椀を選んだ理由が伝わると、贈りものはもっと個人的なものになります。' },
      ]}
      steps={[
        { number: '01', title: '犬のサイズを確認する', description: '分かる範囲で体格や普段の食事量を確認します。迷う場合は、相手に聞かずに選べる情報だけで無理に決めないことも大切です。' },
        { number: '02', title: '相手の暮らしに合う色や質感を選ぶ', description: 'インテリアや普段使っている食器を思い浮かべながら、生活空間に自然に置ける一椀を選びます。' },
        { number: '03', title: '贈る理由をひとこと添える', description: '「毎日使うものだから、いいものを」と一言あるだけで、器そのもの以上の意味が伝わります。' },
      ]}
      secondaryImage="/assets/tws-creative/tws-mood-seal-stamp.jpeg"
      secondaryAlt="THE WAN STANDARDのギフトイメージ"
      ctaTitle="贈る相手を思いながら、選ぶ。"
      ctaBody="サイズや選び方に迷うときは、商品ガイドを確認するかお問い合わせください。贈りものとして無理のない一椀を一緒に考えます。"
    />
  )
}
