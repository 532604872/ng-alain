import { provideHttpClient, withInterceptors } from '@angular/common/http';
// 导入 Angular 的 HTTP 客户端和拦截器功能。
import { default as ngLang } from '@angular/common/locales/zh';
// 导入中文语言包。
import { ApplicationConfig, EnvironmentProviders, Provider } from '@angular/core';
// 导入 Angular 核心模块中的应用配置、环境提供者和提供者类型。
import { provideAnimations } from '@angular/platform-browser/animations';
// 导入动画提供者。
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withHashLocation,
  RouterFeatures,
  withViewTransitions
} from '@angular/router';
// 导入路由相关的功能和特性。
import { I18NService, defaultInterceptor, provideBindAuthRefresh, provideStartup } from '@core';
// 导入国际化服务、默认拦截器、绑定认证刷新提供者和启动提供者。
import { provideCellWidgets } from '@delon/abc/cell';
// 导入单元格小部件提供者。
import { provideSTWidgets } from '@delon/abc/st';
// 导入表格小部件提供者。
import { authSimpleInterceptor, provideAuth } from '@delon/auth';
// 导入简单认证拦截器和认证提供者。
import { provideSFConfig } from '@delon/form';
// 导入表单配置提供者。
import { AlainProvideLang, provideAlain, zh_CN as delonLang } from '@delon/theme';
// 导入主题相关的语言提供者和配置。
import { AlainConfig } from '@delon/util/config';
// 导入 Alian 配置类型。
import { environment } from '@env/environment';
// 导入环境配置。
import { CELL_WIDGETS, SF_WIDGETS, ST_WIDGETS } from '@shared';
// 导入共享的小部件。
import { zhCN as dateLang } from 'date-fns/locale';
// 导入日期相关的中文语言包。
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
// 导入 Ng Zorro Ant Design 的配置和提供者。
import { zh_CN as zorroLang } from 'ng-zorro-antd/i18n';
// 导入 Ng Zorro Ant Design 的中文语言包。

import { ICONS } from '../style-icons';
// 导入样式图标。
import { ICONS_AUTO } from '../style-icons-auto';
// 导入自动样式图标。
import { routes } from './routes/routes';
// 导入路由配置。

const defaultLang: AlainProvideLang = {
  abbr: 'zh-CN',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};
// 定义默认语言配置，包含缩写和不同库的语言包。

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
  },
  auth: { login_url: '/passport/login' }
};
// 定义 Alain 配置，包括模态框大小、页面头部国际化、Lodop 许可证和认证登录 URL。

const ngZorroConfig: NzConfig = {};
// 定义 Ng Zorro 的配置（当前为空）。

const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withViewTransitions(),
  withInMemoryScrolling({ scrollPositionRestoration: 'top' })
];
// 定义路由特性，包括组件输入绑定、视图过渡和内存滚动。

if (environment.useHash) routerFeatures.push(withHashLocation());
// 如果环境配置使用哈希路由，则添加哈希路由特性。

const providers: Array<Provider | EnvironmentProviders> = [
  provideHttpClient(withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor, defaultInterceptor])),
  provideAnimations(),
  provideRouter(routes, ...routerFeatures),
  provideAlain({ config: alainConfig, defaultLang, i18nClass: I18NService, icons: [...ICONS_AUTO, ...ICONS] }),
  provideNzConfig(ngZorroConfig),
  provideAuth(),
  provideCellWidgets(...CELL_WIDGETS),
  provideSTWidgets(...ST_WIDGETS),
  provideSFConfig({ widgets: SF_WIDGETS }),
  provideStartup(),
  ...(environment.providers || [])
];
// 定义提供者数组，包含 HTTP 客户端、动画、路由、Alain 配置、Ng Zorro 配置、认证、各种小部件和启动提供者。

if (environment.api?.refreshTokenEnabled && environment.api.refreshTokenType === 'auth-refresh') {
  providers.push(provideBindAuthRefresh());
}
// 如果环境配置启用了刷新令牌并且类型为认证刷新，则添加绑定认证刷新提供者。

export const appConfig: ApplicationConfig = {
  providers: providers
};
// 导出应用程序配置，包含提供者数组。
