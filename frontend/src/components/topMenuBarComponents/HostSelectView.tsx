import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { useAtom } from "jotai";
import { VStack, styled } from "styled-system/jsx";

const EndpointP = styled("p", {
	base: {
		fontSize: "xl",
	},
	variants: {
		variants: {
			light: {
				color: "black",
			},
			dark: {
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

const ModelP = styled("p", {
	base: {
		fontSize: "lg",
	},
	variants: {
		variants: {
			light: {
				color: "black",
			},
			dark: {
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

export const HostSelectView = () => {
	const [config, setConfig] = useAtom(configAtom);
	const [currentOllamaHost, setCurrentOllamaHost] = useAtom(
		currentOllamaHostAtom,
	);

	const handleSelectOllamaHost = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentOllamaHost({
			DisplayName: e.target.value,
			Endpoint:
				config?.OllamaEndpoints?.find((v) => v.EndpointName === e.target.value)
					?.EndpointUrl || "",
			ModelName:
				config?.OllamaEndpoints?.find((v) => v.EndpointName === e.target.value)
					?.DefaultLLMModel || "",
		});
	};

	const handleSelectModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentOllamaHost((prev) => {
			const prevDisplayName = prev?.DisplayName as string;
			const prevEndpoint = prev?.Endpoint as string;
			const newModelName =
				config?.OllamaEndpoints?.find(
					(v) => v.EndpointName === prevDisplayName,
				)?.LLMModels.find((v) => v === e.target.value) || "";
			return {
				DisplayName: prevDisplayName,
				Endpoint: prevEndpoint,
				ModelName: newModelName,
			};
		});
	};

	return (
		<>
			<VStack alignItems={"flex-start"}>
				<select
					id="endpoint-select"
					value={currentOllamaHost?.DisplayName}
					onChange={handleSelectOllamaHost}
				>
					{config?.OllamaEndpoints?.map((endpoint) => (
						<option
							key={`host-${endpoint.EndpointName}`}
							value={endpoint.EndpointName}
						>
							{endpoint.EndpointName}
						</option>
					))}
				</select>
				{/* <EndpointP variants={appTheme}>
					{currentOllamaHost?.DisplayName}
				</EndpointP> */}

				<select
					id="model-select"
					value={currentOllamaHost?.ModelName}
					onChange={handleSelectModel}
				>
					{config?.OllamaEndpoints?.find(
						(v) => v.EndpointName === currentOllamaHost?.DisplayName,
					)?.LLMModels.map((modelName) => (
						<option
							key={`model-${currentOllamaHost?.ModelName}-${modelName}`}
							value={modelName}
						>
							{modelName}
						</option>
					))}
				</select>

				{/* <ModelP variants={appTheme}>{currentOllamaHost?.ModelName}</ModelP> */}
			</VStack>
		</>
	);
};
