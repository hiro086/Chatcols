import CUSTOM_MODEL_PRESET from "@src/components/Header/CustomModelDrawer/preset";
import { getSecretKey, getBaseUrl } from "@src/store/storage";
import {
  getJsonDataFromLocalStorage,
  setJsonDataToLocalStorage,
} from "@src/utils/helpers";
import { LOCAL_STORAGE_KEY } from "@src/utils/types";
import { openAiCompatibleChat } from "./utils";

const modules = import.meta.glob("../assets/img/models/*.*", { eager: true });

const _iconCache = {};

let customModels = null;
let normalizedCustomModel = null;

// 辅助函数：解析模型ID，提取 series、name
function parseModelId(id) {
  let fullName = id;
  const [series, ...nameParts] = fullName.split("/");
  const name = nameParts.join("/");
  return { series, name };
}

const keywordsMap = {
  openai: "Open AI",
  claude: "Anthropic",
  gemini: "Google Gemini",
  gork: "xAI",
  deepseek: "DeepSeek",
  others: "Others",
};

// 处理AIBOX_MODELS中模型
// id, price, length, vision 是否视觉模型;
const textModelOf = (id, price, length, vision) => {
  const { series, name } = parseModelId(id);
  const icon = getModelIcon(id); // 使用原始id获取图标
  let keywords = keywordsMap[series];
  if (vision) {
    keywords += ",多模态,视觉,图像,VL,vision,image";
  }
  return {
    id,
    name,
    series,
    price,
    length,
    icon,
    keywords,
    vision,
  };
};

/**
 * 获取内置的自定义模型解析函数
 */
function getCustomModelResolveFn(modelConfig) {
  const model = CUSTOM_MODEL_PRESET.find((item) =>
    modelConfig.isOpenAiCompatible
      ? item.isOpenAiCompatible
      : item.id === modelConfig.id
  );
  // 在标准的函数入参之外，添加上用户配置的数据（内含 apiKey 等东西）
  return (...args) => model.resolveFn(modelConfig, ...args);
}

export function getCustomModels() {
  if (!customModels) {
    customModels = getJsonDataFromLocalStorage(
      LOCAL_STORAGE_KEY.USER_CUSTOM_MODELS,
      []
    );
    normalizedCustomModel = customModels
      .map((item) => {
        const resolveFn =
          item.paramsMode || item.isOpenAiCompatible
            ? getCustomModelResolveFn(item)
            : new Function(`return ${item.resolveFn}`)();

        // 拆分多个模型ID，并处理每个ID
        return item.ids.split(",").map((id) => {
          const { series, name } = parseModelId(id);
          const icon = item.icon || getModelIcon(id); // 使用原始id获取图标
          return {
            ...item,
            keywords: item.keywords || keywordsMap[series],
            ids: void 0, // 移除原始ids字段
            id,
            series,
            name,
            resolveFn,
            icon,
            isCustom: true,
          };
        });
      })
      .reduce((acc, cur) => [...acc, ...cur], []);
  }
  return { raw: customModels, normalized: normalizedCustomModel };
}

export function setCustomModels(models) {
  setJsonDataToLocalStorage(LOCAL_STORAGE_KEY.USER_CUSTOM_MODELS, models);
  getCustomModels();
}

// 修改 getModelIcon 函数，确保使用正确的 fullName 获取图标
export function getModelIcon(model) {
  if (!_iconCache[model]) {
    const { series } = parseModelId(model);
    _iconCache[model] =
      modules[Object.keys(modules).find((i) => i.includes(series))]?.default;
    if (!_iconCache[model]) {
      _iconCache[model] = "/logo.svg";
    }
  }
  return _iconCache[model];
}

const AIBOX_MODELS = [
  textModelOf("openai/gpt-5-nano", 1, 128, true),
  textModelOf("claude/claude-haiku-4-5-20251001", 2.5, 128),
  textModelOf("gemini/gemini-2.5-flash", 0.15, 128),
  textModelOf("deepseek/deepseek-v3", 0.1429, 32),
  textModelOf("others/qwen3-max", 4.2857, 128, true),
  textModelOf("openai/gpt-5.1", 1, 128, true),
  textModelOf("openai/gpt-5", 1, 128, true),
  textModelOf("openai/gpt-5-mini", 1, 128, true),
  textModelOf("openai/gpt-5-chat", 1, 128, true),
  textModelOf("openai/o4-mini-2025-04-16", 1.1, 128),
  textModelOf("openai/o3", 1.1, 128),
  textModelOf("openai/gpt-4", 30, 128, true),
  textModelOf("openai/gpt-4.1", 30, 128, true),
  textModelOf("openai/gpt-4-turbo", 15, 128, true),
  textModelOf("openai/gpt-4o", 7.5, 128, true),
  textModelOf("gemini/gemini-2.5-pro", 5.25, 128),
  textModelOf("gemini/gemini-2.5-flash-lite", 0.15, 128),
  textModelOf("gemini/gemini-2.0-flash", 0.25, 128),
  textModelOf("claude/claude-haiku-4-5", 2.5, 200, true),
  textModelOf("claude/claude-sonnet-4-20250514", 7.5, 128),
  textModelOf("claude/claude-sonnet-4", 7.5, 128),
  textModelOf("claude/claude-3-7-sonnet-20250219", 7.5, 128),
  textModelOf("claude/claude-3-7-sonnet-thinking", 7.5, 128),
  textModelOf("claude/claude-3-5-sonnet", 7.5, 128),
  textModelOf("claude/claude-3-opus-20240229", 37.5, 128),
  textModelOf("claude/claude-3-haiku-20240307", 0.625, 200),
  textModelOf("claude/claude-sonnet-4-5", 7.5, 128),
  textModelOf("deepseek/deepseek-reasoner", 2.8, 32),
  textModelOf("deepseek/deepseek-chat", 0.1429, 32),
  textModelOf("deepseek/deepseek-v3-2-exp", 1.4, 32),
  textModelOf("deepseek/deepseek-v3.1", 2.8, 32),
  textModelOf("deepseek/deepseek-r1", 2.8, 32),
  textModelOf("others/doubao-seed-1-6-flash", 1.25, 128),
  textModelOf("others/doubao-1-5-pro-32k", 1.25, 128),
  textModelOf("others/doubao-seed-1-6", 1.25, 128),
  textModelOf("others/qwen3-max", 4.2857, 128),
  textModelOf("others/qwen-plus", 0.1429, 128),
];

export function isMixedThinkingModel(modelId) {
  return modelId.includes("Qwen/Qwen3");
}

export const AIBOX_MODELS_IDS = AIBOX_MODELS.map((item) => item.id);

export function getAllTextModels() {
  return [...getCustomModels().normalized, ...AIBOX_MODELS];
}

const _visionModelIds = getAllTextModels()
  .filter((item) => item.vision)
  .map((item) => item.id);

export function isVisionModel(modelId) {
  return _visionModelIds.includes(modelId);
}

const customResolveFns = getAllTextModels()
  .filter((item) => item.resolveFn)
  .reduce((acc, item) => {
    acc[item.id] = item.resolveFn;
    return acc;
  }, {});

/**
 * 获取聊天解析器，根据模型ID选择合适的解析函数
 */
export function getChatResolver(modelId) {
  if (customResolveFns[modelId]) return customResolveFns[modelId];
  return (...args) => {
    return openAiCompatibleChat(
      getBaseUrl(),
      getSecretKey(),
      (modelId) => modelId,
      ...args
    );
  };
}
