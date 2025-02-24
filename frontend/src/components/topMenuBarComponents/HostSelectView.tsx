import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { useAtom, useAtomValue } from "jotai";
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
							{appTheme === "light" ? (
								<img
									alt="chevron-down"
									src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4="
								/>
							) : (
								<img
									alt="chevron-down"
									src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4="
								/>
							)}
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
							{appTheme === "light" ? (
								<img
									alt="chevron-down"
									src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4="
								/>
							) : (
								<img
									alt="chevron-down"
									src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4="
								/>
							)}
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
