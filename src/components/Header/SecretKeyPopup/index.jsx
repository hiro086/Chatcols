import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSecretKey, useBaseUrl, useSecretKeyHistory, useBaseUrlHistory } from "@src/store/storage";
import {
  OpenAILogo,
  LinkLogo,
  ClaudeLogo,
  GeminiLogo,
  DeepSeekLogo,
  DotsLogo
} from "@src/components/icons/ModelLogos";
import { useTranslation } from "react-i18next";

const SecretKeyPopup = forwardRef(
  ({ onImport, checkKeyValid, onClose: onCloseCallback }, ref) => {
    useImperativeHandle(ref, () => ({
      open: () => setShowPopup(true),
      isShow: () => showPopup,
    }));

    const [showPopup, setShowPopup] = useState(false);

    const [secretKey, setSecretKey] = useSecretKey();
    const [baseUrl, setBaseUrl] = useBaseUrl();
    const [keyHistory, addToKeyHistory] = useSecretKeyHistory();
    const [urlHistory, addToUrlHistory] = useBaseUrlHistory();

    const [error, setError] = useState("");
    const [showBaseUrlInput, setShowBaseUrlInput] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUrlDropdown, setShowUrlDropdown] = useState(false);

    const onClose = () => {
      setError("");
      setShowPopup(false);
      setShowDropdown(false);
      setShowUrlDropdown(false);
      // Call the callback if provided
      if (onCloseCallback) {
        onCloseCallback();
      }
    };

    const { t } = useTranslation();

    const check = () => {
      checkKeyValid(secretKey)
        // .then(onClose)
        .then(() => {
          // 验证成功后，保存到历史记录
          if (secretKey) {
            addToKeyHistory(secretKey);
            addToUrlHistory(baseUrl);
          }
        })
        .catch((err) => {
          console.log(err);
          console.log(err.message);

          setError(err.message);
          setShowPopup(true);
        });
    };
    useEffect(() => {
      setError("");
      check();
    }, [secretKey]);

    // 选择 secretKey 历史记录
    const handleSelectHistory = (key) => {
      setSecretKey(key);
      setShowDropdown(false);
    };

    // 选择 baseUrl 历史记录
    const handleSelectUrlHistory = (url) => {
      setBaseUrl(url);
      setShowUrlDropdown(false);
    };

    const isCurrentKeyValid = !error;

    if (!showPopup) return null;

    return (
      <div
        onClick={() => isCurrentKeyValid && onClose()}
        className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 filter backdrop-blur-sm"
      >
        <div className="relative w-10/12 lg:w-[600px] py-8 flex flex-col bg-white dark:bg-[#1A1A1A] rounded-lg p-4 text-center leading-4">
          {isCurrentKeyValid && (
            <i
              className="absolute text-2xl cursor-pointer i-mingcute-close-line opacity-70 top-4 right-4"
              onClick={onClose}
            ></i>
          )}
          <div
            className="flex flex-col items-center justify-center flex-1 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <>
              <div className="flex items-center justify-center mb-6">
                <img
                  src="./logo.svg"
                  alt="ChatcolsChat"
                  className="h-4 mr-4 md:h-10"
                />
                <LinkLogo className="h-4 mr-4 rounded-md md:h-6" />
                <DeepSeekLogo className="h-6 mr-2 rounded-md md:h-12" />
                <ClaudeLogo className="h-4 mr-2 rounded-md md:h-10" />
                <OpenAILogo className="h-4 mr-2 rounded-md md:h-10" />
                <GeminiLogo className="h-4 mr-6 rounded-md md:h-10" />
                <DotsLogo className="h-2 mr-2 rounded-md md:h-4" />
              </div>
              
              <span className="mt-2 text-sm text-gray-500">
                {t("header.popup.intro1")}
                <a href="https://aianswers.cn" target="_blank">
                  {t("header.popup.intro4")}
                </a>
                <br />
              </span>

              <div className="relative w-full">
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  onFocus={() => keyHistory.length > 0 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder={t("header.popup.enter_aibox_key")}
                  className="w-full h-12 px-4 text-center bg-gray-100 outline-none dark:bg-black rounded-xl"
                />
                {showDropdown && keyHistory.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {keyHistory.map((key, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectHistory(key)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-left truncate"
                        title={key}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {secretKey=="sk-18TyZMF9c5G37zM7AMsG2UjXlIftgPVCSUFI0FjAMv4AGmmd" && (
                <span className="mt-1 text-xs text-blue-400 text-left w-full">*此试用令牌仅支持三个模型：gpt-5-nano、claude-haiku-4.5、gemini-2.5-flash</span>
              )}
              {!!secretKey && error && (
                <span className="mt-2 text-sm text-red-400">{error}</span>
              )}
              
              {/* {showBaseUrlInput && ( */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={baseUrl}
                  autoFocus={true}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => setShowUrlDropdown(false), 200);
                    setShowBaseUrlInput(false);
                  }}
                  placeholder={t("header.popup.enter_base_url")}
                  className="w-full h-12 px-4 mt-2 text-center bg-gray-100 outline-none dark:bg-black rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowBaseUrlInput(false);
                    }
                  }}
                />
                {showUrlDropdown && urlHistory.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {urlHistory.map((url, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectUrlHistory(url)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-left truncate"
                        title={url}
                      >
                        {url}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* } */}

              

              <span className="mt-2 text-xs text-blue-400 text-left w-full">
                {t("header.popup.intro2")}
                {t("header.popup.update_base_url")}
                {/* {t("header.popup.intro3")} */}
              </span>

              <span className="mt-2 text-xs text-blue-400 text-left w-full">
                {t("header.popup.key_storage_notice")}
              </span>

              {/* <span className="mt-4 text-sm text-gray-500">
              {t('header.popup.have_config')}
              <a
                className="mx-1 cursor-pointer"
                target="_blank"
                onClick={onImport}
              >
                {t('header.popup.click_to_import')}
              </a>
            </span>

            {AIBOX_ENV.EXPERIENCE_SK && (
              <>
                <span
                  className="mt-4 text-sm text-blue-400 cursor-pointer"
                  onClick={() => {
                    setSecretKey();
                  }}
                >
                  🤖 {t('header.popup.use_experience_key')} 🤖
                </span>
                <span className="mt-2 text-xs text-gray-600">
                  {t('header.popup.experience_key_warning')}
                </span>
              </>
            )} */}
            </>
          </div>
        </div>
      </div>
    );
  }
);

export default SecretKeyPopup;
