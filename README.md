# Aural

The __zero-dependency__ ~_612B_ audio manager for your Javascript projects.

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
}
```

# Api

```
// Load audio file, with a key
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

# License

[MIT](https://oss.ninja/mit/mjanssen/)
