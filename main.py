import js
import random
from pyodide.ffi import create_proxy

# 0〜51 のカードIDを使う
deck = list(range(52))

def draw_two_cards(*args, **kwargs):
    # デッキをシャッフルして、先頭2枚を取り出す
    random.shuffle(deck)
    c1, c2 = deck[0], deck[1]

    # JavaScript の show_card(cardId, canvasId) を呼び出す
    js.show_card(int(c1), "cardCanvas1")
    js.show_card(int(c2), "cardCanvas2")

# JS から呼べるように Python 関数を登録
# window.onDrawClicked = draw_two_cards に相当
js.window.onDrawClicked = create_proxy(draw_two_cards)
# 画像ロードが終わったら最初の2枚を描画（JS側で window.onCardsReady() を呼ぶ）
js.window.onCardsReady = create_proxy(draw_two_cards)