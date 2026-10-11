"""Builds hub.html (artifact page) and index.html (standalone) from src/hub.src.html.

The English grammar bank (G) and reading passages (P) are shared with ../rishay-english/paper.html
and injected at the /*@ENGLISH_BANK@*/ marker so there is one copy of that content.
"""
import pathlib, re
root = pathlib.Path(__file__).parent
paper = (root.parent / "rishay-english" / "paper.html").read_text()
def grab(name):
    start = paper.index(f"const {name} = [")
    end = paper.index("\n];", start) + 3
    return paper[start:end]
bank = grab("G") + "\n\n" + grab("P") + "\n"
src = (root / "src" / "hub.src.html").read_text()
out = src.replace("/*@ENGLISH_BANK@*/", bank)
(root / "hub.html").write_text(out)
(root / "index.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + out + "</body></html>")
print("built", len(out), "bytes")
