// スプライトシート情報
const COLS = 13;
const ROWS = 4;

const img = new Image();
// ★キャッシュ対策（任意：更新するたびに数字を変えると確実）
img.src = "English_pattern_playing_cards_deck_PLUS_CC0.svg?v=20260213";

let srcCardW = 0;
let srcCardH = 0;

// ★余り（今回は3px）を「上下余白」とみなす
let TOP_Y = 0;     // 上余白
const GAP_Y = 0;   // 行間は0にする

// 表示サイズ
const DISP_W = 147;
const DISP_H = 270;

let ready = false;
const pending = [];

function prepareCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = `${DISP_W}px`;
  canvas.style.height = `${DISP_H}px`;

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
  // ★ここが肝：行間で増やさず、上余白 + row*高さ
  const sy = TOP_Y + row * (srcCardH + GAP_Y);

  ctx.clearRect(0, 0, DISP_W, DISP_H);
  ctx.drawImage(img, sx, sy, srcCardW, srcCardH, 0, 0, DISP_W, DISP_H);
}

window.show_card = show_card;

img.onload = () => {
  srcCardW = Math.floor(img.width / COLS);    // 5109/13 = 393
  srcCardH = Math.floor(img.height / ROWS);   // 2883/4 = 720 (余り3)

  const remainderY = img.height - srcCardH * ROWS; // 3
  TOP_Y = Math.floor(remainderY / 2);              // 1（上1px、下2px）

  ready = true;
  console.log("loaded:", img.width, img.height, "card:", srcCardW, srcCardH, "TOP_Y:", TOP_Y);

  while (pending.length) {
    const r = pending.shift();
    show_card(r.cardId, r.canvasId);
  }

  if (window.onCardsReady) window.onCardsReady();
};

img.onerror = (e) => console.error("image load error", e, img.src);

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("drawBtn");
  btn.addEventListener("click", () => {
    if (window.onDrawClicked) window.onDrawClicked();
  });
});

