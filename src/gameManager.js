import * as THREE from 'three';
import { soundManager, QURAN_AYATS } from './audio.js';

export class GameManager {
  constructor(matafScene, saiScene, controls, camera) {
    this.mataf = matafScene;
    this.sai = saiScene;
    this.controls = controls;
    this.camera = camera;

    // Player state
    this.playerName = 'Little Pilgrim';
    this.characterGender = 'boy'; // 'boy' or 'girl'
    this.currentStage = 'welcome'; // welcome, intention, tawaf, maqam, zamzam, sai, taqsir, complete

    // Virtues unlocked
    this.virtues = {
      ikhlas: false,   // Sincerity & Intention
      sabr: false,     // Patience & Anger Control
      khushu: false,   // Focus in Worship
      shukr: false,    // Gratitude
      forgiveness: false // Forgiveness & Clean Heart
    };

    // Tawaf tracking
    this.tawafCircuit = 0; // 0 to 7
    this.currentTawafCornerIdx = 0;
    this.tawafCompleted = false;

    // Sa'i tracking
    this.saiLap = 0; // 0 to 7
    this.saiCurrentEnd = 'safa'; // 'safa' or 'marwah'
    this.saiCompleted = false;

    // Active modal / dialog state
    this.activeAyahKey = null;

    this.initUI();
  }

  initUI() {
    this.bindEvents();
    this.updateVirtueBadgesUI();
  }

  bindEvents() {
    // Start Journey button
    const btnStart = document.getElementById('btn-start-journey');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        soundManager.unlockAudio();
        const nameInput = document.getElementById('player-name-input');
        if (nameInput && nameInput.value.trim()) {
          this.playerName = nameInput.value.trim();
        }
        const boyRadio = document.getElementById('gender-boy');
        this.characterGender = (boyRadio && boyRadio.checked) ? 'boy' : 'girl';

        this.setStage('intention');
      });
    }

    // Sound toggle button
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        soundManager.unlockAudio();
        const muted = soundManager.toggleMute();
        btnSound.textContent = muted ? '🔇 Sound Off' : '🔊 Sound On';
      });
    }

    // Ayah audio listen button
    const btnListenAyah = document.getElementById('btn-listen-ayah');
    if (btnListenAyah) {
      btnListenAyah.addEventListener('click', () => {
        if (this.activeAyahKey) {
          soundManager.playAyah(this.activeAyahKey);
        }
      });
    }

    // Auto-walk guide button
    const btnGuide = document.getElementById('btn-guide-step');
    if (btnGuide) {
      btnGuide.addEventListener('click', () => {
        this.guideToNextTarget();
      });
    }
  }

  setStage(stage) {
    this.currentStage = stage;
    soundManager.unlockAudio();

    // Hide all stage UI panels
    document.querySelectorAll('.stage-panel').forEach(p => p.classList.add('hidden'));

    switch (stage) {
      case 'welcome':
        this.showPanel('panel-welcome');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        this.camera.position.set(0, 1.6, 28);
        this.controls.yaw = 0;
        this.controls.pitch = 0.05;
        break;

      case 'intention':
        this.showPanel('panel-intention');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        this.camera.position.set(0, 1.6, 25);
        this.controls.yaw = 0;
        this.activeAyahKey = 'ihram';
        this.updateAyahCard('ihram');
        this.startSabrShieldMiniGame();
        break;

      case 'tawaf':
        this.showPanel('panel-tawaf');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        // Position at Black Stone starting corner
        this.camera.position.set(11, 1.6, 12);
        this.controls.yaw = -Math.PI / 4;
        this.activeAyahKey = 'tawafDua';
        this.updateAyahCard('tawafDua');
        this.updateTawafUI();
        break;

      case 'maqam':
        this.showPanel('panel-maqam');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        this.camera.position.set(15, 1.6, 0);
        this.controls.yaw = -Math.PI / 2;
        this.activeAyahKey = 'maqamIbrahim';
        this.updateAyahCard('maqamIbrahim');
        break;

      case 'zamzam':
        this.showPanel('panel-zamzam');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        this.camera.position.set(20, 1.6, -12);
        this.controls.yaw = -Math.PI * 0.75;
        break;

      case 'sai':
        this.showPanel('panel-sai');
        this.mataf.setVisible(false);
        this.sai.setVisible(true);
        // Position at Mount Safa
        this.camera.position.set(0, 1.6, -38);
        this.controls.yaw = 0;
        this.activeAyahKey = 'safaMarwa';
        this.updateAyahCard('safaMarwa');
        this.updateSaiUI();
        break;

      case 'taqsir':
        this.showPanel('panel-taqsir');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        this.camera.position.set(0, 1.6, 22);
        this.controls.yaw = 0;
        this.activeAyahKey = 'halq';
        this.updateAyahCard('halq');
        break;

      case 'complete':
        this.showPanel('panel-complete');
        this.mataf.setVisible(true);
        this.sai.setVisible(false);
        this.renderDiploma();
        break;
    }
  }

  showPanel(panelId) {
    const p = document.getElementById(panelId);
    if (p) p.classList.remove('hidden');
  }

  updateAyahCard(key) {
    const data = QURAN_AYATS[key];
    if (!data) return;

    const elTitle = document.getElementById('ayah-title');
    const elRef = document.getElementById('ayah-reference');
    const elArabic = document.getElementById('ayah-arabic');
    const elTrans = document.getElementById('ayah-translation');
    const elTranslit = document.getElementById('ayah-transliteration');

    if (elTitle) elTitle.textContent = data.title;
    if (elRef) elRef.textContent = `Surah ${data.surah} [${data.ayahNum}]`;
    if (elArabic) elArabic.textContent = data.arabic;
    if (elTrans) elTrans.textContent = `"${data.translation}"`;
    if (elTranslit) elTranslit.textContent = data.transliteration;
  }

  // Mini-Game 1: Sabr Shield & Sincerity
  startSabrShieldMiniGame() {
    const container = document.getElementById('sabr-bubbles-container');
    if (!container) return;
    container.innerHTML = '';

    const distractions = [
      { bad: '😡 "Someone pushed me!"', good: '🤍 Sabr! "May Allah forgive us both!"' },
      { bad: '🥵 "It is so hot & crowded!"', good: '🤲 Shukr! "Alhamdulillah for being here!"' },
      { bad: '📱 "Let me take a cool selfie!"', good: '🎯 Focus! "My heart is with Allah!"' },
      { bad: '😤 "Why is the line so long?!"', good: '🛡️ Patience! "Waiting with peace earns reward!"' }
    ];

    let cleared = 0;
    distractions.forEach((item, idx) => {
      const bubble = document.createElement('button');
      bubble.className =
        'sabr-bubble bg-amber-50 hover:bg-emerald-50 text-amber-900 border-2 border-amber-300 rounded-xl p-3 text-left transition transform active:scale-95 shadow-sm flex flex-col gap-1 w-full';
      bubble.innerHTML = `
        <span class="text-xs font-semibold uppercase tracking-wider text-amber-700">Test ${idx + 1}</span>
        <span class="text-sm font-bold text-red-600">${item.bad}</span>
        <span class="text-xs text-gray-500 italic">Tap to activate Sabr!</span>
      `;

      bubble.addEventListener('click', () => {
        bubble.className =
          'sabr-bubble bg-emerald-50 text-emerald-950 border-2 border-emerald-400 rounded-xl p-3 text-left shadow-sm flex flex-col gap-1 w-full scale-100 transition';
        bubble.innerHTML = `
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Protected with Sabr! ✨</span>
          <span class="text-sm font-bold text-emerald-700">${item.good}</span>
        `;
        bubble.disabled = true;
        soundManager.playVirtueChime();
        cleared++;

        if (cleared >= distractions.length) {
          this.unlockVirtue('ikhlas');
          this.unlockVirtue('sabr');
          const btnProceed = document.getElementById('btn-proceed-to-tawaf');
          if (btnProceed) {
            btnProceed.classList.remove('hidden');
            btnProceed.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });

      container.appendChild(bubble);
    });
  }

  // Tawaf Management
  updateTawafUI() {
    const elCounter = document.getElementById('tawaf-circuit-count');
    const elDhikr = document.getElementById('tawaf-circuit-dhikr');
    const elDesc = document.getElementById('tawaf-corner-info');

    const dhikrs = [
      'Circuit 1: سُبْحَانَ اللَّهِ (SubhanAllah - Glory be to Allah)',
      'Circuit 2: الْحَمْدُ لِلَّهِ (Alhamdulillah - Praise be to Allah)',
      'Circuit 3: لَا إِلَهَ إِلَّا اللَّهُ (La ilaha illAllah - None worthy of worship but Allah)',
      'Circuit 4: اللَّهُ أَكْبَرُ (Allahu Akbar - Allah is the Greatest)',
      'Circuit 5: أَسْتَغْفِرُ اللَّهَ (Astaghfirullah - I ask Allah for forgiveness)',
      'Circuit 6: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
      'Circuit 7: رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ'
    ];

    if (elCounter) {
      elCounter.textContent = `${this.tawafCircuit} / 7`;
    }
    if (elDhikr) {
      elDhikr.textContent = this.tawafCircuit > 0 ? dhikrs[this.tawafCircuit - 1] : 'Face the Ka’bah at the Green Light line to begin!';
    }
    if (elDesc) {
      const corner = this.mataf.corners[this.currentTawafCornerIdx];
      elDesc.textContent = corner ? `${corner.name}: ${corner.desc}` : '';
    }
  }

  advanceTawafCircuit() {
    if (this.tawafCircuit < 7) {
      this.tawafCircuit++;
      soundManager.playVirtueChime();
      this.updateTawafUI();

      if (this.tawafCircuit === 7) {
        this.tawafCompleted = true;
        this.unlockVirtue('khushu');
        const btnMaqam = document.getElementById('btn-proceed-to-maqam');
        if (btnMaqam) btnMaqam.classList.remove('hidden');
      }
    }
  }

  // Sa'i Management
  updateSaiUI() {
    const elCounter = document.getElementById('sai-lap-count');
    const elInfo = document.getElementById('sai-lap-info');

    if (elCounter) {
      elCounter.textContent = `${this.saiLap} / 7 Laps`;
    }

    if (elInfo) {
      if (this.saiLap === 0) {
        elInfo.textContent = 'Begin Lap 1 at Mount Safa! Face the Ka’bah, raise your hands, and make du’a.';
      } else if (this.saiLap % 2 === 1) {
        elInfo.textContent = `Lap ${this.saiLap}: Walking from Safa to Marwah. Jog in the green light zone!`;
      } else {
        elInfo.textContent = `Lap ${this.saiLap}: Returning from Marwah back to Safa with Sabr & Tawakkul.`;
      }
    }
  }

  advanceSaiLap() {
    if (this.saiLap < 7) {
      this.saiLap++;
      soundManager.playVirtueChime();
      this.updateSaiUI();

      if (this.saiLap === 7) {
        this.saiCompleted = true;
        this.unlockVirtue('shukr');
        const btnTaqsir = document.getElementById('btn-proceed-to-taqsir');
        if (btnTaqsir) btnTaqsir.classList.remove('hidden');
      }
    }
  }

  // Virtue Unlocker
  unlockVirtue(virtueKey) {
    if (this.virtues[virtueKey]) return;
    this.virtues[virtueKey] = true;
    soundManager.playVirtueChime();
    this.updateVirtueBadgesUI();
    this.showVirtueNotification(virtueKey);
  }

  updateVirtueBadgesUI() {
    const map = {
      ikhlas: { icon: '🤍', title: 'Ikhlas (Sincerity)' },
      sabr: { icon: '🛡️', title: 'Sabr (Patience)' },
      khushu: { icon: '🎯', title: 'Khushu (Focus)' },
      shukr: { icon: '🤲', title: 'Shukr (Gratitude)' },
      forgiveness: { icon: '✨', title: 'Forgiveness' }
    };

    const container = document.getElementById('virtue-badges-bar');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(map).forEach(key => {
      const active = this.virtues[key];
      const badge = document.createElement('div');
      badge.className = `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition border ${
        active
          ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
          : 'bg-white/60 text-gray-400 border-gray-200 opacity-60'
      }`;
      badge.innerHTML = `<span>${map[key].icon}</span><span class="hidden sm:inline">${map[key].title}</span>`;
      container.appendChild(badge);
    });
  }

  showVirtueNotification(key) {
    const toast = document.getElementById('virtue-toast');
    const toastText = document.getElementById('virtue-toast-text');
    if (!toast || !toastText) return;

    const titles = {
      ikhlas: 'Pure Intention Unlocked! 🤍',
      sabr: 'Sabr Shield Mastered! 🛡️',
      khushu: 'Focus & Reverence in Tawaf Achieved! 🎯',
      shukr: 'Gratitude & Reliance Unlocked! 🤲',
      forgiveness: 'Clean Slate & Full Forgiveness! ✨'
    };

    toastText.textContent = titles[key] || 'Virtue Unlocked!';
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 3800);
  }

  guideToNextTarget() {
    if (this.currentStage === 'tawaf') {
      // Guide around the next corner
      this.currentTawafCornerIdx = (this.currentTawafCornerIdx + 1) % 4;
      const corner = this.mataf.corners[this.currentTawafCornerIdx];
      if (corner) {
        this.controls.walkToTarget(corner.pos);
        if (this.currentTawafCornerIdx === 0) {
          this.advanceTawafCircuit();
        }
        this.updateTawafUI();
      }
    } else if (this.currentStage === 'sai') {
      // Guide between Safa and Marwah
      if (this.saiCurrentEnd === 'safa') {
        this.controls.walkToTarget(this.sai.marwaPos);
        this.saiCurrentEnd = 'marwah';
      } else {
        this.controls.walkToTarget(this.sai.safaPos);
        this.saiCurrentEnd = 'safa';
      }
      this.advanceSaiLap();
    }
  }

  renderDiploma() {
    const elName = document.getElementById('diploma-child-name');
    const elDate = document.getElementById('diploma-date');
    if (elName) elName.textContent = this.playerName;
    if (elDate) {
      elDate.textContent = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    soundManager.playVirtueChime();
  }

  // Bounds checker to keep player on marble and outside Kaaba solid walls
  checkBounds(newX, newZ, currentPos) {
    if (this.currentStage === 'sai') {
      // Masa'a bounds: x between -9 and 9, z between -46 and 46
      const clampedX = Math.max(-9, Math.min(9, newX));
      const clampedZ = Math.max(-46, Math.min(46, newZ));

      // Check if entering green zone to activate boost
      const inGreenZone = Math.abs(clampedZ) < 14;
      this.controls.boostSpeed = inGreenZone ? 1.6 : 1.0;

      // Update lap detection when reaching ends
      if (clampedZ < -40 && this.saiCurrentEnd === 'marwah') {
        this.saiCurrentEnd = 'safa';
        this.advanceSaiLap();
      } else if (clampedZ > 40 && this.saiCurrentEnd === 'safa') {
        this.saiCurrentEnd = 'marwah';
        this.advanceSaiLap();
      }

      return { x: clampedX, z: clampedZ };
    }

    // Mataf / Ka'bah bounds
    // Keep within radius 55m from center
    const dist = Math.hypot(newX, newZ);
    let rx = newX;
    let rz = newZ;
    if (dist > 55) {
      rx = (newX / dist) * 55;
      rz = (newZ / dist) * 55;
    }

    // Ka'bah box collision (Ka'bah is 11m x 12.5m -> half extents 5.5m and 6.25m + 1.2m player margin)
    const minX = -6.8;
    const maxX = 6.8;
    const minZ = -7.5;
    const maxZ = 7.5;

    if (rx > minX && rx < maxX && rz > minZ && rz < maxZ) {
      // Revert to current position to avoid walking into Ka'bah
      return { x: currentPos.x, z: currentPos.z };
    }

    return { x: rx, z: rz };
  }
}
