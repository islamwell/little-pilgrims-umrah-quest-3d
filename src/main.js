import * as THREE from 'three';
import { MatafScene } from './sceneMataf.js';
import { SaiScene } from './sceneSai.js';
import { FirstPersonController } from './controls.js';
import { GameManager } from './gameManager.js';
import { soundManager } from './audio.js';

class App {
  constructor() {
    this.container = document.getElementById('webgl-container');
    this.initThree();
    this.initScenes();
    this.initGame();
    this.bindGlobalEvents();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce7f0); // Warm daytime sky
    this.scene.fog = new THREE.FogExp2(0xdce7f0, 0.009);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 500);
    this.camera.position.set(0, 1.6, 26);

    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;

      if (this.container) {
        this.container.appendChild(this.renderer.domElement);
      }
    } catch (e) {
      console.warn('WebGL initialization warning:', e);
    }

    // Warm daylight sun
    const hemiLight = new THREE.HemisphereLight(0xfffef5, 0xebdcc7, 1.1);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.5);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    this.clock = new THREE.Clock();
  }

  initScenes() {
    this.matafScene = new MatafScene(this.scene);
    this.saiScene = new SaiScene(this.scene);
    this.saiScene.setVisible(false);

    const domTarget = this.renderer ? this.renderer.domElement : document.body;
    this.controls = new FirstPersonController(this.camera, domTarget);
  }

  initGame() {
    this.game = new GameManager(this.matafScene, this.saiScene, this.controls, this.camera);
  }

  bindGlobalEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      if (this.renderer) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    // Fullscreen toggle
    const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', (e) => {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          btnFullscreen.textContent = '⤓ Exit';
        } else {
          document.exitFullscreen().catch(() => {});
          btnFullscreen.textContent = '⛶ Fullscreen';
        }
      });
    }

    // Unlock audio on any global interaction
    window.addEventListener('pointerdown', () => soundManager.unlockAudio(), { once: true });
    window.addEventListener('keydown', () => soundManager.unlockAudio(), { once: true });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Update Controls & Bounds
    if (this.controls && this.game) {
      this.controls.update(delta, (newX, newZ, curPos) => {
        return this.game.checkBounds(newX, newZ, curPos);
      });
    }

    // Update Scenes
    if (this.game && this.game.currentStage === 'sai') {
      if (this.saiScene) this.saiScene.update(delta, this.camera.position);
    } else {
      if (this.matafScene) this.matafScene.update(delta, this.camera.position);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

function startApp() {
  try {
    new App();
  } catch (err) {
    console.error('App init error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
