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

	return (
		<>
			<VStack alignItems={"flex-start"}>
				<select
					id="endpoint-select"
					value={currentOllamaHost?.DisplayName}
					onChange={(e) =>
						setCurrentOllamaHost({
							DisplayName: e.target.value,
							Endpoint:
								config?.OllamaEndpoints?.find((v) => v.Name === e.target.value)
									?.Endpoint || "",
							ModelName:
								config?.OllamaEndpoints?.find(
									(v) => v.Name === e.target.value,
								)?.LLMModels.find((v) => v.Default)?.ModelName || "",
						})
					}
				>
					{config?.OllamaEndpoints?.map((endpoint, index) => (
						<option
							key={`endpoint-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							value={endpoint.Name}
						>
							{endpoint.Name}
						</option>
					))}
				</select>
				{/* <EndpointP variants={appTheme}>
					{currentOllamaHost?.DisplayName}
				</EndpointP> */}

				<select
					id="model-select"
					value={currentOllamaHost?.ModelName}
					onChange={(e) =>
						setCurrentOllamaHost((prev) => {
							const prevDisplayName = prev?.DisplayName as string;
							const prevEndpoint = prev?.Endpoint as string;
							const newModelName =
								config?.OllamaEndpoints?.find(
									(v) => v.Name === prevDisplayName,
								)?.LLMModels.find((v) => v.ModelName === e.target.value)
									?.ModelName || "";
							return {
								DisplayName: prevDisplayName,
								Endpoint: prevEndpoint,
								ModelName: newModelName,
							};
						})
					}
				>
					{config?.OllamaEndpoints?.find(
						(v) => v.Name === currentOllamaHost?.DisplayName,
					)?.LLMModels.map((model, index) => (
						<option
							key={`model-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							value={model.ModelName}
						>
							{model.ModelName}
						</option>
					))}
				</select>

				{/* <ModelP variants={appTheme}>{currentOllamaHost?.ModelName}</ModelP> */}
			</VStack>
		</>
	);
};
