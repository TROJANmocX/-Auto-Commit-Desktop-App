# Auto Commit Desktop App - Installation Guide

## For Users (End Users)

### Windows Installation

1. **Download** the installer:
   - Get `Auto-Commit-Setup-1.0.0.exe` from the releases
   
2. **Run the installer**:
   - Double-click the `.exe` file
   - Choose installation directory (or use default)
   - Select options:
     - ☑ Create Desktop Shortcut (recommended)
     - ☑ Add to Start Menu
   
3. **Launch**:
   - Double-click the desktop icon, OR
   - Find "Auto Commit" in Start Menu

### macOS Installation

1. **Download** the installer:
   - Get `Auto-Commit-1.0.0.dmg` from the releases
   
2. **Install**:
   - Open the `.dmg` file
   - Drag "Auto Commit" to Applications folder
   
3. **Launch**:
   - Open from Applications folder
   - If macOS blocks it: System Preferences → Security & Privacy → "Open Anyway"

### Linux Installation

1. **Download** the AppImage:
   - Get `Auto-Commit-1.0.0.AppImage` from the releases
   
2. **Make executable**:
   ```bash
   chmod +x Auto-Commit-1.0.0.AppImage
   ```
   
3. **Run**:
   ```bash
   ./Auto-Commit-1.0.0.AppImage
   ```

---

## For Developers (Building from Source)

### Prerequisites

- **Node.js** 18+ and npm
- **Git** installed and configured
- Platform-specific tools:
  - **Windows**: No additional tools needed
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `icnsutils`, `graphicsmagick`

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "AUTO COMMIT DESKTOP APP"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development Mode

Run the app in development mode with hot reload:

```bash
npm run electron:dev
```

This will:
- Start Vite dev server on `http://localhost:5173`
- Launch Electron window
- Enable DevTools
- Support hot module replacement

### Building for Production

#### Build for Current Platform

```bash
npm run electron:build
```

This creates installers in the `release/` directory:
- **Windows**: `Auto-Commit-Setup-1.0.0.exe`
- **macOS**: `Auto-Commit-1.0.0.dmg`
- **Linux**: `Auto-Commit-1.0.0.AppImage`

#### Build for Specific Platform

```bash
# Windows only
npm run electron:build -- --win

# macOS only
npm run electron:build -- --mac

# Linux only
npm run electron:build -- --linux
```

#### Build for All Platforms

```bash
npm run electron:build -- --win --mac --linux
```

**Note**: Building for macOS requires a Mac. Cross-platform builds have limitations.

### Project Structure

```
AUTO COMMIT DESKTOP APP/
├── assets/              # App icons
│   └── icon.png
├── electron/            # Electron main process
│   ├── main.js
│   └── preload.js
├── src/                 # React app
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── App.jsx
│   └── main.jsx
├── dist/                # Built React app (generated)
├── release/             # Built Electron app (generated)
├── electron-builder.json
├── package.json
└── vite.config.js
```

### Configuration Files

#### `electron-builder.json`
Controls how the application is packaged:
- App ID and name
- Icons and build resources
- Platform-specific settings
- Installer options

#### `package.json`
Defines dependencies and scripts:
- `electron:dev` - Development mode
- `electron:build` - Production build

### Troubleshooting

#### "Cannot find icon" error
Ensure `assets/icon.png` exists. The build process requires this file.

#### Build fails on Windows
- Install Windows Build Tools:
  ```bash
  npm install --global windows-build-tools
  ```

#### Build fails on macOS
- Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

#### Build fails on Linux
- Install required packages:
  ```bash
  sudo apt-get install icnsutils graphicsmagick
  ```

### Testing the Build

1. **Build the app**:
   ```bash
   npm run electron:build
   ```

2. **Find the installer**:
   - Look in `release/` directory
   - Find the file for your platform

3. **Install and test**:
   - Run the installer
   - Launch the app
   - Test core functionality:
     - Repository selection
     - Dry run mode
     - Heatmap preview
     - Undo functionality

### Code Signing (Optional)

For production releases, consider code signing:

#### Windows
- Get a code signing certificate
- Configure in `electron-builder.json`:
  ```json
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password"
  }
  ```

#### macOS
- Enroll in Apple Developer Program
- Configure signing identity in `electron-builder.json`:
  ```json
  "mac": {
    "identity": "Developer ID Application: Your Name"
  }
  ```

### Distribution

#### GitHub Releases
1. Tag a release: `git tag v1.0.0`
2. Push tags: `git push --tags`
3. Upload installers to GitHub Releases

#### Direct Download
Host the installers on your website or cloud storage.

### Updates and Versioning

Update version in `package.json`:
```json
{
  "version": "1.1.0"
}
```

Rebuild to  generate new installers with updated version.

---

## First-Time Usage

After installation:

1. **Launch the app**
2. **Browse to a Git repository**
3. **Configure your schedule**:
   - Enable "Dry run" first
   - Set commits per day (start with 1-2)
   - Choose date range
4. **Preview** the heatmap
5. **Run** dry mode to verify
6. **Disable dry run** when ready
7. **Run** to create actual commits

## Support

For issues or questions:
- Check the README.md
- Review the walkthrough.md
- Open an issue on GitHub

---

**Remember**: Use responsibly and ethically!
