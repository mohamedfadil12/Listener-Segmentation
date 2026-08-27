# 🌌 Listener Segmentation — ML Music Behavioral Clustering

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8.svg)]()
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive, high-precision Machine Learning web application mapping music listener behaviors into multi-dimensional clusters using an unsupervised **K-Means ($k=3$)** pipeline and **StandardScaler** normalization. Features real-time client-side inference (0ms latency), dynamic topological orbit maps, streaming history ingestors (Spotify Takeout, Apple Music, Last.fm), chronological drift tracking, and customizable listener passports.

---

## 📌 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Machine Learning Pipeline & Mathematical Formulation](#-machine-learning-pipeline--mathematical-formulation)
  - [1. Feature Vector Space](#1-feature-vector-space)
  - [2. StandardScaler Normalization](#2-standardscaler-normalization)
  - [3. Cluster Centroids & Euclidean Distance Metric](#3-cluster-centroids--euclidean-distance-metric)
  - [4. Softmax Probability Distribution](#4-softmax-probability-distribution)
- [Listener Segment Archetypes](#-listener-segment-archetypes)
- [Application Modules](#-application-modules)
  - [Interactive Telemetry Console](#interactive-telemetry-console)
  - [Celestial Multi-Dimensional Orbit Visualizer](#celestial-multi-dimensional-orbit-visualizer)
  - [Feature Radar Decomposition](#feature-radar-decomposition)
  - [Streaming History Importer (Spotify / Apple Music / Last.fm)](#streaming-history-importer)
  - [Chronological History & Drift Comparison](#chronological-history--drift-comparison)
  - [Listener Profile & Audio Passport](#listener-profile--audio-passport)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Development Server](#running-development-server)
  - [Production Build](#production-build)
- [GitHub Actions CI/CD](#-github-actions-cicd)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview & Architecture

Modern streaming platforms generate millions of playback events daily. This project demonstrates how unsupervised machine learning clusters raw audio consumption behavior into distinct listener personas without manual labeling:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LISTENER TELEMETRY                              │
│   • Listening Hours (hrs/wk)            • Songs Per Day                │
│   • Skip Rate (%)                       • Playlists / Albums Saved     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 STANDARDSCALER FEATURE NORMALIZATION                   │
│                    z_i = (x_i - μ_i) / σ_i                             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 K-MEANS CLUSTERING (k=3 CENTROIDS)                     │
│               d_k = sqrt( Σ (z_i - c_{k,i})^2 )                        │
│                 k* = argmin_k ( d_k )                                  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│              INFERENCE & VISUALIZATION LAYER (0ms LATENCY)             │
│   • Celestial Orbit Map               • 4-Axis Radar Polygon           │
│   • Softmax Probability Distribution  • History Drift Telemetry        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **⚡ Zero-Latency Client-Side Inference**: Pure TypeScript implementation of the scikit-learn trained model weights, calculating Euclidean distance and cluster assignments in $<1\text{ms}$.
- **🪐 Celestial Multi-Dimensional Orbit Topology**: Dynamic Canvas visualizer rendering cluster gravitation, distance-based orbital velocity, and real-time cursor proximity.
- **📊 4-Axis Feature Radar Polygon**: Normalized SVG radar plot contrasting user inputs against standard cluster baselines.
- **📂 Universal Streaming History Importer**:
  - **Spotify**: Ingests `Streaming_History_Audio_*.json` and `endsong.json` Takeout logs.
  - **Apple Music**: Parses `Play_Activity.csv` privacy exports.
  - **Last.fm & Generic Logs**: Computes scrobble velocity, repeat rates, and track durations.
  - **Sample Benchmark Datasets**: Includes pre-calibrated streaming datasets for instant analysis.
- **🕰️ Chronological Drift & Milestone Tracking**:
  - Historical snapshot timeline tracking behavioral trajectory across months.
  - Side-by-side snapshot comparison modal calculating $\Delta$ metric deviations and cluster drift.
  - Export and restore telemetry snapshots.
- **🪪 Listener Identity Profile & Passport**: Customizable listener avatar, favorite genres tagger, primary streaming platform, and copyable share passport card.
- **🎨 Bento Grid UI Architecture**: Built with high-contrast slate aesthetics, fluid glassmorphism borders, and mobile-first responsive design.

---

## 🧮 Machine Learning Pipeline & Mathematical Formulation

### 1. Feature Vector Space
Each user session is parameterized by a 4-dimensional vector $\mathbf{x} \in \mathbb{R}^4$:

$$\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \end{bmatrix} = \begin{bmatrix} \text{Listening Hours / Week} \\ \text{Songs / Day} \\ \text{Skip Rate (\%)} \\ \text{Playlists / Albums Count} \end{bmatrix}$$

### 2. StandardScaler Normalization
To prevent features with larger absolute magnitudes from dominating the distance metric, inputs are standardized using the empirical mean $\boldsymbol{\mu}$ and standard deviation $\boldsymbol{\sigma}$ computed across the training corpus:

$$z_i = \frac{x_i - \mu_i}{\sigma_i} \quad \text{for } i \in \{1, 2, 3, 4\}$$

$$\boldsymbol{\mu} = [17.52, 45.10, 31.80, 14.25]^T$$

$$\boldsymbol{\sigma} = [9.84, 28.40, 18.65, 8.90]^T$$

### 3. Cluster Centroids & Euclidean Distance Metric
The 3 cluster centroids in standardized $Z$-space are defined as $\mathbf{c}_0, \mathbf{c}_1, \mathbf{c}_2 \in \mathbb{R}^4$:

- **Casual Listener ($\mathbf{c}_0$)**: $[-0.92, -0.95, -0.74, -0.91]^T$
- **Music Explorer ($\mathbf{c}_1$)**: $[-0.08, 0.08, 1.25, 0.88]^T$
- **Heavy Listener ($\mathbf{c}_2$)**: $[1.12, 1.05, -0.38, 0.22]^T$

The distance $d_k$ to cluster $k$ is calculated via the Euclidean ($L_2$) norm:

$$d_k = \|\mathbf{z} - \mathbf{c}_k\|_2 = \sqrt{\sum_{i=1}^{4} (z_i - c_{k,i})^2}$$

The assigned segment $k^*$ corresponds to the minimum distance:

$$k^* = \arg\min_{k \in \{0, 1, 2\}} d_k$$

### 4. Softmax Probability Distribution
Cluster affinities are converted into a normalized probability distribution using an inverse temperature parameter $\tau = 1.0$:

$$P(k \mid \mathbf{z}) = \frac{\exp(-d_k / \tau)}{\sum_{j=0}^{2} \exp(-d_j / \tau)}$$

---

## 🎧 Listener Segment Archetypes

| Segment | Primary Behavior | Typical Hours | Skip Rate | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Casual Listener** | Ambient & Relaxed | $2 - 10\text{ hrs/wk}$ | Low ($<25\%$) | Listens during commutes or background study. High album completion and loyalty to known tracks. |
| **Music Explorer** | High Discovery Velocity | $12 - 25\text{ hrs/wk}$ | High ($>50\%$) | Constantly searching for emerging artists and new releases. High skip rate as they sample playlists. |
| **Heavy Listener** | Immersive Audiophile | $25 - 40+\text{ hrs/wk}$ | Moderate ($20-35\%$) | Music plays continuously all day. Extensive playlist curation and high track velocity. |

---

## 📱 Application Modules

### Interactive Telemetry Console
Four responsive sliders with dual-preset quick actions (*"Focus Work"*, *"Discovery Mode"*, *"Weekend Vibes"*, *"Power Session"*) allow immediate manipulation of playback telemetry.

### Celestial Multi-Dimensional Orbit Visualizer
Interactive dynamic Canvas depicting the listener's coordinates in relation to the three cluster solar systems. Includes orbital particle paths, real-time gravitation pull vectors, and cluster centroid distance readouts.

### Feature Radar Decomposition
SVG-rendered 4-axis radar chart showing the proportional deviation of the active session relative to archetype centerlines.

### Streaming History Importer
Drop `.json` or `.csv` files directly or test with built-in benchmark profiles to parse raw track timestamps, skip flags, and total play durations into standard K-Means telemetry.

### Chronological History & Drift Comparison
Track session milestones across time, inspect drift lines, and compare two snapshots side-by-side with metric difference indicators.

### Listener Profile & Audio Passport
Customize avatar, bio, favorite genres, and top artists. Generates an Audio Identity Passport formatted for one-click sharing.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Motion
- **Icons**: Lucide React
- **Build Tool**: Vite 6
- **ML Architecture**: Unsupervised K-Means ($k=3$), StandardScaler Normalization, Euclidean Geometry
- **State & Storage**: React Hooks + LocalStorage API

---

## 📂 Project Directory Structure

```
├── .github/
│   ├── workflows/
│   │   └── ci.yml                      # GitHub Actions Continuous Integration
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md               # Bug report template
│   │   └── feature_request.md          # Feature request template
│   └── PULL_REQUEST_TEMPLATE.md        # Pull request template
├── src/
│   ├── components/
│   │   ├── ArchetypePresets.tsx        # Segment preset cards & quick triggers
│   │   ├── CelestialOrbitChart.tsx     # 2D/3D Canvas cluster topology visualizer
│   │   ├── Console.tsx                 # 4-feature interactive telemetry sliders
│   │   ├── FeatureRadar.tsx            # SVG 4-axis feature radar polygon
│   │   ├── Footer.tsx                  # Application footer & info triggers
│   │   ├── Hero.tsx                    # Header hero section & live cluster meter
│   │   ├── HistorySection.tsx          # Chronological timeline & snapshot feed
│   │   ├── ModelDetailsModal.tsx       # StandardScaler math & weights modal
│   │   ├── Nav.tsx                     # Floating blur navigation bar
│   │   ├── ProfileModal.tsx            # Listener profile & passport generator
│   │   ├── SegmentMeter.tsx            # Softmax confidence gauge bar
│   │   ├── SnapshotCompareModal.tsx    # Side-by-side drift comparison modal
│   │   ├── Starfield.tsx               # Ambient canvas starfield animation
│   │   └── StreamingImportModal.tsx    # Spotify/Apple Music file & sync modal
│   ├── data/
│   │   ├── archetypes.ts               # Cluster metadata, descriptions & tips
│   │   └── model_params.json           # StandardScaler (mean, std) & centroids
│   ├── lib/
│   │   ├── predict.ts                  # Pure client-side K-Means inference engine
│   │   ├── storage.ts                  # LocalStorage sync for history & profile
│   │   └── streamingImport.ts          # Parsers for Spotify Takeout & Apple CSV
│   ├── types.ts                        # TypeScript interfaces & types
│   ├── App.tsx                         # Main application root
│   ├── main.tsx                        # React DOM entrypoint
│   └── index.css                       # Tailwind CSS directives & custom styling
├── .env.example                        # Environment variables documentation
├── .gitignore                          # Git ignored paths
├── CONTRIBUTING.md                     # Contribution guidelines
├── LICENSE                             # MIT License
├── metadata.json                       # AI Studio Applet configuration
├── package.json                        # Project dependencies and npm scripts
├── tsconfig.json                       # TypeScript compiler settings
└── vite.config.ts                      # Vite configuration
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun** or **yarn**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/listener-segmentation.git
   cd listener-segmentation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development Server
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build
Compile TypeScript and generate an optimized production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

### Type Checking & Linting
Validate types across all files:
```bash
npm run lint
```

---

## 🤖 GitHub Actions CI/CD

This repository includes a fully configured continuous integration workflow (`.github/workflows/ci.yml`) that runs on every push and pull request to `main`:
- Checks out code and installs dependencies.
- Runs TypeScript type checking (`tsc --noEmit`).
- Executes the production Vite build (`npm run build`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Please check the [CONTRIBUTING.md](CONTRIBUTING.md) guide before opening a pull request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
