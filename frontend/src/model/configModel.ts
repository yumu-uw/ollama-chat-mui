export type AppThemeModel = "light" | "dark";

export type ConfigModel = {
	OllamaEndpoints: OllamaEndpoint[];
	DefaultOllamaEndPointName: string;
};

export type OllamaEndpoint = {
	EndpointName: string;
	EndpointUrl: string;
	LLMModels: string[];
	DefaultLLMModel: string;
};

export type CurrentOllamaHostModel = {
	DisplayName: string;
	Endpoint: string;
	ModelName: string;
};
