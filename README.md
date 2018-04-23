# Aural
[![npm](https://img.shields.io/npm/v/aural.svg)](http://npm.im/aural)
[![gzip size](http://img.badgesize.io/https://unpkg.com/aural/dist/index.js?compression=gzip)](https://unpkg.com/aural/dist/index.js)

The __zero-dependency__ ~_900B_ audio manager for your Javascript projects.

# Install

```
npm install --save aural
```

# Usage

Pass a path to your audio file to the `load` function.

```
Aural.load('music', '/path/to/file.mp3', options);
```

## Mobile and recent browsers
Will not allow playing audio without user gesture. Make sure to pass the `suspended` option, so the Audiocontext will not automatically start.
It will automatically resume the audiocontext when you call `start()` or `play()` on an audio file.

Playing or starting will *always* resume the Audiocontext.

[_Modern browser changelog_](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio)

# Options

_Options are not required_

```
{
  loop: 1, // Loops the audio file [default 0]
  rate: 1, // Sets the rate of the audio file [default 1]
  autoPlay: 1, // Starts playing the file when loaded [default 0]
  volume: 1, // Sets the volume for the sound [default 1]
  frequencyDivider: 128, // Automatically devide the frequency by given number [default 128]
  startAt: 0, // Start playing audio from a certain second [default 0]
  suspended: 1, // Audiocontext is suspended at first, will resume after starting a song. [default 0]
}
```

# Getting started
`Aural.load(key, source, options);`

The `load` function returns a promise with a audio object.

# Api Aural load result
```
Aural.load(key, source, options).then(sound => {
  // Play sound
  sound.play();

  // Pause sound
  sound.pause();

  // Stop playing sound
  sound.stop();

  // Get frequency of sound
  sound.getFrequency();

  // Set rate of sound
  sound.setRate(rate);
  
  // Set volume of sound
  sound.volume(volume);

  // Mute sound
  sound.mute();

  // Unmute sound
  sound.unmute();

  // Start playing. Preferably use for devices which do not allow starting music without interaction (ios)
  sound.start();
});
```

# Api Aural

Aural can also be called globally, without having the load result stored.

```
// Load audio file, with a key, returns Aural object with different methods
Aural.load(key, source, options);

// Play audio file
Aural.play(key);

// Pause audio file
Aural.pause(key);

// Stop playing audio file
Aural.stop(key);

// Get the frequency for a playing file
Aural.getFrequency(key);

// Set the rate for an audio file
Aural.setRate(key, rate);

// Mute all sounds, loaded with Aural
Aural.muteAll();

// Unmute all sounds, loaded with Aural
Aural.unmuteAll();

// Start playing a sound by key.
// Preferably use for devices which do not allow starting music without interaction (ios)
Aural.start(key);
```

# Demo
Code demo [can be found here](https://stackblitz.com/edit/aural)

# License

[MIT](https://oss.ninja/mit/mjanssen/)
