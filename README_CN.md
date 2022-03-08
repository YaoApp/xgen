# xgen next version

## What`s new

- pnpm
- umi 4
- swc
- turborepo
- Independent component library
- mobx
- error catcher
- light theme
- i18n full support
- the art-architecture 
- EIC (Everything is component)

## Why

过去的代码不足以支撑更新的更好的想法，而且xgen在编写之初主要是针对内部业务，在写法和架构上没有时间考虑太多，而我一直致力于追求一种美，这种美不仅仅在表现层，更多的可能体现在思想和架构层面，所以选择基于umi4.0、swc、mobx进行重构，重构之后希望xgen可以被视作一件“作品”，一个“艺术品”，而不仅仅是一个用来谋生的项目。

## Target

我们经过深思熟虑之后，认为基于类型页面的模式可以通过json template解析来实现，这样使用template来编写页面json不会显得很繁琐，于是我们对xgen进行回炉重造，重构之后的一个核心概念是：

Every route is a dynamic route, Everything is component（后面统称EIC），No Table Page，No Chart Page，你可以通过编写json注入数据，然后将数据赋给table component、chart component。

当然，基础组件的配置大部分不会发生变化。

## Todos

### Foundation

- [x] 基于umi 4搭建脚手架
- [x] 使用Turborepo + Parcel将组件作为单独的包使用
- [ ] template转换规则设计
- [ ] EIC架构设计
- [ ] 样式文件的迁移和重构
- [ ] 支持Light Theme
- [ ] 支持多语言
- [ ] 基于EventListner设计错误捕获
- [ ] Table重构
- [ ] Form重构
- [ ] 基于ShadowDom + Web Worker的扩展组件设计
- [ ] JSON字段提示vscode json.$schema

### Gifts

- [ ] 组件打包工具 xtool
- [ ] 支持自定义组件，基于SystemJS从CDN上导入打包之后的组件

### Ideas

- [ ] 云组件，支持从npm引入组件
- [ ] 可视化工作平台Infra，且支持YaoApp一键部署
- [ ] Component as proto（CAP），组件即原型，CAP原型设计平台，从代码层面设计的原型工具（思考逆向工作流的一些灵感），产品策划使用开发者提供的组件系统制作原型，制作完成之后，设计师调教组件参数，添加CSS进行加工，交付给开发者代码。
 
 
