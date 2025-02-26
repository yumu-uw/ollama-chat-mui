# Ollama Chat

## Overview

Ollama をチャット形式で使用するための GUI アプリ

## Demo

![Feb-26-2025 21-35-33](https://github.com/user-attachments/assets/5f7d6c79-193d-4b09-bff9-822e99469f14)

## Usage

アプリケーションへの署名は実施していないため、Mac 版の初回起動時には下記コマンドの実行が必須

```zsh
xattr -rc [アプリのパス]
```

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
