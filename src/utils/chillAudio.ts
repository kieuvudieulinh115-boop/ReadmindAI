// Web Audio API Ambient / Chill Lofi Sound Synthesizer
// Produces relaxing, gentle study music (Soft Piano chords, Vinyl crackle, Rain atmosphere, Wind chime)

class ChillAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentMode: 'lofi' | 'rain' | 'chime' = 'lofi';
  private gainNode: GainNode | null = null;
  private intervalId: any = null;
  private noiseNode: AudioNode | null = null;
  private volume = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getMode(): 'lofi' | 'rain' | 'chime' {
    return this.currentMode;
  }

  // Play a soft bell/piano note with smooth ADSR envelope
  private playChordNote(freq: number, time: number, duration: number, velocity = 0.12) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Gentle warm triangle / sine wave
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.Q.setValueAtTime(1.5, time);

    // Soft gentle envelope
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.exponentialRampToValueAtTime(velocity, time + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, time + duration * 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Ambient gentle wind/vinyl or rain texture
  private startNoiseTexture(type: 'vinyl' | 'rain') {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink/Brown noise filter
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 1.8;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
    filter.frequency.value = type === 'rain' ? 500 : 800;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = type === 'rain' ? 0.04 : 0.015;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.gainNode);

    noise.start();
    this.noiseNode = noise;
  }

  // Relaxing chord progressions (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
  private chords = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [130.81, 164.81, 196.00, 246.94], // Cmaj7
  ];

  public start(mode: 'lofi' | 'rain' | 'chime' = 'lofi') {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentMode = mode;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
    this.isPlaying = true;

    if (mode === 'rain') {
      this.startNoiseTexture('rain');
      // Occasional distant gentle raindrop chime
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        const note = [523.25, 659.25, 783.99, 880.00][Math.floor(Math.random() * 4)];
        this.playChordNote(note, now + 0.1, 2.5, 0.03);
      }, 3500);
      return;
    }

    if (mode === 'chime') {
      // Wind chimes in nature
      this.startNoiseTexture('vinyl');
      const chimePentatonic = [587.33, 659.25, 783.99, 880.00, 987.77, 1174.66];
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        const count = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const note = chimePentatonic[Math.floor(Math.random() * chimePentatonic.length)];
          this.playChordNote(note, now + i * 0.25, 3.5, 0.05);
        }
      }, 3000);
      return;
    }

    // Default: Soft Chill Lofi Piano Loop
    this.startNoiseTexture('vinyl');
    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const currentChord = this.chords[chordIdx % this.chords.length];

      // Arpeggiate chord notes smoothly
      currentChord.forEach((freq, idx) => {
        this.playChordNote(freq, now + idx * 0.2, 3.5, 0.08);
      });

      // Add a higher sparkle note
      const highNote = currentChord[currentChord.length - 1] * 2;
      this.playChordNote(highNote, now + 1.2, 2.0, 0.04);

      chordIdx++;
    };

    playNextChord();
    this.intervalId = setInterval(playNextChord, 3800);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
      } catch {}
      this.noiseNode = null;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }

  public toggle(mode?: 'lofi' | 'rain' | 'chime'): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(mode || this.currentMode);
      return true;
    }
  }
}

export const chillAudio = new ChillAudioEngine();
