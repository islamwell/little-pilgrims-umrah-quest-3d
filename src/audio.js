// Audio Controller - Strictly NO MUSIC, Authentic Quran Ayats & Natural Sound Effects

export const QURAN_AYATS = {
  ihram: {
    surah: 'Al-Baqarah',
    ayahNum: '2:197',
    title: 'Purity, Sabr & No Anger in Ihram',
    arabic: 'فَمَن فَرَضَ فِيهِنَّ الْحَجَّ فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ ۗ وَمَا تَفْعَلُوا مِنْ خَيْرٍ يَعْلَمْهُ اللَّهُ ۗ وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ',
    transliteration: "Faman farada feehinnal-hajja falaa rafatha wa laa fusooqa wa laa jidaala fil-hajj, wa maa taf'aloo min khayrin ya'lamhullah, wa tazawwadoo fa inna khayraz-zaadit-taqwa...",
    translation: "Whoever undertakes pilgrimage, there shall be no obscenity, no wickedness, and no quarreling. Whatever good you do, Allah knows it. And take provisions, but indeed, the best provision is Taqwa (mindfulness of Allah).",
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002197.mp3'
  },
  tawafDua: {
    surah: 'Al-Baqarah',
    ayahNum: '2:201',
    title: 'The Golden Du’a of Tawaf (Between Yemeni Corner & Black Stone)',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'adhaaban-naar",
    translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.",
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002201.mp3'
  },
  maqamIbrahim: {
    surah: 'Al-Baqarah',
    ayahNum: '2:125',
    title: 'Prayer at the Station of Ibrahim',
    arabic: 'وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى ۖ وَعَهِدْنَا إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ أَن طَهِّرَا بَيْتِيَ لِلطَّائِفِينَ وَالْعَاكِفِينَ وَالرُّكَّعِ السُّجُودِ',
    transliteration: "Wattakhidhoo min maqaami Ibraaheema musallaa...",
    translation: "And take the Station of Ibrahim as a place of prayer, and We charged Ibrahim and Ismail: 'Purify My House for those who perform Tawaf and those who stay for worship and those who bow and prostrate.'",
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002125.mp3'
  },
  safaMarwa: {
    surah: 'Al-Baqarah',
    ayahNum: '2:158',
    title: 'The Sacred Hills of Safa & Marwah',
    arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا ۚ وَمَن تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ',
    transliteration: "Innas-Safaa wal-Marwata min sha'aaa'irillaah...",
    translation: "Indeed, As-Safa and Al-Marwah are among the symbols of Allah. So whoever makes Hajj or Umrah, there is no blame upon him for walking between them. And whoever does good voluntarily - then indeed, Allah is Appreciative and Knowing.",
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002158.mp3'
  },
  halq: {
    surah: 'Al-Fath',
    ayahNum: '48:27',
    title: 'Entering in Peace with Trimmed Hair (Halq & Taqsir)',
    arabic: 'لَّتَدْخُلُنَّ الْمَسْجِدَ الْحَرَامَ إِن شَاءَ اللَّهُ آمِنِينَ مُحَلِّقِينَ رُءُوسَكُمْ وَمُقَصِّرِينَ لَا تَخَافُونَ',
    transliteration: "La-tadkhulunnal-masjidal-haraama inshaa'Allaahu aamineena muhalliqeena ru'oosakum wa muqassireen...",
    translation: "You will surely enter the Sacred Mosque, if Allah wills, in safety, with heads shaved and hair shortened, having no fear.",
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/048027.mp3'
  }
};

export class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.currentAyahAudio = null;
    this.isMuted = false;
    this.windGain = null;
    this.hasInteracted = false;
  }

  init() {
    if (this.audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio not supported in this browser', e);
    }
  }

  unlockAudio() {
    this.hasInteracted = true;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.startGentleWindAmbience();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentAyahAudio) {
      this.currentAyahAudio.muted = this.isMuted;
    }
    if (this.windGain) {
      this.windGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }

  // Pure natural desert breeze (pink noise, zero instruments/melody)
  startGentleWindAmbience() {
    if (!this.audioCtx || this.windGain || this.isMuted) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        output[i] = (b0 + b1 + b2 + b3 + b4) * 0.04;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

      this.windGain = this.audioCtx.createGain();
      this.windGain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.audioCtx.destination);
      whiteNoise.start();
    } catch (e) {
      console.warn('Could not start ambient wind', e);
    }
  }

  // Pure natural water droplet / trickling sound for Zamzam
  playZamzamWaterSound() {
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    for (let i = 0; i < 4; i++) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';

      const baseFreq = 700 + Math.random() * 400;
      osc.frequency.setValueAtTime(baseFreq, now + i * 0.12);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 350, now + i * 0.12 + 0.08);

      gain.gain.setValueAtTime(0.12, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.12);
    }
  }

  // Pure gentle single chime for completing a round or achieving a virtue badge
  playVirtueChime() {
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // 528 Hz calm frequency
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  // Gentle marble step tap
  playStepSound() {
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 20, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Play official recitation of an Ayah from Mishary Rashid Alafasy
  playAyah(ayahKey, onEndCallback) {
    const data = QURAN_AYATS[ayahKey];
    if (!data) return;

    if (this.currentAyahAudio) {
      this.currentAyahAudio.pause();
      this.currentAyahAudio.currentTime = 0;
    }

    try {
      const audio = new Audio(data.audioUrl);
      audio.crossOrigin = 'anonymous';
      audio.muted = this.isMuted;
      this.currentAyahAudio = audio;

      audio.play().catch(err => {
        console.warn('Audio play auto-prevented; user interaction required', err);
      });

      audio.onended = () => {
        if (onEndCallback) onEndCallback();
      };
    } catch (e) {
      console.warn('Ayah audio load error', e);
    }
  }

  stopCurrentAyah() {
    if (this.currentAyahAudio) {
      this.currentAyahAudio.pause();
      this.currentAyahAudio.currentTime = 0;
      this.currentAyahAudio = null;
    }
  }
}

export const soundManager = new SoundManager();
