package model

type Chat struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatApiRequestData struct {
	Model    string `json:"model"`
	Messages []Chat `json:"messages"`
	Stream   bool   `json:"stream"`
}

type ChatApiResponseData struct {
	Message struct {
		Content string `json:"content"`
	} `json:"message"`
}
