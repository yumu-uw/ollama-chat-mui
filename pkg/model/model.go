package model

type ConfigJson struct {
	OllamaEndpoints []OllamaEndpoint `json:"OllamaEndpoints"`
}

type LLMModel struct {
	ModelName string `json:"ModelName"`
	Default   bool   `json:"Default"`
}

type OllamaEndpoint struct {
	Name      string      `json:"Name"`
	Endpoint  string      `json:"Endpoint"`
	LLMModels []LLMModel `json:"LLMModels"`
	Default   bool        `json:"Default"`
}