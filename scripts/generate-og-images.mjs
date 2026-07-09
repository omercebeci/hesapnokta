// Statik Open Graph / Twitter Card görsellerini üretir (public/og-image.png).
// Talep üzerine "npm run generate:og" ile elle çalıştırılır; her build'de otomatik
// çalışmaz çünkü marka görseli (logo, slogan) sık değişmez.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;

const fontRegular = fs.readFileSync(path.join(__dirname, 'fonts', 'DejaVuSans.ttf'));
const fontBold = fs.readFileSync(path.join(__dirname, 'fonts', 'DejaVuSans-Bold.ttf'));

const CATEGORY_PILLS = ['Finans', 'Sağlık', 'İnşaat & Tadilat', 'Matematik'];

function buildTree({ slogan }) {
  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 90px',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #12172a 60%, #161b30 100%)',
        fontFamily: 'DejaVu Sans',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: -140,
              right: -120,
              width: 560,
              height: 560,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(129,140,248,0.35) 0%, rgba(129,140,248,0) 70%)',
              display: 'flex',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: -180,
              left: -110,
              width: 520,
              height: 520,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(79,70,229,0.32) 0%, rgba(79,70,229,0) 70%)',
              display: 'flex',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 28 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 132,
                    height: 132,
                    borderRadius: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: { color: '#ffffff', fontSize: 74, fontWeight: 700 },
                      children: 'H',
                    },
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: { color: '#f3f4f8', fontSize: 88, fontWeight: 700, letterSpacing: -2 },
                  children: 'HesapNokta',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', marginTop: 36, fontSize: 34, fontWeight: 400, color: '#c2c6da' },
            children: slogan,
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', marginTop: 26, gap: 14 },
            children: CATEGORY_PILLS.map((label) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  padding: '8px 20px',
                  borderRadius: 999,
                  fontSize: 22,
                  color: '#8b90ac',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                },
                children: label,
              },
            })),
          },
        },
        {
          type: 'div',
          props: {
            style: { position: 'absolute', bottom: 44, right: 64, display: 'flex', fontSize: 24, color: '#666c8a' },
            children: 'hesapnokta.com',
          },
        },
      ],
    },
  };
}

async function renderPng(tree) {
  const svg = await satori(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'DejaVu Sans', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'DejaVu Sans', data: fontBold, weight: 700, style: 'normal' },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

async function main() {
  const png = await renderPng(buildTree({ slogan: 'Hızlı, doğru ve ücretsiz hesaplama araçları' }));
  const outPath = path.join(root, 'public', 'og-image.png');
  fs.writeFileSync(outPath, png);
  console.log(`✓ ${path.relative(root, outPath)} üretildi (${WIDTH}x${HEIGHT}).`);
}

main();
