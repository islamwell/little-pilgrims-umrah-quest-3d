const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function build() {
  console.log('Building JS bundle with esbuild...');
  const result = await esbuild.build({
    entryPoints: [path.join(__dirname, 'src/main.js')],
    bundle: true,
    minify: true,
    write: false,
    format: 'iife'
  });

  const bundleCode = result.outputFiles[0].text;
  console.log(`Bundle size: ${(bundleCode.length / 1024).toFixed(1)} KB`);

  console.log('Reading index.template.html...');
  const templatePath = path.join(__dirname, 'index.template.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  // Replace injection point safely without special $ pattern substitution
  const finalHtml = template.replace('/* BUNDLE_INJECTION_POINT */', () => bundleCode);

  // 1. Output to dist/index.html
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  const distHtmlPath = path.join(distDir, 'index.html');
  fs.writeFileSync(distHtmlPath, finalHtml, 'utf8');
  console.log(`Wrote dist HTML to: ${distHtmlPath}`);

  // 2. Output to Artifact directory
  const artifactDir = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/a090ad79-a31c-42ee-b59e-c1ccda82edb6';
  if (fs.existsSync(artifactDir)) {
    const artifactPath = path.join(artifactDir, 'umrah_quest_3d.html');
    fs.writeFileSync(artifactPath, finalHtml, 'utf8');
    console.log(`Wrote Artifact HTML to: ${artifactPath}`);
  }

  console.log('Build complete!');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
