import type { Metadata } from 'next'
import ThanksClient from './ThanksClient'

export const metadata: Metadata = {
  title: 'ご購入ありがとうございます — THE WAN STANDARD',
  description:
    'THE WAN STANDARD をお選びいただきありがとうございます。ご注文の確認と、愛犬との暮らしを楽しむためのご案内。',
}

export default function ThanksPage() {
  return <ThanksClient />
}
