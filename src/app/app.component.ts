import { Component, ElementRef, OnInit, Renderer2, inject } from '@angular/core';
// 导入 Angular 核心模块中的组件、元素引用、生命周期钩子、渲染器和依赖注入功能。
import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
// 导入路由相关的事件和功能，包括导航结束、导航错误、路由配置加载开始、路由器和路由出口。
import { TitleService, VERSION as VERSION_ALAIN, stepPreloader } from '@delon/theme';
// 导入 Delon 主题中的标题服务、版本信息和步骤预加载器。
import { environment } from '@env/environment';
// 导入环境配置。
import { NzModalService } from 'ng-zorro-antd/modal';
// 导入 Ng Zorro Ant Design 的模态框服务。
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
// 导入 Ng Zorro Ant Design 的版本信息。

// 定义一个 Angular 组件，选择器为 'app-root'，模板为路由出口，标记为独立组件，并导入 RouterOutlet。
@Component({
  selector: 'app-root',
  template: ` <router-outlet />`,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  // 使用依赖注入获取 Router 实例。

  private readonly titleSrv = inject(TitleService);
  // 使用依赖注入获取 TitleService 实例。

  private readonly modalSrv = inject(NzModalService);
  // 使用依赖注入获取 NzModalService 实例。

  private donePreloader = stepPreloader();
  // 初始化步骤预加载器。

  constructor(el: ElementRef, renderer: Renderer2) {
    // 构造函数，接收元素引用和渲染器作为参数。
    renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    // 设置元素的 ng-alain-version 属性为 Alain 版本。
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
    // 设置元素的 ng-zorro-version 属性为 Zorro 版本。
  }

  ngOnInit(): void {
    // 组件初始化生命周期钩子。
    let configLoad = false;
    // 初始化配置加载标志。

    this.router.events.subscribe(ev => {
      // 订阅路由事件。
      if (ev instanceof RouteConfigLoadStart) {
        // 如果事件是路由配置加载开始。
        configLoad = true;
        // 设置配置加载标志为 true。
      }
      if (configLoad && ev instanceof NavigationError) {
        // 如果配置已加载且事件是导航错误。
        this.modalSrv.confirm({
          // 显示确认模态框。
          nzTitle: `提醒`,
          nzContent: environment.production ? `应用可能已发布新版本，请点击刷新才能生效。` : `无法加载路由：${ev.url}`,
          nzCancelDisabled: false,
          nzOkText: '刷新',
          nzCancelText: '忽略',
          nzOnOk: () => location.reload()
          // 点击确认时刷新页面。
        });
      }
      if (ev instanceof NavigationEnd) {
        // 如果事件是导航结束。
        this.donePreloader();
        // 执行步骤预加载器完成操作。
        this.titleSrv.setTitle();
        // 设置页面标题。
        this.modalSrv.closeAll();
        // 关闭所有模态框。
      }
    });
  }
}
