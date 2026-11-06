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

    this.container.appendChild(this.renderer.domElement);

    // Warm daylight sun
    const hemiLight = new THREE.HemisphereLight(0xfffef5, 0xebdcc7, 1.1);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.5);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
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

    this.controls = new FirstPersonController(this.camera, this.renderer.domElement);
  }

  initGame() {
    this.game = new GameManager(this.matafScene, this.saiScene, this.controls, this.camera);

    // Wire up stage progression buttons
    document.getElementById('btn-proceed-to-tawaf')?.addEventListener('click', () => {
      this.game.setStage('tawaf');
    });

    document.getElementById('btn-advance-tawaf')?.addEventListener('click', () => {
      this.game.advanceTawafCircuit();
    });

    document.getElementById('btn-proceed-to-maqam')?.addEventListener('click', () => {
      this.game.setStage('maqam');
    });

    document.getElementById('btn-proceed-to-zamzam')?.addEventListener('click', () => {
      this.game.setStage('zamzam');
    });

    document.getElementById('btn-drink-zamzam')?.addEventListener('click', () => {
      soundManager.playZamzamWaterSound();
      soundManager.playVirtueChime();
      const cup = document.getElementById('zamzam-cup-btn');
      if (cup) {
        cup.innerHTML = '💧 <span>Drank 3 sips with Bismillah! Alhamdulillah!</span>';
        cup.classList.add('bg-emerald-100', 'text-emerald-900', 'border-emerald-400');
      }
      setTimeout(() => {
        document.getElementById('btn-proceed-to-sai')?.classList.remove('hidden');
      }, 1000);
    });

    document.getElementById('btn-proceed-to-sai')?.addEventListener('click', () => {
      this.game.setStage('sai');
    });

    document.getElementById('btn-advance-sai')?.addEventListener('click', () => {
      this.game.advanceSaiLap();
    });

    document.getElementById('btn-proceed-to-taqsir')?.addEventListener('click', () => {
      this.game.setStage('taqsir');
    });

    document.getElementById('btn-cut-hair')?.addEventListener('click', () => {
      soundManager.playVirtueChime();
      this.game.unlockVirtue('forgiveness');
      const hairBtn = document.getElementById('btn-cut-hair');
      if (hairBtn) {
        hairBtn.innerHTML = '✂️ <span>Hair Trimmed with Humility! Sins Forgiven!</span>';
        hairBtn.classList.add('bg-emerald-100', 'text-emerald-900', 'border-emerald-400');
      }
      setTimeout(() => {
        document.getElementById('btn-finish-umrah')?.classList.remove('hidden');
      }, 1000);
    });

    document.getElementById('btn-finish-umrah')?.addEventListener('click', () => {
      this.game.setStage('complete');
    });

    document.getElementById('btn-explore-freely')?.addEventListener('click', () => {
      document.getElementById('panel-complete')?.classList.add('hidden');
      this.game.showVirtueNotification('ikhlas');
    });

    document.getElementById('btn-print-diploma')?.addEventListener('click', () => {
      window.print();
    });
  }

  bindGlobalEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Fullscreen toggle
    const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          btnFullscreen.textContent = '⤓ Exit';
        } else {
          document.exitFullscreen().catch(() => {});
          btnFullscreen.textContent = '⛶ Fullscreen';
        }
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Update Controls & Bounds
    this.controls.update(delta, (newX, newZ, curPos) => {
      return this.game.checkBounds(newX, newZ, curPos);
    });

    // Update Scenes
    if (this.game.currentStage === 'sai') {
      this.saiScene.update(delta, this.camera.position);
    } else {
      this.matafScene.update(delta, this.camera.position);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
