package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"slices"
	"strings"

	"ollama-chat/pkg/model"
	ymuwutil "ollama-chat/pkg/ymuw-util"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	config model.ConfigJson
}

// NewApp creates a new App application struct
func NewApp(config model.ConfigJson) *App {
	return &App{
		config: config,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetConfig() model.ConfigJson {
	return a.config
}

func (a *App) SendChat(ollamaURL string, ollamaModel string, chatHistory []model.Chat) string {
	systemPrompt := []model.Chat{
		{
			Role:    "system",
			Content: a.config.DefaultPrompt,
		},
	}
	newChat := slices.Concat(systemPrompt, chatHistory)
	data := model.ChatApiRequestData{
		Model:    ollamaModel,
		Messages: newChat,
		Stream:   true,
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}

	req, err := http.NewRequest("POST", ollamaURL+"/api/chat", bytes.NewBuffer(jsonData))
	if err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	defer resp.Body.Close()

	var output string

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		for v := range strings.SplitSeq(scanner.Text(), "\n") {
			var obj model.ChatApiResponseData
			if err := json.Unmarshal([]byte(v), &obj); err != nil {
				panic(err)
			}
			output += obj.Message.Content
			runtime.EventsEmit(a.ctx, "receiveChat", v)
		}
	}

	if err := scanner.Err(); err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	return output
}

func (a *App) GetOllamaModels(ollamaURL string) string {
	resp, err := http.Get(ollamaURL + "/api/tags")
	if err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	defer resp.Body.Close()

	var data model.TagApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}

	var models []string
	for _, v := range data.Models {
		models = append(models, string(v.Name))
	}

	log.Println("models", models)
	models = a.excludeEmbededModel(ollamaURL, models)

	return strings.Join(models, ",")
}

// embdedモデルはチャット未対応のため除外する
func (a *App) excludeEmbededModel(ollamaURL string, models []string) []string {
	var filteredModels []string
	for _, model := range models {
		body, err := json.Marshal(map[string]string{
			"model": model,
		})
		if err != nil {
			continue
		}

		resp, err := http.Post(
			ollamaURL+"/api/show",
			"application/json",
			bytes.NewBuffer(body),
		)
		if err != nil {
			continue
		}

		var showResp struct {
			Capabilities []string `json:"capabilities"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&showResp); err == nil {
			// "embedding" を含まない場合のみ追加
			containsEmbedding := slices.Contains(showResp.Capabilities, "embedding")
			log.Println("Model:", model, "Capabilities:", showResp.Capabilities, "Contains Embedding:", containsEmbedding)
			if !containsEmbedding {
				filteredModels = append(filteredModels, model)
			}
		}
		resp.Body.Close()
	}
	log.Println("Filtered models:", filteredModels)
	return filteredModels
}

func (a *App) RefreshChatHistory() {
	runtime.EventsEmit(a.ctx, "refreshChat")
}

func (a *App) UpdateOllamaEndpoints(newOllamaEndpoints []model.OllamaEndpoint) string {
	a.config.OllamaEndpoints = newOllamaEndpoints
	if err := ymuwutil.UpdateConfigJson(a.config); err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	return ""
}

func (a *App) UpdateDefaultOllamaEndPointName(name string) string {
	a.config.DefaultOllamaEndPointName = name
	if err := ymuwutil.UpdateConfigJson(a.config); err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	return ""
}

func (a *App) UpdatePrompt(newPrompt string) string {
	a.config.DefaultPrompt = newPrompt
	if err := ymuwutil.UpdateConfigJson(a.config); err != nil {
		return ymuwutil.CreateErrorMessage(err)
	}
	return ""
}
