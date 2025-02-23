export type AppThemeModel = "light" | "dark";

export type ConfigModel = {
	OllamaEndpoints: OllamaEndpoint[];
};

export type LLMModel = {
	ModelName: string;
	Default: boolean;
};

export type OllamaEndpoint = {
	Name: string;
	Endpoint: string;
	LLMModels: LLMModel[];
	Default: boolean;
};

export type CurrentOllamaHostModel = {
	DisplayName: string;
	Endpoint: string;
	ModelName: string;
};
