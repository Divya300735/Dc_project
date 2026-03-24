# 📡 Analog to Digital Conversion Tool

An **interactive web-based simulator** for exploring Pulse Code Modulation (PCM) and Delta Modulation techniques in digital communication systems. Built with pure HTML, CSS, and JavaScript using Chart.js for real-time visualization.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/HTML5-CSS3-JavaScript-orange.svg)
![Charts](https://img.shields.io/badge/Chart.js-v3.9.1-brightgreen.svg)

---

## ✨ Key Features

### 🔷 PCM (Pulse Code Modulation) Simulation
- **3 Signal Types**: Sine Wave, Square Wave, Triangle Wave
- **Real-time Parameter Control**:
  - Amplitude (0.1V - 5V)
  - Signal Frequency (1Hz - 20Hz)
  - Sampling Frequency (10Hz - 200Hz)
  - Quantization Bits (1-8 bits)
- **Live Calculations**:
  - Quantization Levels (L = 2ⁿ)
  - Step Size (Δ = 2A/L)
  - Max Quantization Error (±Δ/2)
  - PCM Bit Rate (Fs × bits)
  - Theoretical SQNR (6.02 × n dB)
  - **Nyquist Criterion Check** with aliasing detection
- **4 Interactive Graphs**:
  - Analog Signal visualization
  - Sampled Signal (discrete points)
  - Quantized Signal (step approximation)
  - PCM Digital Signal (binary waveform)
- **Detailed Data Table** showing Sample, Time, Value, Level, Quantized value, and Binary representation

### 🔶 Delta Modulation Simulation
- **Same 3 Signal Types** with independent parameter controls
- **Step Size Control** (0.01V - 1V) for granular noise analysis
- **Live Calculations**:
  - Bit Rate (= Sampling Frequency)
  - Granular Noise (±Δ/2)
  - Maximum Signal Slope (2πAf)
  - Maximum Tracking Slope (Δ × Fs)
  - **Slope Overload Detection** with real-time warning
- **3 Visual Outputs**:
  - Original Signal
  - Staircase Approximation (reconstructed signal)
  - Bitstream (1/0 output sequence)
- **Delta Data Table** tracking Time, Signal Value, Staircase level, Bit, and Direction (Up/Down)

### 🎨 User Experience
- **Dual-Tab Interface**: Seamlessly switch between PCM and Delta Modulation
- **Responsive Design**: Modern glassmorphism UI with gradient accents
- **Real-time Updates**: All parameters update instantly without page reload
- **Visual Feedback**: 
  - Color-coded warnings (Green for safe, Red for aliasing/slope overload)
  - Animated sliders with progress indicators
  - Professional data cards with formulas

---

## 🚀 Quick Start

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No installation required!

### Run Locally
```bash
# Clone the repository
git clone https://github.com/Divya300735/Dc_project.git

# Navigate to project folder
cd "Dc project"

# Open in browser
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### Or simply open `index.html` directly in your browser after downloading.

---

## 📊 How It Works

### PCM Workflow
1. **Select Signal Type** (Sine/Square/Triangle)
2. **Adjust Parameters** using sliders
3. **Click "Generate Signal"** to visualize the analog waveform
4. **Click "Run PCM Simulation"** to see:
   - Sampling at specified frequency
   - Quantization to discrete levels
   - Binary encoding
   - Real-time data table population

### Delta Modulation Workflow
1. **Switch to Delta Tab**
2. **Configure Step Size** (crucial for slope overload)
3. **Run Simulation** to observe:
   - Staircase tracking of the signal
   - Bit generation (1 = up, 0 = down)
   - Slope overload warnings if Δ is too small

---

## 🛠️ Technical Architecture

```
📁 dc project/
├── 📄 index.html          # Main UI structure with dual tabs
├── 📄 script.js           # Core simulation logic (800+ lines)
├── 📄 style.css           # Modern glassmorphism styling
├── 📄 package.json        # Project metadata
├── 📄 vite.config.ts      # Vite build configuration
├── 📄 tailwind.config.js  # Tailwind CSS setup
├── 📄 postcss.config.js   # PostCSS configuration
├── 📁 src/                # Source assets
└── 📁 node_modules/       # Dependencies
```

### Technologies Used
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure, Canvas elements |
| **CSS3** | Grid/Flexbox layout, animations, gradients |
| **Vanilla JavaScript** | Signal generation, calculations, DOM manipulation |
| **Chart.js** | Real-time waveform visualization |
| **Vite** | Modern build tooling |
| **Tailwind CSS** | Utility-first styling framework |

---

## 📚 Educational Value

This tool is perfect for:
- 📖 **Students** learning Digital Communication
- 🎓 **Engineering courses** on Signal Processing
- 🔬 **Visualizing Nyquist-Shannon Theorem**
- 📈 **Understanding Quantization Noise**
- ⚡ **Demonstrating Slope Overload in Delta Modulation**

### Formulas Implemented
- **Sampling**: Nyquist rate (Fs ≥ 2Fmax)
- **Quantization**: L = 2ⁿ levels, Δ = 2A/L
- **SQNR**: 6.02n dB (theoretical)
- **Delta Step**: Tracking slope = Δ × Fs
- **Slope Overload**: Occurs when 2πAf > Δ × Fs

---

## 🎯 Unique Selling Points

1. **No Backend Required** - 100% client-side processing
2. **Instant Feedback** - Real-time calculations as you drag sliders
3. **Dual Mode** - PCM and Delta Modulation in one tool
4. **Visual Learning** - Graphs update synchronously with data tables
5. **Warning System** - Smart detection of aliasing and slope overload
6. **Zero Dependencies** for end users (CDN-loaded Chart.js)
7. **Clean Architecture** - Modular JavaScript with separation of concerns

---

## 🤝 Contributing

Contributions welcome! This project is open for:
- 🐛 Bug fixes
- ✨ New signal types (Sawtooth, Pulse, etc.)
- 📊 Export functionality (CSV, PNG)
- 🌐 Multi-language support
- 📱 Mobile responsiveness improvements

---

## 📄 License

This project is licensed under the MIT License - feel free to use for educational and commercial purposes.

---

## 🎖️ Acknowledgments

- Built as a learning project for Digital Communication concepts
- Chart.js community for excellent documentation
- Inspired by traditional PCM/Delta Modulation lab experiments

---

**Made with ❤️ by Divya and Vedika**

*Star ⭐ this repo if you found it helpful!*

