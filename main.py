import js
import pyodide
import random
from pyodide import create_proxy

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
js.window.onDrawClicked = pyodide.create_proxy(draw_two_cards)

# ページ読み込み直後にも1回引いておく（お好みで）
draw_two_cards()