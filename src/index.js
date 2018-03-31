const reducer = (accumulator, currentValue) => accumulator + currentValue;

class Aural {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.sources = {};
  }

  newBufferSource(key, buffer = false, options) {
    if (buffer === false) {
      return null;
    }

    this.sources[key] = this.context.createBufferSource();
    this.sources[key].options = options;
    this.sources[key].isPlaying = false;

    this.sources[key].buffer = buffer;
    this.sources[key].analyzer = {
      node: this.context.createAnalyser(),
      bufferLength: null,
      dataArray: null,
    };

    this.sources[key].connect(this.sources[key].analyzer.node);
    this.sources[key].analyzer.node.connect(this.context.destination);
    this.sources[key].playbackRate.value = 0;

    this.sources[key].analyzer.bufferLength = this.sources[key].analyzer.node.frequencyBinCount;

    this.sources[key].analyzer.dataArray = new Uint8Array(this.sources[key].analyzer.bufferLength);

    this.sources[key].start(0);

    if (options.autoPlay) {
      this.sources[key].isPlaying = true;
      this.sources[key].playbackRate.value = options.rate || 1.0;
    }

    return this.sources[key];
  }

  getBuffer(source) {
    return fetch(source)
      .then(result => result.arrayBuffer())
      .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer, buffer => buffer));
  }

  load(key, source, options) {
    this.getBuffer(source).then(buffer => this.newBufferSource(key, buffer, options));
  }

  play(key) {
    if (typeof this.sources[key] !== 'undefined' && this.sources[key].isPlaying === false) {
      const { options } = this.sources[key];
      this.sources[key].playbackRate.value = options.rate;
    }
  }

  pause(key) {
    this.setRate(key, 0);
  }

  stop(key) {
    if (typeof this.sources[key] !== 'undefined' && this.sources[key].isPlaying) {
      this.sources[key].stop();
      const { buffer, options } = this.sources[key];
      this.newBufferSource(key, buffer, options);
    }
  }

  setRate(key, rate) {
    if (typeof this.sources[key] !== 'undefined') {
      this.sources[key].options.rate = rate;
      this.sources[key].playbackRate.value = rate;
    }
  }

  getFrequency(key) {
    if (typeof this.sources[key] !== 'undefined') {
      this.sources[key].analyzer.node.getByteFrequencyData(this.sources[key].analyzer.dataArray);
      return (
        this.sources[key].analyzer.dataArray.reduce(reducer) /
        (this.sources[key].options.frequencyDevider || 128)
      );
    }

    return 0;
  }
}

const aural = new Aural();

export default aural;
