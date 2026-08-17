import React from 'react';
import { Shield, FileText, BarChart3, Database, Check } from 'lucide-react';
import { BUILD_DAY, COURSE, FAQS, ORG } from '../../content/site';

/**
 * 料金 / FAQ / 法務ページの本文
 * ============================================================================
 * 同じ内容を2箇所から使う:
 *   - トップのオーバーレイ（FixedPageOverlay）— 従来どおりのUX
 *   - 実URLを持つ単独ページ（StandalonePage）— クロールと被リンクのため
 *
 * どちらから使われるかで見出しの階層が変わるので、`level` で h1 / h2 を切り替える。
 * 単独ページでは h1、オーバーレイでは（トップの h1 と衝突しないよう）h2 になる。
 */

export interface PageContentProps {
  /** 1 = 単独ページ（h1）, 2 = オーバーレイ（h2） */
  level?: 1 | 2;
}

const Title: React.FC<{ level: 1 | 2; className?: string; children: React.ReactNode }> = ({
  level,
  className,
  children,
}) => (level === 1 ? <h1 className={className}>{children}</h1> : <h2 className={className}>{children}</h2>);

/** 見出しの飛び（h1 → h3）を作らないための小見出し。level に追従する */
const Sub: React.FC<{ level: 1 | 2; className?: string; children: React.ReactNode }> = ({
  level,
  className,
  children,
}) => (level === 1 ? <h2 className={className}>{children}</h2> : <h3 className={className}>{children}</h3>);

const Updated: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`text-xs text-slate-500 ${className}`}>
    最終更新日: <time dateTime={BUILD_DAY}>{BUILD_DAY.replace(/-/g, '年').replace(/年(\d+)$/, '月$1日')}</time>
  </p>
);

/* ══════════════════════════════ 料金プラン ══════════════════════════════ */

export const PricingContent: React.FC<PageContentProps> = ({ level = 1 }) => (
  <div className="animate-slide-up">
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-8 mb-12 gap-4">
      <Title level={level} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] font-black jp-display">
        料金プラン
      </Title>
      <div className="text-left md:text-right font-mono text-xs">
        <p>{COURSE.durationLabel}プログラム</p>
        <p>{COURSE.mode} / 日本全国</p>
        <p>受付中</p>
      </div>
    </div>

    <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
      <div className="lg:col-span-7">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl md:text-2xl font-bold leading-relaxed mb-8">
            {COURSE.durationLabel}で、次世代エンジニアへ。
            <br />
            <span className="bg-brand-200 px-1">AIを相棒にした開発スキル</span>を習得します。
          </p>
          <p className="text-slate-600 leading-relaxed mb-8 font-medium">
            {COURSE.mode}のプログラム。経験豊富な講師陣によるマンツーマンサポートで、
            未経験からでも確実にスキルを身につけることができます。
          </p>

          <Sub level={level} className="text-lg font-black mb-4">受講後にできるようになること</Sub>
          <ul className="space-y-3 mb-12">
            {COURSE.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-slate-700">
                <Check className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm md:text-base leading-relaxed">{o}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 border border-slate-200 shadow-sm hover:border-brand-500 transition-colors">
              <BarChart3 className="w-8 h-8 text-brand-500 mb-4" aria-hidden="true" />
              <p className="font-black text-lg mb-2">{COURSE.durationLabel}集中</p>
              <p className="text-sm text-slate-500">短期集中でスキル習得</p>
            </div>
            <div className="bg-white p-6 border border-slate-200 shadow-sm hover:border-brand-500 transition-colors">
              <Database className="w-8 h-8 text-brand-500 mb-4" aria-hidden="true" />
              <p className="font-black text-lg mb-2">実践スキル</p>
              <p className="text-sm text-slate-500">実務で即使えるスキル</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-white border-2 border-black p-1 relative">
          <div className="border border-slate-200 p-6">
            <Sub level={level} className="font-mono text-xs font-bold text-slate-400 mb-6 tracking-widest border-b border-slate-100 pb-2">
              // プログラム詳細
            </Sub>
            <dl className="space-y-6 font-mono text-sm">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">期間</dt>
                <dd className="sm:col-span-2 font-bold">{COURSE.durationLabel}（講座+自習）</dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">形式</dt>
                <dd className="sm:col-span-2 font-bold">{COURSE.mode}</dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">サポート</dt>
                <dd className="sm:col-span-2 font-bold">マンツーマンメンタリング</dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">受講料</dt>
                <dd className="sm:col-span-2">
                  <span className="font-bold text-brand-600 text-lg">
                    {COURSE.price.toLocaleString('ja-JP')}円
                  </span>
                  <span className="text-xs text-slate-500 ml-1">+税</span>
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">別途</dt>
                <dd className="sm:col-span-2 text-xs text-slate-600">{COURSE.extras}</dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">お支払方法</dt>
                <dd className="sm:col-span-2 text-xs text-slate-600">クレジットカード決済、銀行振込</dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-slate-500">特典</dt>
                <dd className="sm:col-span-2 font-bold">
                  学習サポートツール＆専用サイト2ヶ月無料
                  <br />
                  卒業証明書発行
                  <br />
                  卒業生コミュニティ永久参加権
                </dd>
              </div>
            </dl>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-[10px] text-center text-slate-400">プログラムID: {COURSE.programId}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500 leading-relaxed">
          販売業者: {ORG.legalName}／お問い合わせ:{' '}
          <a href={`mailto:${ORG.email}`} className="text-brand-600 underline underline-offset-2">
            {ORG.email}
          </a>
        </p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════ FAQ ══════════════════════════════ */

export const FaqContent: React.FC<PageContentProps> = ({ level = 1 }) => (
  <div className="animate-slide-up">
    <div className="mb-16">
      <p className="inline-block bg-black text-white px-3 py-1 font-mono text-xs font-bold mb-4">FAQ</p>
      <Title level={level} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-black jp-display mb-8">
        よくある
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600 pb-1 inline-block">
          質問
        </span>
      </Title>
      <p className="text-xl font-bold max-w-2xl text-slate-700">
        {ORG.brand}の{COURSE.shortName}に寄せられる質問をまとめました。
        <br />
        その他のご質問は{' '}
        <a href={`mailto:${ORG.email}`} className="text-brand-600 underline underline-offset-4">
          {ORG.email}
        </a>{' '}
        までお問い合わせください。
      </p>
    </div>

    {/* itemscope を書かずとも JSON-LD 側で FAQPage を宣言済み。ここは可読性を優先する */}
    <div className="space-y-4">
      {FAQS.map((item) => (
        <article key={item.q} className="group relative bg-white border border-slate-200 p-4 md:p-8 hover:border-black transition-all">
          <Sub level={level} className="text-base md:text-xl font-black mb-4 group-hover:text-brand-600 transition-colors">
            {item.q}
          </Sub>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{item.a}</p>
        </article>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════ プライバシーポリシー ══════════════════════════════ */

export const PrivacyContent: React.FC<PageContentProps> = ({ level = 1 }) => (
  <div className="animate-slide-up max-w-3xl">
    <div className="mb-4 flex items-center gap-4 text-brand-500">
      <Shield className="w-8 h-8 md:w-12 md:h-12 shrink-0" aria-hidden="true" />
      <Title level={level} className="text-2xl md:text-4xl font-black jp-display text-white">
        プライバシーポリシー
      </Title>
    </div>
    <Updated className="mb-12" />

    <div className="space-y-10 text-sm leading-relaxed">
      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">1. 個人情報の定義</Sub>
        <p className="opacity-80">
          「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
        </p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">2. 個人情報の収集方法</Sub>
        <p className="opacity-80">
          当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下、「提携先」といいます。）などから収集することがあります。
        </p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">3. 個人情報を収集・利用する目的</Sub>
        <ul className="opacity-80 list-disc list-inside space-y-2">
          <li>当社サービスの提供・運営のため</li>
          <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
          <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
          <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
          <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
          <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
          <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
          <li>上記の利用目的に付随する目的</li>
        </ul>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">4. 利用目的の変更</Sub>
        <p className="opacity-80">
          当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
        </p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">5. 個人情報の第三者提供</Sub>
        <p className="opacity-80 mb-4">
          当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
        </p>
        <ul className="opacity-80 list-disc list-inside space-y-2">
          <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
          <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
          <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
        </ul>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">6. お問い合わせ窓口</Sub>
        <p className="opacity-80">
          本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
          <br />
          <br />
          <span className="text-white">{ORG.legalName}</span>
          <br />
          Eメールアドレス:{' '}
          <a href={`mailto:${ORG.email}`} className="text-brand-500 underline underline-offset-4">
            {ORG.email}
          </a>
        </p>
      </section>

      <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500">
        <p>© 2026 {ORG.englishName} All rights reserved.</p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════ 利用規約 ══════════════════════════════ */

export const TermsContent: React.FC<PageContentProps> = ({ level = 1 }) => (
  <div className="animate-slide-up max-w-3xl">
    <div className="mb-4 flex items-center gap-4 text-brand-500">
      <FileText className="w-8 h-8 md:w-12 md:h-12 shrink-0" aria-hidden="true" />
      <Title level={level} className="text-2xl md:text-4xl font-black jp-display text-white">
        利用規約
      </Title>
    </div>
    <Updated className="mb-12" />

    <div className="space-y-10 text-sm leading-relaxed">
      <p className="opacity-80">
        本規約は「{ORG.legalName}」（以下「当社」）が提供するウェブサービスの利用条件を定めるものです。ユーザーは本規約に従ってサービスを利用するものとします。
      </p>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第1条（適用）</Sub>
        <p className="opacity-80">本規約は、ユーザーと当社との間のすべての関係に適用されます。</p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第2条（利用登録）</Sub>
        <p className="opacity-80">
          登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
        </p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第3条（利用料金）</Sub>
        <p className="opacity-80">ユーザーは、当社が指定する方法により利用料金を支払う義務を負います。</p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第4条（禁止事項）</Sub>
        <p className="opacity-80 mb-4">ユーザーは、以下の行為をしてはなりません。</p>
        <ul className="opacity-80 list-disc list-inside space-y-2">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
          <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
          <li>他のユーザーに成りすます行為</li>
          <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ul>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第5条（サービス提供の停止）</Sub>
        <p className="opacity-80">
          当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなくサービスの全部または一部の提供を停止または中断することができるものとします。
        </p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第6条（免責事項）</Sub>
        <p className="opacity-80">
          当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。
        </p>
      </section>

      <section>
        <Sub level={level} className="text-white font-bold mb-4 text-lg">第7条（準拠法・裁判管轄）</Sub>
        <p className="opacity-80">
          本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社本店所在地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </section>

      <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500">
        <p>© 2026 {ORG.englishName} All rights reserved.</p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════ 特定商取引法 ══════════════════════════════ */

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: '販売業者', value: ORG.legalName },
  { label: '運営統括責任者', value: ORG.representative },
  { label: '所在地', value: ORG.address },
  {
    label: '電話番号',
    value: (
      <a href={ORG.telUri} className="underline underline-offset-4 hover:text-brand-500">
        {ORG.tel}
      </a>
    ),
  },
  {
    label: 'メールアドレス',
    value: (
      <a href={`mailto:${ORG.email}`} className="underline underline-offset-4 hover:text-brand-500">
        {ORG.email}
      </a>
    ),
  },
  {
    label: '販売価格',
    value: `${COURSE.name} ${COURSE.price.toLocaleString('ja-JP')}円（${COURSE.priceNote}）`,
  },
  { label: '商品代金以外の必要料金', value: `消費税、銀行振込手数料（銀行振込の場合）、${COURSE.extras}` },
  { label: 'お支払方法', value: 'クレジットカード決済、銀行振込' },
  {
    label: 'お支払時期',
    value: (
      <>
        クレジットカード: 各カード会社の引き落とし日
        <br />
        銀行振込: お申し込みから7日以内
      </>
    ),
  },
  { label: '役務の提供時期', value: '決済完了後、直ちにご利用いただけます' },
  {
    label: '返品・キャンセルについて',
    value:
      'デジタルコンテンツの性質上、決済完了後の返品・キャンセルはお受けしておりません。ただし、商品に欠陥がある場合はこの限りではありません。',
  },
];

export const TokushohoContent: React.FC<PageContentProps> = ({ level = 1 }) => (
  <div className="animate-slide-up max-w-3xl">
    <div className="mb-4 flex items-center gap-4 text-brand-500">
      <FileText className="w-8 h-8 md:w-12 md:h-12 shrink-0" aria-hidden="true" />
      <Title level={level} className="text-2xl md:text-4xl font-black jp-display text-white">
        特定商取引法に基づく表記
      </Title>
    </div>
    <Updated className="mb-12" />

    <dl className="space-y-6 text-sm leading-relaxed">
      {ROWS.map((row) => (
        <div key={row.label} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800 pb-6">
          <dt className="text-slate-500">{row.label}</dt>
          <dd className="md:col-span-2 text-white">{row.value}</dd>
        </div>
      ))}
    </dl>

    <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500">
      <p>© 2026 {ORG.englishName} All rights reserved.</p>
    </div>
  </div>
);
