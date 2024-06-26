# Dialoqbase Lite

Dialoqbase Lite is a fork of [Page Assist](https://github.com/n4ze3m/page-assist.git) that provides a Sidebar and Web UI for Ollama. Since it's limited to Ollama, and has received more requests for support for other AI providers, I decided to create a new extension that is not limited to single AI provider.

Checkout the Demo:

<div align="center">

[![Dialoqbase Lite Demo](https://img.youtube.com/vi/u9zUS3zIBvM/0.jpg)](https://www.youtube.com/watch?v=u9zUS3zIBvM)

</div>

## Features

- **Sidebar**: A sidebar that can be opened on any webpage. It allows you to interact with your model and see the results.

- **Web UI**: A web UI that allows you to interact with your model like a ChatGPT Website.

- **Chat With Webpage**: You can chat with the webpage and ask questions about the content.

want more features? Create an issue and let me know.

## Installation

### Chrome Web Store

You can install the extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/dialoqbase-lite-a-sidepan/fhdonbcklgialicndhegpkkhhekafglb?hl=en)

Note: You can install the extension on any Chromium-based browser. It is not limited to Chrome.

### Manual Installation

1. Clone the repository

```bash
git clone https://github.com/n4ze3m/dialoqbase-lite.git
cd dialoqbase-lite
```

2. Install the dependencies

```bash
npm install
```

3. Build the extension

```bash
npm run build
```

4. Load the extension

- Open the Extension Management page by navigating to `chrome://extensions`.

- Enable Developer Mode by clicking the toggle switch next to Developer mode.

- Click the `Load unpacked` button and select the `build` directory.

## Usage

### Sidebar

Once the extension is installed, you can open the sidebar via context menu or keyboard shortcut.

Default Keyboard Shortcut: `Ctrl+Shift+P`

### Web UI

You can open the Web UI by clicking on the extension icon which will open a new tab with the Web UI.

Default Keyboard Shortcut: `Ctrl+Shift+L`

Note: You can change the keyboard shortcuts from the extension settings on the Chrome Extension Management page.

## Development

You can run the extension in development mode to make changes and test them.

```bash
npm run dev
```

This will start a development server and watch for changes in the source files. You can load the extension in your browser and test the changes.

## Browser Support

| Browser  | Sidebar | Chat With Webpage | Web UI |
| -------- | ------- | ----------------- | ------ |
| Chrome   | ✅      | ✅                | ✅     |
| Brave    | ✅      | ✅                | ✅     |
| Edge     | ✅      | ✅                | ✅     |
| Opera GX | ❌      | ❌                | ✅     |
| Arc      | ❌      | ❌                | ✅     |
| Firefox  | ❌      | ❌                | ❌     |


## Contributing

Contributions are welcome. If you have any feature requests, bug reports, or questions, feel free to create an issue.

## Support

If you like the project and want to support it, you can buy me a coffee. It will help me to keep working on the project.

<a href='https://ko-fi.com/M4M3EMCLL' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

or you can sponsor me on GitHub.

## License

MIT

## Last but not least

Made in [Alappuzha](https://en.wikipedia.org/wiki/Alappuzha) with ❤️
