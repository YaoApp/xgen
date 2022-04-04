# xgen next version

## Tips

Before you run dev, you must generate theme css files to public by `pnpm run build:theme`.

.umirc.ts `mfsu: false` for packages debugging `pnpm run dev:all`.

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

The past code is not enough to support newer and better ideas, and at the beginning of writing xgen mainly for internal business, there is no time to think too much about the writing method and architecture, I am committed to pursuing a kind of beauty, this kind of beauty is not only Performance is more likely to be reflected in the ideological and architectural level, so I choose to refactor based on umi4.0, swc, mobx. After refactoring, I hope that I can regard xgen as a "work", a "artwork", Not just a project to make a living.

## Target

After careful consideration, we believe that the mode based on type page can be realized by json template parsing, so that it will not be very cumbersome to use template to write page json, so we remade xgen, and a core concept after refactoring is:

Every route is a dynamic route, everything is component, no Table Page(hereinafter collectively referred to as EIC), no Chart Page, you can inject data by writing json, and then assign the data to table component and chart component.

Of course, the configuration of the base components is mostly unchanged.

## Todos

### Foundation

- [x] Build scaffolding based on umi 4
- [x] Use Turborepo + Parcel to use components as separate packages
- [x] template conversion rule design
- [x] EIC Architecture Design
- [x] Migration and refactoring of style files
- [x] Support Light Theme
- [x] Multilingual support
- [x] Design error capture based on EventListner
- [x] Table refactoring
- [ ] Form refactoring
- [ ] Design of extension components based on React/Vue/Lit Element
- [ ] JSON field prompt vscode json.$schema

### Gifts

- [ ] Component packaging tool xtool
- [ ] Support custom components, import packaged components from based on Dynamic import

### Ideas

- [ ] Cloud components, support importing components from yao workshop
- [ ] Infra, a visual work platform, supports one-click deployment of YaoApp
- [ ] Component as proto (CAP), components are prototypes, CAP prototyping platform, prototyping tools designed from the code level (thinking some inspiration for reverse workflow), product planning uses the component system provided by developers to make prototypes, and the production is completed After that, the designer adjusts the component parameters, adds CSS for processing, and delivers the code to the developer.
