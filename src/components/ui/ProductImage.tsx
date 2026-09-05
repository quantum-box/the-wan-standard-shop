'use client'

import Image from 'next/image'
import { useState } from 'react'
import styles from './storefront.module.css'

/** Catalog photos only: never substitute a lifestyle photo for an actual product. */
export function ProductImage({ src, name, sizes, priority = false }: { src: string | null; name: string; sizes: string; priority?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (!src || src === failedSrc) return <div className={styles.noImage}>商品画像準備中</div>
  return <Image src={src} alt={name} fill unoptimized sizes={sizes} priority={priority} onError={() => setFailedSrc(src)} />
}
