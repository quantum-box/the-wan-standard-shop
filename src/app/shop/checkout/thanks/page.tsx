import Link from "next/link";

// PET-739: swap after PdM-Pet return (CEO 確認値)
const STORE_TEL = "TEL_TBD";
const STORE_HOURS = "HOURS_TBD";

export default function ThanksPage() {
  return (
    <div className="text-center py-16">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">
        Thank You
      </h1>
      <p className="text-sm text-n1 mb-8">
        ご注文ありがとうございます。
      </p>

      <section
        aria-label="注文履歴・受取に関するお問い合わせ"
        className="max-w-md mx-auto mb-10 p-5 border border-s2 bg-p1 text-left"
      >
        <p className="text-sm text-p2 font-medium mb-2">
          注文履歴・受取に関するお問い合わせ
        </p>
        <p className="text-xs text-n1 leading-relaxed mb-3">
          注文履歴・受取に関するお問い合わせは、店舗までお電話ください。
        </p>
        <dl className="text-xs text-n1 space-y-1">
          <div className="flex gap-2">
            <dt className="flex-shrink-0 w-16">電話</dt>
            <dd>
              <a href={`tel:${STORE_TEL}`} className="text-p2 underline">
                {STORE_TEL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="flex-shrink-0 w-16">営業時間</dt>
            <dd>{STORE_HOURS}</dd>
          </div>
        </dl>
      </section>

      <Link
        href="/shop"
        className="text-sm text-p2 hover:text-s1 underline transition-colors"
      >
        ショップに戻る
      </Link>
    </div>
  );
}
