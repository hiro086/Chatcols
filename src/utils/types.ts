export const CHAT_PLACEHOLDER_TEXT = [
  "chat.placeholder.weather",
  "chat.placeholder.hungry",
  "chat.placeholder.quiet_world",
  "chat.placeholder.sleep",
  "chat.placeholder.go_out",
  "chat.placeholder.nice_place",
  "chat.placeholder.lets_chat",
  "chat.placeholder.chat_topic",
  "chat.placeholder.catch_something",
  "chat.placeholder.catch_bird",
  "chat.placeholder.quiet_place",
  "chat.placeholder.lucky",
  "chat.placeholder.your_story",
  "chat.placeholder.rare_chat",
  "chat.placeholder.nothing_to_say",
];

/**
 * 用于标识错误信息
 */
export const ERROR_PREFIX = "@<E1RaRvO0R>w>F.fz!J6R.zot#G,E>@";

/**
 * 用于标识聊天 Loading
 */
export const LOADING_MATCH_TOKEN = "      ";

/**
 * 用于标识内置自定义模型的标识
 */
export const CUSTOM_PRESET_PREFIX = "[预设] ";

export enum LOCAL_STORAGE_KEY {
  /**
   * 主题
   */
  THEME_MODE = "theme-mode",
  /**
   * 密钥
   */
  SECRET_KEY = "sc_key",
  /**
   * 当前已选择的模型
   */
  ACTIVE_MODELS = "active_models",
  /**
   * 模型请求选项
   */
  CHAT_MODEL_OPTIONS = "chat_model_options",
  /**
   * 多行模式
   */
  ROW_MODE = "multi_rows",
  /**
   * 用户重新拖拽
   */
  USER_SORT_SETTINGS = "user_sort_settings",
  /**
   * 用户自定义模型
   */
  USER_CUSTOM_MODELS = "user_custom_models",
  /**
   * 禅模式
   */
  ZEN_MODE = "zen_mode",
  /**
   * System Prompts
   */
  SYSTEM_PROMPTS = "system_prompts",
  /**
   * 当前使用的 System Prompt
   */
  ACTIVE_SYSTEM_PROMPT = "active_system_prompt",
  /**
   * Chat Input History
   */
  CHAT_INPUT_HISTORY = "chat_input_history",
  /**
   * 隐藏 Zen mode 提示
   */
  FLAG_NO_ZEN_MODE_HELP = "flag_no_zen_mode_help",
  /**
   * 关闭引导
   */
  FLAG_NO_GUIDE = "flag_no_guide",
  /**
   * 词解器激活模型
   */
  WORD_EXPLAINER_ACTIVE_MODELS = "word_explainer_active_models",
  /**
   * 词解器提示词
   */
  WORD_EXPLAINER_PROMPT = "word_explainer_prompt",
  /**
   * 联网搜索设置
   */
  WEB_SEARCH_SETTINGS = "web_search_settings",
  /**
   * base URL
   */
  BASE_URL = "base_url",
  /**
   * Secret Key 历史记录
   */
  SECRET_KEY_HISTORY = "secret_key_history",
  /**
   * Base URL 历史记录
   */
  BASE_URL_HISTORY = "base_url_history",
}

export enum GUIDE_STEP {
  /**
   * 输入框模型选择器
   */
  INPUT_MODEL_SELECTOR = "input-model-selector",
  /**
   * 输入框选择系统提示
   */
  INPUT_SELECT_SYSTEM_PROMPT = "input-select-system-prompt",
  /**
   * 输入框快捷键
   */
  CHAT_INPUT_SHORTCUTS = "chat-input-shortcuts",
  /**
   * 输入框
   */
  CHAT_INPUT = "chat-input",
  /**
   * 对话参数调整弹窗
   */
  CHAT_OPTIONS_MODAL = "chat-options-modal",
  /**
   * 对话参数调整
   */
  CHAT_OPTIONS_ADJUST = "chat-options-adjust",
  /**
   * 模型选择Select
   */
  CLASS_CHAT_MODEL_SELECT = "chat-model-select-modal",
  /**
   * HEADER更多功能
   */
  HEADER_MORE_FUNCTION = "header-more-function",
  /**
   * 重新发送消息
   */
  CHAT_RESEND_MESSAGE = "chat-resend-message",
}

export enum LOCATION_QUERY_KEY {
  SYSTEM_PROMPT_ID = "system_prompt_id",
  QUESTION = "q",
  ACTIVE_MODELS = "active_models",
}
