## 🧰 GLIDE Tech Stack Overview

### 🖥️ Desktop Framework

- **Electron**: Facilitates the development of cross-platform desktop applications using web technologies.

- **Electron-Vite**: Enhances Electron development with Vite's fast build times and hot module replacement.

### ⚙️ Backend & Hardware Communication

- **Node.js**: Provides a runtime environment for executing JavaScript code server-side, essential for hardware interactions.

- **Johnny-Five**: A JavaScript Robotics and IoT platform, ideal for interfacing with Arduino and similar devices.

- **serialport**: Facilitates serial communication, allowing data exchange between your application and hardware components.

- **node-hid**: Enables communication with USB HID devices across platforms. It supports Windows, macOS, and Linux, making it a versatile choice for HID interactions.

- **Web Bluetooth API**: Electron supports the Web Bluetooth API, allowing communication with Bluetooth devices. Developers need to handle the `select-bluetooth-device` event to manage device selection.

### 📷 Camera & Media Handling

- **node-webcam**: Provides cross-platform webcam support, enabling image capture and video recording functionalities.

- **fluent-ffmpeg**: A powerful tool for handling video processing tasks, including recording, conversion, and streaming.

### 🎨 Frontend & UI

- **React**: A JavaScript library for building user interfaces, promoting component-based architecture.

- **Jotai**: A minimalistic state management library for React, offering atomic state management capabilities.

- **Tailwind CSS**: A utility-first CSS framework that accelerates UI development with pre-defined classes.

### 🛠️ Build & Packaging

- **electron-builder**: Streamlines the packaging and distribution of Electron applications across platforms.

- **electron-store**: Provides a simple and persistent key-value storage mechanism for Electron apps.

- **electron-log**: Facilitates logging within Electron applications, aiding in debugging and monitoring.

---

## 🗂️ Project Structure

```
glide/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Entry point for Electron
│   │   └── ipc/           # IPC handlers
│   ├── preload/           # Preload scripts
│   │   └── index.ts       # Entry point for preload
│   ├── renderer/          # React frontend
│   │   ├── assets/        # Static assets (images, fonts, etc.)
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # React pages or views
│   │   ├── state/         # Jotai atoms and state management
│   │   ├── styles/        # TailwindCSS configurations or additional styles
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main React component
│   └── shared/            # Shared code between main and renderer
│       └── types/         # TypeScript types and interfaces
├── electron.vite.config.ts # Electron-Vite configuration
├── package.json
├── tsconfig.json
└── vite.config.ts         # Vite configuration for renderer
```

---

## ⚠️ Considerations

- **Bluetooth Support**: While Electron supports the Web Bluetooth API, developers need to handle device selection manually. Ensure to implement appropriate UI components for device selection and pairing.

- **Native Module Compatibility**: When using packages with native bindings (e.g., `node-hid`), ensure they are compatible with your Electron version. You may need to rebuild these modules using tools like `electron-rebuild`.

- **Cross-Platform Testing**: Regularly test your application on all target platforms to identify and address platform-specific issues early in the development process.

---

By adhering to this tech stack and architectural guidelines, GLIDE will be well-positioned to deliver a robust, cross-platform IoT application. If you need assistance with specific implementations or further guidance, feel free to ask!
