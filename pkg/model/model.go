package model

type ConfigJson struct {
	AppTheme        string           `json:"AppTheme"`
	OllamaEndpoints []OllamaEndpoint `json:"OllamaEndpoints"`
}

type LLMModel struct {
	ModelName string `json:"ModelName"`
	Default   bool   `json:"Default"`
}

type OllamaEndpoint struct {
	Name      string     `json:"Name"`
	Endpoint  string     `json:"Endpoint"`
	LLMModels []LLMModel `json:"LLMModels"`
	Default   bool       `json:"Default"`
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
