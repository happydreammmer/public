import { LiveDisplayElements } from '../types';

export class LiveDisplayManager {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private waveformDataArray: Uint8Array | null = null;
  private waveformDrawingId: number | null = null;
  private timerIntervalId: number | null = null;
  private recordingStartTime: number = 0;

  private elements: LiveDisplayElements;
  private liveWaveformCtx: CanvasRenderingContext2D | null = null;
  private isLive: boolean = false;

  constructor(elements: LiveDisplayElements) {
    this.elements = elements;
    if (this.elements.liveWaveformCanvas) {
      this.liveWaveformCtx = this.elements.liveWaveformCanvas.getContext('2d');
      if (!this.liveWaveformCtx) {
        console.warn('Failed to get 2D context for live waveform canvas.');
      }
    } else {
      console.warn('Live waveform canvas element not provided to LiveDisplayManager.');
    }
    this.handleResize = this.handleResize.bind(this);
  }

  private setupAudioVisualizer(stream: MediaStream): void {
    if (!stream || !stream.active || this.audioContext || !this.liveWaveformCtx) {
        if (!stream || !stream.active) console.warn("LiveDisplay: Stream is not active for visualizer.");
        return;
    }

    try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 256;
        this.analyserNode.smoothingTimeConstant = 0.7;
        const bufferLength = this.analyserNode.frequencyBinCount;
        this.waveformDataArray = new Uint8Array(bufferLength);
        source.connect(this.analyserNode);
    } catch (e) {
        console.error("Error setting up audio visualizer:", e);
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(console.warn);
        }
        this.audioContext = null;
        this.analyserNode = null;
    }
  }

  private drawLiveWaveform(): void {
    if (
      !this.analyserNode || !this.waveformDataArray || !this.liveWaveformCtx ||
      !this.elements.liveWaveformCanvas || !this.isLive
    ) {
      if (this.waveformDrawingId) cancelAnimationFrame(this.waveformDrawingId);
      this.waveformDrawingId = null;
      return;
    }

    this.waveformDrawingId = requestAnimationFrame(() => this.drawLiveWaveform());
    
    try {
        this.analyserNode.getByteFrequencyData(this.waveformDataArray);
    } catch (e) {
        // This can happen if the audio context closes unexpectedly
        console.warn("Error getting frequency data, stopping waveform:", e);
        this.stopVisualizerDrawing(); // Stop drawing if analyser fails
        return;
    }


    const ctx = this.liveWaveformCtx;
    const canvas = this.elements.liveWaveformCanvas;
    const logicalWidth = canvas.clientWidth;
    const logicalHeight = canvas.clientHeight;

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    const bufferLength = this.analyserNode.frequencyBinCount;
    const numBars = Math.floor(bufferLength * 0.6);
    if (numBars === 0) return;

    const totalBarPlusSpacingWidth = logicalWidth / numBars;
    const barWidth = Math.max(1, Math.floor(totalBarPlusSpacingWidth * 0.65));
    const barSpacing = Math.max(0, Math.floor(totalBarPlusSpacingWidth * 0.35));
    let x = 0;
    const recordingColor = getComputedStyle(document.documentElement).getPropertyValue('--color-recording').trim() || '#ff3b30';
    ctx.fillStyle = recordingColor;

    for (let i = 0; i < numBars; i++) {
      if (x >= logicalWidth) break;
      const dataIndex = Math.floor(i * (bufferLength / numBars));
      const barHeightNormalized = this.waveformDataArray[dataIndex] / 255.0;
      let barHeight = barHeightNormalized * logicalHeight;
      if (barHeight < 1 && barHeight > 0) barHeight = 1;
      barHeight = Math.round(barHeight);
      const y = Math.round((logicalHeight - barHeight) / 2);
      ctx.fillRect(Math.floor(x), y, barWidth, barHeight);
      x += barWidth + barSpacing;
    }
  }

  private updateLiveTimer(): void {
    if (!this.isLive || !this.elements.liveRecordingTimerDisplay) return;
    const elapsedMs = Date.now() - this.recordingStartTime;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((elapsedMs % 1000) / 10);
    this.elements.liveRecordingTimerDisplay.textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  }

  public start(stream: MediaStream): void {
    if (!stream || !stream.active) {
        console.warn("LiveDisplayManager: Cannot start, stream is not valid or active.");
        return;
    }
    this.isLive = true;
    this.elements.recordingInterface.classList.add('is-live');
    this.elements.liveRecordingTitle.style.display = 'block';
    this.elements.liveWaveformCanvas.style.display = 'block';
    this.elements.liveRecordingTimerDisplay.style.display = 'block';

    this.setupCanvasDimensions(); // Call once on start
    window.addEventListener('resize', this.handleResize);

    if (this.elements.statusIndicatorDiv) this.elements.statusIndicatorDiv.style.display = 'none';

    const iconElement = this.elements.recordButton.querySelector('.record-button-inner i') as HTMLElement;
    if (iconElement) {
      iconElement.classList.remove('fa-microphone');
      iconElement.classList.add('fa-stop');
    }
    this.elements.recordButton.setAttribute('aria-pressed', 'true');
    this.elements.recordButton.setAttribute('title', 'Stop Recording');

    const currentTitle = this.elements.editorTitle.textContent?.trim();
    const placeholder = this.elements.editorTitle.getAttribute('placeholder') || 'Voice Session Title';
    this.elements.liveRecordingTitle.textContent = (currentTitle && currentTitle !== placeholder) ? currentTitle : 'New Recording';

    this.setupAudioVisualizer(stream); // Setup after UI is visible
    if (this.analyserNode) { // Only start drawing if visualizer setup was successful
        this.drawLiveWaveform();
    }


    this.recordingStartTime = Date.now();
    this.updateLiveTimer();
    if (this.timerIntervalId) clearInterval(this.timerIntervalId);
    this.timerIntervalId = window.setInterval(() => this.updateLiveTimer(), 50);
  }
  
  private stopVisualizerDrawing(): void {
    if (this.waveformDrawingId) {
        cancelAnimationFrame(this.waveformDrawingId);
        this.waveformDrawingId = null;
    }
    if (this.liveWaveformCtx && this.elements.liveWaveformCanvas) {
      this.liveWaveformCtx.clearRect(0, 0, this.elements.liveWaveformCanvas.width, this.elements.liveWaveformCanvas.height);
    }
  }


  public stop(): void {
    if (!this.isLive && !this.elements.recordingInterface.classList.contains('is-live')) {
        // Already stopped or was never started properly
        return;
    }
    this.isLive = false;
    this.elements.recordingInterface.classList.remove('is-live');
    this.elements.liveRecordingTitle.style.display = 'none';
    this.elements.liveWaveformCanvas.style.display = 'none';
    this.elements.liveRecordingTimerDisplay.style.display = 'none';
    window.removeEventListener('resize', this.handleResize);

    if (this.elements.statusIndicatorDiv) this.elements.statusIndicatorDiv.style.display = 'block';

    const iconElement = this.elements.recordButton.querySelector('.record-button-inner i') as HTMLElement;
    if (iconElement) {
      iconElement.classList.remove('fa-stop');
      iconElement.classList.add('fa-microphone');
    }
    this.elements.recordButton.setAttribute('aria-pressed', 'false');
    this.elements.recordButton.setAttribute('title', 'Start Recording');

    this.stopVisualizerDrawing();

    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }

    if (this.audioContext) {
      if (this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(e => console.warn('Error closing audio context during stop:', e));
      }
      this.audioContext = null;
    }
    this.analyserNode = null; // Ensure analyser is nulled
    this.waveformDataArray = null;
  }

  private setupCanvasDimensions(): void {
    if (!this.elements.liveWaveformCanvas || !this.liveWaveformCtx) return;
    const canvas = this.elements.liveWaveformCanvas;
    const dpr = window.devicePixelRatio || 1;
    
    // Use current clientWidth/Height for logical dimensions
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;

    // Check if dimensions are valid
    if (cssWidth <= 0 || cssHeight <= 0) {
        // console.warn("Canvas dimensions are zero or negative. Skipping resize.");
        return;
    }

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    
    this.liveWaveformCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // Apply scaling for HiDPI
    // this.liveWaveformCtx.scale(dpr, dpr); // Alternative for scaling
  }
  
  private handleResize(): void {
    // Only resize if live and canvas is visible
    if (this.isLive && this.elements.liveWaveformCanvas && this.elements.liveWaveformCanvas.style.display === 'block') {
        requestAnimationFrame(() => { // Debounce via rAF
            this.setupCanvasDimensions();
        });
    }
  }
}
