import type { ConfigModel } from "@/model/configModel";
import type React from "react";
import { type ReactNode, createContext, useState } from "react";

interface ConfigContextType {
	config: ConfigModel;
	setConfig: React.Dispatch<React.SetStateAction<ConfigModel>>;
}

// Create the context with default values
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const ConfigProvider = ({ children }: { children: ReactNode }) => {
	const [config, setConfig] = useState<ConfigModel>({
		OllamaEndpoints: [],
		DefaultOllamaEndPointName: "",
		DefaultPrompt: "",
	});

	return (
		<ConfigContext value={{ config, setConfig }}>{children}</ConfigContext>
	);
};

export { ConfigContext, ConfigProvider };
