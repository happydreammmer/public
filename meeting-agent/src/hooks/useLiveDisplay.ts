import { useState, useRef, useCallback, useEffect } from 'react';

export const useLiveDisplay = (isRecording: boolean, stream: MediaStream | null) => {
  const [timer, setTimer] = useState('00:00.00');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const waveformDataArrayRef = useRef<Uint8Array | null>(null);
  const waveformDrawingIdRef = useRef<number | null>(null);
  const timerIntervalIdRef = useRef<number | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  const setup = useCallback((stream: MediaStream) => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(e => console.warn('Error closing previous audio context', e));
    }
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    analyserNodeRef.current = analyserNode;
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.75;
    const bufferLength = analyserNode.frequencyBinCount;
    waveformDataArrayRef.current = new Uint8Array(bufferLength);
    source.connect(analyserNode);
  }, []);

  const drawWaveform = useCallback(() => {
    const analyserNode = analyserNodeRef.current;
    const waveformDataArray = waveformDataArrayRef.current;
    const canvas = canvasRef.current;
    if (!analyserNode || !waveformDataArray || !canvas) {
      if (waveformDrawingIdRef.current) cancelAnimationFrame(waveformDrawingIdRef.current);
      waveformDrawingIdRef.current = null;
      return;
    }

    waveformDrawingIdRef.current = requestAnimationFrame(drawWaveform);
    analyserNode.getByteFrequencyData(waveformDataArray);

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const logicalWidth = canvas.clientWidth;
    const logicalHeight = canvas.clientHeight;
    canvasCtx.clearRect(0, 0, logicalWidth, logicalHeight);

    const bufferLength = analyserNode.frequencyBinCount;
    const numBars = Math.floor(bufferLength * 0.5);
    if (numBars === 0) return;

    const totalBarPlusSpacingWidth = logicalWidth / numBars;
    const barWidth = Math.max(1, Math.floor(totalBarPlusSpacingWidth * 0.7));
    const barSpacing = Math.max(0, Math.floor(totalBarPlusSpacingWidth * 0.3));
    let x = 0;

    const recordingColor = getComputedStyle(document.documentElement).getPropertyValue('--color-recording').trim() || '#ff3b30';
    canvasCtx.fillStyle = recordingColor;

    for (let i = 0; i < numBars; i++) {
        if (x >= logicalWidth) break;
        const dataIndex = Math.floor(i * (bufferLength / numBars));
        const barHeightNormalized = waveformDataArray[dataIndex] / 255.0;
        let barHeight = barHeightNormalized * logicalHeight;
        if (barHeight < 1 && barHeight > 0) barHeight = 1;
        barHeight = Math.round(barHeight);
        
        const y = Math.round((logicalHeight - barHeight) / 2);
        canvasCtx.fillRect(Math.floor(x), y, barWidth, barHeight);
        x += barWidth + barSpacing;
    }
  }, []);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const elapsedMs = now - recordingStartTimeRef.current;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((elapsedMs % 1000) / 10);
    setTimer(
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`
    );
  }, []);

  const startDisplay = useCallback(() => {
    drawWaveform();
    recordingStartTimeRef.current = Date.now();
    updateTimer();
    if (timerIntervalIdRef.current) clearInterval(timerIntervalIdRef.current);
    timerIntervalIdRef.current = window.setInterval(updateTimer, 50);
  }, [drawWaveform, updateTimer]);

  const stopDisplay = useCallback(() => {
    if (waveformDrawingIdRef.current) {
      cancelAnimationFrame(waveformDrawingIdRef.current);
      waveformDrawingIdRef.current = null;
    }
    if (timerIntervalIdRef.current) {
      clearInterval(timerIntervalIdRef.current);
      timerIntervalIdRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(e => console.warn('Error closing audio context', e));
      audioContextRef.current = null;
    }
    analyserNodeRef.current = null;
    waveformDataArrayRef.current = null;
  }, []);

  useEffect(() => {
    if (isRecording && stream) {
      setup(stream);
      startDisplay();
    } else {
      stopDisplay();
    }

    return () => {
      stopDisplay();
    };
  }, [isRecording, stream, setup, startDisplay, stopDisplay]);

  return { timer, canvasRef };
}; 