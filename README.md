## React Context Theming

This is an alpha release! The API of this library will likely change a little. 

The purpose of this library is to provide one API that allows you to dynamically theme both React Native Apps (including RN Web) and React.js. I hope that this will make it easier to move between RN and React.js project or even share code between projects. The library is inspired by what I've seen from React Native Paper and Material UI, but decoupled from a component library.

## Checklist to make this library production ready

- [x] Web Support
  - [x] Next.js SSR styles
  - [ ] Test performance (check for white flash on page load)
  - [x] Support for pseudo classes and media queries
- [ ] React Native Support
  - [x] RN StyleSheet like syntax
  - [x] Test this library as a method to support dark mode
    - [x] Ios
    - [x] Android
    - [x] RN Web (https://awesome-stonebraker-f3e667.netlify.app/)
- [ ] Docs
  - [ ] Better TypeScript examples 
  - [x] Add Next.js example app to repo

### Docs

- React Native
    - [React Native Example Usage](https://github.com/christianjuth/react-context-theming/wiki/React-Native-Example-Usage)
- Web
    - [Web Example Usage](https://github.com/christianjuth/react-context-theming/wiki/Web-Example-Usage)
    - [Server Side Rendering](https://github.com/christianjuth/react-context-theming/wiki/Server-Side-Rendering)
    - [All About Classes](https://github.com/christianjuth/react-context-theming/wiki/All-About-Classes-(web-only))
- Other
    - [Usage With TypeScript](https://github.com/christianjuth/react-context-theming/wiki/Usage-With-TypeScript)
