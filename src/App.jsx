import { lazy, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  HashRouter as Router,
} from 'react-router-dom';
import { useI18nSideEffect } from './utils/use';
import { useTranslation } from 'react-i18next';
import ConfigProvider from 'tdesign-react/es/config-provider';
import Loading from 'tdesign-react/es/loading';
import 'tdesign-react/es/loading/style/css.js';
import enConfig from 'tdesign-react/es/locale/en_US';
import zhConfig from 'tdesign-react/es/locale/zh_CN';
import { merge } from 'lodash-es';

// 懒加载路由组件
const Header = lazy(() => import('./components/Header'));
const Chat = lazy(() => import('./pages/chat'));
const WebCopilot = lazy(() => import('./pages/web-copilot'));

function App() {
  useI18nSideEffect();
  const { i18n } = useTranslation();
  const globalConfig = merge(
    i18n.language.startsWith('zh') ? zhConfig : enConfig,
    {}
  );

  // 加载状态组件
  const LoadingFallback = () => (
    <div className="h-dvh w-full flex items-center justify-center bg-[#f8f8f8] dark:bg-black">
      <Loading loading={true} text="拼命加载中..." size="small"></Loading>
    </div>
  );

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <div className="h-dvh w-full flex flex-col selection:bg-primary selection:text-white pb-2 text-sm bg-[#f8f8f8] dark:bg-black">
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/chat" />} />
              <Route
                path="/chat"
                element={
                  <>
                    <Header />
                    <Chat />
                  </>
                }
              />
              <Route path="/web-copilot" element={<WebCopilot />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
