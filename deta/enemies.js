const makePixelSvg = (palette, rows) => {
  const cell = 8;
  const width = rows[0].length * cell;
  const height = rows.length * cell;
  const rects = [];

  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      const color = palette[ch] || "#ffffff";
      rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${color}"/>`);
    });
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const ENEMIES = {
  normal: [
    {
      name: "スライム",
      hp: 55,
      art: makePixelSvg(
        { a: "#5de19e", b: "#1d8d56", e: "#ffffff", p: "#0f3f2b" },
        [
          "....aaaa....",
          "..aabbbbaa..",
          ".aabbbb bbaa.",
          "aabbbbbbbbaa",
          "aabbe..ebbaa",
          "aabbbbbbbbaa",
          ".aabppppbbaa.",
          "..aa....aa.."
        ].map((r) => r.replace(/\s/g, ""))
      )
    },
    {
      name: "ゴブリン",
      hp: 65,
      art: makePixelSvg(
        { g: "#8fcf4d", d: "#3f6f1f", e: "#ffffff", n: "#1e1e1e", c: "#9b6f43" },
        [
          "....gggg....",
          "..ggddddgg..",
          ".ggdeeedddg.",
          "ggdddnnnddgg",
          "ggdccccccddg",
          ".ggdccccddg.",
          "..ggddddgg..",
          "...g....g..."
        ]
      )
    },
    {
      name: "バット",
      hp: 50,
      art: makePixelSvg(
        { p: "#8e77ff", d: "#3b2b7b", e: "#ffffff", n: "#1d173b" },
        [
          "ppp......ppp",
          "pppp....pppp",
          "pdddppppdddp",
          ".dddeeeddd..",
          "..ddnnndd...",
          "...dddd.....",
          "....pp......",
          "....pp......"
        ]
      )
    }
  ],
  boss: [
    {
      name: "語彙ドラゴン",
      hp: 130,
      art: makePixelSvg(
        { r: "#ff6b6b", d: "#8f1c1c", e: "#ffffff", n: "#2e0f0f", y: "#ffd166" },
        [
          "..rrrrrrrr..",
          ".rrrddddrrr.",
          "rrdddeeedddr",
          "rdddnnnndddr",
          "rdddyyyydddr",
          ".rddyyyyddr.",
          "..rddddddr..",
          "...rr..rr..."
        ]
      )
    }
  ]
};
