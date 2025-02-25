package main

import (
	"embed"
	"ollama-chat/pkg/model"
	ymuwutil "ollama-chat/pkg/ymuw-util"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	var config model.ConfigJson
	var err error
	if err = ymuwutil.SetupConfigDir(); err != nil {
		panic(err)
	}
	if err = ymuwutil.CreateTemplateConfigJson(); err != nil {
		panic(err)
	}
	config, err = ymuwutil.LoadConfigJson()
	if err != nil {
		panic(err)
	}

	// Create an instance of the app structure
	app := NewApp(config)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "ollama-chat",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
