import laughingBabyResolveFn from "./laughingBaby.js?raw";
import geminiResolveFn from "./gemini.js";
import claudeChat from "./claude.js";
import zhipuaiChat from "./zhipuai.js";
import deepseekResolveFn from "./deepseek.js";
import { CUSTOM_PRESET_PREFIX } from "@src/utils/types";
import { openAiCompatibleChat } from "@src/utils/utils.js";
import { getSecretKey } from "@src/store/storage.js";
import xAiChat from "./x-ai";

const CUSTOM_MODEL_PRESET = [
  {
    name: "OpenAI Compatible",
    icon: "/logo.svg",
    id: "preset-openai-compatible",
    ids: "openai/chatgpt-5-nano,gemini/gemini-2.5-flash,deepseek/deepseek-r1",
    sk: getSecretKey(),
    length: "32",
    price: 0,
    baseUrl: "https://aianswers.cn/v1",
    resolveFn: openAiCompatibleResolver,
    link: "https://aianswers.cn/price",
    isOpenAiCompatible: true,
  },
].map((item) => ({
  ...item,
  name: CUSTOM_PRESET_PREFIX + item.name,
  isPreset: true,
  params: item.paramsMode ? item.params || [] : [],
}));

export default CUSTOM_MODEL_PRESET;

export function openAiCompatibleResolver(modelConfig, ...args) {
  const { baseUrl, sk, idResolver } = modelConfig;
  let idResolverFn = "";
  if (idResolver) {
    idResolverFn = new Function(`return ${idResolver}`)();
  }
  return openAiCompatibleChat(baseUrl, sk, idResolverFn, ...args);
}
