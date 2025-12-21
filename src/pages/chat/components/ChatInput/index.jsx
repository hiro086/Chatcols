import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@src/utils/use";
import SystemPromptSelector from "./SystemPromptSelector";
import { useTranslation } from "react-i18next";
import ImageUploader from "./ImageUploader";
import { useMemo } from "react";
import { Popup, Checkbox, DialogPlugin } from "tdesign-react";
import Shortcuts, { SHORTCUTS_ACTIONS, useShortcuts } from "./Shortcuts";
import { GUIDE_STEP } from "@src/utils/types";
import { removeUserMessage } from "@src/utils/chat";
import { isBrowserExtension } from "@src/utils/utils";
import Tooltip from "@src/components/MobileCompatible/Tooltip";
import { useActiveModels } from "@src/store/app";
import { getAllTextModels } from "@src/utils/models";
import { getSecretKey } from "@src/store/storage";

/**
 * 不使用输入框的历史记录
 */
const NO_INPUT_HISTORY_INDEX = -1;

export default function ({
  onStop,
  onSubmit,
  loading,
  placeholder,
  plain = false,
  onCursorPre,
  onCursorNext,
  hasVisionModel,
  messageHistory = [],
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const inputRef = useRef();
  const isMobile = useIsMobile();
  const validInput = input.trim();
  const [image, setImage] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(NO_INPUT_HISTORY_INDEX);

  const handleShortcutSelect = (action) => {
    if (action === SHORTCUTS_ACTIONS.CLEAR) {
      onStop(true);
    } else if (action === SHORTCUTS_ACTIONS.STOP) {
      onStop(false);
    } else if (
      action === SHORTCUTS_ACTIONS.RESEND_LAST &&
      messageHistory.length > 0
    ) {
      const { message, image, chatId } =
        messageHistory[messageHistory.length - 1];
      removeUserMessage(chatId);
      onSubmit(message, image, null);
    }
    setInput("");
    onInputHook("");
    inputRef.current.focus();
  };
  const {
    onInputHook,
    onKeyDownHook,
    showShortcuts,
    selectedShortcutIndex,
    toggleShortcuts,
    setShowShortcuts,
  } = useShortcuts(handleShortcutSelect);

  const { activeModels, setActiveModels } = useActiveModels();
  const allTextModels = getAllTextModels();
  const [showModelSelector, setShowModelSelector] = useState(false);

  const handleModelToggle = (modelId) => {
    const isAdding = !activeModels.includes(modelId);

    // 如果是增加模型，检查是否为非智答 API 且已有3个模型
    // if (isAdding) {
    //   const baseUrl = getBaseUrl();
    //   if (baseUrl !== "https://aianswers.cn/v1" && activeModels.length >= 3) {
    //     message.warning(
    //       "非本站令牌只能同时与三个模型对话，可在对话框顶部切换任意模型。"
    //     );
    //     return;
    //   }
    // }

    const newActiveModels = isAdding
      ? [...activeModels, modelId]
      : activeModels.filter((id) => id !== modelId);
    setActiveModels(newActiveModels);
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [loading]);

  // 自动调整输入框高度
  useEffect(() => {
    if (inputRef.current) {
      const el = inputRef.current;
      if (!input) {
        el.style.height = "1.5rem";
      } else {
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 300) + "px";
      }
    }
  }, [input]);

  const onInput = (e) => {
    const value = e.target.value;
    setInput(value);
    onInputHook(value);
  };

  const canSend = image || validInput;

  const checkFreeLimited = () => {
    const secretKey = getSecretKey();
    if (secretKey === "sk-18TyZMF9c5G37zM7AMsG2UjXlIftgPVCSUFI0FjAMv4AGmmd") {
      // 计算字符串长度和汉字数量
      const charCount = validInput.length;
      const chineseCount = (validInput.match(/[\u4e00-\u9fa5]/g) || []).length;

      if (image || charCount > 500 || chineseCount > 300) {
        const dialog = DialogPlugin.alert({
          header: t("common.warning"),
          body: t("chat.free_limit_exceeded"),
          confirmBtn: t("common.confirm"),
          onConfirm: () => {
            dialog.destroy();
          },
          onClose: () => {
            dialog.destroy();
          },
        });
        return false;
      }
    }
    return true;
  };

  const onSend = () => {
    if (!checkFreeLimited()) return;
    if (!canSend) return;
    if (loading) {
      onStop(false);
    }
    onSubmit(validInput, image, null);
    setInput("");
    setImage(null);
    setHistoryIndex(NO_INPUT_HISTORY_INDEX);
    umami.track("chat", { models: `${activeModels.length}` });
  };

  useEffect(() => {
    if (!hasVisionModel) {
      setImage(null);
    }
  }, [hasVisionModel]);

  const systemPromptSelectorRef = useRef();
  const shortcutsPopupRef = useRef();

  const _onPre = onCursorPre || (() => systemPromptSelectorRef.current?.pre());
  const _onNext =
    onCursorNext || (() => systemPromptSelectorRef.current?.next());

  /**
   * 切换历史记录
   */
  const _onSwitchHistory = (isUp) => {
    let targetIndex = 0;
    if (isUp) {
      // 向上切换
      // 如果没使用历史记录，则设置为最后一个历史记录
      if (historyIndex === NO_INPUT_HISTORY_INDEX) {
        if (input.length) return;
        targetIndex = messageHistory.length - 1;
      } else {
        targetIndex = Math.max(historyIndex - 1, 0);
      }
    } else {
      // 向下切换
      // 如果没使用历史记录，则不进行切换
      if (historyIndex === NO_INPUT_HISTORY_INDEX) {
        return;
      } else if (historyIndex === messageHistory.length - 1) {
        // 如果当前是最后一个历史记录，则重置为不使用历史记录
        targetIndex = NO_INPUT_HISTORY_INDEX;
      } else {
        targetIndex = Math.min(historyIndex + 1, messageHistory.length - 1);
      }
    }

    if (targetIndex === historyIndex) return;
    console.log(targetIndex);

    // 根据历史记录设置输入框的内容
    if (targetIndex === NO_INPUT_HISTORY_INDEX) {
      setInput("");
      setImage(null);
    } else {
      const { message, image } = messageHistory[targetIndex];
      setInput(message);
      setImage(image);
    }
    setHistoryIndex(targetIndex);
  };

  useEffect(() => {
    if (!isBrowserExtension && isMobile && showShortcuts) {
      inputRef.current.blur();
    }
  }, [isMobile, showShortcuts]);

  // 点击外部时隐藏快捷指令弹窗 (仅移动端)
  useEffect(() => {
    if (!isMobile) return; // 桌面端使用 hover，不需要点击外部隐藏

    const handleClickOutside = (event) => {
      if (
        showShortcuts &&
        shortcutsPopupRef.current &&
        !shortcutsPopupRef.current.contains(event.target)
      ) {
        setShowShortcuts(false);
      }
    };

    if (showShortcuts) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showShortcuts, setShowShortcuts, isMobile]);

  const onKeyDown = (e) => {
    if (onKeyDownHook(e)) {
      return;
    }
    if (e.key === "Enter") {
      // 允许回车键发送
      if (
        (!isBrowserExtension && isMobile) ||
        (!e.shiftKey && !e.nativeEvent?.isComposing)
      ) {
        // shift+回车 换行不发送
        e.preventDefault();
        onSend();
        if (isMobile) {
          inputRef.current.blur();
        }
      }
    }

    // 获取光标的位置
    const selectionStart = inputRef.current.selectionStart;
    const isOnStart = selectionStart === 0;
    const isOnEnd = selectionStart === input.length;
    // 在输入框的开始位置
    if (isOnStart) {
      switch (e.key) {
        case "ArrowLeft":
          _onPre();
          break;
        case "ArrowRight":
          if (!input.length) {
            // 如果输入框没有内容，则切换到下一个快捷指令（系统提示词）
            _onNext();
          }
          break;
        case "ArrowUp":
          _onSwitchHistory(true);
          break;
        default:
          break;
      }
    }
    if (isOnEnd) {
      if (e.key === "ArrowDown") {
        _onSwitchHistory(false);
      }
    }
  };

  const actionBaseClassName =
    "absolute bottom-3 right-4 w-6 h-6 cursor-pointer transition-all duration-500 ease-in-out ";
  const onUpload = (img) => {
    setImage(img);
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  };

  const imageUploaderRef = useRef();
  useEffect(() => {
    if (!image) {
      imageUploaderRef.current?.clear();
    }
  }, [image]);
  const imageUploader = useMemo(() => {
    return (
      <ImageUploader
        ref={imageUploaderRef}
        onUpload={onUpload}
        className="ml-2"
      />
    );
  }, [image]);

  // 添加粘贴事件处理函数
  const handlePaste = (e) => {
    e.preventDefault(); // 阻止默认粘贴行为
    const items = e.clipboardData.items;

    let hasImage = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        hasImage = true;
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target.result);
        };
        reader.readAsDataURL(file);
        break;
      }
    }

    // 只有在没有图片的情况下才处理文本
    if (!hasImage) {
      const text = e.clipboardData.getData("text");
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const currentValue = target.value;
      const newValue =
        currentValue.substring(0, start) + text + currentValue.substring(end);
      target.value = newValue;
      target.selectionStart = target.selectionEnd = start + text.length;
      setInput(newValue);
    }
  };

  return (
    <>
      <div className="h-12"></div>

      {/* 图片预览区域 */}
      {image && (
        <div className="absolute p-3 mb-2 bg-white shadow-md left-2 right-2 bottom-16 dark:bg-black rounded-2xl">
          <div className="relative inline-block">
            <img
              src={image}
              alt="Uploaded preview"
              className="object-cover max-w-xs rounded-lg max-h-32 border-[0.5px] border-gray-300  dark:border-gray-600"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute flex items-center justify-center w-6 h-6 text-xs text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div
        id="inputarea"
        className={`min-h-12 z-40 absolute left-2 right-2 bottom-0 bg-gray-100 dark:bg-[#1A1A1A] flex pl-4 pr-10 py-3 shadow-md overflow-hidden transition-[border-radius] duration-400 rounded-md ${plain ? "!bg-opacity-70" : ""
          }`}
      >
        {/* 指令按钮区域 */}
        <div className="flex items-start">
          <Tooltip content={t("chat.shortcuts")}>
            <Popup
              content={
                <Shortcuts
                  onAction={handleShortcutSelect}
                  selectedIndex={selectedShortcutIndex}
                />
              }
              showArrow
              placement="top-left"
              visible={showShortcuts}
              trigger={isMobile ? "click" : "hover"}
              onVisibleChange={setShowShortcuts}
            >
              <div
                ref={shortcutsPopupRef}
                className="flex items-start justify-center text-black dark:filter dark:invert dark:brightness-0 dark:contrast-100 rounded-full cursor-pointer transform mr-2.5 mt-0.5"
                onClick={
                  isMobile
                    ? toggleShortcuts
                    : () => {
                      // PC端：如果已经显示，点击切换；如果未显示，点击显示
                      if (showShortcuts) {
                        setShowShortcuts(!showShortcuts);
                      } else {
                        setShowShortcuts(true);
                      }
                    }
                }
              >
                <i className="iconfont icon-up-square-fill" />
              </div>
            </Popup>
          </Tooltip>
        </div>

        <SystemPromptSelector ref={systemPromptSelectorRef} />

        {/* 模型选择器 */}
        <Tooltip content={t("header.add_model")}>
          <Popup
            content={
              <div className="max-w-xs my-2">
                <div className="mb-2 text-sm font-medium">
                  {t("common.select_models")}
                </div>
                <div className="overflow-y-auto max-h-60">
                  {allTextModels.map((model) => (
                    <div key={model.id} className="flex items-center py-1">
                      <Checkbox
                        checked={activeModels.includes(model.id)}
                        onChange={() => handleModelToggle(model.id)}
                      />
                      <img
                        src={model.icon}
                        alt={model.name}
                        className="w-4 h-4 mx-2 rounded-sm"
                      />
                      <span className="text-sm">{model.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            }
            showArrow
            placement="top-left"
            visible={showModelSelector}
            trigger={isMobile ? "click" : "hover"}
            onVisibleChange={setShowModelSelector}
          >
            <div
              id={GUIDE_STEP.INPUT_MODEL_SELECTOR}
              className="flex items-start justify-center dark:filter dark:invert dark:brightness-0 dark:contrast-100 rounded-full cursor-pointer transform text-black ml-1.5 mr-2 mt-0.5"
              onClick={
                isMobile
                  ? () => setShowModelSelector(!showModelSelector)
                  : () => {
                    // PC端：如果已经显示，点击切换；如果未显示，点击显示
                    if (showModelSelector) {
                      setShowModelSelector(!showModelSelector);
                    } else {
                      setShowModelSelector(true);
                    }
                  }
              }
            >
              <i className="scale-[1.0]  iconfont icon-agentguanli" />
            </div>
          </Popup>
        </Tooltip>

        {/* 分割线 */}
        <div className="self-stretch w-px mx-2 bg-gray-300 dark:bg-gray-600"></div>

        {hasVisionModel && imageUploader}

        <textarea
          id={GUIDE_STEP.CHAT_INPUT}
          type="text"
          rows={1}
          enterKeyHint="send"
          value={input}
          style={{ height: "1.5rem" }}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onPaste={handlePaste}
          placeholder={loading ? "" : placeholder}
          ref={inputRef}
          className="w-full pl-4 pr-2 overflow-y-auto text-base leading-6 bg-transparent outline-none resize-none"
        />
        <i
          className={
            actionBaseClassName +
            "  i-mingcute-arrow-up-circle-fill " +
            (canSend
              ? "translate-y-0 opacity-100 z-10 "
              : "translate-y-0 opacity-20 z-0 ") +
            (!canSend && loading ? "rotate-180 !opacity-0 " : "rotate-0 ")
          }
          onClick={onSend}
        ></i>
        <>
          <i
            className={
              (!canSend && loading ? "opacity-100 z-10 " : "opacity-0 z-0  ") +
              " i-mingcute-stop-circle-fill " +
              actionBaseClassName
            }
            onClick={() => onStop(false)}
          ></i>
        </>
      </div>
    </>
  );
}
