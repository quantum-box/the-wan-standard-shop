import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { BrandLockup } from '@/components/BrandLockup'

type Point = {
  label: string
  title: string
  description: string
}

type Step = {
  number: string
  title: string
  description: string
}

type UseCaseLandingProps = {
  eyebrow: string
  title: string
  lead: string
  heroImage: string
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
  eyebrow,
  title,
  lead,
  heroImage,
  introTitle,
  introBody,
  points,
  steps,
  secondaryImage,
  secondaryAlt,
  ctaTitle,
  ctaBody,
}: UseCaseLandingProps) {
  return (
    <>
      <Nav />

      <main>
        <section className="relative min-h-[86vh] flex items-end overflow-hidden">
          <Image src={heroImage} alt={title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-p3/85 via-p3/35 to-p3/10" />
          <div className="relative z-10 max-w-7xl w-full mx-auto px-8 md:px-16 pb-20 md:pb-28 pt-32">
            <p className="font-serif-en text-s2 text-xs tracking-[0.45em] uppercase mb-6">{eyebrow}</p>
            <h1 className="font-serif-ja font-semibold text-4xl md:text-7xl text-p1 leading-tight mb-8 max-w-4xl">
              {title}
            </h1>
            <p className="font-sans-ja text-sm md:text-base text-p1/80 leading-[2] max-w-2xl">{lead}</p>
          </div>
        </section>

        <section className="bg-p1 py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-8 md:px-16 text-center">
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] uppercase mb-8">Why This Standard</p>
            <h2 className="font-serif-ja text-3xl md:text-5xl text-p2 leading-snug mb-10">{introTitle}</h2>
            <p className="font-sans-ja text-sm text-n1 leading-[2.1] max-w-3xl mx-auto">{introBody}</p>
          </div>
        </section>

        <section className="bg-p2 py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid md:grid-cols-3 gap-px bg-s2/20 border border-s2/20">
              {points.map((point) => (
                <article key={point.label} className="bg-p2 p-8 md:p-10">
                  <p className="font-serif-en text-s2 text-xs tracking-[0.35em] uppercase mb-8">{point.label}</p>
                  <h3 className="font-serif-ja text-2xl text-p1 mb-6">{point.title}</h3>
                  <p className="font-sans-ja text-sm text-n1 leading-[1.9]">{point.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-p1">
          <div className="grid md:grid-cols-2 min-h-[620px]">
            <div className="relative min-h-[420px] md:min-h-full">
              <Image src={secondaryImage} alt={secondaryAlt} fill className="object-cover" />
            </div>
            <div className="px-8 md:px-16 py-20 md:py-28 flex flex-col justify-center">
              <p className="font-serif-en text-s2 text-xs tracking-[0.4em] uppercase mb-10">How to Choose</p>
              <div className="space-y-10">
                {steps.map((step) => (
                  <div key={step.number} className="grid grid-cols-[56px_1fr] gap-5 border-t border-s2/30 pt-7">
                    <span className="font-serif-en text-3xl text-s2 font-light">{step.number}</span>
                    <div>
                      <h3 className="font-serif-ja text-xl text-p2 mb-3">{step.title}</h3>
                      <p className="font-sans-ja text-sm text-n1 leading-[1.9]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/guide/size" className="mt-12 inline-block text-xs tracking-[0.25em] text-p2 border-b border-s2 pb-2 w-fit">
                サイズ・商品の選び方を見る
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-p3 py-28 md:py-36">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] uppercase mb-8">Find Your Bowl</p>
            <h2 className="font-serif-ja text-3xl md:text-5xl text-p1 leading-snug mb-8">{ctaTitle}</h2>
            <p className="font-sans-ja text-sm text-n1 leading-[2] max-w-2xl mx-auto mb-10">{ctaBody}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop" className="bg-s2 text-p3 px-10 py-4 text-xs tracking-[0.25em] hover:bg-p1 transition-colors">
                商品を見る
              </Link>
              <Link href="/contact" className="border border-s2/50 text-p1 px-10 py-4 text-xs tracking-[0.25em] hover:border-s2 transition-colors">
                選び方を相談する
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-p3 border-t border-s2/20">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLockup tone="dark" markSize={34} wordmarkClassName="text-sm" />
          <p className="font-sans-ja text-n1 text-xs tracking-wide">
            © {new Date().getFullYear()} THE WAN STANDARD. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
