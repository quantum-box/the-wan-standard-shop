export function Footer() {
  return (
    <footer className="border-t border-s2 bg-p1 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-n1">
            &copy; {new Date().getFullYear()} The Wan Standard
          </p>
          <nav className="flex gap-6">
            <a href="https://thewanstandard.jp/legal/tokusho" className="text-sm text-n1 hover:text-p2">
              特定商取引法に基づく表記
            </a>
            <a href="https://thewanstandard.jp/legal/privacy" className="text-sm text-n1 hover:text-p2">
              プライバシーポリシー
            </a>
            <a href="https://thewanstandard.jp/legal/terms" className="text-sm text-n1 hover:text-p2">
              利用規約
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
