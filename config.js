// ============================================================
//  EDIT THIS FILE to customise your site.
//  Everything you need to change lives here.
// ============================================================

window.SITE_CONFIG = {
  // ---------- About you ----------
  name: "Spirit Paper",
  bio: "Just a guy programming. I make retro tools for game makers and YouTube creators.",

  // Path to your avatar image. Leave "" to show your initials instead.
  avatar: "spirit.png",

  // Links shown under your name. Each needs a label and an https:// url.
  links: [
    { label: "GitHub", url: "https://github.com/spiritpaper" },
  ],

  // ---------- Projects ----------
  // Newest or favourite first. To add a project, copy one block and edit it.
  //   name, description: shown on the card
  //   tags:  short labels (platform, type…)
  //   image: optional screenshot path, e.g. "images/chipforge.png"
  //   links: buttons; the first one is highlighted
  projects: [
    {
      name: "ChipForge",
      description: "Turn your music into 8-bit chiptune, compose songs on an emulated NES or Game Boy chip, and make retro sound effects for your games. Works in the browser and offline, with a desktop app and Godot and Unity plugins.",
      tags: ["Web app", "Desktop", "Godot", "Unity", "Open source"],
      image: "",
      links: [
        { label: "Download", url: "https://github.com/spiritpaper/chipforge/releases/latest" },
        { label: "Source", url: "https://github.com/spiritpaper/chipforge" },
      ],
    },
    {
      name: "YT Toolkit",
      description: "A Chrome extension for YouTube creators: find outlier videos, learn from the channels you follow, and plan, script, film and track your own videos. AI is optional (bring your own key).",
      tags: ["Chrome extension", "YouTube", "Free"],
      image: "",
      links: [
        { label: "Download", url: "https://github.com/spiritpaper/youtube-toolkit/releases/latest" },
        { label: "Source", url: "https://github.com/spiritpaper/youtube-toolkit" },
      ],
    },
  ],

  // ---------- Support ----------
  supportText: "If my apps or videos made your day better, you can power up my next level with crypto. Thank you, player!",

  // The domain this site lives on. Shown to donors so they can spot fake copies.
  officialUrl: "spiritpaper.github.io",

  // Your wallet addresses. Paste each one EXACTLY as your wallet shows it.
  // Leave an address as "" to hide that option.
  wallets: [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      address: "bc1qeydxfrgzxhf07w3nmgc43v3lgchpau4yztadtz",
      networks: ["Bitcoin"],
      tokens: ["BTC"],
      warning: "Send only Bitcoin (BTC) on the Bitcoin network.",
    },
    {
      id: "evm",
      name: "Ethereum",
      symbol: "ETH · USDC · USDT",
      address: "0xa5298cae21F9933aAE24fD300706b52117e12a65",
      networks: ["Ethereum", "Base", "Arbitrum", "Optimism", "Polygon", "BNB Chain"],
      tokens: ["ETH", "USDC", "USDT", "BNB", "POL"],
      warning: "Only use the networks listed above. Tokens sent on other networks may be lost.",
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL · USDC",
      address: "9W3gyosfaM67wwEDUGcFpbkTS321ZYr6dCDoFHpJxfwz",
      networks: ["Solana"],
      tokens: ["SOL", "USDC", "USDT"],
      warning: "Send only on the Solana network.",
    },
    {
      id: "tron",
      name: "Tron",
      symbol: "USDT · TRX",
      address: "TCxsGxYjjaxF2V7jRixGLuVp81kSDgouJa",
      networks: ["Tron (TRC-20)"],
      tokens: ["USDT", "TRX"],
      warning: "Send only on the Tron network (TRC-20).",
    },
  ],

  // Optional "pay with any other coin" checkout link (https://). Leave "" to hide it.
  otherCoinsUrl: "",
};
