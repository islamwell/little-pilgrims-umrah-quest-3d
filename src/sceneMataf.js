import * as THREE from 'three';
import {
  createKiswahTexture,
  createKaabaDoorTexture,
  createMarbleFloorTexture,
  createMatafRadialFloorTexture,
  createPilgrimSilhouetteTexture
} from './textures.js';

export class MatafScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.pilgrims = [];
    this.greenLightBeacon = null;
    this.kaaba = null;
    this.corners = [];

    this.buildScene();
    this.scene.add(this.group);
  }

  buildScene() {
    // 1. Grand Mataf Floor
    const floorGeo = new THREE.PlaneGeometry(160, 160);
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

    // Radial Mataf prayer lines overlay
    const radialGeo = new THREE.PlaneGeometry(70, 70);
    const radialTex = createMatafRadialFloorTexture();
    const radialMat = new THREE.MeshBasicMaterial({
      map: radialTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const radialFloor = new THREE.Mesh(radialGeo, radialMat);
    radialFloor.rotation.x = -Math.PI / 2;
    radialFloor.position.y = 0.01;
    this.group.add(radialFloor);

    // 2. The Holy Ka'bah
    const kw = 11;
    const kl = 12.5;
    const kh = 14;

    const kiswahTex = createKiswahTexture();
    const kiswahMat = new THREE.MeshStandardMaterial({
      map: kiswahTex,
      roughness: 0.85,
      metalness: 0.15
    });

    const kaabaGeo = new THREE.BoxGeometry(kw, kh, kl);
    this.kaaba = new THREE.Mesh(kaabaGeo, kiswahMat);
    this.kaaba.position.set(0, kh / 2, 0);
    this.kaaba.castShadow = true;
    this.kaaba.receiveShadow = true;
    this.group.add(this.kaaba);

    // Ka'bah Marble Base (Shadharwan)
    const baseGeo = new THREE.BoxGeometry(kw + 0.9, 0.45, kl + 0.9);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xedebe4,
      roughness: 0.2
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, 0.22, 0);
    this.group.add(baseMesh);

    // Ka'bah Golden Door (Bab ar-Rahman) on East-North side
    const doorTex = createKaabaDoorTexture();
    const doorMat = new THREE.MeshStandardMaterial({
      map: doorTex,
      roughness: 0.3,
      metalness: 0.85
    });
    const doorGeo = new THREE.PlaneGeometry(2.4, 4.2);
    const door = new THREE.Mesh(doorGeo, doorMat);
    // Door is positioned on the +X wall (towards Maqam Ibrahim), elevated 2.2m from ground
    door.position.set(kw / 2 + 0.03, 4.2, 1.8);
    door.rotation.y = Math.PI / 2;
    this.group.add(door);

    // Golden Spout (Mizab ar-Rahmah) on North-West wall (+Z side towards Hijr Ismail)
    const spoutGeo = new THREE.BoxGeometry(0.5, 0.3, 1.8);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfcc201,
      metalness: 0.9,
      roughness: 0.2
    });
    const spout = new THREE.Mesh(spoutGeo, goldMat);
    spout.position.set(0, kh - 0.2, -kl / 2 - 0.8);
    this.group.add(spout);

    // The Black Stone (al-Hajar al-Aswad) at South-East corner (+X, +Z)
    const stoneGroup = new THREE.Group();
    // Silver casing
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8df,
      metalness: 0.95,
      roughness: 0.1
    });
    const casingGeo = new THREE.TorusGeometry(0.35, 0.14, 16, 32);
    const casing = new THREE.Mesh(casingGeo, silverMat);
    casing.rotation.y = Math.PI / 4;
    // Dark polished stone interior
    const stoneCoreGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const stoneCoreMat = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.1
    });
    const stoneCore = new THREE.Mesh(stoneCoreGeo, stoneCoreMat);
    stoneGroup.add(casing);
    stoneGroup.add(stoneCore);
    stoneGroup.position.set(kw / 2 + 0.05, 1.5, kl / 2 + 0.05);
    this.group.add(stoneGroup);

    // Green Light Beacon / Starting Line Indicator for Tawaf!
    // At the Black Stone corner, a glowing green beacon line on the floor & wall
    const greenLineGeo = new THREE.PlaneGeometry(0.3, 35);
    const greenLineMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.85
    });
    const greenLine = new THREE.Mesh(greenLineGeo, greenLineMat);
    greenLine.rotation.x = -Math.PI / 2;
    greenLine.position.set(kw / 2 + 18, 0.02, kl / 2);
    this.group.add(greenLine);

    // Glowing Green Lantern / Light Pillar at the wall
    const greenLampGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const greenLampMat = new THREE.MeshBasicMaterial({
      color: 0x10b981
    });
    const greenLamp = new THREE.Mesh(greenLampGeo, greenLampMat);
    greenLamp.position.set(kw / 2 + 35, 6, kl / 2);
    this.group.add(greenLamp);

    const greenLight = new THREE.PointLight(0x00ff88, 3, 20);
    greenLight.position.set(kw / 2 + 35, 6, kl / 2);
    this.group.add(greenLight);
    this.greenLightBeacon = greenLight;

    // 3. Hijr Ismail (The Hateem) - Semi-circular marble wall on North-West side (-Z)
    const hateemRadius = 6.8;
    const hateemWallGeo = new THREE.CylinderGeometry(
      hateemRadius,
      hateemRadius,
      1.1,
      48,
      1,
      true,
      Math.PI + 0.25,
      Math.PI - 0.5
    );
    const hateemMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const hateemWall = new THREE.Mesh(hateemWallGeo, hateemMat);
    hateemWall.position.set(0, 0.55, -kl / 2 - 2.5);
    this.group.add(hateemWall);

    // Lanterns on Hateem
    const hateemLanternMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.3
    });
    [-1, 0, 1].forEach(offset => {
      const angle = Math.PI * 1.5 + offset * 0.7;
      const lx = Math.sin(angle) * hateemRadius;
      const lz = -kl / 2 - 2.5 + Math.cos(angle) * hateemRadius;
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8), hateemLanternMat);
      lantern.position.set(lx, 1.4, lz);
      this.group.add(lantern);
    });

    // 4. Maqam Ibrahim (The Station of Ibrahim) - East of Ka'bah (+X)
    const maqamGroup = new THREE.Group();
    // Marble plinth
    const maqamPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.4, 6),
      new THREE.MeshStandardMaterial({ color: 0xedeae2, roughness: 0.3 })
    );
    maqamPlinth.position.y = 0.2;
    maqamGroup.add(maqamPlinth);

    // Crystal & Golden Lattice Kiosk
    const kioskGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 6);
    const kioskMat = new THREE.MeshStandardMaterial({
      color: 0xf7e199,
      metalness: 0.75,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const kiosk = new THREE.Mesh(kioskGeo, kioskMat);
    kiosk.position.y = 1.5;
    maqamGroup.add(kiosk);

    // Golden Dome top
    const domeGeo = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xdeb835,
      metalness: 0.9,
      roughness: 0.2
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 2.6;
    maqamGroup.add(dome);

    maqamGroup.position.set(kw / 2 + 10, 0, 0);
    this.group.add(maqamGroup);

    // 5. Zamzam Drinking Fountains (Station near Mataf)
    this.buildZamzamStation(kw / 2 + 16, -12);

    // 6. Grand Surrounding Colonnade (Grand Mosque Portico with Arches)
    this.buildGrandColonnade();

    // 7. Respectful Pilgrim Silhouettes (Translucent glowing white shapes)
    this.buildPilgrimSilhouettes();

    // 8. 4 Checkpoint Corners for Tawaf Guidance
    this.setupTawafCorners(kw, kl);
  }

  buildZamzamStation(x, z) {
    const stationGroup = new THREE.Group();
    // Marble dispenser counter
    const counterGeo = new THREE.BoxGeometry(4, 1.1, 2);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0xfdfcf7, roughness: 0.2 });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.y = 0.55;
    stationGroup.add(counter);

    // Golden dispensers
    const dispMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    [-1.2, 0, 1.2].forEach(dx => {
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.9, 16), dispMat);
      urn.position.set(dx, 1.45, 0);
      stationGroup.add(urn);
    });

    // Sign banner
    const signGeo = new THREE.PlaneGeometry(3, 0.8);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('مَاء زَمْزَم • ZAMZAM', 256, 75);
    const signTex = new THREE.CanvasTexture(canvas);
    const sign = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 2.3, 0);
    stationGroup.add(sign);

    stationGroup.position.set(x, 0, z);
    this.group.add(stationGroup);
  }

  buildGrandColonnade() {
    // Elegant Islamic portico around the perimeter
    const colonnadeGroup = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xeeebe1,
      roughness: 0.25
    });
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xe5dfcf,
      roughness: 0.3
    });

    const radius = 62;
    const numPillars = 48;

    for (let i = 0; i < numPillars; i++) {
      const angle = (i / numPillars) * Math.PI * 2;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;

      // Outer Pillar
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 14, 16), pillarMat);
      pillar.position.set(px, 7, pz);
      colonnadeGroup.add(pillar);

      // Capital / Arch block
      const capital = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 2.2), archMat);
      capital.position.set(px, 14.5, pz);
      colonnadeGroup.add(capital);
    }

    // Minarets in corners
    [[-65, -65], [65, -65], [-65, 65], [65, 65]].forEach(([mx, mz]) => {
      const minaretGroup = new THREE.Group();
      // Base
      const mBase = new THREE.Mesh(new THREE.BoxGeometry(6, 16, 6), pillarMat);
      mBase.position.y = 8;
      minaretGroup.add(mBase);
      // Shaft
      const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 38, 16), pillarMat);
      mShaft.position.y = 35;
      minaretGroup.add(mShaft);
      // Spire & Golden Crescent
      const mSpire = new THREE.Mesh(
        new THREE.ConeGeometry(2, 10, 16),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 })
      );
      mSpire.position.y = 59;
      minaretGroup.add(mSpire);

      minaretGroup.position.set(mx, 0, mz);
      colonnadeGroup.add(minaretGroup);
    });

    this.group.add(colonnadeGroup);
  }

  buildPilgrimSilhouettes() {
    // Elegant, glowing respectful silhouettes (no faces/realistic anatomy)
    const silhouetteTex = createPilgrimSilhouetteTexture();
    const silMat = new THREE.MeshBasicMaterial({
      map: silhouetteTex,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const silGeo = new THREE.PlaneGeometry(1.6, 2.8);

    // Spawn 55 pilgrim silhouettes at various concentric orbits around the Kaaba
    for (let i = 0; i < 55; i++) {
      const mesh = new THREE.Mesh(silGeo, silMat);
      // Radius between 13m and 32m from Ka'bah
      const orbitRadius = 13 + Math.random() * 20;
      const angle = (i / 55) * Math.PI * 2 + Math.random() * 0.2;
      // Walking speed (counter-clockwise)
      const speed = 0.003 + (1 / orbitRadius) * 0.02 + Math.random() * 0.002;

      mesh.position.set(Math.cos(angle) * orbitRadius, 1.4, Math.sin(angle) * orbitRadius);

      this.pilgrims.push({
        mesh,
        radius: orbitRadius,
        angle,
        speed,
        baseY: 1.4 + Math.random() * 0.05
      });

      this.group.add(mesh);
    }
  }

  setupTawafCorners(kw, kl) {
    // 4 Checkpoint corners around the Ka'bah
    // Tawaf moves counter-clockwise:
    // 1: Hajr al-Aswad (Black Stone) [Start/Finish] -> 2: Iraqi Corner -> 3: Shami/Syrian Corner -> 4: Yamani Corner -> Back to 1
    this.corners = [
      {
        id: 'blackStone',
        name: 'Al-Hajar al-Aswad (Black Stone & Green Light)',
        desc: 'Start here! Face the Ka’bah, raise right hand: Bismillahi Allahu Akbar!',
        pos: new THREE.Vector3(kw / 2 + 5, 1.6, kl / 2 + 5),
        angle: 0.78 // ~45 deg
      },
      {
        id: 'iraqiCorner',
        name: 'Rukn al-Iraqi (Iraqi Corner)',
        desc: 'Keep moving counter-clockwise with Sabr and peace.',
        pos: new THREE.Vector3(kw / 2 + 5, 1.6, -kl / 2 - 5),
        angle: 2.35 // ~135 deg
      },
      {
        id: 'shamiCorner',
        name: 'Rukn ash-Shami (Syrian Corner & Hijr Ismail)',
        desc: 'Passing the crescent of Hijr Ismail. Recite your du’a with focus (Khushu)!',
        pos: new THREE.Vector3(-kw / 2 - 5, 1.6, -kl / 2 - 5),
        angle: 3.92 // ~225 deg
      },
      {
        id: 'yamaniCorner',
        name: 'Rukn al-Yamani (Yemeni Corner)',
        desc: 'Touch or acknowledge with peace! Begin reciting: Rabbana atina fid-dunya hasanah...',
        pos: new THREE.Vector3(-kw / 2 - 5, 1.6, kl / 2 + 5),
        angle: 5.5 // ~315 deg
      }
    ];
  }

  update(delta, cameraPos) {
    // Animate pilgrim silhouettes smoothly counter-clockwise around the Ka'bah
    this.pilgrims.forEach(p => {
      p.angle += p.speed;
      if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

      p.mesh.position.x = Math.cos(p.angle) * p.radius;
      p.mesh.position.z = Math.sin(p.angle) * p.radius;
      // Gentle floating walking bob
      p.mesh.position.y = p.baseY + Math.sin(Date.now() * 0.005 + p.angle * 10) * 0.05;

      // Always billboard face towards the first-person camera for crisp perspective
      if (cameraPos) {
        p.mesh.lookAt(cameraPos.x, p.mesh.position.y, cameraPos.z);
      }
    });

    // Pulse the green beacon light softly
    if (this.greenLightBeacon) {
      this.greenLightBeacon.intensity = 2.5 + Math.sin(Date.now() * 0.004) * 0.8;
    }
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
