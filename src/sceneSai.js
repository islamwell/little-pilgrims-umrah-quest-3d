import * as THREE from 'three';
import {
  createMarbleFloorTexture,
  createRockTexture,
  createPilgrimSilhouetteTexture
} from './textures.js';

export class SaiScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.pilgrims = [];
    this.greenLights = [];
    this.safaPos = new THREE.Vector3(0, 1.6, -42);
    this.marwaPos = new THREE.Vector3(0, 1.6, 42);

    this.buildScene();
    this.scene.add(this.group);
  }

  buildScene() {
    const hallLength = 100;
    const hallWidth = 22;
    const hallHeight = 12;

    // 1. Long Marble Gallery Floor
    const floorGeo = new THREE.PlaneGeometry(hallWidth, hallLength);
    const floorTex = createMarbleFloorTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.15,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Track lane stripes (separating outbound and inbound lanes)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x059669 });
    [-4, 0, 4].forEach(x => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.2, hallLength - 16), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.02, 0);
      this.group.add(line);
    });

    // 2. High Arched Walls & Ceiling
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.3 });
    // Left & Right walls
    [-hallWidth / 2, hallWidth / 2].forEach(x => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(1, hallHeight, hallLength), wallMat);
      wall.position.set(x, hallHeight / 2, 0);
      this.group.add(wall);
    });

    // Decorative arches along the hall
    const archMat = new THREE.MeshStandardMaterial({ color: 0xeae6dc, roughness: 0.25 });
    for (let z = -hallLength / 2 + 8; z <= hallLength / 2 - 8; z += 12) {
      // Arched beam overhead
      const beam = new THREE.Mesh(new THREE.BoxGeometry(hallWidth, 1.2, 1.4), archMat);
      beam.position.set(0, hallHeight - 0.6, z);
      this.group.add(beam);

      // Support columns
      [-hallWidth / 2 + 1, hallWidth / 2 - 1].forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, hallHeight, 16), archMat);
        col.position.set(cx, hallHeight / 2, z);
        this.group.add(col);
      });
    }

    // 3. Central Emerald GREEN LIGHT ZONE (Between z = -14 and z = 14)
    // The famous green lights where the Prophet (saw) and Lady Hajar hastened
    const greenZoneLength = 28;
    const greenFloorGeo = new THREE.PlaneGeometry(hallWidth - 2, greenZoneLength);
    const greenFloorMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.18,
      depthWrite: false
    });
    const greenFloor = new THREE.Mesh(greenFloorGeo, greenFloorMat);
    greenFloor.rotation.x = -Math.PI / 2;
    greenFloor.position.set(0, 0.03, 0);
    this.group.add(greenFloor);

    // Glowing Green Fluorescent Light Strips overhead
    for (let gz = -greenZoneLength / 2 + 2; gz <= greenZoneLength / 2 - 2; gz += 4) {
      const lampGeo = new THREE.BoxGeometry(hallWidth - 4, 0.3, 0.5);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(0, hallHeight - 1.2, gz);
      this.group.add(lamp);

      const pLight = new THREE.PointLight(0x00ff88, 1.8, 16);
      pLight.position.set(0, hallHeight - 1.8, gz);
      this.group.add(pLight);
      this.greenLights.push(pLight);
    }

    // 4. Mount Safa (South Hill, z = -42)
    const rockTex = createRockTexture();
    const rockMat = new THREE.MeshStandardMaterial({
      map: rockTex,
      roughness: 0.9,
      metalness: 0.1
    });

    const safaGroup = new THREE.Group();
    // Stepped rocky terrain
    for (let step = 0; step < 5; step++) {
      const stepMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(8 - step * 1.2, 9 - step * 1.2, 0.7, 12),
        rockMat
      );
      stepMesh.position.y = 0.35 + step * 0.6;
      safaGroup.add(stepMesh);
    }
    // Natural rocky crags
    for (let r = 0; r < 7; r++) {
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.6), rockMat);
      boulder.position.set((Math.random() - 0.5) * 6, 2.8 + Math.random() * 0.8, (Math.random() - 0.5) * 5);
      safaGroup.add(boulder);
    }
    // Sign banner: JABAL AS-SAFA
    this.addMountainSign(safaGroup, 'جَبَلُ الصَّفَا • MOUNT SAFA (START)', 0x1e3a8a);
    safaGroup.position.set(0, 0, -42);
    this.group.add(safaGroup);

    // 5. Mount Marwah (North Hill, z = +42)
    const marwaGroup = new THREE.Group();
    for (let step = 0; step < 5; step++) {
      const stepMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(8 - step * 1.2, 9 - step * 1.2, 0.7, 12),
        rockMat
      );
      stepMesh.position.y = 0.35 + step * 0.6;
      marwaGroup.add(stepMesh);
    }
    for (let r = 0; r < 7; r++) {
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1 + Math.random() * 0.5), rockMat);
      boulder.position.set((Math.random() - 0.5) * 6, 2.8 + Math.random() * 0.8, (Math.random() - 0.5) * 5);
      marwaGroup.add(boulder);
    }
    // Sign banner: JABAL AL-MARWAH
    this.addMountainSign(marwaGroup, 'جَبَلُ الْمَرْوَة • MOUNT MARWAH (FINISH)', 0x991b1b);
    marwaGroup.position.set(0, 0, 42);
    this.group.add(marwaGroup);

    // 6. Zamzam Water Stations along the side
    [-20, 20].forEach(z => {
      this.buildTracksideZamzam(-hallWidth / 2 + 2, z);
      this.buildTracksideZamzam(hallWidth / 2 - 2, z);
    });

    // 7. Pilgrim Silhouettes along Sa'i path
    this.buildSaiPilgrims();
  }

  addMountainSign(parent, text, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `#${bgColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 75);

    const signTex = new THREE.CanvasTexture(canvas);
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 1.5),
      new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
    );
    sign.position.set(0, 5, 0);
    parent.add(sign);
  }

  buildTracksideZamzam(x, z) {
    const group = new THREE.Group();
    const cooler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.4, 1.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
    );
    cooler.position.y = 0.9;
    group.add(cooler);
    group.position.set(x, 0, z);
    this.group.add(group);
  }

  buildSaiPilgrims() {
    const silTex = createPilgrimSilhouetteTexture();
    const silMat = new THREE.MeshBasicMaterial({
      map: silTex,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const silGeo = new THREE.PlaneGeometry(1.6, 2.8);

    // Pilgrims walking from Safa to Marwah on track A (x = -4)
    for (let i = 0; i < 14; i++) {
      const mesh = new THREE.Mesh(silGeo, silMat);
      const z = -38 + i * 5.8 + (Math.random() - 0.5) * 2;
      mesh.position.set(-4 + (Math.random() - 0.5) * 1.5, 1.4, z);
      this.pilgrims.push({
        mesh,
        dir: 1, // moving +Z
        speed: 0.08 + Math.random() * 0.04,
        minZ: -40,
        maxZ: 40
      });
      this.group.add(mesh);
    }

    // Pilgrims walking from Marwah to Safa on track B (x = +4)
    for (let i = 0; i < 14; i++) {
      const mesh = new THREE.Mesh(silGeo, silMat);
      const z = 38 - i * 5.8 + (Math.random() - 0.5) * 2;
      mesh.position.set(4 + (Math.random() - 0.5) * 1.5, 1.4, z);
      this.pilgrims.push({
        mesh,
        dir: -1, // moving -Z
        speed: 0.08 + Math.random() * 0.04,
        minZ: -40,
        maxZ: 40
      });
      this.group.add(mesh);
    }
  }

  update(delta, cameraPos) {
    // Animate Sa'i pilgrims
    this.pilgrims.forEach(p => {
      // In green light zone (-14 to 14), pilgrims hasten/jog!
      const inGreenZone = Math.abs(p.mesh.position.z) < 14;
      const curSpeed = inGreenZone ? p.speed * 1.9 : p.speed;

      p.mesh.position.z += p.dir * curSpeed;

      if (p.dir === 1 && p.mesh.position.z > p.maxZ) {
        p.mesh.position.z = p.minZ;
      } else if (p.dir === -1 && p.mesh.position.z < p.minZ) {
        p.mesh.position.z = p.maxZ;
      }

      // Billboard to face camera
      if (cameraPos) {
        p.mesh.lookAt(cameraPos.x, p.mesh.position.y, cameraPos.z);
      }
    });

    // Pulse green lights
    const glow = 1.6 + Math.sin(Date.now() * 0.006) * 0.6;
    this.greenLights.forEach(gl => {
      gl.intensity = glow;
    });
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
