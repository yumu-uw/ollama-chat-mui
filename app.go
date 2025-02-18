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

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	messageHistory []Chat
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
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

func (a *App) SendChat2(chatHistory []Chat) string {
	url := "http://192.168.1.250:11434/api/chat"

	// リクエストデータを作成
	data := RequestData{
		Model: "qwen2.5-coder:7b",
		Messages: chatHistory,
		Stream: true,
	}

	// JSONエンコード
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err.Error()
	}

	// HTTPリクエストを作成
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
		os.Exit(1)
	}
	runtime.EventsEmit(a.ctx, "deleteEvent", output)
	return ""
}

func (a *App) SendChat(input string) string {
	url := "http://localhost:11434/api/chat"
	a.messageHistory = append(a.messageHistory, Chat{
		Role:    "user",
		Content: input,
	})

	// リクエストデータを作成
	data := RequestData{
		Model: "qwen2.5-coder:7b",
		Messages: a.messageHistory,
		Stream: true,
	}

	// JSONエンコード
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err.Error()
	}

	// HTTPリクエストを作成
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err.Error()
	}
	req.Header.Set("Content-Type", "application/json")

	// HTTPクライアントでリクエストを送信
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err.Error()
	}
	defer resp.Body.Close()

	decoder := json.NewDecoder(resp.Body)
	var output string

	for decoder.More() {
		var chunk struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		}

		err := decoder.Decode(&chunk)
		if err != nil {
			fmt.Println("Error:", err)
			break
		}

		output += chunk.Message.Content
		runtime.EventsEmit(a.ctx, "receiveChat", chunk.Message.Content)
		// fmt.Print(chunk.Message.Content)
	}
	runtime.EventsEmit(a.ctx, "deleteEvent")
	a.messageHistory = append(a.messageHistory, Chat{
		Role:    "assistant",
		Content: output,
	})
	return ""
}

type Chat struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type RequestData struct {
	Model    string    `json:"model"`
	Messages []Chat `json:"messages"`
	Stream   bool      `json:"stream"`
}

type ResponseData struct {
	Message struct {
		Content string `json:"content"`
	} `json:"message"`
}