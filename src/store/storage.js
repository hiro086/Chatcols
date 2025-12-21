import { atom, useAtom } from "jotai";
import {
  getJsonDataFromLocalStorage,
  getLocalStorage,
  setJsonDataToLocalStorage,
  setLocalStorage,
} from "../utils/helpers";
import { LOCAL_STORAGE_KEY } from "../utils/types";
import { useEffect } from "react";
import { useState } from "react";
import { message } from "tdesign-react/es/message";
import "tdesign-react/es/message/style/css.js";
import i18next from "i18next";
import { AIBOX_ENV } from "@src/utils/env";
import { decrypt } from "@src/utils/encryption";
import wordExplainPrompt from "@src/services/prompt/web-copilot.txt?raw";
import { useRef } from "react";

let _cacheKey = "";
let _cacheBaseUrl = "";
export function getSecretKey(forceUpdate = false) {
  if (!_cacheKey || forceUpdate) {
    _cacheKey = getLocalStorage(LOCAL_STORAGE_KEY.SECRET_KEY, "sk-18TyZMF9c5G37zM7AMsG2UjXlIftgPVCSUFI0FjAMv4AGmmd");
  }
  return _cacheKey;
}

export function getBaseUrl(forceUpdate = false) {
  if (!_cacheBaseUrl || forceUpdate) {
    _cacheBaseUrl = getLocalStorage(
      LOCAL_STORAGE_KEY.BASE_URL,
      "https://aianswers.cn/v1"
    );
  }
  return _cacheBaseUrl;
}

const secretKeyAtom = atom(getSecretKey(true));
const baseUrlAtom = atom(getBaseUrl(true));

const isZenModeAtom = atom(
  getLocalStorage(LOCAL_STORAGE_KEY.ZEN_MODE, "false") === "true"
);

const activeSystemPromptIdAtom = atom(
  getLocalStorage(LOCAL_STORAGE_KEY.ACTIVE_SYSTEM_PROMPT, "")
);

const allCustomSystemPromptsAtom = atom(
  getJsonDataFromLocalStorage(LOCAL_STORAGE_KEY.SYSTEM_PROMPTS, [])
);

const noGuideAtom = atom(
  getLocalStorage(LOCAL_STORAGE_KEY.FLAG_NO_GUIDE, false)
);

const wordExplainerActiveModelsAtom = atom(
  getJsonDataFromLocalStorage(
    LOCAL_STORAGE_KEY.WORD_EXPLAINER_ACTIVE_MODELS,
    AIBOX_ENV.DEFAULT_WEB_COPILOT_ACTIVE_MODELS
  )
);
const wordExplainerPromptAtom = atom(
  getLocalStorage(LOCAL_STORAGE_KEY.WORD_EXPLAINER_PROMPT, wordExplainPrompt)
);

const themeModeAtom = atom(
  getLocalStorage(
    LOCAL_STORAGE_KEY.THEME_MODE,
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  )
);

const webSearchSettingsAtom = atom(
  getJsonDataFromLocalStorage(LOCAL_STORAGE_KEY.WEB_SEARCH_SETTINGS, {
    zhipuai: null,
  })
);

const secretKeyHistoryAtom = atom(
  getJsonDataFromLocalStorage(LOCAL_STORAGE_KEY.SECRET_KEY_HISTORY, [])
);

const baseUrlHistoryAtom = atom(
  getJsonDataFromLocalStorage(LOCAL_STORAGE_KEY.BASE_URL_HISTORY, [])
);

const atomMap = {
  [LOCAL_STORAGE_KEY.SYSTEM_PROMPTS]: allCustomSystemPromptsAtom,
  [LOCAL_STORAGE_KEY.ACTIVE_SYSTEM_PROMPT]: activeSystemPromptIdAtom,
  [LOCAL_STORAGE_KEY.ZEN_MODE]: isZenModeAtom,
  [LOCAL_STORAGE_KEY.SECRET_KEY]: secretKeyAtom,
  [LOCAL_STORAGE_KEY.BASE_URL]: baseUrlAtom,
  [LOCAL_STORAGE_KEY.FLAG_NO_GUIDE]: noGuideAtom,
  [LOCAL_STORAGE_KEY.WORD_EXPLAINER_ACTIVE_MODELS]:
    wordExplainerActiveModelsAtom,
  [LOCAL_STORAGE_KEY.WORD_EXPLAINER_PROMPT]: wordExplainerPromptAtom,
  [LOCAL_STORAGE_KEY.THEME_MODE]: themeModeAtom,
  [LOCAL_STORAGE_KEY.WEB_SEARCH_SETTINGS]: webSearchSettingsAtom,
  [LOCAL_STORAGE_KEY.SECRET_KEY_HISTORY]: secretKeyHistoryAtom,
  [LOCAL_STORAGE_KEY.BASE_URL_HISTORY]: baseUrlHistoryAtom,
};

/**
 * 获取localStorage 存储的 JSON 数据
 * @param {LOCAL_STORAGE_KEY} key
 * @returns
 */
export function useLocalStorageJSONAtom(key) {
  return useLocalStorageAtom(key, true);
}

export function useLocalStorageAtom(key, isJson = false) {
  const [value, setValue] = useAtom(atomMap[key]);
  const setValueToLocalStorage = (newValue, noPersist = false) => {
    setValue(newValue);
    if (!noPersist) {
      (isJson ? setJsonDataToLocalStorage : setLocalStorage)(key, newValue);
    }
  };
  return [value, setValueToLocalStorage];
}

export const useSecretKey = () => {
  const [value, setValue] = useLocalStorageAtom(LOCAL_STORAGE_KEY.SECRET_KEY);
  const setSecretKey = (key) => {
    let _key = key || "";
    setValue(_key);
    _cacheKey = _key;
  };
  return [value, setSecretKey];
};

export const useBaseUrl = () => {
  const [value, setValue] = useLocalStorageAtom(LOCAL_STORAGE_KEY.BASE_URL);
  const setBaseUrl = (url) => {
    let _url = url || "";
    setValue(_url);
    _cacheBaseUrl = _url;
  };
  return [value, setBaseUrl];
};

export function useActiveSystemPromptId() {
  return useLocalStorageAtom(LOCAL_STORAGE_KEY.ACTIVE_SYSTEM_PROMPT);
}

export function useLocalStorageFlag(key, defaultValue = false) {
  const [value, setValue] = useState(getLocalStorage(key, defaultValue));
  const setFlag = (flag) => {
    setValue(flag);
    setLocalStorage(key, flag);
  };
  return [value, setFlag];
}

export const useZenMode = () => {
  const [value, setValue] = useLocalStorageAtom(LOCAL_STORAGE_KEY.ZEN_MODE);
  const [hideNotify, setHideNotify] = useLocalStorageFlag(
    LOCAL_STORAGE_KEY.FLAG_NO_ZEN_MODE_HELP,
    false
  );
  const _setValue = (value) => {
    setValue(value);
    if (value && !hideNotify) {
      message.info({
        content: i18next.t("header.zen_mode_tip.content"),
        duration: 0,
        closeBtn: i18next.t("header.zen_mode_tip.do_not_show_again"),
        onClose: () => {
          setHideNotify(true);
        },
      });
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      _setValue(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return [value, _setValue];
};

const defaultZhipuaiWebSearchSettings = {
  apiKey: "",
  active: false,
  searchEngine: "search_std",
  model: "THUDM/GLM-4-9B-0414",
  skipIntent: false,
  prompt: `你是一个智能助手，你的任务是判断用户输入是否需要联网搜索才能获得最佳答案。

如果用户输入涉及以下情况，请回答“是”：
*   需要实时信息（例如：天气、新闻、股票价格）
*   需要查找特定事实或数据（例如：某人的生日、某事件的日期）
*   需要获取最新的信息或知识（例如：最新的科技进展、最近的体育赛事结果）
*   需要查找特定地点或服务（例如：附近的餐馆、某公司的地址）

如果用户输入可以通过已有的知识或简单的计算得出答案，请回答“否”。

输出要求：仅输出是或否
用户的输入是：`,
};

/**
 * 联网搜索设置，当前只支持智谱AI
 * @returns
 */
export const useWebSearchSettings = () => {
  const plainRef = useRef({});
  const [{ zhipuai }, setValue] = useLocalStorageJSONAtom(
    LOCAL_STORAGE_KEY.WEB_SEARCH_SETTINGS
  );
  const setZhipuai = (zhipuai) => {
    setValue({ zhipuai });
  };

  const resetZhipuai = () => {
    setZhipuai({
      ...defaultZhipuaiWebSearchSettings,
      active: zhipuai?.active || false,
      skipIntent: zhipuai?.skipIntent || false,
      apiKey: zhipuai?.apiKey || "",
      searchEngine: zhipuai?.searchEngine || "search_std",
    });
  };
  return [
    Object.assign(plainRef.current, defaultZhipuaiWebSearchSettings, zhipuai),
    setZhipuai,
    resetZhipuai,
  ];
};

/**
 * Secret Key 历史记录管理
 * @returns {[string[], (key: string) => void]}
 */
export const useSecretKeyHistory = () => {
  const [history, setHistory] = useLocalStorageJSONAtom(
    LOCAL_STORAGE_KEY.SECRET_KEY_HISTORY
  );

  const addToHistory = (key) => {
    if (!key || key.trim() === "") return;

    // 去重：如果 key 已存在，先移除
    const newHistory = history.filter((item) => item !== key);
    // 添加到最前面
    newHistory.unshift(key);
    // 最多保存 10 条记录
    const limitedHistory = newHistory.slice(0, 10);

    setHistory(limitedHistory);
  };

  return [history, addToHistory];
};

/**
 * Base URL 历史记录管理
 * @returns {[string[], (url: string) => void]}
 */
export const useBaseUrlHistory = () => {
  const [history, setHistory] = useLocalStorageJSONAtom(
    LOCAL_STORAGE_KEY.BASE_URL_HISTORY
  );

  const addToHistory = (url) => {
    if (!url || url.trim() === "") return;

    // 去重：如果 url 已存在，先移除
    const newHistory = history.filter((item) => item !== url);
    // 添加到最前面
    newHistory.unshift(url);
    // 最多保存 10 条记录
    const limitedHistory = newHistory.slice(0, 10);

    setHistory(limitedHistory);
  };

  return [history, addToHistory];
};
