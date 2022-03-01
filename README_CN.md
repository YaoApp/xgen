# xgen next version

## Why

过去的代码不足以支撑更新的更好的想法，而且xgen在编写之初主要是针对内部业务，在写法和架构上没有时间考虑太多，我致力于追求一种美，这种美不仅仅在表现层，更多的可能体现在思想和架构层面，所以我选择基于umi4.0、swc、mobx进行重构，重构之后我希望我可以xgen视作一件“作品”，一个“艺术品”，而不仅仅是一个用来谋生的项目。

## Target

我们经过深思熟虑之后，认为基于类型页面的模式可以通过json template解析来实现，这样使用template来编写页面json不会显得很繁琐，于是我们对xgen进行回炉重造，重构之后的一个核心概念是：

Everything is component，No Table Page，No Chart Page，你可以通过编写json注入数据，然后将数据赋给table component、chart component。

当然，基础组件的配置大部分不会发生变化。

## Todos

- [x] 基于umi 4搭建脚手架

- [] asda
