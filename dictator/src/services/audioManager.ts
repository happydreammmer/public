import { AudioProcessingResult } from '../types';

export type StatusUpdater = (status: string) => void;
export type AudioAvailableCallback = (result: AudioProcessingResult) => void;
export type RecordingProcessedCallback = () => void;
export type RecordingErrorCallback = (
  errorType: 'permission' | 'no-mic' | 'in-use' | 'general' | 'unsupported',
  message: string
) => void;

export class AudioManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  public isRecording: boolean = false;

  constructor(
    private onStatusUpdate: StatusUpdater,
    private onAudioAvailable: AudioAvailableCallback,
    private onRecordingProcessed: RecordingProcessedCallback,
    private onError: RecordingErrorCallback,
  ) {}

  private async getMicrophoneAccess(): Promise<MediaStream | null> {
    this.onStatusUpdate('Requesting microphone access...');
    try {
      // Clean up any existing stream before requesting a new one
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }
      // Attempt with ideal constraints first (you can customize these)
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          // echoCancellation: true, // Example: add preferred constraints
          // noiseSuppression: true,
          // autoGainControl: true
        } 
      });
      return this.stream;
    } catch (err) {
      console.warn('Failed with ideal audio constraints:', err);
      try {
        // Fallback to simpler constraints if the preferred ones fail
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return this.stream;
      } catch (error) {
        this.handleMediaError(error);
        return null;
      }
    }
  }

  private handleMediaError(error: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'UnknownError';

    console.error(`Microphone access error (${errorName}):`, errorMessage, error);

    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      this.onError('permission', 'Microphone permission denied. Please check browser settings and reload.');
    } else if (errorName === 'NotFoundError' || (errorName === 'DOMException' && errorMessage.includes('Requested device not found'))) {
      this.onError('no-mic', 'No microphone found. Please connect a microphone.');
    } else if (errorName === 'NotReadableError' || errorName === 'AbortError' || (errorName === 'DOMException' && errorMessage.includes('Failed to allocate audiosource'))) {
      this.onError('in-use', 'Cannot access microphone. It may be in use by another application or hardware error.');
    } else if (errorName === 'TypeError' && errorMessage.includes('MediaRecorder')) {
        this.onError('unsupported', 'MediaRecorder is not supported in this browser or context.');
    }
     else {
      this.onError('general', `Error accessing microphone: ${errorMessage}`);
    }
    this.cleanupStreamInternals(); // Ensure stream is cleaned up on error
  }

  public async start(): Promise<MediaStream | null> {
    if (this.isRecording) {
      console.warn("AudioManager: Start called while already recording.");
      return this.stream;
    }

    this.audioChunks = []; // Clear previous chunks
    const userStream = await this.getMicrophoneAccess();

    if (!userStream) {
      // Error already handled by getMicrophoneAccess via this.onError
      this.isRecording = false; // Ensure state is correct
      return null;
    }
    this.stream = userStream;

    const mimeTypes = [
      'audio/webm;codecs=opus', 'audio/ogg;codecs=opus',
      'audio/webm', 'audio/ogg', 
      'audio/mp4', // Safari might prefer this
      '', // Let browser pick
    ];
    
    let chosenMimeTypeFound = false;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType) || mimeType === '') {
        try {
          const options = mimeType ? { mimeType } : {};
          // Ensure stream is active before creating MediaRecorder
          if (!this.stream || !this.stream.active) {
            throw new Error("Stream is not active for MediaRecorder.");
          }
          this.mediaRecorder = new MediaRecorder(this.stream, options);
          console.log('Using MIME type:', this.mediaRecorder.mimeType || mimeType);
          chosenMimeTypeFound = true;
          break;
        } catch (e) {
          console.warn(`Could not initialize MediaRecorder with MIME type ${mimeType}:`, e);
          this.mediaRecorder = null; // Reset on failure
        }
      }
    }

    if (!this.mediaRecorder || !chosenMimeTypeFound) {
      this.onError('unsupported', 'MediaRecorder not supported or no suitable MIME type found.');
      this.cleanupStreamInternals();
      this.isRecording = false;
      return null;
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      // This 'onstop' can be triggered by mediaRecorder.stop() or if the stream ends unexpectedly.
      // The isRecording flag should ideally be managed at the point of calling stop() or detecting stream end.
      // For now, we assume it means recording has effectively ended.
      this.isRecording = false; 
      
      if (this.audioChunks.length > 0) {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        await this.processAudioBlob(audioBlob);
      } else {
        this.onStatusUpdate('No audio data captured.');
      }
      // It's important that cleanupStreamInternals is called *after* onAudioAvailable might have been triggered by processAudioBlob
      // and after onRecordingProcessed signals the end of this cycle.
      // However, the stream might already be stopped by the browser or user action.
      this.cleanupStreamInternals(); 
      this.onRecordingProcessed(); // Signal that this recording cycle (including processing) is complete.
    };
    
    this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        this.onError('general', `MediaRecorder error: ${(event as any)?.error?.name || 'Unknown error'}`);
        this.stop(); // Attempt a graceful stop and cleanup
    };


    try {
        this.mediaRecorder.start();
        this.isRecording = true;
        // this.onStatusUpdate('Recording...'); // Status usually handled by main app based on successful start
        return this.stream;
    } catch (e) {
        console.error("Failed to start MediaRecorder:", e);
        this.handleMediaError(e); // Use generic media error handler
        this.isRecording = false;
        return null;
    }
  }

  public stop(): void {
    if (this.mediaRecorder && (this.mediaRecorder.state === 'recording' || this.mediaRecorder.state === 'paused')) {
      try {
        this.mediaRecorder.stop(); // onstop will handle further processing and cleanup
        // isRecording will be set to false in onstop or if stop is called when not truly recording
      } catch (e) {
        console.error('Error stopping MediaRecorder:', e);
        this.onError('general', `Error stopping recorder: ${e instanceof Error ? e.message : String(e)}`);
        // Force cleanup if stop itself fails, and call onRecordingProcessed
        this.isRecording = false;
        this.cleanupStreamInternals();
        this.onRecordingProcessed();
      }
    } else {
      // If stop is called when not recording (e.g. after an error, or if already stopped)
      // Ensure state consistency and cleanup.
      if (this.isRecording) this.isRecording = false; // Correct the state if it was wrongly true
      this.cleanupStreamInternals();
      this.onRecordingProcessed(); // Still call to signal the end of any potential recording cycle
    }
  }

  private async processAudioBlob(audioBlob: Blob): Promise<void> {
    if (audioBlob.size === 0) {
      this.onStatusUpdate('No audio data captured.');
      return;
    }
    this.onStatusUpdate('Converting audio...');
    try {
      const reader = new FileReader();
      const readResult = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          try {
            const base64data = reader.result as string;
            resolve(base64data.split(',')[1]);
          } catch (err) { reject(err); }
        };
        reader.onerror = (error) => reject(reader.error || error);
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await readResult;

      if (!base64Audio) throw new Error('Failed to convert audio to base64');

      this.onAudioAvailable({
        base64Audio,
        mimeType: this.mediaRecorder?.mimeType || 'audio/webm',
      });
    } catch (error) {
      console.error('Error in AudioManager.processAudioBlob:', error);
      this.onError('general', `Error processing audio: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private cleanupStreamInternals(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    // Don't null out mediaRecorder here if onstop is expected to fire.
    // mediaRecorder is best nulled after its lifecycle methods (onstop, onerror) are done.
    // Or if we are certain it's no longer needed and won't fire.
    // For safety, if mediaRecorder exists and is not inactive, it might mean an abrupt stop.
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        // console.warn("Cleaning up MediaRecorder that might not have stopped cleanly.");
        // No direct action here, rely on .stop() or natural stream end to trigger onstop.
    }
     this.mediaRecorder = null; // It's generally safe to null it here after tracks are stopped.
     this.audioChunks = []; // Clear chunks
  }

  public fullCleanup(): void {
    if (this.isRecording || (this.mediaRecorder && this.mediaRecorder.state !== 'inactive')) {
      this.stop(); // Attempt to stop if recording or recorder seems active
    } else {
      this.cleanupStreamInternals(); // Otherwise, just clean up
    }
    this.isRecording = false; // Ensure state is false
  }
}
