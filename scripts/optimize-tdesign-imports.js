/**
 * 自动优化 TDesign 组件引入方式
 * 将全量引入改为按需引入，减少打包体积
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TDesign 组件名称到路径的映射
const componentMap = {
  ConfigProvider: 'config-provider',
  Loading: 'loading',
  Button: 'button',
  message: 'message',
  notification: 'notification',
  Dropdown: 'dropdown',
  Tag: 'tag',
  ImageViewer: 'image-viewer',
  Image: 'image',
  Space: 'space',
  TooltipLite: 'tooltip',
  Tooltip: 'tooltip',
  Popup: 'popup',
  Guide: 'guide',
  Dialog: 'dialog',
  Upload: 'upload',
  MessagePlugin: 'message',
  Textarea: 'textarea',
  Form: 'form',
  Input: 'input',
  Select: 'select',
  InputNumber: 'input-number',
  Switch: 'switch',
  Drawer: 'drawer',
  Divider: 'divider',
  Checkbox: 'checkbox',
  Radio: 'radio',
  Slider: 'slider',
  Collapse: 'collapse',
  DialogPlugin: 'dialog',
  PopupPlacement: 'popup',
};

function optimizeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // 匹配 import { xxx } from 'tdesign-react'
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]tdesign-react['"]/g;
  const matches = [...content.matchAll(importRegex)];

  if (matches.length === 0) {
    return false;
  }

  let newImports = [];
  let styleImports = [];
  const processedComponents = new Set();

  matches.forEach(match => {
    const components = match[1]
      .split(',')
      .map(c => c.trim())
      .filter(c => c);

    components.forEach(component => {
      if (processedComponents.has(component)) return;
      processedComponents.add(component);

      const kebabCase = componentMap[component];
      if (!kebabCase) {
        console.warn(`⚠️  Unknown component: ${component} in ${filePath}`);
        return;
      }

      // 生成按需引入语句
      if (component === 'message' || component === 'notification' || component === 'MessagePlugin' || component === 'DialogPlugin') {
        // 这些是对象/插件，用默认导入
        newImports.push(`import ${component} from "tdesign-react/es/${kebabCase}";`);
      } else {
        newImports.push(`import ${component} from "tdesign-react/es/${kebabCase}";`);
      }

      // 添加样式引入
      if (!styleImports.includes(kebabCase)) {
        styleImports.push(`import "tdesign-react/es/${kebabCase}/style/index.css";`);
      }
    });
  });

  // 替换原有的导入语句
  if (newImports.length > 0) {
    // 移除所有旧的 tdesign-react 导入
    content = content.replace(importRegex, '');

    // 在文件顶部添加新的导入（在第一个非注释的 import 之前）
    const firstImportIndex = content.search(/^import\s+/m);
    if (firstImportIndex !== -1) {
      const allImports = [...newImports, ...styleImports].join('\n');
      content =
        content.slice(0, firstImportIndex) +
        allImports + '\n' +
        content.slice(firstImportIndex);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Optimized: ${path.relative(process.cwd(), filePath)}`);
  }

  return modified;
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        walkDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 主函数
function main() {
  console.log('🚀 开始优化 TDesign 组件引入...\n');

  const srcDir = path.resolve(__dirname, '../src');
  const files = walkDirectory(srcDir);

  let optimizedCount = 0;

  files.forEach(file => {
    if (optimizeFile(file)) {
      optimizedCount++;
    }
  });

  console.log(`\n✨ 完成！共优化了 ${optimizedCount} 个文件。`);
  console.log('\n💡 提示：部分已手动优化的文件可能未计入统计。');
}

main();
