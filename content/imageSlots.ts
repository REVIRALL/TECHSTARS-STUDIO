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
 * ========================================================================== */

const ART_DIRECTION = `- Palette: strictly monochrome near-black (#050507 base, #0A0C10 midtones) with ONE accent color, electric cyan #00E5FF. A cold steel-blue #16384A may appear as a secondary shadow tone. No other hue is allowed.
- Mood: high-end cyberpunk tech editorial. Engineered, precise, expensive, quiet. NOT 80s retrowave, NOT neon-soaked Blade Runner street, NOT cartoon.
- Light: one directional cyan key light plus a cyan rim light. Volumetric haze catching the beams. Deep, clean falloff to true black at the frame edges. Subtle bloom on the brightest cyan only.
- Materials: matte black anodized metal, black micro-etched glass, brushed graphite, wet black stone. Physically based, believable reflections.
- Texture: fine 35mm film grain, very faint horizontal scanline, slight chromatic aberration in the outer 10% of the frame.
- Render: photoreal CGI, Octane/Redshift quality, 8k detail, 35mm or 50mm lens, shallow depth of field, cinematic color grade with lifted blacks kept below 6% luminance.
- Negative space is a feature. At least 40% of the frame should be near-empty black. Never fill the whole frame with detail.`;

const DO_NOT = `text, letters, words, numbers, kanji, hiragana, katakana, chinese characters, captions, subtitles, logos, brand marks, watermarks, signatures, UI labels, menu bars, readable code, lorem ipsum, purple, magenta, violet, orange, red, green, yellow, rainbow neon, pink glow, warm light, daylight, white background, low resolution, jpeg artifacts, oversaturation, HDR halos, clip-art, cartoon, anime, illustration, flat vector, clay 3d render, stock-photo people smiling at camera, recognizable faces, deformed hands, extra fingers, cluttered composition, visual noise, busy background`;

const MJ_NO = `text, letters, watermark, logo, purple, magenta, orange, faces, hands`;

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
          `${v.safeArea.trim()} Keep that region almost pure black, out of focus and free of any bright element: website headline copy will be laid over it, so contrast there must stay high.`,
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
    label: 'ヒーロー背景',
    section: 'HERO',
    role: 'ファーストビュー全面の背景。サイトの第一印象を決める最重要カット。見出しが乗るので左側（モバイルは上側）は暗く空ける。',
    alt: '',
    decorative: true,
    desktop: {
      size: [2880, 1620],
      aspect: '16:9',
      deliver: 1920,
      subject: `A colossal dark hall — a "cathedral of computation". A single human figure, seen from behind as a pure black silhouette, stands small in the lower right, facing away from camera. In front of the figure, a towering curved wall of translucent holographic panels made of cyan light rises and curves overhead; the panels carry abstract geometric data structures — grids, nodes, connection lines, wireframe blocks — never anything readable. The floor is polished wet black stone mirroring the cyan wall in a long vertical reflection.`,
      composition: `Wide anamorphic establishing shot, 35mm, camera at chest height, one-point perspective. The figure occupies roughly 8% of the frame height — humanity is small against the architecture. Volumetric cyan haze fills the middle distance. The left half of the frame falls away into black emptiness.`,
      safeArea: `The LEFT 55% of the frame and the TOP 40% must remain empty black void.`,
    },
    mobile: {
      size: [1170, 2080],
      aspect: '9:16',
      deliver: 900,
      subject: `Vertical recomposition of the same scene: a colossal dark hall with a single black human silhouette seen from behind, standing at the very bottom of the frame, facing a vertical column of translucent cyan holographic panels that rises the full height of the image behind them. Abstract geometric data structures inside the light column — grids, nodes, wireframe blocks — nothing readable. Wet black stone floor reflecting cyan.`,
      composition: `Vertical portrait, 50mm, low camera angle looking slightly up so the light column towers. The silhouette sits in the bottom 20% of the frame and is small. The light column is a narrow vertical band through the center, so the sides stay black.`,
      safeArea: `The TOP 55% of the frame must be near-empty black haze with only the faintest suggestion of the light column.`,
    },
  }),

  slot({
    id: 'hero.core',
    label: 'ヒーロー AIコア',
    section: 'HERO',
    role: 'ヒーロー右カラムの背後に置く小さめの主役オブジェクト。「AIという相棒」の象徴。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1600, 1600],
      aspect: '1:1',
      deliver: 760,
      subject: `A single floating object suspended in a black void: a machined matte-black icosahedral core, its panels slightly separated and hovering apart from each other, revealing an intensely bright cyan energy nucleus burning at the center. Thin cyan filaments arc between the floating panels. Fine milled grooves and hairline chamfers on every black surface catch a cold rim light.`,
      composition: `Centered hero product shot, 85mm macro, object filling about 55% of the frame with generous black margin on all sides. Slight top-down three-quarter angle. Shallow depth of field so the rear panels soften. No pedestal, no ground plane, no horizon — pure floating in black.`,
    },
  }),

  /* -------------------------------------------------------- STUDIO MODEL */
  slot({
    id: 'model.legacy',
    label: '従来の学習（LEGACY）',
    section: 'WHY NOW',
    role: '「2〜3年かかる従来型の学習」を表す退廃的なカット。あえて色を殺し、右のAI側と対比させる。',
    alt: '積み上がった技術書と埃をかぶった旧世代の端末が並ぶ、退廃的な学習環境のイメージ',
    desktop: {
      size: [1600, 1200],
      aspect: '4:3',
      deliver: 1480,
      subject: `An abandoned study carrel in a dim archive. Towers of thick, dog-eared technical manuals stacked unevenly and sagging. Two dead beige CRT terminals with dark, dust-filmed screens. A tangle of grey cables hangs slack like dead vines. Dust motes hang in a single weak grey shaft of light. Everything is desaturated, cold, colorless — NO cyan appears anywhere in this image.`,
      composition: `Slightly wide 35mm, eye level, symmetrical and static — the stillness is the point. Heavy grain, muted contrast, faded like a photograph left in a drawer. Deep shadows swallow the edges of the frame.`,
    },
  }),

  slot({
    id: 'model.ai',
    label: 'AI時代の学習（AI_DRIVEN）',
    section: 'WHY NOW',
    role: '同じ空間が生まれ変わった姿。左のLEGACYと構図を揃えて「同じ場所・違う時代」に見せるのが肝。',
    alt: 'AIが空中に構造化されたコードを展開する、軽やかで先進的な学習環境のイメージ',
    desktop: {
      size: [1600, 1200],
      aspect: '4:3',
      deliver: 1480,
      subject: `The exact same study carrel, reborn. The books and CRTs are gone. In their place: one thin sheet of black glass floating horizontally, and above it a weightless holographic construct of cyan light unfolding in mid-air — clean geometric modules, node graphs and wireframe blocks assembling themselves layer by layer. The dust is gone; the air is clear except for a soft cyan volumetric glow. Nothing readable inside the hologram.`,
      composition: `Identical camera to the LEGACY image — slightly wide 35mm, eye level, same symmetrical framing, same vanishing point — so the two images read as a before/after pair of one room. Crisp, low grain, high contrast, deep true blacks.`,
    },
  }),

  /* ------------------------------------------------------ FLOW (4 STEPS) */
  slot({
    id: 'flow.01',
    label: 'STEP 01 PROMPT',
    section: '学習の流れ',
    role: '「言語化してAIに指示する」ステップ。曖昧な発想が精密な形に固まる瞬間を描く。',
    alt: '曖昧な線が精密な設計図の幾何形状へと収束していくイメージ',
    desktop: {
      size: [1400, 1400],
      aspect: '1:1',
      deliver: 780,
      subject: `A stroke of cyan light drawn in mid-air inside a black void. On the left end it is a loose, fuzzy, trembling scribble; travelling right it resolves and crystallises into a perfectly precise architectural wireframe — clean orthogonal geometry with measured tick marks and node points. The transformation from chaos to precision happens across the width of the object. No hand, no person, no tool — only the line itself.`,
      composition: `Centered macro, 100mm, the light object crossing the frame horizontally through the middle third. Very shallow depth of field: the scribble end is out of focus, the geometric end razor sharp. Vast black emptiness above and below.`,
    },
  }),

  slot({
    id: 'flow.02',
    label: 'STEP 02 GENERATE',
    section: '学習の流れ',
    role: '「AIがコードを生成する」ステップ。降り注ぐ光が構造物を自動で組み上げていく。',
    alt: '降り注ぐ光の粒子が結晶格子となって構造物を組み上げていくイメージ',
    desktop: {
      size: [1400, 1400],
      aspect: '1:1',
      deliver: 780,
      subject: `A vertical cascade of cyan light particles pouring downward out of darkness into a crystalline lattice that is assembling itself in real time — modular blocks snapping into a precise architectural structure from the bottom up, each newly placed block glowing brighter for an instant. Half-built: the top is still loose falling particles, the bottom is finished solid geometry in matte black with cyan seams.`,
      composition: `Centered vertical flow, 50mm, structure occupying the lower 60% of the frame, particle cascade in the upper 40%. Strong sense of downward motion. Black void on both sides.`,
    },
  }),

  slot({
    id: 'flow.03',
    label: 'STEP 03 DEBUG',
    section: '学習の流れ',
    role: '「エラーをAIが直す」ステップ。割れた面が光の糸で縫い直される＝修復のメタファー。',
    alt: '黒い面に走った亀裂が光の糸で縫合され修復されていくイメージ',
    desktop: {
      size: [1400, 1400],
      aspect: '1:1',
      deliver: 780,
      subject: `A slab of black obsidian with a single jagged fracture running across it. The crack is being sealed: dozens of impossibly fine cyan filaments stitch across the gap like surgical sutures made of light, pulling the two halves back together. Where the filaments have already closed the seam the surface is flawless again and glows faintly along a hairline. Cold, surgical, calm — this is a repair, not an explosion.`,
      composition: `Top-down macro, 100mm, slab filling the frame edge to edge, crack running diagonally from lower-left to upper-right. Extremely shallow depth of field with only the stitching zone in focus. No debris, no sparks, no fire.`,
    },
  }),

  slot({
    id: 'flow.04',
    label: 'STEP 04 SHIP',
    section: '学習の流れ',
    role: '「本番にデプロイする」ステップ。7日目に手元に残る「動くもの」の象徴。',
    alt: '黒いモノリスが光の軌跡を引いて夜空へ打ち上がっていくイメージ',
    desktop: {
      size: [1400, 1400],
      aspect: '1:1',
      deliver: 780,
      subject: `A matte-black monolith the shape of a tall rectangular slab launching vertically off a mirrored black platform, already several meters clear of the ground. Beneath it, a column of concentrated cyan exhaust light and a shockwave ring of cyan haze spreading across the platform. Above it, empty night. The monolith's edges catch a hard cyan rim light. No flames, no orange fire, no smoke plume — the thrust is pure light.`,
      composition: `Low angle looking up, 35mm, monolith in the upper-center of the frame with the platform and shockwave in the lower third. Strong upward diagonal energy. Motion blur only in the exhaust, the monolith itself tack sharp.`,
    },
  }),

  /* ----------------------------------------------------------- CURRICULUM */
  slot({
    id: 'curriculum.01',
    label: 'Day 1-2 Web制作',
    section: 'カリキュラム',
    role: 'カリキュラム1枚目。作れるようになる成果物（LP・ポートフォリオ）の象徴。',
    alt: 'ガラス板のように積層したダークテーマのWebレイアウトが浮遊するイメージ',
    desktop: {
      size: [1600, 1200],
      aspect: '4:3',
      deliver: 1200,
      subject: `Five sheets of black micro-etched glass floating in parallax above a black surface, each one a layer of a dark-mode web layout: a hero band, a grid of cards, a column rhythm. The content on the sheets is purely abstract — solid blocks, rounded rectangles and rule lines, absolutely no readable text and no realistic UI chrome. Cyan light traces the edge of every sheet and pools softly on the surface below.`,
      composition: `Three-quarter isometric-feeling view, 50mm, layers receding toward the upper right with the front sheet sharp and the rear ones softening. Structure occupies the right 65%; the left of the frame is empty black.`,
    },
  }),

  slot({
    id: 'curriculum.02',
    label: 'Day 3-4 業務自動化',
    section: 'カリキュラム',
    role: 'カリキュラム2枚目。GAS・Gmail自動化＝人手の作業が機械的に流れていく様子。',
    alt: '光でできた歯車と搬送ラインが書類の断片を自動で処理していくイメージ',
    desktop: {
      size: [1600, 1200],
      aspect: '4:3',
      deliver: 1200,
      subject: `A precision machine room rendered in black metal: interlocking gears whose teeth and rims are drawn in cyan light, driving a conveyor beam of light along which flat luminous shards — abstract stand-ins for documents and messages, blank with no writing — glide and are sorted automatically into slots. Everything moves by itself; there is no operator in the frame.`,
      composition: `Slightly elevated three-quarter view, 50mm, mechanism running left to right across the lower two-thirds. Repetition and rhythm in the gear line create the sense of endless automation. Upper third is black haze.`,
    },
  }),

  slot({
    id: 'curriculum.03',
    label: 'Day 5-6 バックエンド',
    section: 'カリキュラム',
    role: 'カリキュラム3枚目。DB・サーバー＝目に見えない足場を築くフェーズ。',
    alt: '地下空間にそびえるデータベースの柱と、その周囲を巡るデータの光輪のイメージ',
    desktop: {
      size: [1600, 1200],
      aspect: '4:3',
      deliver: 1200,
      subject: `A subterranean cathedral of data. Three colossal cylindrical black totems rise out of a dark floor; each is banded by slowly rotating rings of cyan light, and thick cable-roots run from their bases outward across the ground and disappear into darkness. Faint cyan light leaks up between the floor slabs.`,
      composition: `Low wide angle, 24mm, looking up along the totems so they feel monumental. Symmetrical arrangement with the center totem tallest. Heavy volumetric haze between the columns; the ceiling is pure black with no visible top.`,
    },
  }),

  slot({
    id: 'curriculum.04',
    label: 'Day 7 卒業',
    section: 'カリキュラム',
    role: 'カリキュラム4枚目。到達・門出。ここだけ余韻と広がりのある一枚にする。',
    alt: '崖の上に立つ人物のシルエットが、光の塔が立ち並ぶ街を見下ろすイメージ',
    desktop: {
      size: [1600, 1200],
      aspect: '4:3',
      deliver: 1200,
      subject: `A lone human figure as a pure black silhouette, seen from behind and standing at the edge of a black cliff at night, looking out over a vast valley filled with slender towers of cyan light rising from the darkness like a city that runs on electricity. One beam of cyan light rises from the valley floor straight into the night sky.`,
      composition: `Wide 35mm, figure small and placed on the left third at the horizon line, valley opening to the right. Horizon sits low so most of the frame is night sky. Atmospheric depth: near cliff is solid black, far towers fade into haze.`,
    },
  }),

  /* -------------------------------------------------------------- PROCESS */
  slot({
    id: 'process.banner',
    label: '学習スケジュール帯',
    section: '学習スケジュール',
    role: '7日間のタイムラインの上に敷く横長の帯。日を追うごとに光が強くなる＝進捗の可視化。',
    alt: '',
    decorative: true,
    // 5:1 で指定していたが、画像生成AIはここまで極端な横長を出せず 2.5:1 前後になる。
    // 出せる比率に合わせた。枠側は高さ固定 + object-cover なので多少ぶれても破綻しない。
    desktop: {
      size: [2000, 800],
      aspect: '5:2',
      deliver: 1800,
      subject: `Seven vertical pillars of cyan light standing in a row inside an infinite black void, receding slightly in perspective. The leftmost pillar is dim and thin; each successive pillar is brighter, thicker and more defined, until the rightmost burns intensely and throws a hard reflection across the wet black floor. Volumetric haze pools around the bases.`,
      composition: `Ultra-wide panoramic, 24mm, camera low and centered on the row so the pillars stretch the full width. Even horizontal rhythm. Top half of the frame is empty black; the floor reflection anchors the bottom.`,
    },
    mobile: {
      size: [1170, 1460],
      aspect: '4:5',
      deliver: 700,
      subject: `Seven horizontal bars of cyan light stacked vertically inside an infinite black void, like rungs seen head-on. The topmost bar is dim and thin; each bar below it is brighter and thicker, until the bottom one burns intensely and reflects on a wet black surface. Volumetric haze between the bars.`,
      composition: `Vertical portrait, 35mm, bars centered and stacked with even spacing, occupying the middle 70% of the height. Wide black margins left and right.`,
    },
  }),

  /* -------------------------------------------------------------- OUTCOME */
  slot({
    id: 'outcome.01',
    label: 'できること 01 Webサイト制作',
    section: '7日後にできること',
    role: '能力アイコン的な一枚。カリキュラム画像より寄り・記号的にして重複感を消す。',
    alt: '光の枠組みで構成されたレイアウトグリッドのマクロイメージ',
    desktop: {
      size: [1200, 1200],
      aspect: '1:1',
      deliver: 760,
      subject: `An extreme macro of a single layout grid rendered as a physical object: thin machined black rails forming a rectangular column grid, with cyan light running inside the rails like fluid in a channel. One cell of the grid is lifted slightly out of plane and glows brighter, as if being placed. Symbolic and iconic rather than scenic.`,
      composition: `Straight-on macro, 100mm, object centered and occupying the middle 60% of the frame, edges falling into black. Perfect symmetry. Extremely shallow depth of field at the corners.`,
    },
  }),

  slot({
    id: 'outcome.02',
    label: 'できること 02 業務自動化',
    section: '7日後にできること',
    role: '能力アイコン的な一枚。「触らなくても回る」を1オブジェクトで言い切る。',
    alt: '自律的に回転する光の歯車のマクロイメージ',
    desktop: {
      size: [1200, 1200],
      aspect: '1:1',
      deliver: 760,
      subject: `An extreme macro of two interlocking gears machined from matte black metal, their teeth outlined in cyan light, caught mid-rotation with a faint motion arc. A thin stream of cyan light enters at one side and exits transformed at the other. Nothing else in frame. Symbolic and iconic.`,
      composition: `Straight-on macro, 100mm, gears centered filling the middle 60% of the frame. Hard cyan rim light on the top edges of the teeth, everything else falling to black.`,
    },
  }),

  slot({
    id: 'outcome.03',
    label: 'できること 03 案件獲得',
    section: '7日後にできること',
    role: '能力アイコン的な一枚。「仕事が取れる状態」を人物なしで表現する。',
    alt: '黒いケースの隙間から光が漏れ出す、案件獲得を象徴するイメージ',
    desktop: {
      size: [1200, 1200],
      aspect: '1:1',
      deliver: 760,
      subject: `A matte black hard case resting on a black glass table, its lid open by only a few centimetres, with intense cyan light escaping from the seam and cutting a sharp wedge into the dark air above it. A few blank luminous shards hover just above the opening, drifting upward. No people, no hands.`,
      composition: `Low three-quarter angle, 50mm, case centered in the lower half so the light wedge has room to open upward. Strong single light source from inside the case. Everything beyond the case is black.`,
    },
  }),

  slot({
    id: 'outcome.04',
    label: 'できること 04 コミュニティ',
    section: '7日後にできること',
    role: '能力アイコン的な一枚。卒業生ネットワーク＝ノードが繋がった星座。',
    alt: '光のノードが線で結ばれ星座のようなネットワークを形づくるイメージ',
    desktop: {
      size: [1200, 1200],
      aspect: '1:1',
      deliver: 760,
      subject: `A three-dimensional constellation floating in black: two dozen small cyan light nodes connected by taut threads of light into an irregular network shell, like a dome seen from outside. Four or five nodes burn noticeably brighter than the rest. Depth is readable — near nodes sharp and large, far nodes small and softened.`,
      composition: `Centered, 85mm, network occupying the middle 65% of the frame with black margin all around. Slight rotation so the structure reads as volumetric rather than flat. Faint haze inside the shell.`,
    },
  }),

  /* ----------------------------------------------------------------- TEAM */
  slot({
    id: 'team.backdrop',
    label: '講師陣セクション背景',
    section: '講師陣',
    role: '講師2名のカードの背後に敷く帯。人物写真は実写のまま、背景だけ世界観を統一する。',
    alt: '',
    decorative: true,
    desktop: {
      size: [2560, 1000],
      aspect: '21:9',
      deliver: 1800,
      subject: `An empty dark studio stage. Two circular pools of cyan light on a polished black floor, side by side and evenly spaced, with soft volumetric cones rising from them into haze. Nobody is standing in them — the stage is waiting. The back wall is pure black and infinitely far away.`,
      composition: `Ultra-wide, 35mm, camera low and centered between the two light pools. Perfectly symmetrical. The upper 60% of the frame is empty black haze.`,
    },
  }),

  /* -------------------------------------------------------------- CONTACT */
  slot({
    id: 'contact.cta',
    label: 'CTA背景（君も、星になれ。）',
    section: 'CONTACT',
    role: 'サイト最後の締め。「TECH × 星」のコンセプトを回収する一枚。感情のピークをここに置く。',
    alt: '',
    decorative: true,
    desktop: {
      size: [2880, 1620],
      aspect: '16:9',
      deliver: 1800,
      subject: `A black horizon under a night sky. On the ground, one tiny human figure as a pure black silhouette, seen from behind, arms at their sides, looking up. High above them a single point of light is igniting into a cyan starburst — the first frame of a supernova — throwing long clean rays outward and casting one narrow shaft of cyan down onto the figure. The rest of the sky holds only a scatter of faint cold stars.`,
      composition: `Wide 35mm, figure very small and placed on the lower-left third, star igniting in the upper-right third, so a strong diagonal runs between them. The horizon sits in the bottom quarter. Vast empty sky dominates.`,
      safeArea: `The LEFT 45% of the frame above the horizon must remain empty black sky.`,
    },
    mobile: {
      size: [1170, 1460],
      aspect: '4:5',
      deliver: 820,
      subject: `Vertical recomposition: a black horizon at the very bottom of the frame with one tiny human silhouette seen from behind looking up, and directly above them, high in the frame, a single point of light igniting into a cyan starburst that casts a narrow vertical shaft of light straight down onto the figure. Faint cold stars scattered elsewhere.`,
      composition: `Vertical portrait, 50mm, figure centered in the bottom 15%, star centered in the top 30%, connected by the vertical light shaft. Everything else is empty black sky.`,
      safeArea: `The MIDDLE 40% of the frame (the band between the star and the figure) must stay near-black apart from the thin light shaft.`,
    },
  }),


  /* ---------------------------------------------------------------- ICON
   * lucide の線アイコンを、実際にレンダリングされた立体オブジェクトに置き換える枠。
   * 背景は真っ黒で作り、UI側は mix-blend-screen で合成するので黒が抜ける。
   * 画像が無い間は元の lucide アイコンにフォールバックするので、崩れない。
   * ------------------------------------------------------------------- */
  slot({
    id: 'icon.legacy',
    label: 'アイコン: 旧世代（LEGACY）',
    section: 'ICON',
    role: 'StudioModel の「従来の学習」バッジ。唯一シアンを使わないアイコン。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small machined warning marker: a matte grey-steel triangle standing upright, its edges worn and slightly pitted, a thin dark seam running down its face. Cold dead grey metal, no glow, no cyan, no light source inside it. It reads as obsolete hardware.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  slot({
    id: 'icon.ai',
    label: 'アイコン: AI駆動（AI_DRIVEN）',
    section: 'ICON',
    role: 'StudioModel の「AI時代の学習」バッジ。icon.legacy と対になる。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small machined lightning bolt cut from matte black metal, its inner edges glowing with intense electric cyan light that spills onto the bevels. The bolt is a solid physical object, not a flat symbol. Sharp chamfered edges catching a cyan rim light.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  slot({
    id: 'icon.web',
    label: 'アイコン: Webサイト制作',
    section: 'ICON',
    role: '「7日後にできること」01。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small stack of three black glass plates floating in tight parallax, each plate edge-lit in electric cyan, arranged like layers of a page. The top plate is lifted slightly and glows brighter. Clean machined edges, no text or UI on the plates.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  slot({
    id: 'icon.automation',
    label: 'アイコン: 業務自動化',
    section: 'ICON',
    role: '「7日後にできること」02。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small precision gear machined from matte black metal, its teeth outlined in electric cyan light, with a second smaller gear meshed behind it. Fine milled detail on the hub. Caught mid-rotation with a faint cyan motion arc.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  slot({
    id: 'icon.client',
    label: 'アイコン: 案件獲得',
    section: 'ICON',
    role: '「7日後にできること」03。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small matte black hard case, lid cracked open by a few millimetres, with intense electric cyan light escaping from the seam and cutting a thin wedge upward. Solid machined latches and a carry handle. The case itself stays almost silhouette-dark.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  slot({
    id: 'icon.community',
    label: 'アイコン: コミュニティ',
    section: 'ICON',
    role: '「7日後にできること」04。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small three-dimensional cluster of electric cyan light nodes connected by taut glowing threads into an irregular network ball. Five or six nodes burn brighter than the rest. Depth is readable — near nodes larger and sharper, far nodes smaller and softer.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  slot({
    id: 'icon.check',
    label: 'アイコン: 該当（MATCH）',
    section: 'ICON',
    role: 'Contact「こういう人向け」6枚のカードで共通して使う。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1024, 1024],
      aspect: '1:1',
      deliver: 256,
      subject: `A small check mark cut from matte black metal as a solid three-dimensional object, its inner groove filled with intense electric cyan light. Chamfered edges catching a cyan rim light. Precise and machined, not hand-drawn.`,
      composition: `Centered single object, 85mm macro product shot, filling about 70% of the frame with even black margin on all sides. Slight three-quarter angle from above. The background is pure flat black #000000 with no floor, no horizon, no shadow cast onto anything — the object floats. Crisp focus across the whole object.`,
    },
  }),
  /* --------------------------------------------------------------- CARD
   * カード面のテクスチャ。1枚を横に長く作り、カードごとに
   * object-position をずらして使い回すので、6枚とも違う面に見える。
   * ------------------------------------------------------------------- */
  slot({
    id: 'card.surface',
    label: 'カード面のテクスチャ',
    section: 'CARD',
    role: 'カードの背景。CSSのベタ塗りをやめて実素材の面にする。1枚を位置をずらして複数枚で共用する。',
    alt: '',
    decorative: true,
    desktop: {
      size: [2400, 800],
      aspect: '3:1',
      deliver: 1600,
      subject: `A wide sheet of matte black anodized metal photographed straight on, filling the entire frame. The surface carries fine machining marks, a faint brushed grain, micro-scratches and a few tiny dust specks. Very subtle unevenness in the finish so no two areas look identical. A single soft electric cyan light grazes across it from the upper left, falling off to near-black at the lower right.`,
      composition: `Perfectly flat-on, no perspective, no visible edges of the sheet, no objects on it. Even exposure with a gentle diagonal light falloff. This is a texture, not a scene — it must tile visually with itself when cropped at different positions. Keep it dark: the brightest point should stay below 25% luminance.`,
    },
  }),
  /* ------------------------------------------------------------------ OGP */
  slot({
    id: 'meta.ogp',
    label: 'OGP画像（SNSシェア用）',
    section: 'META',
    role: 'X・Facebook・LINE でシェアされたときのサムネイル。サイト内には表示されない。',
    alt: '',
    decorative: true,
    desktop: {
      size: [1200, 630],
      aspect: '1.91:1',
      deliver: 1200,
      subject: `A machined matte-black icosahedral core floating in a black void, panels slightly separated, an intense cyan nucleus burning inside, thin cyan filaments arcing between the panels. Behind it, far back and heavily blurred, a faint curved wall of cyan holographic grid light.`,
      composition: `The core sits in the RIGHT third of the frame, 85mm, sharp. The left two-thirds is empty black with only haze — the site name and tagline will be typeset there afterwards in a design tool. No text in the generated image itself.`,
      safeArea: `The LEFT 60% of the frame must be empty black.`,
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
