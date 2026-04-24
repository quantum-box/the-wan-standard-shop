export function Footer() {
  return (
    <footer className="border-t border-s2 bg-p1 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-n1">
            &copy; {new Date().getFullYear()} THE WAN STANDARD
          </p>
          <nav className="flex gap-6">
            <a href="/legal/terms" className="text-sm text-n1 hover:text-p2">
              利用規約
            </a>
            <a href="/legal/privacy" className="text-sm text-n1 hover:text-p2">
              プライバシーポリシー
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
