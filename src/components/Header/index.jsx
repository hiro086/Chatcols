import { useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { useActiveModels, useIsRowMode } from "@src/store/app";
import {
  useActiveSystemPromptId,
  useLocalStorageAtom,
  useZenMode,
  useSecretKey,
} from "@src/store/storage";
import { fetchUserInfo } from "@src/services/api";
import { useDarkMode, useIsMobile, useMultiRows } from "@src/utils/use";
import CustomModelDrawer from "./CustomModelDrawer";
import { message } from "tdesign-react/es/message";
import { notification } from "tdesign-react/es/notification";
import Button from "tdesign-react/es/button";
import Dropdown from "tdesign-react/es/dropdown";
import "tdesign-react/es/message/style/css.js";
import "tdesign-react/es/notification/style/css.js";
import "tdesign-react/es/button/style/css.js";
import "tdesign-react/es/dropdown/style/css.js";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from "@src/components/MobileCompatible/Tooltip";
import { useTranslation } from "react-i18next";
import ConfigImportModal from "./ConfigImportModal";
import { exportConfig, isBrowserExtension } from "@src/utils/utils";
import SecretKeyPopup from "./SecretKeyPopup";
import { GUIDE_STEP, LOCAL_STORAGE_KEY } from "@src/utils/types";
import Guide from "@src/components/Guide";
import { i18nOptions } from "@src/i18n/resources";
import MobileModelSelector from "./MobileModelSelector";
import WebCopilotSettingsModal from "./WebCopilotSettingsModal";
import WebSearchSettingsModal from "./WebSearchSettingsModal";

export default function () {
  const secretKeyPopupRef = useRef(null);
  const configModalRef = useRef(null);
  const [secretKey] = useSecretKey();
  const [hasPopupClosedOnce, setHasPopupClosedOnce] = useState(false);

  const openConfigModal = () => {
    configModalRef.current.open();
  };

  const [isDark, setDarkMode] = useDarkMode();
  const { i18n, t } = useTranslation();

  const location = useLocation();
  const isImageMode = location.pathname === "/image";
  const [showGuide, setShowGuide] = useState(false);
  const [guideKey, setGuideKey] = useState(0);

  const customModelRef = useRef();
  // const { data: userInfoRes, runAsync: getUserData } = useRequest(
  //   fetchUserInfo,
  //   {
  //     pollingInterval: 60 * 1000,
  //     debounceWait: 300,
  //     manual: true,
  //   }
  // );

  // 本地验证密钥格式的函数
  const validateSecretKey = async (key) => {
    if (!key || !key.startsWith("sk-") || key.length < 10) {
      throw new Error('密钥格式不正确，必须以 "sk-" 开头');
    }
    setRows(multiRows);
    return true;
  };

  // const userData = userInfoRes?.data;

  const [noGuide, setNoGuide] = useLocalStorageAtom(
    LOCAL_STORAGE_KEY.FLAG_NO_GUIDE
  );
  const isMobile = useIsMobile();

  // Handle secret key popup close and show guide logic
  const handleSecretKeyPopupClose = () => {
    const chatLineExists = document.getElementById("chat-line-0");
    console.log("handleSecretKeyPopupClose");
    if (
      !hasPopupClosedOnce &&
      secretKey &&
      secretKey.startsWith("sk-") &&
      !noGuide &&
      !isMobile &&
      chatLineExists
    ) {
      setShowGuide(true);
    }
    setHasPopupClosedOnce(true);
  };

  // useEffect(() => {
  //   // 不显示引导：移动端、密钥不可用、已关闭引导
  //   if (!isMobile) {
  //     setTimeout(() => {
  //       if (!secretKeyPopupRef.current?.isShow()) {
  //         setShowGuide(true);
  //       }
  //     }, 100);
  //   }
  // }, [noGuide, isImageMode, secretKeyPopupRef.current?.isShow()]);
  useEffect(() => {
    if (!hasPopupClosedOnce) {
      setTimeout(() => {
        if (secretKey === "sk-18TyZMF9c5G37zM7AMsG2UjXlIftgPVCSUFI0FjAMv4AGmmd" && !secretKeyPopupRef.current?.isShow()) {
          secretKeyPopupRef.current.open()
        }
      }, 100);
    }
  }, [secretKeyPopupRef.current?.isShow()]);

  const navigate = useNavigate();
  const [isRowMode, setIsRowMode] = useIsRowMode();

  const [isZenMode, setIsZenMode] = useZenMode();
  const [showInZen, setShowInZen] = useState(false);
  useEffect(() => {
    if (isZenMode) {
      setShowInZen(false);
    }
  }, [isZenMode]);

  const { addMoreModel, activeModels } = useActiveModels();
  const [systemPromptId] = useActiveSystemPromptId();
  const [multiRows, setRows] = useMultiRows();
  const mobileModelSelectorRef = useRef();
  const webCopilotSettingsRef = useRef();
  const webSearchSettingsRef = useRef(null);
  const onAddMoreModel = () => {
    if (isMobile) {
      mobileModelSelectorRef.current.open();
    } else {
      addMoreModel();
    }
  };

  return (
    <>
      {showGuide && (
        <Guide key={guideKey} onClose={() => setShowGuide(false)} />
      )}
      {isMobile && <MobileModelSelector ref={mobileModelSelectorRef} />}
      {isZenMode && (
        <div
          className="h-3 transition-colors hover:bg-primary hover:bg-opacity-10"
          onMouseOver={() => setShowInZen(true)}
        ></div>
      )}

      <div
        onMouseLeave={() => setShowInZen(false)}
        className={
          `h-12 w-full filter bg-white ${isMobile ? 'dark:bg-black' : 'dark:bg-[#1A1A1A]'} text-xl flex items-center px-4 ` +
          (isZenMode
            ? "fixed top-0 left-0 right-0 z-50 transform transition-visible duration-300 delay-150 " +
              (showInZen
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0")
            : " ")
        }
      >
        <img
          src="/logo.svg"
          alt="logo"
          className="w-8 mr-auto cursor-pointer"
          onClick={() => navigate("/chat")}
        />
        
        <div id={GUIDE_STEP.HEADER_MORE_FUNCTION} className="flex items-center">
          {!isImageMode && (
            <Tooltip placement="bottom" content={t("header.add_model")}>
              <i
                className="block mr-4 cursor-pointer iconfont icon-market_new_tab"
                onClick={onAddMoreModel}
              ></i>
            </Tooltip>
          )}

          {/* <Tooltip
            placement="bottom"
            content={t(
              isImageMode ? 'header.switch_to_chat' : 'header.switch_to_image'
            )}
          >
            <i
              onClick={() => navigate(isImageMode ? '/chat' : '/image')}
              className={
                (isImageMode
                  ? 'iconify mingcute--chat-1-line'
                  : 'iconify mingcute--pic-ai-line') +
                ' block color-current mr-4 cursor-pointer'
              }
            ></i>
          </Tooltip> */}
          <i
            className={
              (isDark
                ? "iconfont icon-light_mode"
                : "iconfont icon-dark_mode") + " cursor-pointer mr-4"
            }
            onClick={() => setDarkMode(!isDark)}
          ></i>
          <Tooltip placement="bottom" content={t("header.guide")}>
            <i
              className="mr-4 cursor-pointer iconfont icon-userguide"
              onClick={() => {
                setNoGuide(false);
                setGuideKey((prev) => prev + 1);
                setShowGuide(true);
              }}
            ></i>
          </Tooltip>
          <Tooltip placement="bottom" content={t("header.modify_key")}>
            <i
              className="mr-4 cursor-pointer iconfont icon-license"
              onClick={() => secretKeyPopupRef.current.open()}
            ></i>
          </Tooltip>
          <Dropdown
            maxColumnWidth="160"
            direction="left"
            trigger="click"
            options={[
              {
                icon: isRowMode
                  ? "i-mingcute-columns-3-fill"
                  : "i-mingcute-rows-3-fill",
                onClick: () => setIsRowMode(!isRowMode),
                hidden: isMobile || isImageMode,
                disabled: activeModels.length <= 1,
                title: t(
                  isRowMode
                    ? "header.multi_column_mode"
                    : "header.dual_line_mode"
                ),
              },
              {
                icon: "iconify mingcute--radiobox-line",
                onClick: () => setIsZenMode(!isZenMode),
                hidden: isMobile,
                title: t(
                  isZenMode ? "header.exit_zen_mode" : "header.zen_mode"
                ),
              },
              // {
              //   icon: 'i-ri-key-line',
              //   title: t('header.modify_key'),
              //   onClick: () => secretKeyPopupRef.current.open(),
              // },
              // {
              //   icon: 'iconify mingcute--earth-2-line',
              //   onClick: () => webSearchSettingsRef.current.open(),
              //   hidden: isImageMode,
              //   title: t('webSearch.settings'),
              // },
              {
                icon: "i-mingcute-plugin-2-fill",
                onClick: () => customModelRef.current.open(),
                hidden: isImageMode,
                title: t("header.custom_model"),
              },
              {
                icon: "i-mingcute-translate-2-line",
                // onClick: () => {
                //   window.open('https://chatcols.ai/translate', '_blank');
                // },
                title: t("header.select_language"),
                children: i18nOptions.map((item) => ({
                  content: item.label,
                  onClick: () => i18n.changeLanguage(item.value),
                })),
              },
              // {
              //   icon: "i-ri-copilot-fill",
              //   onClick: () => webCopilotSettingsRef.current.open(),
              //   hidden: !isBrowserExtension || isMobile || isImageMode,
              //   title: t("webCopilot.settings"),
              // },
              {
                icon: "iconify mingcute--more-3-fill",
                title: t("header.more"),
                divider: true,
                children: [
                  // {
                  //   icon: 'i-mingcute-search-fill',
                  //   onClick: async () => {
                  //     const searchUrl = `${window.location.origin}/${
                  //       isBrowserExtension ? 'ext.html' : ''
                  //     }#/chat?q=%s&system_prompt_id=${systemPromptId}&model=${activeModels.join(
                  //       ','
                  //     )}`;
                  //     const notify = await notification.info({
                  //       placement: 'bottom-right',
                  //       offset: [-20, -20],
                  //       title: t('header.add_as_search_engine'),
                  //       content: t('header.add_as_search_engine_content'),
                  //       closeBtn: true,
                  //       duration: 0,
                  //       footer: (
                  //         <>
                  //           <CopyToClipboard
                  //             text={searchUrl}
                  //             onCopy={() => {
                  //               message.success(t('common.copied'));
                  //               notify.close();
                  //             }}
                  //           >
                  //             <Button
                  //               className="ml-2"
                  //               theme="primary"
                  //               variant="text"
                  //             >
                  //               {t('common.copy')}
                  //             </Button>
                  //           </CopyToClipboard>
                  //         </>
                  //       ),
                  //     });
                  //   },
                  //   hidden: isMobile || isImageMode,
                  //   title: t('header.add_as_search_engine'),
                  // },
                  {
                    icon: "i-mingcute-file-export-fill",
                    onClick: exportConfig,
                    title: t("header.export_config"),
                  },
                  {
                    icon: "iconify mingcute--file-import-fill",
                    onClick: openConfigModal,
                    title: t("header.import_config"),
                  },
                  // {
                  //   icon: 'i-logos-chrome',
                  //   onClick: () => {
                  //     window.open(
                  //       'https://chromewebstore.google.com/detail/chatcols-aibox-api-pla/nakohnjaacfmjiodegibhnepfmioejln',
                  //       '_blank'
                  //     );
                  //   },
                  //   title: t('header.chrome_extension'),
                  //   hidden: isMobile || isImageMode,
                  // },
                ]
                  .filter((item) => !item.hidden)
                  .map((item) => ({
                    prefixIcon: <i className={item.icon + " mr-0"} />,
                    content: item.title,
                    onClick: item.onClick,
                  })),
              },
            ]
              .filter((item) => !item.hidden)
              .map((item) => ({
                prefixIcon: <i className={item.icon + " mr-0"} />,
                content: item.title,
                onClick: item.onClick,
                disabled: item.disabled,
                value: item.title,
                children: item.children,
              }))}
          >
            <i
              className={
                "i-ri-more-fill cursor-pointer iconfont icon-settings1"
              }
            ></i>
          </Dropdown>
          {/* <div className="inline-flex items-center ml-4 cursor-pointer">
            <i
              className="iconify i-ri-github-fill"
              onClick={() => {
                window.open('https://github.com/KwokKwok/Chatcols', '_blank');
              }}
            ></i>
          </div> */}
        </div>
      </div>
      <CustomModelDrawer ref={customModelRef} />
      <SecretKeyPopup
        ref={secretKeyPopupRef}
        onImport={openConfigModal}
        checkKeyValid={validateSecretKey}
        onClose={handleSecretKeyPopupClose}
      />
      <ConfigImportModal ref={configModalRef} />
      <WebCopilotSettingsModal ref={webCopilotSettingsRef} />
      <WebSearchSettingsModal ref={webSearchSettingsRef} />
    </>
  );
}
