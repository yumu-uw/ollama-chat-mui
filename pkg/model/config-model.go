package model

type ConfigJson struct {
	AppTheme                  string           `json:"AppTheme"`
	OllamaEndpoints           []OllamaEndpoint `json:"OllamaEndpoints"`
	DefaultOllamaEndPointName string           `json:"DefaultOllamaEndPointName"`
	DefaultPrompt             string           `json:"DefaultPrompt"`
}

type OllamaEndpoint struct {
	EndpointName    string   `json:"EndpointName"`
	EndpointURL     string   `json:"EndpointUrl"`
	LLMModels       []string `json:"LLMModels"`
	DefaultLLMModel string   `json:"DefaultLLMModel"`
}
