import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

export const metadata: Metadata = {
  title: 'はじめての一椀 | THE WAN STANDARD',
  description: '愛犬の最初の器選びを、素材・サイズ・扱いやすさの基準から考えるTHE WAN STANDARDのガイド。',
}

export default function FirstBowlPage() {
  return (
    <UseCaseLanding
      eyebrow="First Bowl"
      title="はじめての一椀を、ちゃんと選ぶ。"
      lead="かわいさだけでも、機能だけでもなく。毎日口にするものとして、素材・大きさ・暮らしとの相性から選ぶための入口です。"
      heroImage="/assets/tws-creative/tws-scene-family-dog-1.jpeg"
      introTitle="最初の器には、迷わないための基準がいる。"
      introBody="犬用の器は選択肢が多く、見た目だけでは違いが分かりにくいもの。THE WAN STANDARDでは、食品に触れる器として安心して選べること、愛犬の体格に合うこと、そして毎日扱いたくなることを大切にしています。"
      points={[
        { label: 'Material', title: '口に触れる素材から', description: '食品に触れるものとして、素材や加工の考え方が明確な器を選ぶ。最初に確認したいのは、目に見えない部分です。' },
        { label: 'Size', title: '体格に合わせる', description: '小さすぎても大きすぎても使いにくいもの。犬種名だけで決めず、普段の食事量や顔まわりとのバランスから考えます。' },
        { label: 'Routine', title: '毎日扱えること', description: '洗いやすさ、持ちやすさ、置いたときの安定感。毎日繰り返す動作に無理がないことも、長く使うための大事な基準です。' },
      ]}
      steps={[
        { number: '01', title: 'いま使っている器を観察する', description: '食べこぼしや器の動き、洗うときの扱いやすさなど、日々感じている小さな違和感を見つけます。' },
        { number: '02', title: '必要な大きさを決める', description: '普段の一食分が無理なく収まり、愛犬が自然に口を運べる余白を目安にします。' },
        { number: '03', title: '暮らしに残したい一椀を選ぶ', description: '最後は、毎日置いておきたいと思えるものを。器は愛犬との生活の景色の一部になります。' },
      ]}
      secondaryImage="/assets/tws-mood-ceramic-texture.jpeg"
      secondaryAlt="陶器の質感"
      ctaTitle="最初の一椀を、ここから。"
      ctaBody="迷ったら、まずはサイズと素材から。商品ページと選び方ガイドを見ながら、愛犬に合う一椀を探してみてください。"
    />
  )
}
