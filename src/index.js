const reducer = (accumulator, currentValue) => accumulator + currentValue;

/**
 * The Aural class, wohoo
 */
class Aural {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this._context = new AudioContext();
    this._sources = {};

    /*
    * Mute all available sounds
    */
    this.muteAll = function() {
      Object.keys(this._sources).forEach(key => this.setVolume(key, 0));
    }.bind(this);

    /*
    * Unmute all available sounds
    */
    this.unmuteAll = function(volume = 1) {
      Object.keys(this._sources).forEach(key => this.setVolume(key, volume));
    }.bind(this);

    /**
     * Play audio file
     * @param {string} key
     */
    this.play = function(key) {
      this._possiblyResume().then(() =>
        this._updateRate({ key, rate: this._sources[key].options.rate || 1 }, true)
      );
    }.bind(this);

    /**
     * Pause audio file
     * @param {string} key
     */
    this.pause = function(key) {
      this._updateRate({ key, rate: 0 }, false);
    }.bind(this);

    /**
     * Update the rate for audio file
     * @param {string} key
     * @param {int} rate
     */
    this.setRate = function(key, rate) {
      this._updateRate({ key, rate });
    };
  }

  /**
   * Create the audio object with the loaded buffer
   * @param {string} key
   * @param {audioBuffer} buffer
   * @param {object} options
   */
  _newBufferSource(key, buffer = false, options = {}) {
    if (buffer === false) {
      return null;
    }

    this._sources[key] = {};

    const audioObject = this._sources[key];

    audioObject.options = options;
    audioObject.isPlaying = false;
    audioObject.started = false;

    audioObject.audio = this._context.createBufferSource();

    audioObject.audio.buffer = buffer;
    audioObject.audio.analyzer = {
      node: this._context.createAnalyser(),
      bufferLength: null,
      dataArray: null,
    };

    audioObject.audio.loop = options.loop || 0;

    audioObject.audio.gainNode = this._context.createGain();

    audioObject.audio.connect(audioObject.audio.analyzer.node);
    audioObject.audio.analyzer.node.connect(audioObject.audio.gainNode);
    audioObject.audio.gainNode.connect(this._context.destination);
    audioObject.audio.playbackRate.value = 0;

    audioObject.audio.analyzer.bufferLength = this._sources[
      key
    ].audio.analyzer.node.frequencyBinCount;

    audioObject.audio.analyzer.dataArray = new Uint8Array(audioObject.audio.analyzer.bufferLength);

    const suspended = options.suspended || false;

    /**
     * If suspended is true, don't start the audio automatically.
     * This will probably become default for all browsers.
     * https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
     */
    if (suspended === false) {
      audioObject.started = true;
      audioObject.audio.start(0, options.startAt || 0);
    }

    audioObject.audio.gainNode.gain.value = options.volume || 1;

    if (options.autoPlay) {
      audioObject.isPlaying = true;
      audioObject.audio.playbackRate.value = options.rate || 1.0;
    }

    audioObject.getFrequency = () => this.getFrequency(key);
    audioObject.play = () => this.play(key);
    audioObject.pause = () => this.pause(key);
    audioObject.stop = () => this.stop(key);
    audioObject.mute = () => this.setVolume(key, 0);
    audioObject.unmute = (volume = 1) => this.setVolume(key, volume);
    audioObject.volume = (volume = 1) => this.setVolume(key, volume);
    audioObject.start = () => this.start(key);

    audioObject.setRate = rate => this._updateRate({ key, rate }, true);

    if (options.onLoad) {
      options.onLoad(audioObject);
    }

    return audioObject;
  }

  /**
   * Fetch the source file and parse the buffer, passing it to newBufferSource()
   * Resolve with promise because Safari can't
   * @param {string} source
   */
  _getBuffer(source) {
    return fetch(source)
      .then(result => result.arrayBuffer())
      .then(
        arrayBuffer =>
          new Promise(resolve => {
            this._context.decodeAudioData(arrayBuffer, buffer => {
              resolve(buffer);
            });
          })
      );
  }

  /**
   * Load the audio file and create the Aural object
   * @param {string} key
   * @param {string} source
   * @param {object} options
   */
  load(key, source, options) {
    return this._getBuffer(source).then(buffer => this._newBufferSource(key, buffer, options));
  }

  _startAudio = key => this._sources[key].audio.start(0, this._sources[key].options.startAt || 0);

  _possiblyResume = callback => {
    return new Promise(resolve => {
      if (this._context.state === 'suspended') {
        return resolve(this._context.resume());
      }

      resolve();
    });
  };

  /**
   * Start playing audio file by key
   * @param {string} key
   */
  start = key => {
    if (this._sources[key].started === false) {
      this._possiblyResume().then(() => this._startAudio(key));
    }

    this._updateRate({ key, rate: this._sources[key].options.rate || 1 }, true);
    this._sources[key].started = true;
  };

  /**
   * Mute audio file by key
   * @param {string} key
   */
  mute = key => {
    this.setVolume(key, 0);
  };

  /**
   * Unmute audio file by key
   * @param {string} key
   * @param {int} volume
   */
  unmute = (key, volume = 1) => {
    this.setVolume(key, volume);
  };

  /**
   * Set volume of audio file by key
   * @param {string} key
   * @param {int} volume
   */
  setVolume = (key, volume) => {
    this._sources[key].audio.gainNode.gain.value = volume;
  };

  /**
   * Stop audio file
   * @param {string} key
   */
  stop(key) {
    this._sources[key].audio.stop();
    const options = this._sources[key].options;
    options.autoPlay = 0;
    const buffer = this._sources[key].audio.buffer;

    this._newBufferSource(key, buffer, options);
  }

  /**
   * Change the rate for the audio object
   * @param {object} options
   * @param {bool} updateOptions
   */
  _updateRate(options, updateOptions = false) {
    updateOptions && (this._sources[options.key].options.rate = options.rate);
    this._sources[options.key].audio.playbackRate.value = options.rate;
  }

  /**
   * Get the frequency of a playing sound
   * @param {string} key
   */
  getFrequency(key) {
    const audioObject = this._sources[key];
    audioObject.audio.analyzer.node.getByteFrequencyData(audioObject.audio.analyzer.dataArray);
    return (
      audioObject.audio.analyzer.dataArray.reduce(reducer) /
      (audioObject.options.frequencyDivider || 128)
    );
  }
}

const aural = new Aural();

export default aural;
