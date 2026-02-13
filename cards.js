// スプライトシート情報
const COLS = 13;
const ROWS = 4;
const img = new Image();
img.src = "English_pattern_playing_cards_deck_PLUS_CC0.jpg";

let sheetW = 0;
let sheetH = 0;
let cardW = 147;   // 横幅は固定で 147px と決め打ち
let cardH = 270;   // 縦はそのまま 270px

img.onload = () => {
  sheetW = img.width;
  sheetH = img.height;

  // 必要ならログで確認
  console.log("sprite sheet loaded:", sheetW, sheetH);
  // 横方向の実使用幅は cardW * COLS のみ使う
  console.log("effective width:", cardW * COLS);
};

// cardId: 0〜51
// canvasId: 描画する <canvas> の id
function show_card(cardId, canvasId) {
  if (!img.complete) {
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
    sx, sy, cardW, cardH,           // ここを固定値で切り出す
    0, 0, canvas.width, canvas.height
  );
}

window.show_card = show_card;

window.onDrawClicked = null;

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("drawBtn");
  btn.addEventListener("click", () => {
    if (window.onDrawClicked) {
      window.onDrawClicked();
    }
  });
});