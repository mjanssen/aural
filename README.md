# Aural

The __zero-dependency__ ~_700B_ audio manager for your Javascript projects.

# Install

```
$ npm install --save aural
```

# Usage

Pass a path to your audio file to the `load` function.

```
Aural.load('music', '/path/to/file.mp3', options );
```

# Options

_Options are optional_

```
{
  loop: 1, // Loops the audio file
  rate: 1, // Sets the rate of the audio file
  autoPlay: 1, // Starts playing the file when loaded
  frequencyDivider: 128, // Automatically devide the frequency by given number (default 128)
}
```

# Getting started
`Aural.load(key, source, options);`

The `load` function returns a promise with a audio object.

# Api Aural load result
```
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
```

# Demo
Code demo [can be found here](https://stackblitz.com/edit/aural)

# License

[MIT](https://oss.ninja/mit/mjanssen/)
