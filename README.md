# Leet Xt - Extend Your LeetCode

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![WXT](https://img.shields.io/badge/Framework-WXT-purple)](https://wxt.dev/)

A feature-rich browser extension that enhances your LeetCode experience with friends management, contest predictions, and premium features.

## ✨ Features

- **Friends Management**
  - Add users to Friends Page from their Profile Page (⭐ star button)
  - View all friends and their data from one place
  - Import/Export friends list 

- **Contest Enhancements**
  - Predict your rating before official results
  - View friends' participation and predicted ratings

- **Problem Insights**
  - View all problems by company (with duration + frequency)
  - See problem ratings, contest, and company tags

## 🏗️ Project Structure

Built with **WXT Framework** (WebExtensions + TypeScript) for robust extension development.

```
src/
├── components/          # Reusable UI components
│
├── core/                # Core application logic
│   ├── app.ts           # Main application class
│   ├── manager.ts       # Base manager class
│   ├── defines/         # Mostly enums
│   ├── interfaces/      # TypeScript interfaces
│   ├── modules/         # Feature modules
│   └── utils/           # Sub-managers and helpers
│
├── entries/             # Extension entry points
│   ├── content.ts       # Content script entry
│   ├── background/      # Background service worker
│   ├── import_friends/  # Firefox fix for file import 
│   └── popup/           # Extension popup
│
├── public/              # Static assets
│   └── icons/           # Extension icons
│
└── values/              # Configuration values
    ├── config/          # App configuration
    ├── html/            # HTML components
    ├── selectors/       # DOM selectors
    └── svg/             # SVG assets
```

### Key Architectural Decisions

1. **Modular Design**
   - Features are split into independent modules in `core/modules/`
   - Each module implements `IModule` interface for consistent lifecycle
   - Enables easy feature toggling and maintenance

2. **Separate Selectors**
   - All DOM selectors are centralized in `values/selectors/`
   - Organized by LeetCode page type (contest, problem, profile)
   - Makes UI changes easier to manage

3. **HTML Components**
   - Templates stored in `values/html/` as separate files
   - Loaded dynamically to keep TSX/JSX minimal
   - Promotes separation of concerns

4. **Type Safety**
   - Comprehensive type definitions 
   - Strict TypeScript configuration

## � Installation

### Development

Note: Alternatively npm can be used instead of bun

1. Fork this repository
   
   <img src="https://github.com/user-attachments/assets/541a3b5c-396a-426a-9fb4-ef7a1f74365a" alt="Fork" width="120">

3. Clone the repository
   ```bash
   git clone https://github.com/<yourusername>/leet-xt.git
   cd leet-xt
   ```

4. Install dependencies
   ```bash
   bun install
   ```

5. Start development server
   ```bash
   bun run dev
   ```

### Production Build

```bash
bun run build
```

## � Contributing

We welcome contributions! Please follow these steps:

1. Make sure you have forked and cloned the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Leet Xt - leet-xt@binbard.org

Project Link: [https://leet-xt.js.org/](https://leet-xt.js.org/)
