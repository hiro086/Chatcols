# Android APP 构建指南

本文档说明如何将 Chatcols 项目构建为 Android APP。

## 📋 前置要求

在开始之前，请确保您的系统已安装以下工具：

### 1. Node.js 和 npm
- Node.js 16+
- npm 或 pnpm

### 2. Java Development Kit (JDK)
- JDK 17 或更高版本
- 配置 `JAVA_HOME` 环境变量

### 3. Android Studio
- 下载并安装 [Android Studio](https://developer.android.com/studio)
- 安装 Android SDK (API 33 或更高版本推荐)
- 配置 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT` 环境变量

### 4. Gradle
- Android Studio 自带 Gradle，通常无需单独安装

## 🚀 构建步骤

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 构建 Web 应用并同步到 Android

```bash
npm run cap:sync
```

这个命令会：
1. 运行 `npm run build` 构建 Web 应用到 `dist` 目录
2. 将构建好的文件同步到 Android 项目

### 步骤 3: 在 Android Studio 中打开项目

```bash
npm run cap:open:android
```

这会在 Android Studio 中打开 Android 项目。

### 步骤 4: 配置签名（用于发布版本）

#### 生成签名密钥

```bash
keytool -genkey -v -keystore chatcols-release-key.keystore -alias chatcols -keyalg RSA -keysize 2048 -validity 10000
```

#### 配置 Gradle 签名

在 `android/app/build.gradle` 中添加签名配置：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("path/to/chatcols-release-key.keystore")
            storePassword "your-store-password"
            keyAlias "chatcols"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

**注意**: 不要将密钥文件和密码提交到版本控制！建议使用环境变量或 `gradle.properties`。

### 步骤 5: 构建 APK

#### 调试版本（Debug APK）

在 Android Studio 中：
1. 点击 `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`
2. APK 文件位置：`android/app/build/outputs/apk/debug/app-debug.apk`

或使用命令行：
```bash
cd android
./gradlew assembleDebug
```

#### 发布版本（Release APK）

```bash
npm run build:android
```

或手动：
```bash
cd android
./gradlew assembleRelease
```

发布 APK 位置：`android/app/build/outputs/apk/release/app-release.apk`

### 步骤 6: 构建 AAB（Google Play 发布格式）

```bash
cd android
./gradlew bundleRelease
```

AAB 文件位置：`android/app/build/outputs/bundle/release/app-release.aab`

## 📱 在设备上测试

### 使用 USB 连接

1. 在 Android 设备上启用开发者选项和 USB 调试
2. 通过 USB 连接设备到电脑
3. 运行：

```bash
npm run cap:run:android
```

### 使用模拟器

1. 在 Android Studio 中启动模拟器（AVD Manager）
2. 运行：

```bash
npm run cap:run:android
```

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run cap:sync` | 构建并同步 Web 代码到 Android |
| `npm run cap:open:android` | 在 Android Studio 中打开项目 |
| `npm run cap:run:android` | 构建并在设备/模拟器上运行 |
| `npm run build:android` | 构建发布版本 APK |
| `npx cap sync` | 同步代码（不重新构建 Web） |
| `npx cap update android` | 更新 Capacitor Android 平台 |

## 🎨 自定义应用图标和启动画面

### 应用图标

1. 准备一张 1024x1024 的 PNG 图标
2. 使用在线工具（如 [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)）生成各种尺寸
3. 替换 `android/app/src/main/res/` 下的 `mipmap-*` 文件夹中的图标

### 启动画面（Splash Screen）

编辑 `android/app/src/main/res/values/styles.xml` 和相关资源文件。

## ⚙️ 配置修改

### 修改应用名称

编辑 `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">Chatcols</string>
    <string name="title_activity_main">Chatcols</string>
</resources>
```

### 修改应用 ID

编辑 `capacitor.config.json`:

```json
{
  "appId": "com.chatcols.app",
  "appName": "Chatcols",
  "webDir": "dist"
}
```

修改后运行 `npx cap sync` 同步更改。

### 修改版本号

编辑 `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.2.1"
    }
}
```

## 🐛 常见问题

### 问题 1: Gradle 构建失败

**解决方案**:
- 确保 Java 版本正确（JDK 17+）
- 检查 Android SDK 是否正确安装
- 尝试在 Android Studio 中 `File` -> `Invalidate Caches / Restart`

### 问题 2: 找不到 Android SDK

**解决方案**:
- 设置环境变量 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`
- Windows: `C:\Users\YourName\AppData\Local\Android\Sdk`
- Mac/Linux: `~/Library/Android/sdk` 或 `/Users/YourName/Library/Android/sdk`

### 问题 3: 签名配置错误

**解决方案**:
- 确保密钥文件路径正确
- 验证密钥别名和密码
- 使用 `keytool -list -v -keystore your-keystore.keystore` 查看密钥信息

### 问题 4: Web 资源未更新

**解决方案**:
```bash
# 清理并重新构建
npm run build
npx cap sync --force
```

## 📚 更多资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android 开发者文档](https://developer.android.com/docs)
- [发布到 Google Play](https://developer.android.com/studio/publish)

## 🎯 下一步

构建完成后，您可以：
1. 在设备上安装并测试 APK
2. 准备应用商店素材（截图、描述等）
3. 发布到 Google Play Store
4. 或直接分发 APK 文件

祝您构建顺利！
