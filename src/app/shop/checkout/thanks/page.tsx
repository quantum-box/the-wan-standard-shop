import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="text-center py-16">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">
        Thank You
      </h1>
      <p className="text-sm text-n1 mb-2">
        ご注文ありがとうございます。
      </p>
      <p className="text-sm text-n1 mb-8">
        確認メールをお送りします。しばらくお待ちください。
      </p>
      <Link
        href="/shop"
        className="text-sm text-p2 hover:text-s1 underline transition-colors"
      >
        ショップに戻る
      </Link>
    </div>
  );
}
