// GO LIVE — site config. Fill CA, X and VAULT at launch.
window.LIVE_CFG = {
  NAME: "GO LIVE",
  TICKER: "LIVE",
  CA: "CZnGxDU7MhFdmgYVyzHH2mwhQDbvx1W8K5fakdnbpump",       // $LIVE mint (pump.fun CA)
  CHAIN: "solana",
  PAD: "pump.fun",
  PAIR: "",
X: "https://x.com/usegolive",         // https://x.com/<handle>
  BUY: "",                // blank = https://pump.fun/coin/<CA>
  CHART: "",              // blank = https://gmgn.ai/sol/token/<CA>

  VAULT: "",              // GO LIVE vault wallet: set it as the creator-fee recipient when launching a streamer coin
  SPLIT_STREAMER: 90,     // % of each payout to the streamer (USDC)
  SPLIT_BUYBACK: 10,      // % of each payout that buys $LIVE
  PAY_EVERY_MIN: 1,       // payout tick while the streamer is live

  API: "/api/live",       // live status endpoint (middleware.js). Falls back to DEMONSTRATION if unreachable
  STREAMERS: [
    { p: "kick", c: "xqc", n: "xQc" },
    { p: "kick", c: "adinross", n: "Adin Ross" },
    { p: "twitch", c: "kaicenat", n: "Kai Cenat" },
    { p: "twitch", c: "jynxzi", n: "Jynxzi" },
    { p: "kick", c: "trainwreckstv", n: "Trainwreck" },
    { p: "twitch", c: "caseoh_", n: "CaseOh" },
    { p: "kick", c: "n3on", n: "N3on" },
    { p: "twitch", c: "zackrawrr", n: "Asmongold" }
  ]
};
