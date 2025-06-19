# 🎹 MIDI Musical Keyboard App

A mobile MIDI-style musical keyboard built using **React Native**, offering real-time audio playback with support for multiple instruments and Indian classical notation display (`Sa Re Ga Ma Pa Da Ni Sa`). Ideal for learning, practicing, or just jamming!

---

## 📱 Features

- 🎼 **MIDI-style Piano UI** with responsive keys
- 🔊 **Real-time audio playback** using local sound files
- 🎚️ **Volume control slider**
- 🎹 Toggle to **show/hide key labels**
- 🪕 Switch between **128 MIDI instruments**
- 🇮🇳 Display of **Indian swaras (Sa Ri Ga Ma...)** instead of Western numeric notation
- 📦 Built using **Expo**, **React Native**, and **Expo Audio API**

---

## 📸 Screenshots

![Screenshot][Intro Screen](Project%20Info/images/2.jpg)
![Screenshot](Project%20Info/images/3.jpg)
![Screenshot](Project%20Info/images/4.jpg)


---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 14
- Expo CLI:  
  ```bash
  npm install -g expo-cli
  ```

### Run the App

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/midi-keyboard-app.git
   cd midi-keyboard-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   expo start
   ```

4. Use Expo Go (Android/iOS) to preview the app.
Use Expo SDK 52 to run this app. Download the Expo Go APK of SDK 52 to run this app. 
 ```
 https://expo.dev/go?sdkVersion=52&platform=android&device=true
 ```
---

## 📁 Folder Structure

```
.
├── assets/
│   └── sounds/            # Sound files (1.mp3 to 9.mp3)
│   └── music.jpg          # Background image
├── components/
│   └── Piano.js           # Main piano component
├── instruments.js         # MIDI instrument list (128 options)
├── App.js
└── ...
```

---

## ⚙️ Customization

### 🔤 Change Key Labels (Sa Ri Ga Ma...)

We replaced Western-style `1 2 3...` notation with Indian classical:
```js
const swaras = ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Da', 'Ni', 'Sa'];
...
<Text style={styles.whiteKeyLabel}>{swaras[i]}</Text>
```

### 🔈 Add More Sounds

Add new `.mp3` files in `/assets/sounds` and map them in the `keyToNote` object.

---

## 🛠️ Roadmap

- ✅ Basic piano key playback
- ✅ Volume control
- ✅ Display Indian swaras
- 🔜 Recording & playback system
- 🔜 Export to MIDI or audio file
- 🔜 Self-hosted **F-Droid** version (open-source only)
- 🔜 Save & share custom compositions

---

## 📦 F-Droid Compatibility (Planned)

We aim to publish a **fully open-source** version on [F-Droid](https://f-droid.org), compliant with their policies. The app will:
- Use only FOSS dependencies
- Include full build instructions
- Be free from Google/Firebase services

---

## 🧑‍💻 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the **MIT License**.  
See [LICENSE](LICENSE) for details.

---

## 🌐 Links

- [Expo Docs](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [F-Droid Submission Guide](https://f-droid.org/en/docs/Submitting_Apps/)

---

Made with ❤️ for music and code!