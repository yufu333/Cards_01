// スプライトシート情報
const COLS = 13;
const ROWS = 4;      // ここではトランプ52枚分のみ扱う
const img = new Image();
img.src = "English_pattern_playing_cards_deck_PLUS_CC0.jpg";  // リポジトリに配置しておく

let sheetW = 0;
let sheetH = 0;
let cardW = 0;
let cardH = 0;

img.onload = () => {
  sheetW = img.width;
  sheetH = img.height;
  cardW = sheetW / COLS;
  cardH = sheetH / ROWS;
  console.log("sprite sheet loaded:", sheetW, sheetH, cardW, cardH);
};

// cardId: 0〜51
// canvasId: 描画する <canvas> の id
function show_card(cardId, canvasId) {
  if (!img.complete || cardW === 0 || cardH === 0) {
    console.warn("image not loaded yet");
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("canvas not found:", canvasId);
    return;
  }

  const ctx = canvas.getContext("2d");

  const col = cardId % COLS;
  const row = Math.floor(cardId / COLS);

  const sx = col * cardW;
  const sy = row * cardH;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    sx, sy, cardW, cardH,   // 元画像上の切り出し範囲
    0, 0, canvas.width, canvas.height // canvas 上の描画サイズ
  );
}

// PyScript から呼べるようにグローバルに公開
window.show_card = show_card;

// ボタン押下イベントを Python 側に渡すためのフック（あとで設定）
window.onDrawClicked = null;

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("drawBtn");
  btn.addEventListener("click", () => {
    if (window.onDrawClicked) {
      window.onDrawClicked();
    }
  });
});