# 照片 App

这部分完全独立于微信等其他 App，唯一入口为 `src/apps/photos/index.js`，样式只在 `styles.css` 内维护。

## 功能目录

- `features/library/`：图库五列照片网格与顶部筛选
- `features/collections/`：精选集、回忆、固定、相簿和人物
- `features/albums/`：相簿详情
- `features/viewer/`：单张照片、收藏、壁纸、分享、删除
- `features/search/`：搜索
- `features/import/`：导入图片，写入游戏存档
- `features/selection/`：图片多选状态
- `components/`：独立 SVG 图标
- `data/`：脱敏的排版演示缩略图模型

## 视觉和内容约束

参考用户提供的 iOS 照片截图，图库为满屏五列缩略图，精选集由回忆、固定、相簿和人物的横向卡片组成；页面使用独立底部半透明胶囊导航和搜索圆按钮。全局手势引擎负责底部上滑回主页及动画，照片 App 不重复绑定手势。

`data/demo.js` 中的 6,940 是截图的**视觉演示计数**，对应的缩略图为程序绘制的虚拟排版素材，不代表存档里真的有这么多张照片。只有玩家在游戏内导入的照片才是存档数据，依然在 `store.get().content.photos` 中；后续接入剧情照片时应替换演示数据和计数，不要将真实私聊截图上传公开仓库。

一级页面之间以 `photos-tabs` 稳定视图键切换，禁用整屏重新入场动画。进入相簿、搜索及单图时则保留现有路由及返回栈。不要新建第二套 `index.html`。
