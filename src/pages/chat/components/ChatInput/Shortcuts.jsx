import { GUIDE_STEP } from '@src/utils/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SHORTCUTS_ACTIONS = {
  /**
   * 清空所有消息
   */
  CLEAR: 'clear',
  /**
   * 停止当前对话
   */
  STOP: 'stop',
  /**
   * 重新发送最后一条消息
   */
  RESEND_LAST: 'resend_last',
};

const shortcuts = [
  {
    label: 'common.clear_all',
    action: SHORTCUTS_ACTIONS.CLEAR,
    icon: 'i-mingcute-close-circle-fill',
  },
  {
    label: 'chat.stop',
    action: SHORTCUTS_ACTIONS.STOP,
    icon: 'i-mingcute-stop-circle-fill',
  },
  {
    label: 'chat.resend_last',
    action: SHORTCUTS_ACTIONS.RESEND_LAST,
    icon: 'i-mingcute-arrow-up-circle-fill',
  },
];

export function useShortcuts(onAction) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedShortcutIndex, setSelectedShortcutIndex] = useState(0);

  const onInputHook = value => {
    // 移除弹窗触发逻辑，现在通过按钮手动触发
  };

  const toggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  };

  /**
   * 处理快捷键
   * @returns 是否已处理
   */
  const onKeyDownHook = e => {
    if (!showShortcuts) return false;
    if (e.key === 'ArrowUp') {
      setSelectedShortcutIndex(prev =>
        prev > 0 ? prev - 1 : shortcuts.length - 1
      );
    } else if (e.key === 'ArrowDown') {
      setSelectedShortcutIndex(prev =>
        prev < shortcuts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'Enter') {
      onAction(shortcuts[selectedShortcutIndex].action);
      setShowShortcuts(false);
    } else if (e.key === 'Escape') {
      setShowShortcuts(false);
    } else {
      return false;
    }
    e.preventDefault();
    return true;
  };

  return {
    onInputHook,
    onKeyDownHook,
    showShortcuts,
    selectedShortcutIndex,
    setSelectedShortcutIndex,
    toggleShortcuts,
    setShowShortcuts,
  };
}

const Shortcuts = ({ onAction, selectedIndex }) => {
  const { t } = useTranslation();
  return (
    <div className="my-1" id={GUIDE_STEP.CHAT_INPUT_SHORTCUTS}>
      {shortcuts.map((shortcut, index) => (
        <div
          key={shortcut.action}
          className={`px-4 py-2 first:mt-0 mt-1 min-w-24 flex justify-start items-center gap-2 cursor-pointer rounded overflow-hidden ${
            index === selectedIndex
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => onAction(shortcut.action)}
          onKeyDown={event => handleKeyDown(event, shortcut)}
          tabIndex={0}
        >
          <i className={shortcut.icon} />
          <span>{t(shortcut.label)}</span>
        </div>
      ))}
    </div>
  );
};

export default Shortcuts;
