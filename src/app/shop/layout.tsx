import { PageShell } from '@/components/ui/PageShell'
import { PurchaseProgress } from '@/components/ui/PurchaseProgress'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <PageShell variant="commerce"><PurchaseProgress />{children}</PageShell>
}
