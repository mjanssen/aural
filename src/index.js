const reducer = (accumulator, currentValue) => accumulator + currentValue;

/**
 * The Aural class, wohoo
 */
class Aural {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.sources = {};
  }

  /**
   * Create the audio object with the loaded buffer
   * @param {string} key
   * @param {audioBuffer} buffer
   * @param {object} options
   */
  newBufferSource(key, buffer = false, options = {}) {
    if (buffer === false) {
      return null;
    }

    this.sources[key] = {};

    this.sources[key].options = options;
    this.sources[key].isPlaying = false;

    this.sources[key].audio = this.context.createBufferSource();

    this.sources[key].audio.buffer = buffer;
    this.sources[key].audio.analyzer = {
      node: this.context.createAnalyser(),
      bufferLength: null,
      dataArray: null,
    };

    this.sources[key].audio.connect(this.sources[key].audio.analyzer.node);
    this.sources[key].audio.analyzer.node.connect(this.context.destination);
    this.sources[key].audio.playbackRate.value = 0;

    this.sources[key].audio.analyzer.bufferLength = this.sources[
      key
    ].audio.analyzer.node.frequencyBinCount;

    this.sources[key].audio.analyzer.dataArray = new Uint8Array(
      this.sources[key].audio.analyzer.bufferLength
    );

    this.sources[key].audio.start(0);

    if (options.autoPlay) {
      this.sources[key].isPlaying = true;
      this.sources[key].audio.playbackRate.value = options.rate || 1.0;
    }

    this.sources[key].getFrequency = () => this.getFrequency(key);
    this.sources[key].play = () => this.play(key);
    this.sources[key].pause = () => this.pause(key);
    this.sources[key].stop = () => this.stop(key);
    this.sources[key].setRate = rate => this.setRate({ key, rate }, true);

    if (options.onLoad) {
      options.onLoad(this.sources[key]);
    }

    return this.sources[key];
  }

  /**
   * Fetch the source file and parse the buffer, passing it to newBufferSource()
   * @param {string} source
   */
  getBuffer(source) {
    return fetch(source)
      .then(result => result.arrayBuffer())
      .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer, buffer => buffer));
  }

  /**
   * Load the audio file and create the Aural object
   * @param {string} key
   * @param {string} source
   * @param {object} options
   */
  load(key, source, options) {
    return this.getBuffer(source).then(buffer => this.newBufferSource(key, buffer, options));
  }

  /**
   * Play audio file
   * @param {string} key
   */
  play(key) {
    this.setRate({ key, rate: this.sources[key].options.rate, isPlaying: true });
  }

  /**
   * Pause audio file
   * @param {string} key
   */
  pause(key) {
    this.setRate({ key, rate: 0, isPlaying: false });
  }

  /**
   * Stop audio file
   * @param {string} key
   */
  stop(key) {
    if (typeof this.sources[key] !== 'undefined') {
      this.sources[key].audio.stop();
      const options = this.sources[key].options;
      options.autoPlay = 0;
      const buffer = this.sources[key].audio.buffer;

      this.newBufferSource(key, buffer, options);
    }
  }

  /**
   * Change the rate for the audio object
   * @param {object} options
   * @param {bool} updateOptions
   */
  setRate(options, updateOptions = false) {
    if (options.key && typeof this.sources[options.key] !== 'undefined') {
      updateOptions && (this.sources[options.key].options.rate = options.rate);
      this.sources[options.key].audio.playbackRate.value = options.rate;
    }
  }

  /**
   * Get the frequency of a playing sound
   * @param {string} key
   */
  getFrequency(key) {
    if (typeof this.sources[key] !== 'undefined') {
      this.sources[key].audio.analyzer.node.getByteFrequencyData(
        this.sources[key].audio.analyzer.dataArray
      );
      return (
        this.sources[key].audio.analyzer.dataArray.reduce(reducer) /
        (this.sources[key].options.frequencyDevider || 128)
      );
    }

    return 0;
  }
}

const aural = new Aural();

export default aural;
