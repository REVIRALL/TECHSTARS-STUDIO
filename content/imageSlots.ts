/**
 * TechStars — 画像スロット定義（正本）
 * ============================================================================
 * サイト内の「画像に置き換える枠」をすべてここで一元管理する。
 *
 * 使い方:
 *   1. このファイルの prompt をコピーして GPT / Midjourney 等で画像を作る
 *   2. できた画像を `public/img/<slot の src と同じ名前>` に置く
 *   3. 何もコードを触らなくてよい。画像が存在すれば ImageFrame が自動で表示に切り替わる
 *      （存在しない間はプロンプト入りのプレースホルダー枠が出る）
 *
 * 生成の手順・書き出し設定は docs/IMAGE_GENERATION.md を参照。
 * ブラウザで `?prompts=1` を付けると全プロンプトの一覧コンソールが開く。
 */

export type Device = 'desktop' | 'mobile';

export interface ImageVariant {
  /** public/ からのパス。ここにファイルを置けば自動で表示に切り替わる */
  src: string;
  /** 生成すべき最小ピクセルサイズ */
  width: number;
  height: number;
  /** '16:9' など。プレースホルダーの箱の縦横比にも使う */
  aspect: string;
  /**
   * 実際に public/img/ に置くときの横幅の上限（px）。
   * 実ブラウザで測ったレイアウト上の表示幅 × 2（Retina）から決めている。
   * これを超える画像は `npm run img` が縮小する。width/height は
   * 「生成時に確保しておきたい最小サイズ」なので別物。
   */
  deliverWidth: number;
  /** コピーしてそのまま画像生成AIに貼れる完成プロンプト（英語） */
  prompt: string;
}

export interface ImageSlot {
  /** 一意ID。プレースホルダーにも表示されるので、どの枠か画面から特定できる */
  id: string;
  /** 日本語のラベル（プレースホルダー表示用） */
  label: string;
  /** どのセクションの画像か */
  section: string;
  /** この画像が担う役割・意図（日本語1〜2行） */
  role: string;
  /** alt 属性。SEO・アクセシビリティのため必ず書く */
  alt: string;
  desktop: ImageVariant;
  /** 省略時はデスクトップ画像をモバイルでもそのまま使う（正方形・カード系はこれでよい） */
  mobile?: ImageVariant;
  /** 装飾画像で、読み上げ不要な場合 true（alt="" になる） */
  decorative?: boolean;
}

/* ==========================================================================
 * 共通のアートディレクション
 * 全プロンプトの末尾に同じ文言で埋め込まれる。ここを直せば全画像のトーンが揃う。
 *
 * ★2026-11-16 明るい版に替えた（ユーザー「トップページもうちょい明るい人物系にしたいかも。暗いから」
 *   「２で。他の全セクションも明るい系に。」）。手本は designs/lp-stats/variants/2-section-fv/v2.png
 *   （明るいコワーキングで講師と受講生が1台の画面をのぞき込んで笑う写真）。
 *   区画ごとの写真は designs/lp-bright/sections/*.png（GPT に描かせた区画の絵）の同じ場所を切って参照に渡し、
 *   字を抜いて描き直させた物（designs/lp-bright/gen_photos.py・slots.json・slots2.json）。
 * ========================================================================== */

const ART_DIRECTION = `- Palette: bright and airy. White and very pale sky-blue (#F1F8FC) dominate, warm light wood, fresh green plants, soft daylight. Accent color is a clear sky cyan (#14B4EA) only in small touches. No dark or moody grading.
- Mood: a real, warm Japanese co-working space or bright office. Friendly, confident, hopeful. Real people actually working and learning together.
- Light: soft natural window light from the side, gentle bloom, high-key exposure, soft shadows. Blacks never crushed.
- People: real-looking Japanese working adults in their 20s–50s, mixed genders, natural skin texture with pores, natural asymmetry, relaxed genuine expressions. Do NOT make "a black-haired man in profile facing a laptop" the main subject.
- Lens: 35mm or 50mm photography, shallow depth of field, background softly blurred. Photo, not CGI, not illustration.`;

const DO_NOT = `text, letters, words, numbers, kanji, hiragana, katakana, captions, logos, brand marks, watermarks, UI labels, readable code on screens, dark background, night, neon, cyberpunk, sci-fi hologram, black void, CGI render, illustration, cartoon, anime, plastic skin, perfectly symmetrical faces, deformed hands, extra fingers, cluttered composition`;

const MJ_NO = `text, letters, watermark, logo, neon, dark, cgi, illustration`;

interface VariantSeed {
  size: [number, number];
  aspect: string;
  /** 配信時の横幅上限。実測した表示幅 × 2 */
  deliver: number;
  subject: string;
  composition: string;
  /** テキストを載せるため暗く空けておく領域の指定 */
  safeArea?: string;
}

function compose(id: string, device: Device, v: VariantSeed): ImageVariant {
  const [width, height] = v.size;
  const src = `/img/${id.replace(/\./g, '-')}-${device}.webp`;

  const prompt = [
    `### TechStars — ${id} / ${device.toUpperCase()} / ${width}x${height}px (${v.aspect})`,
    ``,
    `## SUBJECT`,
    v.subject.trim(),
    ``,
    `## COMPOSITION & CAMERA`,
    v.composition.trim(),
    ...(v.safeArea
      ? [
          ``,
          `## TEXT SAFE AREA — this is a hard requirement`,
          `${v.safeArea.trim()} Keep that region bright, calm and softly out of focus (window light, plants, pale wall) with no people and no busy detail: website headline copy will be laid over it, so it must stay quiet.`,
        ]
      : []),
    ``,
    `## ART DIRECTION — follow exactly`,
    ART_DIRECTION,
    ``,
    `## DO NOT INCLUDE`,
    DO_NOT,
    ``,
    `## OUTPUT`,
    `Aspect ratio ${v.aspect}, at least ${width}x${height}px. Full-bleed image with no border, no frame, no matte, no drop shadow, no mockup device around it.`,
    ``,
    `## Midjourney params`,
    `--ar ${v.aspect.replace(':', ':')} --style raw --v 7 --no ${MJ_NO}`,
  ].join('\n');

  return { src, width, height, aspect: v.aspect, deliverWidth: v.deliver, prompt };
}

interface SlotSeed {
  id: string;
  label: string;
  section: string;
  role: string;
  alt: string;
  decorative?: boolean;
  desktop: VariantSeed;
  mobile?: VariantSeed;
}

function slot(s: SlotSeed): ImageSlot {
  return {
    id: s.id,
    label: s.label,
    section: s.section,
    role: s.role,
    alt: s.alt,
    decorative: s.decorative,
    desktop: compose(s.id, 'desktop', s.desktop),
    mobile: s.mobile ? compose(s.id, 'mobile', s.mobile) : undefined,
  };
}

/* ==========================================================================
 * スロット定義
 * ========================================================================== */

export const IMAGE_SLOTS: ImageSlot[] = [
  /* ---------------------------------------------------------------- HERO */
  slot({
    id: 'hero.backdrop',
    label: 'ヒーロー写真',
    section: 'HERO',
    role: 'ファーストビュー全面の写真。明るいコワーキングで講師と受講生が1台の画面をのぞき込んで笑う（マンツーマン指導の実感）。見出しが乗るので左側（スマホは上側）は明るく空ける。正本は designs/lp-stats/variants/2-section-fv/v2.png。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1536, 864],
      aspect: '16:9',
      deliver: 1920,
      subject: `A bright co-working corner. A Japanese woman instructor in a white blouse leans in and points at a silver laptop screen while a young Japanese man in a navy jacket and white T-shirt, chin on hand, smiles at the screen. Both are laughing naturally. A paper coffee cup on the light wood table, green plants and big windows softly blurred behind.`,
      composition: `Horizontal 16:9, 50mm, eye level. The two people sit in the RIGHT 55% of the frame. The bottom 25% is the table, hands and laptop.`,
      safeArea: `The LEFT 45% of the frame is bright, softly blurred window light and plants only.`,
    },
    mobile: {
      size: [864, 1536],
      aspect: '9:16',
      deliver: 1080,
      subject: `The same two people and the same scene as the desktop cut: the woman instructor pointing at the silver laptop and the young man smiling at it, in a bright co-working space with plants and big windows.`,
      composition: `Vertical 9:16, 50mm. The two people and the laptop sit in the BOTTOM half; their faces are 35-50% from the bottom.`,
      safeArea: `The TOP half of the frame is bright, softly blurred ceiling, window light and plants only.`,
    },
  }),

  /* -------------------------------------------------------- STUDIO MODEL */
  slot({
    id: 'model.legacy',
    label: '従来の学習（LEGACY）',
    section: 'WHY NOW',
    role: '「2〜3年かかる従来型の学習」。少しくすんだ調子で、右の AI 側と対比させる。',
    alt: '積み上がった本の横で、ノートPCを前に頭を抱える受講生',
    desktop: {
      size: [1536, 864],
      aspect: '16:9',
      deliver: 1300,
      subject: `A young Japanese man in a gray sweater sits at a desk with his hand in his hair, frustrated, in front of a laptop. A tall stack of thick technical books on the left, crumpled paper and a gray mug on the desk. A quiet, slightly desaturated room.`,
      composition: `Horizontal 16:9, 35mm, the man in the center, books on the left edge.`,
      safeArea: `The bottom-left corner stays calm (books and desk) because a large number is laid over it.`,
    },
  }),
  slot({
    id: 'model.ai',
    label: 'AI時代の学習（AI_DRIVEN）',
    section: 'WHY NOW',
    role: '「AI に指示を出して7日で作る」学び方。明るく手応えのある調子。',
    alt: '明るい窓辺で、ペンを手に笑顔で画面を見る受講生',
    desktop: {
      size: [1536, 864],
      aspect: '16:9',
      deliver: 1300,
      subject: `A Japanese woman in a white blouse with short hair smiles with a pen at her chin, looking up with confidence, a silver laptop in front of her, by a bright window with green plants.`,
      composition: `Horizontal 16:9, 50mm, the woman in the right half.`,
      safeArea: `The bottom-left corner is pale window light and plants only.`,
    },
  }),

  /* ------------------------------------------------------- FLOW 4 STEPS */
  slot({
    id: 'flow.01',
    label: 'STEP 01 PROMPT',
    section: 'HOW IT WORKS',
    role: '「何を作るか」を言語化する。ノートに書き出す手元。',
    alt: '明るい机でノートに作りたい物を書き出す手元',
    desktop: {
      size: [1280, 1024],
      aspect: '5:4',
      deliver: 720,
      subject: `A woman in a white shirt writes notes with a black pen in a spiral notebook on a light wood desk, a white mug beside her. Face partly out of frame; the hand and notebook are the subject.`,
      composition: `5:4, 50mm, slightly high angle.`,
    },
  }),
  slot({
    id: 'flow.02',
    label: 'STEP 02 GENERATE',
    section: 'HOW IT WORKS',
    role: 'AI がコードを生成する。画面に向かう手元（画面の中は読めない）。',
    alt: 'ノートPCのキーボードに手を置き、画面を見守る手元',
    desktop: {
      size: [1280, 1024],
      aspect: '5:4',
      deliver: 720,
      subject: `Hands on a silver laptop keyboard seen over the shoulder of a person in a navy jacket; the bright screen shows soft unreadable blocks. A white mug and plants on the desk.`,
      composition: `5:4, 35mm, over-the-shoulder.`,
    },
  }),
  slot({
    id: 'flow.03',
    label: 'STEP 03 DEBUG',
    section: 'HOW IT WORKS',
    role: 'エラーを AI に投げて直す。2人で画面を見て直す場面。',
    alt: '2人で1台のノートPCを見ながら一緒に直している場面',
    desktop: {
      size: [1280, 1024],
      aspect: '5:4',
      deliver: 720,
      subject: `Two young Japanese men, one seated in a navy shirt and one standing in a white shirt leaning in, solve something together on a laptop in a bright office.`,
      composition: `5:4, 35mm, both faces visible, the laptop on the right.`,
    },
  }),
  slot({
    id: 'flow.04',
    label: 'STEP 04 SHIP',
    section: 'HOW IT WORKS',
    role: '動くものを公開する。できあがって笑顔になる場面。',
    alt: 'ノートPCの前で、できあがりに笑顔になる受講生',
    desktop: {
      size: [1280, 1024],
      aspect: '5:4',
      deliver: 720,
      subject: `A Japanese woman with tied-back hair in a white top smiles happily at her silver laptop in a bright room with plants.`,
      composition: `5:4, 50mm, eye level, the woman centered.`,
    },
  }),

  /* --------------------------------------------------------- CURRICULUM */
  slot({
    id: 'curriculum.01',
    label: 'Day 1-2 Web制作',
    section: 'CURRICULUM',
    role: '右の窓のプレビュー（スマホは各カードの中）。教わりながら Web を作る場面。',
    alt: '講師が画面を指さし、受講生と一緒にノートPCで Web 制作を進める場面',
    desktop: {
      size: [1280, 1104],
      aspect: '8:7',
      deliver: 1120,
      subject: `A woman instructor with a lanyard leans in and points at a laptop while a woman student in a striped shirt smiles at the screen, in a bright co-working space.`,
      composition: `8:7, 50mm.`,
      safeArea: `The bottom-left corner stays calm because a label is laid over it.`,
    },
  }),
  slot({
    id: 'curriculum.02',
    label: 'Day 3-4 業務自動化',
    section: 'CURRICULUM',
    role: '右の窓のプレビュー。GAS・スプレッドシートの自動化を作る場面。',
    alt: '明るい部屋で、業務の自動化に取り組む受講生',
    desktop: {
      size: [1280, 1104],
      aspect: '8:7',
      deliver: 1120,
      subject: `A working adult builds an office automation on a laptop (spreadsheet and mail, nothing readable) in a bright room, a different person from curriculum.01.`,
      composition: `8:7, 50mm.`,
      safeArea: `The bottom-left corner stays calm because a label is laid over it.`,
    },
  }),
  slot({
    id: 'curriculum.03',
    label: 'Day 5-6 バックエンド',
    section: 'CURRICULUM',
    role: '右の窓のプレビュー。データベースとサーバーを作る場面。',
    alt: '明るい部屋で、データベースとサーバーの作り方を学ぶ受講生',
    desktop: {
      size: [1280, 1104],
      aspect: '8:7',
      deliver: 1120,
      subject: `A working adult learns to build a database and server with a mentor in a bright room, a different person from curriculum.01 and .02.`,
      composition: `8:7, 50mm.`,
      safeArea: `The bottom-left corner stays calm because a label is laid over it.`,
    },
  }),
  slot({
    id: 'curriculum.04',
    label: 'Day 7 卒業',
    section: 'CURRICULUM',
    role: '右の窓のプレビュー。作品を仕上げて発表し、仲間とつながる場面。',
    alt: '作品を仕上げて発表し、仲間と喜び合う受講生',
    desktop: {
      size: [1280, 1104],
      aspect: '8:7',
      deliver: 1120,
      subject: `Graduates present their finished work and celebrate with peers in a bright space.`,
      composition: `8:7, 50mm.`,
      safeArea: `The bottom-left corner stays calm because a label is laid over it.`,
    },
  }),

  /* ----------------------------------------------------------- SCHEDULE */
  ...[1, 2, 3, 4, 5, 6, 7].map((n) =>
    slot({
      id: `schedule.0${n}`,
      label: `学習スケジュール DAY 0${n}`,
      section: 'SCHEDULE',
      role: '学習スケジュールの上の写真の帯（7枚）。7枚とも別の人・別の場面で、同じ人を繰り返さない。',
      alt: '',
      decorative: true,
      desktop: {
        size: [640, 1104],
        aspect: '4:7',
        deliver: 400,
        subject: `One of seven portrait photos for a 7-day schedule: a different Japanese working adult (or hands) learning in a bright co-working space, smiling or focused. Never the same person as the other six.`,
        composition: `Vertical 4:7, 50mm, the face about one third from the top.`,
      },
    })
  ),

  /* ------------------------------------------------------------ PRICING */
  slot({
    id: 'pricing.header',
    label: '料金プランの見出しの写真',
    section: 'PRICING',
    role: '料金プランの見出しの右上に溶かして敷く写真。相談している明るい場面。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1536, 512],
      aspect: '3:1',
      deliver: 1536,
      subject: `A smiling Japanese woman in a white blouse talks with another woman (seen from behind) across a table in a bright office with plants.`,
      composition: `Wide 3:1, 50mm. The people sit in the RIGHT half.`,
      safeArea: `The LEFT half is bright, softly blurred window and plants only.`,
    },
  }),

  /* --------------------------------------------------------------- TEAM */
  slot({
    id: 'outcome.01',
    label: 'できること 01 Webサイト制作',
    section: 'OUTPUT',
    role: 'できることのカードの写真。',
    alt: 'ノートPCで Web サイトを作る手元',
    desktop: {
      size: [1024, 1072],
      aspect: '20:21',
      deliver: 680,
      subject: `Hands typing on a laptop whose screen shows soft unreadable code blocks, on a light wood desk with a small plant, bright window light.`,
      composition: `Near-square, 35mm.`,
    },
  }),
  slot({
    id: 'outcome.02',
    label: 'できること 02 業務自動化',
    section: 'OUTPUT',
    role: 'できることのカードの写真。',
    alt: '表計算の画面を指さして集計を確かめる手元',
    desktop: {
      size: [1024, 1072],
      aspect: '20:21',
      deliver: 680,
      subject: `A hand points at a laptop screen showing a soft spreadsheet with bar charts (nothing readable), a pen and notebook on the desk, bright light.`,
      composition: `Near-square, 35mm.`,
    },
  }),
  slot({
    id: 'outcome.03',
    label: 'できること 03 案件獲得',
    section: 'OUTPUT',
    role: 'できることのカードの写真。',
    alt: '打ち合わせで提案を説明する受講生',
    desktop: {
      size: [1024, 1072],
      aspect: '20:21',
      deliver: 680,
      subject: `A young Japanese man in a navy jacket explains a proposal with an open hand to a client (seen from behind) across a table with a laptop, smiling, bright meeting room.`,
      composition: `Near-square, 50mm.`,
    },
  }),
  slot({
    id: 'outcome.04',
    label: 'できること 04 コミュニティ',
    section: 'OUTPUT',
    role: 'できることのカードの写真。',
    alt: '仲間と笑顔で話す卒業生',
    desktop: {
      size: [1024, 1072],
      aspect: '20:21',
      deliver: 680,
      subject: `A smiling Japanese woman in a striped shirt talks with peers around a table with laptops and a tablet, a friendly community moment, bright room.`,
      composition: `Near-square, 50mm.`,
    },
  }),

  /* ------------------------------------------- 円と曲線の版（2026-11-17） */
  /* 依頼主「クリエイティブさが一切ないのもよくない。斜めだったり他の形だったり欲しい。デザインが単調」→ 組み方は「円と曲線」。
     区画ごとに GPT に描かせた絵（LMS 側 designs/lp-creative/sections/*-pc.png）にあって、前の LP に無かった丸い写真。
     絵の同じ場所を切って参照に渡し、字を抜いて写真として描き直させた（designs/lp-creative/gen_photos.py）。 */
  ...([
    ['curriculum.desk', 'カリキュラムの表の横の丸い写真', 'CURRICULUM', '机の上のノートPCと観葉植物', 840, `A laptop open on a light wood desk with a white mug, a notebook and a potted plant, no people.`],
    ['outcome.web', '7日間で作る物 Webサイト', 'OUTPUT', 'Webサイトの画面のノートPCで作業する手元', 560, `Hands typing on a laptop whose screen shows a soft, unreadable website layout.`],
    ['outcome.app', '7日間で作る物 Webアプリ', 'OUTPUT', 'Webアプリの管理画面のノートPCで作業する手元', 560, `Hands typing on a laptop whose screen shows a soft, unreadable web app dashboard with a side menu.`],
    ['after.community', '終わったあとに使える物 コミュニティ', 'OUTPUT', '並んで座り笑顔で話す2人', 440, `A smiling woman and a man sitting side by side and talking in a bright room.`],
    ['after.lms', '終わったあとに使える物 LMSの教材', 'OUTPUT', '教材の画面のノートPC', 440, `A laptop on a desk showing a soft, unreadable video lesson page.`],
    ['cta.person', '呼びかけの丸い写真', 'CONTACT', '', 1024, `A woman resting her hand on her chin, listening and laughing in a bright room, a small plant in front.`],
    ['footer.person', '下の帯の丸い写真', 'FOOTER', '', 680, `A woman smiling and looking slightly up in front of a laptop by a bright window.`],
  ] as const).map(([id, label, section, alt, deliver, subject]) =>
    slot({
      id,
      label,
      section,
      role: '円と曲線の版の丸い写真（丸く切り抜いて置く）。',
      alt,
      decorative: alt === '',
      desktop: { size: [1024, 1024], aspect: '1:1', deliver, subject, composition: `Square 1:1, 50mm, the subject in the center (it is cropped to a circle).` },
    })
  ),
  ...[1, 2, 3, 4, 5, 6].map((n) =>
    slot({
      id: `target.0${n}`,
      label: `こういう人向け 0${n} の顔写真`,
      section: 'CONTACT',
      role: 'こういう人向けの札の左の丸い顔写真（考える表情）。6人とも別の人。',
      alt: '',
      decorative: true,
      desktop: {
        size: [1024, 1024],
        aspect: '1:1',
        deliver: 320,
        subject: `A Japanese working adult with a thoughtful expression, hand near the chin, chest-up, in a bright office. Never the same person as the other five.`,
        composition: `Square 1:1, 50mm, the face in the center (it is cropped to a small circle).`,
      },
    })
  ),

  /* ------------------------------------------------------------ CONTACT */
  slot({
    id: 'contact.cta',
    label: 'お問い合わせの写真（君も、星になれ。）',
    section: 'CONTACT',
    role: 'サイトの最後の締め。明るいオフィスで笑い合う人たち。左（スマホは上）に見出しが乗る。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1536, 864],
      aspect: '16:9',
      deliver: 1920,
      subject: `A woman with short hair laughs brightly at a table with coffee and a laptop; a man in his 40s and another woman laugh with her, in a bright office with big windows and plants.`,
      composition: `Horizontal 16:9, 50mm, the people from the center to the right.`,
      safeArea: `The LEFT 40% is bright, softly blurred window light only.`,
    },
    mobile: {
      size: [864, 1088],
      aspect: '4:5',
      deliver: 1080,
      subject: `The same scene recomposed vertically: the laughing woman with short hair is the main subject.`,
      composition: `Vertical 4:5, 50mm. The people in the BOTTOM half.`,
      safeArea: `The TOP half is bright, softly blurred window light only.`,
    },
  }),

  /* ------------------------------------------------------- BACKGROUND */
  slot({
    id: 'section.glow',
    label: '区画の地の淡い光',
    section: 'BACKGROUND',
    role: '各区画の地に薄く敷く光（styles.css の .lp-glow）。最初の画面の写真を強くぼかして白に寄せた物で、生成はしない。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1600, 900],
      aspect: '16:9',
      deliver: 1600,
      subject: `(Not generated.) The hero photo blurred with a 48px Gaussian blur, saturation 0.75, blended 62% toward white.`,
      composition: `Same framing as hero.backdrop desktop.`,
    },
  }),
];

/* ==========================================================================
 * ヘルパー
 * ========================================================================== */

const BY_ID: Record<string, ImageSlot> = Object.fromEntries(
  IMAGE_SLOTS.map((s) => [s.id, s])
);

export function getSlot(id: string): ImageSlot | undefined {
  return BY_ID[id];
}

/** モバイル用が定義されていなければデスクトップ用を返す */
export function variantFor(slotDef: ImageSlot, device: Device): ImageVariant {
  return device === 'mobile' ? slotDef.mobile ?? slotDef.desktop : slotDef.desktop;
}

/** セクション見出しごとにまとめた一覧（プロンプトコンソール用） */
export function slotsBySection(): { section: string; slots: ImageSlot[] }[] {
  const order: string[] = [];
  const map = new Map<string, ImageSlot[]>();
  for (const s of IMAGE_SLOTS) {
    if (!map.has(s.section)) {
      map.set(s.section, []);
      order.push(s.section);
    }
    map.get(s.section)!.push(s);
  }
  return order.map((section) => ({ section, slots: map.get(section)! }));
}
