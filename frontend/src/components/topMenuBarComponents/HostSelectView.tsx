import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { useAtom, useAtomValue } from "jotai";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { Box, HStack, VStack, styled } from "styled-system/jsx";
import { TooltipView } from "./TooltipView";

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
	const [hostSelectIsOpen, setHostSelectIsOpen] = useState(false);
	const [modelSelectIsOpen, setmodelSelectIsOpen] = useState(false);

	const appTheme = useAtomValue(appThemeAtom);
	const [config, setConfig] = useAtom(configAtom);
	const [currentOllamaHost, setCurrentOllamaHost] = useAtom(
		currentOllamaHostAtom,
	);

	const hostRef = useRef<HTMLDivElement>(null);
	const modelRef = useRef<HTMLDivElement>(null);

	const handleSelectOllamaHost = (select: string) => {
		setCurrentOllamaHost({
			DisplayName: select,
			Endpoint:
				config?.OllamaEndpoints?.find((v) => v.EndpointName === select)
					?.EndpointUrl || "",
			ModelName:
				config?.OllamaEndpoints?.find((v) => v.EndpointName === select)
					?.DefaultLLMModel || "",
		});
	};

	const handleSelectModel = (select: string) => {
		setCurrentOllamaHost((prev) => {
			const prevDisplayName = prev?.DisplayName as string;
			const prevEndpoint = prev?.Endpoint as string;
			const newModelName =
				config?.OllamaEndpoints?.find(
					(v) => v.EndpointName === prevDisplayName,
				)?.LLMModels.find((v) => v === select) || "";
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
				<Box position={"relative"}>
					<HStack ref={hostRef}>
						<EndpointP variants={appTheme}>
							{currentOllamaHost?.DisplayName}
						</EndpointP>
						<styled.button
							cursor={"pointer"}
							onClick={() => setHostSelectIsOpen(!hostSelectIsOpen)}
							rounded="md"
						>
							<ChevronDown color={appTheme === "light" ? "black" : "white"} />
						</styled.button>
					</HStack>
					<TooltipView
						baseRef={hostRef}
						isOpen={hostSelectIsOpen}
						setIsOpen={setHostSelectIsOpen}
						data={
							config?.OllamaEndpoints?.map((v) => {
								return v.EndpointName;
							}) || []
						}
						handleSelectAction={handleSelectOllamaHost}
					/>
				</Box>

				<Box position={"relative"}>
					<HStack ref={modelRef}>
						<ModelP variants={appTheme}>{currentOllamaHost?.ModelName}</ModelP>
						<styled.button
							cursor={"pointer"}
							onClick={() => setmodelSelectIsOpen(!modelSelectIsOpen)}
							rounded="md"
						>
							<ChevronDown color={appTheme === "light" ? "black" : "white"} />
						</styled.button>
					</HStack>
					<TooltipView
						baseRef={modelRef}
						isOpen={modelSelectIsOpen}
						setIsOpen={setmodelSelectIsOpen}
						data={
							config?.OllamaEndpoints?.find(
								(v) => v.EndpointName === currentOllamaHost?.DisplayName,
							)?.LLMModels || []
						}
						handleSelectAction={handleSelectModel}
					/>
				</Box>
			</VStack>
		</>
	);
};
