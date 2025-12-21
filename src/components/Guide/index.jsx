import { GUIDE_STEP, LOCAL_STORAGE_KEY } from "@src/utils/types";
import React from "react";
import { useEffect } from "react";
import { Guide } from "tdesign-react";
import "tdesign-react/es/style/index.css";
import { mockClick, mockInput } from "./utils";
import { useLocalStorageAtom } from "@src/store/storage";
import { useTranslation } from "react-i18next";

const AppGuide = ({ onClose }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = React.useState(0);
  const [_noGuide, setNoGuide] = useLocalStorageAtom(
    LOCAL_STORAGE_KEY.FLAG_NO_GUIDE
  );

  // Reset current step when component mounts
  useEffect(() => {
    setCurrent(0);
  }, []);

  const steps = [
    {
      element: `#${GUIDE_STEP.INPUT_MODEL_SELECTOR}`,
      title: t("guide.model_selector"),
      body: t("guide.model_selector_desc"),
      placement: "top-left",
    },
    {
      element: `#${GUIDE_STEP.INPUT_SELECT_SYSTEM_PROMPT}`,
      title: t("guide.use_system_prompt"),
      body: t("guide.use_system_prompt_desc"),
      placement: "top-left",
    },
    {
      element: `#${GUIDE_STEP.CHAT_INPUT_SHORTCUTS}`,
      title: t("guide.shortcuts"),
      body: t("guide.shortcuts_desc"),
      placement: "top-left",
    },
    {
      element: `.t-popup.t-select__dropdown`,
      title: t("guide.model_select"),
      body: t("guide.model_select_desc"),
      placement: "bottom-left",
    },
    {
      element: `#${GUIDE_STEP.CHAT_OPTIONS_MODAL}`,
      title: t("guide.chat_options"),
      body: t("guide.chat_options_desc"),
      placement: "bottom-right",
    },
    {
      element: `#${GUIDE_STEP.CHAT_RESEND_MESSAGE}`,
      title: t("guide.resend_message"),
      body: t("guide.resend_message_desc"),
      placement: "bottom-left",
    },
    {
      element: `#${GUIDE_STEP.HEADER_MORE_FUNCTION}`,
      title: t("guide.more_functions"),
      body: t("guide.more_functions_desc"),
      placement: "bottom-left",
    },
  ];

  const handleChange = (current) => {
    if (current === 0) {
      // Step 0: Model selector - no special action needed
      setCurrent(0);
      return;
    } else if (current === 1) {
      // Step 1: System prompt selector - no special action needed
      setCurrent(1);
      return;
    } else if (current === 2) {
      // Step 2: Shortcuts - trigger the shortcuts popup
      const shortcutsButton = document.querySelector(
        ".icon-up-square-fill"
      )?.parentElement;
      if (shortcutsButton) {
        shortcutsButton.click();
      }
      // Wait for the popup to render before proceeding
      setTimeout(() => {
        setCurrent(2);
      }, 300);
      return;
    } else if (current === 3) {
      // Step 3: Model select - clear input and click model selector
      mockInput(GUIDE_STEP.CHAT_INPUT, "");
      mockClick(`.${GUIDE_STEP.CLASS_CHAT_MODEL_SELECT} .t-input__inner`);
      setTimeout(() => {
        setCurrent(3);
      }, 50);
      return;
    } else if (current === 4) {
      // Step 4: Chat options - click options adjust button
      mockClick(GUIDE_STEP.CHAT_OPTIONS_ADJUST);
      setTimeout(() => {
        setCurrent(4);
      }, 50);
      return;
    } else if (current === 5) {
      // Need to have some message history to show the resend button
      setCurrent(5);
      return;
    } else if (current === 6) {
      // Step 6: More functions - no special action needed
      setCurrent(6);
      return;
    }

    setCurrent(current);
  };

  const onEnd = () => {
    setNoGuide(true);
    onClose?.();
  };
  return (
    <div>
      <Guide
        current={current}
        steps={steps}
        onChange={handleChange}
        onFinish={onEnd}
        onSkip={onEnd}
      />
      {/* <button id={GUIDE_STEP.INPUT_SELECT_SYSTEM_PROMPT}>选择系统提示</button> */}
    </div>
  );
};

export default AppGuide;
