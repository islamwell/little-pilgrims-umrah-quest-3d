import * as THREE from 'three';

// Procedural Canvas Texture Generators for Umrah 3D Experience

export function createKiswahTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep matte black silk background with fabric weave
  ctx.fillStyle = '#141416';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle woven pattern
  ctx.strokeStyle = '#1d1d22';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Golden Calligraphy Belt (Hizam) at the upper third
  const beltY = 240;
  const beltH = 140;

  // Gold gradient
  const goldGrad = ctx.createLinearGradient(0, beltY, 0, beltY + beltH);
  goldGrad.addColorStop(0, '#A67C1E');
  goldGrad.addColorStop(0.2, '#FEDB72');
  goldGrad.addColorStop(0.5, '#E2B038');
  goldGrad.addColorStop(0.8, '#FFEA9F');
  goldGrad.addColorStop(1, '#916A14');

  // Belt border trim
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, beltY - 12, 1024, 10);
  ctx.fillRect(0, beltY + beltH + 2, 1024, 10);

  // Main belt plate
  ctx.fillStyle = '#100e0b';
  ctx.fillRect(0, beltY, 1024, beltH);

  // Calligraphic & geometric arabesque filigree inside the belt
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 3;

  for (let x = 30; x < 1024; x += 120) {
    // Elegant Islamic arabesque knot
    ctx.beginPath();
    ctx.arc(x, beltY + beltH / 2, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, beltY + beltH / 2, 28, 0, Math.PI * 2);
    ctx.stroke();

    // 8-point geometric star rosette
    for (let k = 0; k < 8; k++) {
      const angle = (k * Math.PI) / 4;
      const r1 = 34;
      const r2 = 14;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * r1, beltY + beltH / 2 + Math.sin(angle) * r1);
      ctx.lineTo(x + Math.cos(angle + 0.39) * r2, beltY + beltH / 2 + Math.sin(angle + 0.39) * r2);
      ctx.stroke();
    }
  }

  // Wavy calligraphic line connecting panels
  ctx.beginPath();
  for (let x = 0; x <= 1024; x += 20) {
    const y = beltY + beltH / 2 + Math.sin(x * 0.05) * 12;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Secondary lower gold band (Ikhlas / Quranic medallions)
  const medY = beltY + beltH + 90;
  for (let x = 60; x < 1024; x += 180) {
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(x, medY, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#141416';
    ctx.beginPath();
    ctx.arc(x, medY, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(x, medY, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createKaabaDoorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Rich Gold gradient
  const gold = ctx.createLinearGradient(0, 0, 512, 1024);
  gold.addColorStop(0, '#B78628');
  gold.addColorStop(0.3, '#FCC201');
  gold.addColorStop(0.6, '#F8DC75');
  gold.addColorStop(0.8, '#D89E23');
  gold.addColorStop(1, '#946B18');

  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, 512, 1024);

  // Border carvings
  ctx.strokeStyle = '#5E430B';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 992);
  ctx.strokeRect(32, 32, 448, 960);

  // Two leaves divider
  ctx.beginPath();
  ctx.moveTo(256, 32);
  ctx.lineTo(256, 992);
  ctx.stroke();

  // Decorative panels
  const panels = [
    { y: 60, h: 220 },
    { y: 310, h: 320 },
    { y: 660, h: 300 }
  ];

  panels.forEach(p => {
    // Left leaf panel
    ctx.strokeRect(48, p.y, 192, p.h);
    // Right leaf panel
    ctx.strokeRect(272, p.y, 192, p.h);

    // Arabesque patterns inside panels
    [144, 368].forEach(cx => {
      const cy = p.y + p.h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * 36, cy + Math.sin(rad) * 36);
        ctx.stroke();
      }
    });
  });

  // Door handles (lock & rings)
  ctx.fillStyle = '#453005';
  ctx.beginPath();
  ctx.arc(230, 560, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(282, 560, 16, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createMarbleFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Thassos Pure White / Soft Cream Marble
  ctx.fillStyle = '#F5F4EE';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle natural marble veins
  ctx.strokeStyle = 'rgba(215, 210, 198, 0.4)';
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 1024) {
      y += 40 + Math.random() * 40;
      x += (Math.random() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Tile grid joints
  ctx.strokeStyle = 'rgba(180, 175, 160, 0.5)';
  ctx.lineWidth = 2;
  const tileSize = 128;
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

export function createMatafRadialFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FAF8F2';
  ctx.fillRect(0, 0, 1024, 1024);

  const cx = 512;
  const cy = 512;

  // Concentric radial prayer circles
  ctx.strokeStyle = 'rgba(195, 185, 165, 0.65)';
  ctx.lineWidth = 2;

  for (let r = 40; r < 512; r += 28) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial lines every 15 degrees
  ctx.strokeStyle = 'rgba(215, 205, 185, 0.35)';
  ctx.lineWidth = 1;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40);
    ctx.lineTo(cx + Math.cos(a) * 510, cy + Math.sin(a) * 510);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createRockTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Granite stone base
  ctx.fillStyle = '#7a6c5f';
  ctx.fillRect(0, 0, 512, 512);

  // Noise and stone streaks
  for (let i = 0; i < 3000; i++) {
    const shade = Math.floor(90 + Math.random() * 80);
    ctx.fillStyle = `rgb(${shade + 10}, ${shade}, ${shade - 10})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 4, 2 + Math.random() * 4);
  }

  // Horizontal stone strata
  ctx.strokeStyle = 'rgba(60, 50, 42, 0.45)';
  ctx.lineWidth = 4;
  for (let y = 20; y < 512; y += 30 + Math.random() * 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < 512; x += 40) {
      ctx.lineTo(x, y + (Math.random() - 0.5) * 12);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Glowing respectful silhouette texture (no face/features, pure graceful pilgrim light)
export function createPilgrimSilhouetteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 256, 512);

  const cx = 128;

  // Soft radiant aura
  const radGrad = ctx.createRadialGradient(cx, 260, 40, cx, 260, 140);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 256, 512);

  // Flowing silhouette body in Ihram
  ctx.fillStyle = 'rgba(250, 252, 255, 0.88)';
  ctx.beginPath();
  // Head/turban silhouette (smooth oval, no facial features)
  ctx.arc(cx, 75, 34, 0, Math.PI * 2);
  ctx.fill();

  // Shoulder and draped Ihram cloth contour
  ctx.beginPath();
  ctx.moveTo(cx - 32, 105);
  ctx.quadraticCurveTo(cx - 55, 130, cx - 65, 175);
  ctx.quadraticCurveTo(cx - 75, 300, cx - 80, 480);
  ctx.lineTo(cx + 80, 480);
  ctx.quadraticCurveTo(cx + 75, 300, cx + 65, 175);
  ctx.quadraticCurveTo(cx + 55, 130, cx + 32, 105);
  ctx.closePath();
  ctx.fill();

  // Soft inner fold highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 20, 130);
  ctx.quadraticCurveTo(cx, 220, cx - 10, 360);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
