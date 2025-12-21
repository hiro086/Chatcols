import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

const resources = {
  'zh-CN': {
    label: '简体中文',
    translation: zhCN,
  },
  en: {
    label: 'English',
    translation: en,
  },
};

export default resources;

export const i18nOptions = Object.keys(resources).map(key => ({
  label: resources[key].label,
  value: key,
}));
