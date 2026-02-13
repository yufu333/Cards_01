// スプライトシート情報
const COLS = 13;
const ROWS = 4;

const img = new Image();
img.src = "English_pattern_playing_cards_deck_PLUS_CC0.svg?v=20260213";

// 画像内の「カード1枚」の切り出しサイズ（自動計算）
let srcCardW = 0;
let srcCardH = 0;

// ★ 行間の区切り（今回の画像は合計3px → 1px×3本 とみなす）
const GAP_Y = 1;

// 表示上のキャンバスサイズ（見た目のサイズ）
const DISP_W = 147;
const DISP_H = 270;

let ready = false;
const pending = [];

function prepareCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;

  // 見た目サイズ
  canvas.style.width = `${DISP_W}px`;
  canvas.style.height = `${DISP_H}px`;

  // 実ピクセル
  canvas.width = Math.round(DISP_W * dpr);
  canvas.height = Math.round(DISP_H * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  return ctx;
}

function show_card(cardId, canvasId) {
  if (!ready) {
    pending.push({ cardId, canvasId });
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = prepareCanvas(canvas);

  const col = cardId % COLS;
  const row = Math.floor(cardId / COLS);

  const sx = col * srcCardW;
  const sy = row * srcCardH + row * GAP_Y; // ★ 行間1pxぶんを加える

  ctx.clearRect(0, 0, DISP_W, DISP_H);
  ctx.drawImage(
    img,
    sx, sy, srcCardW, srcCardH, // 元画像から切り出し
    0, 0, DISP_W, DISP_H        // キャンバスに縮小して描画
  );
}

window.show_card = show_card;

img.onload = () => {
  // 横は割り切れる：393px
  srcCardW = Math.floor(img.width / COLS);

  // 縦は「合計3pxの区切り」を引いてから4等分：720px
  const totalGapY = GAP_Y * (ROWS - 1); // 1px×3本=3px
  srcCardH = Math.floor((img.height - totalGapY) / ROWS);

  ready = true;
  console.log("loaded:", img.width, img.height, "card:", srcCardW, srcCardH, "gapY:", GAP_Y);

  while (pending.length) {
    const r = pending.shift();
    show_card(r.cardId, r.canvasId);
  }

  if (window.onCardsReady) window.onCardsReady(); // 初回表示
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("drawBtn");
  btn.addEventListener("click", () => {
    if (window.onDrawClicked) window.onDrawClicked();
  });
});
