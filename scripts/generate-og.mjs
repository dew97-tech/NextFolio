import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createElement as h } from "react";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/dist/compiled/@vercel/og/index.node.js");

const PAPER = "#F4F4F1";
const INK = "#1A1B18";
const INK_MUTED = "#4F514A";
const INK_FAINT = "#63655E";
const RULE = "#E2E2DC";
const YELLOW = "#FFD300";

const FONTS = [
  {
    name: "Newsreader",
    weight: 400,
    url: "https://cdn.jsdelivr.net/npm/@fontsource/newsreader/files/newsreader-latin-400-normal.woff",
  },
  {
    name: "Geist",
    weight: 400,
    url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff",
  },
  {
    name: "Geist Mono",
    weight: 400,
    url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff",
  },
];

const loadedFonts = [];

for (const font of FONTS) {
  const response = await fetch(font.url);
  if (!response.ok) {
    throw new Error(`Font download failed (${response.status}): ${font.name}`);
  }

  loadedFonts.push({
    name: font.name,
    data: await response.arrayBuffer(),
    weight: font.weight,
    style: "normal",
  });
}

const image = new ImageResponse(
  h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PAPER,
        padding: "88px 96px",
        fontFamily: "Geist",
      },
    },
    h(
      "div",
      { style: { fontFamily: "Geist Mono", fontSize: 24, color: INK_FAINT } },
      "david-dew-mallick.vercel.app",
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h(
        "div",
        {
          style: {
            fontFamily: "Newsreader",
            fontSize: 104,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: INK,
          },
        },
        "David Dew Mallick",
      ),
      h(
        "div",
        { style: { marginTop: 26, fontSize: 30, color: INK_MUTED } },
        "Software Engineer at JB Connect Ltd.",
      ),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${RULE}`,
          paddingTop: 28,
        },
      },
      h(
        "div",
        { style: { fontFamily: "Geist Mono", fontSize: 22, color: INK_FAINT } },
        "Dhaka, Bangladesh",
      ),
      h("div", { style: { width: 44, height: 8, backgroundColor: YELLOW } }),
    ),
  ),
  { width: 1200, height: 630, fonts: loadedFonts },
);

const buffer = Buffer.from(await image.arrayBuffer());
await writeFile("public/og.png", buffer);
console.log(`Wrote public/og.png (${buffer.length} bytes)`);
