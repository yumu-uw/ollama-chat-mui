export type AppTheme = "light" | "dark";

export type ConfigModel = {
	AppTheme: AppTheme;
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
