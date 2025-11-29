class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Helper to ensure context is running (needed for some browsers after user gesture)
  private async resume() {
    this.init();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  async playWhack() {
    await this.resume();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Cute "Pop" / "Chirp"
    osc.type = 'sine';
    // Quick upward pitch slide for a "happy" sound
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);
    
    // Envelope: sharp attack, quick decay
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    
    osc.start(t);
    osc.stop(t + 0.15);
  }

  async playStart() {
    await this.resume();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    
    // Major Arpeggio (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = 'triangle'; // Triangle wave sounds a bit like a bell/flute
        osc.frequency.value = freq;
        
        const startTime = t + i * 0.1;
        
        // Bell-like envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        
        osc.start(startTime);
        osc.stop(startTime + 0.5);
    });
  }

  async playGameOver() {
    await this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Descending sequence (G5, E5, C5)
    const notes = [783.99, 659.25, 523.25];
    
    notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = 'sine'; // Softer, sadder sine wave
        osc.frequency.value = freq;
        
        const startTime = t + i * 0.3;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
        
        osc.start(startTime);
        osc.stop(startTime + 0.6);
    });
  }
}

export const audioService = new AudioService();