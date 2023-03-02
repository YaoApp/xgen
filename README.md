<p align="center">
      <img src="packages/xgen/public/logo_xgen.png" width="180" alt="logo">
</p>

# <p align="center">XGen</p>

_<p align="center">A **official** lowcode resolution based yao app engine.</p>_

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/join-welcome-brightgreen.svg" alt="attitude_img"></a>
  <a href="#"><img src="https://img.shields.io/badge/version-1.*-orange.svg" alt="version_img"></a>
  <a href="#"><img src="https://img.shields.io/badge/compres%20size-2M-red.svg" alt="size_img"></a>
  <a href="#"><img src="https://img.shields.io/badge/style-light%20design-blue.svg" alt="style_img"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-Apache2.0-blue.svg" alt="License"></a>
    <a href="#"><img src="https://img.shields.io/badge/components-60+-purple.svg" alt="License"></a>
</p>

<img src="asserts/xgen.png" width="100%">

## What`s XGen

As it`s name, XGen is a **official** lowcode resolution based yao app engine. It provides multiple lowcode components, just like Table, Form, Chart, Dashboard, List, and kinds of embedded lowcode components for extend above base components.

You just need writing json to use those components, enjoy it!

https://github.com/YaoApp/xgen/tree/main/packages/xgen/components

<img src="asserts/components.png" width="100%">

List of components:

- base 
  - Table
  - Form
  - List
  - Chart
  - Dashboard
  - Modal

- view 
  - A
  - Checkbox
  - Color
  - Image
  - Switch
  - Tag
  - Text
  - Tooltip

- edit
  - Cascader
  - CheckboxGroup
  - ColorPicker
  - DatePicker
  - Input
  - InputNumber
  - List
  - Mentions
  - Password
  - RadioGroup
  - RangePicker
  - RichText
  - Select
  - TextArea
  - TimePicker
  - Tree
  - Upload

- chart
  - Bar
  - Funnel
  - Line
  - LineBar
  - Number
  - NumberChart
  - Pie

- group
  - Block

- optional
  - Table
    - Batch
    - Import

## Motivation

<img src="asserts/why.png" width="100%">

## Tips

Before you run dev, you must generate theme css files to public by `pnpm run build:theme`.

## Cloud components

Only three steps for developing cloud components:

### Step1: define a component like this:

![image](https://user-images.githubusercontent.com/25472851/222555152-7cc9e166-48f7-4d68-8e9b-6bd7ca7df774.png)

### Step2: update your build config in rollup:

![image](https://user-images.githubusercontent.com/25472851/222555443-adc92297-1cba-486c-a1ed-95134e628980.png)

### Step3: use your component in [table/form] json:

![image](https://user-images.githubusercontent.com/25472851/222556074-ce13fa62-62f4-497c-936e-4889428524f1.png)

### xgen will auto load your component:

![image](https://user-images.githubusercontent.com/25472851/222556243-7a43ba03-6837-463e-a25f-487a80097497.png)

### xgen has injected the necessary modules:

![image](https://user-images.githubusercontent.com/25472851/222556583-f3398205-d13a-4f6c-b22e-c431fb59d9a9.png)

## Todos

### Foundation

- [x] Build scaffolding based on umi 4
- [x] Use Turborepo + Parcel
- [x] template conversion rule design
- [x] EIC Architecture Design
- [x] Migration and rebuilding of style files
- [x] Support Light Theme
- [x] Multilingual support
- [x] Design error capture based on EventListner
- [x] Table rebuilding
- [x] Form rebuilding
- [x] Design of extension components based on React/Vue/Lit Element
- [ ] JSON field prompt vscode json.$schema

### Gifts

- [ ] Component packaging tool xtool
- [ ] Support custom components, import packaged components from based on Dynamic import

### Ideas

- [ ] Cloud components, support importing components from yao workshop
- [ ] Infra, a visual work platform, supports one-click deployment of YaoApp
- [ ] Component as proto (CAP), components are prototypes, CAP prototyping platform, prototyping tools designed from the code level (thinking some inspiration for reverse workflow), product planning uses the component system provided by developers to make prototypes, and the production is completed After that, the designer adjusts the component parameters, adds CSS for processing, and delivers the code to the developer.
