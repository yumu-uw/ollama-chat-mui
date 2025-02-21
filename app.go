package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"ollama-chat/pkg/model"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	messageHistory []Chat
	config         model.ConfigJson
}

// NewApp creates a new App application struct
func NewApp() *App {
	var config model.ConfigJson
	// if buildMode == "dev" {
	f, err := os.Open("devconf/config.json")
	if err != nil {
		panic(err)
	}
	parser := json.NewDecoder(f)
	parser.Decode(&config)
	// }
	return &App{
		config: config,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.messageHistory = []Chat{
		{
			Role:    "system",
			Content: "You are a helpful, respectful and honest coding assistant. Always reply using markdown. Be clear and concise, prioritizing brevity in your responses.",
		},
	}
}

func (a *App) LoadConfig() model.ConfigJson {
	return a.config
}

func (a *App) SendChat(ollamaURL string, ollamaModel string, chatHistory []Chat) string {
	data := RequestData{
		Model:    ollamaModel,
		Messages: chatHistory,
		Stream:   true,
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err.Error()
	}

	req, err := http.NewRequest("POST", ollamaURL+"/api/chat", bytes.NewBuffer(jsonData))
	if err != nil {
		return err.Error()
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err.Error()
	}
	defer resp.Body.Close()

	var output string

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		for _, v := range strings.Split(scanner.Text(), "\n") {
			var obj ResponseData
			if err := json.Unmarshal([]byte(v), &obj); err != nil {
				panic(err)
			}
			output += obj.Message.Content
			runtime.EventsEmit(a.ctx, "receiveChat", v)
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading response:", err)
		panic(err)
	}
	runtime.EventsEmit(a.ctx, "deleteEvent", output)
	return ""
}

type Chat struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type RequestData struct {
	Model    string `json:"model"`
	Messages []Chat `json:"messages"`
	Stream   bool   `json:"stream"`
}

type ResponseData struct {
	Message struct {
		Content string `json:"content"`
	} `json:"message"`
}
