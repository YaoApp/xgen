<p align="center">
      <img src="packages/xgen/public/logo_xgen.png" width="300">
      <h4 align="center">XGEN</h4>
      <p align="center">
        The next generation low-code dashboard driven by Yao.
      </p>
</p>

## Tips

Before you run dev, you must generate theme css files to public by `pnpm run build:theme`.

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
- [ ] Design of extension components based on React/Vue/Lit Element
- [ ] JSON field prompt vscode json.$schema

### Gifts

- [ ] Component packaging tool xtool
- [ ] Support custom components, import packaged components from based on Dynamic import

### Ideas

- [ ] Cloud components, support importing components from yao workshop
- [ ] Infra, a visual work platform, supports one-click deployment of YaoApp
- [ ] Component as proto (CAP), components are prototypes, CAP prototyping platform, prototyping tools designed from the code level (thinking some inspiration for reverse workflow), product planning uses the component system provided by developers to make prototypes, and the production is completed After that, the designer adjusts the component parameters, adds CSS for processing, and delivers the code to the developer.
