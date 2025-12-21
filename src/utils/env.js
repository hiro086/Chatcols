function modelStrToIds(str, defaultValue) {
  try {
    const models =
      str
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item) || [];
    return models.length ? models : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
export const AIBOX_ENV = {
  DEFAULT_ACTIVE_CHAT_MODELS: modelStrToIds(
    import.meta.env.AIBOX_DEFAULT_ACTIVE_CHAT_MODELS,
    [
      "chatgpt-4o",
      "chatgpt-5",
      "chatgpt-4o-mini",
      "gemini-2.5-pro",
      "claude-3.7-sonnet",
    ]
  ),
  DEFAULT_WEB_COPILOT_ACTIVE_MODELS: modelStrToIds(
    import.meta.env.SILO_DEFAULT_WEB_COPILOT_ACTIVE_MODELS,
    ["openai/gpt-4o"]
  ),
};
