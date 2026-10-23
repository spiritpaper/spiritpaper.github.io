// ============================================================
//  EDIT THIS FILE to customise your site.
//  Everything you need to change lives here.
// ============================================================

window.SITE_CONFIG = {
  // ---------- About you ----------
  name: "Spirit Paper",
  bio: "Just a guy programming. I make retro tools for game makers, programmers and YouTube creators.",

  // Path to your avatar image. Leave "" to show your initials instead.
  avatar: "spirit.png",

  // Links shown under your name. Each needs a label and an https:// url
  // (or mailto: for an email address). Use copy instead of url for a button
  // that copies text instead of opening a link.
  links: [
    { label: "GitHub", url: "https://github.com/spiritpaper" },
    { label: "YouTube", url: "https://www.youtube.com/@SpiritPaper" },
    { label: "Instagram", url: "https://www.instagram.com/realpaperspirit" },
    { label: "X", url: "https://x.com/imspiritpaper" },
    { label: "Discord", url: "https://discord.gg/Jq3kHTrpTc" },
    { label: "Email", url: "mailto:paperspiritbusiness@gmail.com" },
  ],

  // ---------- Projects ----------
  // Newest or favourite first. To add a project, copy one block and edit it.
  //   name, description: shown on the card
  //   tags:  short labels (platform, type…)
  //   image: optional screenshot path, e.g. "images/chipforge.png"
  //   links: buttons; the first one is highlighted
  projects: [
    {
      name: "Cursed GIT",
      description: "Like git, but she has feelings: Miranda, a toxic ex who lives in your repo, judges your commits and turns every merge conflict into a boss fight. A terminal game where you learn git by surviving her.",
      tags: ["CLI", "Game", "Linux", "macOS", "Windows", "Open source"],
      image: "",
      links: [
        { label: "Download", url: "https://github.com/spiritpaper/cursed-git/releases/latest" },
        { label: "Guides", url: "https://spiritpaper.site/cursed-git/" },
        { label: "Source", url: "https://github.com/spiritpaper/cursed-git" },
      ],
    },
    {
      name: "ChipForge",
      description: "Make retro sound effects and chiptune songs for your games and videos on an emulated NES or Game Boy chip, or turn any song into 8-bit. Royalty-free, runs in your browser and offline, with a desktop app and Godot and Unity plugins.",
      tags: ["Web app", "Desktop", "Godot", "Unity", "Open source"],
      image: "",
      links: [
        { label: "Open in browser", url: "https://spiritpaper.site/chipforge/app/" },
        { label: "Download", url: "https://github.com/spiritpaper/chipforge/releases/latest" },
        { label: "Guides", url: "https://spiritpaper.site/chipforge/" },
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

  // What donations pay for, in order. The first goal that isn't done is shown
  // as the current one.
  //   amount:  cost in US dollars (0 hides the progress bar)
  //   raised:  dollars received so far for this goal. Update it as donations come in.
  //   monthly: true for an ongoing cost; it shows "a month" and never gets done
  //   done:    true once it's paid for, so donors can see their money was used
  goals: [
    {
      title: "Google developer account for YT Toolkit",
      note: "The fee to publish my outlier tool on the Chrome Web Store, so more creators can find it.",
      amount: 5, raised: 0, done: false,
    },
    {
      title: "A nice cake with my friend",
      note: "To celebrate the first win together. Yes, really.",
      amount: 40, raised: 0, done: false,
    },
    {
      title: "Pay my sister back",
      note: "She helped me through uni and bought the laptop I build all of this on. She's done a lot for me, so I'm starting with the laptop.",
      amount: 1000, raised: 0, done: false,
    },
    {
      title: "Gym and staying alive",
      note: "A gym membership and enough for food and bills, so I can keep making things.",
      amount: 80, raised: 0, monthly: true,
    },
    {
      title: "A monster PC",
      note: "A machine that can run my own AI models, and maybe a home lab server one day.",
      amount: 10000, raised: 0, done: false,
    },
  ],

  // The domain this site lives on. Shown to donors so they can spot fake copies.
  officialUrl: "spiritpaper.site",

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
