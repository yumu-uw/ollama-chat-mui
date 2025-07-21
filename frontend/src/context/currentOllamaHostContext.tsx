import type React from "react";
import { createContext, type ReactNode, useState } from "react";
import type { CurrentOllamaHostModel } from "@/model/configModel";

interface CurrentOllamaHostContextType {
	currentOllamaHost: CurrentOllamaHostModel;
	setCurrentOllamaHost: React.Dispatch<
		React.SetStateAction<CurrentOllamaHostModel>
	>;
}

// Create the context with default values
const CurrentOllamaHostContext =
	createContext<CurrentOllamaHostContextType | null>(null);

const CurrentOllamaHostProvider = ({ children }: { children: ReactNode }) => {
	const [currentOllamaHost, setCurrentOllamaHost] =
		useState<CurrentOllamaHostModel>({
			DisplayName: "",
			Endpoint: "",
			ModelName: "",
		});

	return (
		<CurrentOllamaHostContext
			value={{ currentOllamaHost, setCurrentOllamaHost }}
		>
			{children}
		</CurrentOllamaHostContext>
	);
};

export { CurrentOllamaHostContext, CurrentOllamaHostProvider };
