# 开发指南

完整的 Chatcols 项目安装、调试和构建指导文档。

## 📋 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [开发调试](#开发调试)
- [项目构建](#项目构建)
- [多端部署](#多端部署)
- [常见问题](#常见问题)

---

## 环境要求

### 基础环境

- **Node.js**: 16.x 或更高版本
- **包管理器**: npm 或 pnpm（推荐 pnpm）
- **Git**: 用于版本控制

### 不同平台的额外要求

根据您要构建的目标平台，可能需要以下额外工具：

#### Web 应用
仅需要基础环境即可。

#### 浏览器扩展（Chrome/Edge）
仅需要基础环境即可。

#### Android 应用
- **Java Development Kit (JDK)**: 17 或更高版本
- **Android Studio**: 最新稳定版本
- **Android SDK**: API 33 或更高版本
- **Gradle**: 通过 Android Studio 自带

详细的 Android 构建指南请参考 [BUILD_ANDROID.md](./BUILD_ANDROID.md)。

---

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd Chatcols
```

### 2. 安装依赖

使用 npm：
```bash
npm install
```

或使用 pnpm（推荐）：
```bash
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:5173` 即可查看应用。

---

## 开发调试

### Web 应用开发

#### 启动开发服务器

```bash
npm run dev
```

- 支持热模块替换（HMR）
- 自动打开浏览器
- 默认端口：5173

#### 预览生产构建

```bash
npm run build
npm run preview
```

### 浏览器扩展开发

#### Chrome 扩展开发

```bash
# 开发模式
npm run dev:ext

# 构建
npm run build:chrome

# 打包为 zip
npm run zip:chrome
```

**加载扩展到 Chrome**：
1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目中的 `.output/chrome-mv3` 目录

#### Edge 扩展开发

```bash
# 构建
npm run build:edge

# 打包为 zip
npm run zip:edge
```

**加载扩展到 Edge**：
1. 打开 Edge 浏览器，访问 `edge://extensions/`
2. 开启"开发人员模式"
3. 点击"加载解压缩的扩展"
4. 选择项目中的 `.output/edge-mv3` 目录

### Android 应用开发

#### 初始化 Android 项目

如果是首次构建 Android 应用：

```bash
# 构建 Web 应用并同步到 Android
npm run cap:sync
```

#### 在 Android Studio 中调试

```bash
# 打开 Android Studio
npm run cap:open:android
```

在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 连接 Android 设备或启动模拟器
3. 点击运行按钮（绿色三角形）

#### 在设备/模拟器上快速运行

```bash
npm run cap:run:android
```

此命令会自动：
1. 构建 Web 应用
2. 同步到 Android 项目
3. 在连接的设备/模拟器上运行

---

## 项目构建

### Web 应用构建

```bash
npm run build
```

构建产物位于 `dist/` 目录，包含：
- 优化后的 JavaScript 和 CSS
- Gzip 和 Brotli 压缩版本
- PWA 离线支持文件

**部署到静态托管服务**：

将 `dist/` 目录部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- 或任何其他支持单页应用的服务

### 浏览器扩展构建

#### Chrome 扩展

```bash
# 构建
npm run build:chrome

# 打包为 zip（用于发布）
npm run zip:chrome
```

构建产物：
- 开发版：`.output/chrome-mv3/`
- 发布包：`.output/chrome-mv3.zip`

#### Edge 扩展

```bash
# 构建
npm run build:edge

# 打包为 zip（用于发布）
npm run zip:edge
```

构建产物：
- 开发版：`.output/edge-mv3/`
- 发布包：`.output/edge-mv3.zip`

### Android 应用构建

详细步骤请参考 [BUILD_ANDROID.md](./BUILD_ANDROID.md)。

#### 调试版本（Debug APK）

```bash
cd android
./gradlew assembleDebug
# Windows 使用: gradlew.bat assembleDebug
```

APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 发布版本（Release APK）

```bash
npm run build:android
```

或手动：
```bash
cd android
./gradlew assembleRelease
# Windows 使用: gradlew.bat assembleRelease
```

APK 位置：`android/app/build/outputs/apk/release/app-release.apk`

---

## 多端部署

### 🌐 Web 服务

1. 构建应用：`npm run build`
2. 将 `dist/` 目录部署到静态托管服务
3. 确保服务器配置支持 SPA 路由（所有路由返回 index.html）

**推荐服务**：
- **Vercel**: 零配置部署，支持自动 HTTPS
- **Netlify**: 简单易用，支持表单和函数
- **GitHub Pages**: 免费，适合开源项目
- **Cloudflare Pages**: 全球 CDN，性能优秀

### 🧩 浏览器扩展

#### Chrome Web Store 发布流程

1. 构建并打包：`npm run zip:chrome`
2. 访问 [Chrome 开发者控制台](https://chrome.google.com/webstore/devconsole)
3. 创建新商品
4. 上传 `.output/chrome-mv3.zip`
5. 填写商品详情（名称、描述、截图等）
6. 提交审核

#### Microsoft Edge Add-ons 发布流程

1. 构建并打包：`npm run zip:edge`
2. 访问 [Edge 开发者中心](https://partner.microsoft.com/dashboard/microsoftedge)
3. 创建新提交
4. 上传 `.output/edge-mv3.zip`
5. 填写扩展详情
6. 提交审核

### 📱 Android 应用

#### Google Play Store 发布流程

1. 构建 AAB 格式（推荐）：
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   AAB 位置：`android/app/build/outputs/bundle/release/app-release.aab`

2. 访问 [Google Play Console](https://play.google.com/console)
3. 创建应用
4. 上传 AAB 文件
5. 填写应用商店详情
6. 提交审核

#### 直接分发 APK

1. 构建 APK：`npm run build:android`
2. 将 `app-release.apk` 分发给用户
3. 用户需要在设备设置中允许"安装未知来源的应用"

---

## 常见问题

### 安装问题

#### Q: `npm install` 失败

**可能原因**：
- 网络问题
- Node.js 版本不兼容

**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 切换淘宝镜像（中国大陆用户）
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

或使用 pnpm：
```bash
pnpm install
```

#### Q: 依赖版本冲突

**解决方案**：
```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json
# Windows: rmdir /s node_modules && del package-lock.json

# 重新安装
npm install
```

### 开发问题

#### Q: 开发服务器启动失败

**解决方案**：
1. 检查端口 5173 是否被占用
2. 尝试指定其他端口：
   ```bash
   npm run dev -- --port 3000
   ```

#### Q: 热更新不工作

**解决方案**：
1. 检查文件保存是否成功
2. 重启开发服务器
3. 清除浏览器缓存

#### Q: 环境变量不生效

**解决方案**：
1. 确保环境变量以 `VITE_` 或 `AIBOX_` 开头
2. 重启开发服务器（环境变量需要重启才能生效）
3. 在代码中使用 `import.meta.env.VITE_YOUR_VAR` 访问

### 构建问题

#### Q: 构建提示内存不足

**解决方案**：
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
# Windows: set NODE_OPTIONS=--max-old-space-size=4096

npm run build
```

#### Q: 打包体积过大

**解决方案**：
1. 项目已配置代码分割和压缩
2. 检查是否引入了不必要的依赖
3. 使用打包分析工具：
   ```bash
   npm install -D rollup-plugin-visualizer
   ```

### Android 构建问题

#### Q: Gradle 同步失败

**解决方案**：
1. 检查 JDK 版本（需要 JDK 17+）
   ```bash
   java -version
   ```
2. 检查 Android SDK 环境变量
3. 在 Android Studio 中：`File` → `Invalidate Caches / Restart`

#### Q: 找不到 Android SDK

**解决方案**：
设置环境变量：

**Windows**：
```cmd
setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
```

**macOS/Linux**：
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
# 或
export ANDROID_HOME=/Users/YourName/Library/Android/sdk
```

添加到 `.bashrc` 或 `.zshrc` 使其持久化。

#### Q: Web 资源未更新到 Android

**解决方案**：
```bash
# 强制重新同步
npm run build
npx cap sync --force
```

### 扩展开发问题

#### Q: 扩展无法加载

**解决方案**：
1. 确保已开启"开发者模式"
2. 检查 manifest 文件是否正确
3. 查看浏览器扩展页面的错误信息
4. 重新构建扩展：`npm run build:chrome`

#### Q: 内容脚本无法注入

**解决方案**：
1. 检查 manifest 中的 `permissions` 和 `host_permissions`
2. 确保匹配模式正确
3. 重新加载扩展

---

## 📚 相关文档

- [Android 应用构建指南](./BUILD_ANDROID.md) - 详细的 Android 构建步骤
- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [WXT 扩展框架文档](https://wxt.dev/)
- [Vite 构建工具文档](https://vitejs.dev/)
- [React 官方文档](https://react.dev/)

---

## 🛠️ 快速命令参考

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Web 开发服务器 |
| `npm run build` | 构建 Web 应用 |
| `npm run preview` | 预览生产构建 |
| `npm run dev:ext` | 开发浏览器扩展 |
| `npm run build:chrome` | 构建 Chrome 扩展 |
| `npm run build:edge` | 构建 Edge 扩展 |
| `npm run cap:sync` | 构建并同步到 Capacitor |
| `npm run cap:open:android` | 在 Android Studio 中打开 |
| `npm run cap:run:android` | 在设备/模拟器上运行 |
| `npm run build:android` | 构建 Android 发布版本 |

---

## 🤝 贡献

如果您在使用过程中遇到问题或有改进建议，欢迎：
1. 提交 Issue
2. 提交 Pull Request
3. 完善文档

---

## 📄 许可证

本项目的许可证信息请参考项目根目录的 LICENSE 文件。

---

## 致谢

- 灵感来源于 [Silo](https://github.com/KwokKwok/Silo)，致敬！
