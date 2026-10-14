# spiritpaper.github.io

Personal site of Spirit Paper: projects, plus a page to support my work with crypto.

## Editing

Everything lives in **`config.js`**:
- `name`, `bio`, `avatar`, `links`: the top of the page.
- `projects`: one block per project. Copy a block to add a new one. `image` is an optional screenshot path.
- `wallets`: crypto addresses. An empty address hides that coin.
- `otherCoinsUrl`: optional `https://` checkout link for other coins.

If an address doesn't look like the right format, the page shows a red warning.

## Preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Links

- `#projects` and `#support` jump to those sections.
- `#btc`, `#evm`, `#sol` and `#tron` open the support section with that coin selected.

## Credits

QR codes: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT). Fonts: Press Start 2P and VT323 (SIL Open Font License).
