import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhCNLocale from './zh-cn'
import { getStore } from '@/util/store'
Vue.use(VueI18n)
const Avue = window.AVUE;

const messages = {
  en: {
    ...Avue.locale.en,
    ...enLocale,
    ...elementEnLocale,
  },
  'zh-cn': {
    ...Avue.locale.zh,
    ...zhCNLocale,
    ...elementZhCNLocale,
  }
}
const i18n = new VueI18n({
  locale: getLocale(),
  fallbackLocale: 'en',
  messages
})

export function getLocale() {
  const lang = getStore({
    name: 'language'
  }) || navigator.language || 'zh-cn'
  // if (lang.substr(0, 2) === 'en') {
  //   return 'en'
  // }
  return lang.toLowerCase()
}

export function resetLocale() {
  i18n.locale = getLocale()
}

export default i18n
