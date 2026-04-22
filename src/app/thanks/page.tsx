import type { Metadata } from 'next'
import ThanksClient from './ThanksClient'

export const metadata: Metadata = {
  title: 'ご購入ありがとうございます — THE WAN STANDARD',
  description:
    'QRコードをご覧いただきありがとうございます。公式LINEに友だち追加で、次回5%OFFクーポンをお受け取りいただけます。',
}

export default function ThanksPage() {
  return <ThanksClient />
}
