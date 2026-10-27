# 手机 UI 修复交接说明（2026-10-27）

## 分支与状态
- 来源分支：`fix/mobile-ui-scroll-music-toasts-20261027`
- 修改以 App 子文件夹为单位，尽量不侵入其他模块。
- 本文件列出**已在 GitHub 分支中存在**的变更，不代表独立线上预览的所有变更都已同步。

## 文件归属
| 功能 | 文件 | 改动 |
| --- | --- | --- |
| 音乐 | `src/apps/music/styles.css` | 缩小封面、播放器底部预留空间；由 `src/styles/new-apps.css` 引入 |
| 提醒事项 | `src/apps/reminders/styles.css` | 调整触摸滚动容器和底部空间 |
| 澳觅 | `src/apps/aomi/features/home/index.js` | 顶部显示“暂时无法定位” |
| 电话 | `src/apps/phone/replica.js` | 删除澳门地区切换符号与地区 Toast |
| 天气 | `src/apps/weather/replica.js` | 删除底部搜索城市输入栏 |
| 时钟 | `src/apps/clock/index.js` | 删除“游戏内时间”字样 |
| KIRA | `src/apps/kira/features/inbox/index.js` | 删除邮件底部工具栏 |
| 全局提示 | `src/main.js` | 关闭游戏内通用白色 Toast 显示（错误写入控制台） |

## 待完成 / 验收风险
- 锁屏通知已读状态与微信会话未读状态的完整同步**尚未在此分支提交**；需要统一管理通知、已读、回复和重新锁屏状态。
- 之前截图所示设置页固定横线、澳觅键盘布局、电池与灵动岛点击区域、通知中心对比度等问题**不在本次分支差异中**，不能视为已修复。
- 需要在 iPhone 真机验证提醒事项上下滑动、音乐底部控制和键盘弹出后的布局。

## 协作原则
每个 App 的业务逻辑和样式优先留在 `src/apps/<app>/` 下；系统级行为集中在 `src/system/`、`src/services/`。多人协作前先拉取 main，避免覆盖并行修改。
