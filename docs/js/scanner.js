// ─────────────────────────────────────────────
//  Basira QR · Camera / QR Scanner Module
// ─────────────────────────────────────────────

const Scanner = {
  stream: null,
  animFrame: null,
  canvas: null,
  ctx: null,
  video: null,
  onResult: null,
  active: false,

  async start(videoEl, onResult) {
    this.video = videoEl;
    this.onResult = onResult;
    this.active = true;

    // getUserMedia requires a secure context (HTTPS or localhost).
    // On mobile Chrome over plain HTTP this API is simply absent.
    if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      throw new Error('NEEDS_HTTPS');
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('CAMERA_NOT_SUPPORTED');
    }

    // Try progressively simpler constraints so we work on all Android devices
    const attempts = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: { ideal: 'environment' } }, audio: false },
      { video: true, audio: false },
    ];

    let lastErr = null;
    for (const constraints of attempts) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        lastErr = null;
        break; // success
      } catch (err) {
        if (err.name === 'NotAllowedError') throw new Error('CAMERA_DENIED');
        lastErr = err;
      }
    }
    if (lastErr) throw new Error('CAMERA_NOT_SUPPORTED');

    videoEl.srcObject = this.stream;
    await new Promise(resolve => { videoEl.onloadedmetadata = resolve; });
    await videoEl.play();

    // Setup off-screen canvas for frame processing
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    this._tick();
  },

  _tick() {
    if (!this.active) return;
    const { video, canvas, ctx } = this;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (typeof jsQR === 'function') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code?.data) {
          this.onResult(code.data);
          return; // pause ticking until resume() is called
        }
      }
    }
    this.animFrame = requestAnimationFrame(() => this._tick());
  },

  resume() {
    this.active = true;
    this._tick();
  },

  stop() {
    this.active = false;
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.video) { this.video.srcObject = null; }
  },
};

// URL helpers (ported from UrlValidator.js)
const UrlValidator = {
  isValidUrl(str) {
    try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
    catch { return false; }
  },
  sanitizeUrl(url) { return url.trim(); },
  isHttps(url) { return url.startsWith('https://'); },
  extractDomain(url) {
    try { return new URL(url).hostname; } catch { return url; }
  },
};

window.Scanner = Scanner;
window.UrlValidator = UrlValidator;
