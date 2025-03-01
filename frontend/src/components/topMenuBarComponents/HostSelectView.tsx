import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { deepCopyObject } from "@/lib/util";
import { useAtom, useAtomValue } from "jotai";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { Box, HStack, styled } from "styled-system/jsx";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import { TooltipView } from "./TooltipView";

const StyledSelectP = styled("p", {
	base: {
		cursor: "pointer",
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

const StyledSetDefaultButton = styled("button", {
	base: {
		cursor: "pointer",
		fontSize: "small",
	},
	variants: {
		variants: {
			light: {
				color: "gray.700",
			},
			dark: {
				color: "gray.300",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

type SelectablePProps = {
	ref: React.RefObject<HTMLDivElement | null>;
	selectIsOpen: boolean;
	setSelectIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	displayText: string;
	handleSelectt: (select: string) => void;
	handleSetAsDefault: () => void;
	tooltipViewData: string[];
};

const SelectableP = ({ ...rest }: SelectablePProps) => {
	const appTheme = useAtomValue(appThemeAtom);
	return (
		<Box position={"relative"}>
			<HStack ref={rest.ref}>
				<StyledSelectP variants={appTheme}>{rest.displayText}</StyledSelectP>
				<styled.button
					cursor={"pointer"}
					onClick={() => rest.setSelectIsOpen(!rest.selectIsOpen)}
					rounded="md"
				>
					<ChevronDown color={appTheme === "light" ? "black" : "white"} />
				</styled.button>
			</HStack>
			<TooltipView
				baseRef={rest.ref}
				isOpen={rest.selectIsOpen}
				setIsOpen={rest.setSelectIsOpen}
				data={rest.tooltipViewData}
				handleSelectAction={rest.handleSelectt}
			/>
			<StyledSetDefaultButton
				variants={appTheme}
				onClick={rest.handleSetAsDefault}
			>
				Set as default
			</StyledSetDefaultButton>
		</Box>
	);
};

export const HostSelectView = () => {
	const [hostSelectIsOpen, setHostSelectIsOpen] = useState(false);
	const [modelSelectIsOpen, setmodelSelectIsOpen] = useState(false);

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

	const handleSetAsDefaultHost = () => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) return;
		newConfig.DefaultOllamaEndPointName =
			currentOllamaHost?.DisplayName || newConfig.DefaultOllamaEndPointName;
		setConfig(newConfig);
		UpdateDefaultOllamaEndPointName(newConfig.DefaultOllamaEndPointName).then(
			(result) => {
				if (result !== "") {
					alert(result);
				}
			},
		);
	};

	const handleSetAsDefaultModel = () => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) return;
		for (const endpoint of newConfig.OllamaEndpoints) {
			if (endpoint.EndpointName === currentOllamaHost?.DisplayName) {
				endpoint.DefaultLLMModel = currentOllamaHost?.ModelName;
				break;
			}
		}
		setConfig(newConfig);
		UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []).then((result) => {
			if (result !== "") {
				alert(result);
			}
		});
	};

	return (
		<HStack alignItems={"flex-start"} gap={6}>
			<SelectableP
				ref={hostRef}
				selectIsOpen={hostSelectIsOpen}
				setSelectIsOpen={setHostSelectIsOpen}
				displayText={currentOllamaHost?.DisplayName || ""}
				handleSelectt={handleSelectOllamaHost}
				handleSetAsDefault={handleSetAsDefaultHost}
				tooltipViewData={
					config?.OllamaEndpoints?.map((v) => {
						return v.EndpointName;
					}) || []
				}
			/>

			<SelectableP
				ref={modelRef}
				selectIsOpen={modelSelectIsOpen}
				setSelectIsOpen={setmodelSelectIsOpen}
				displayText={currentOllamaHost?.ModelName || ""}
				handleSelectt={handleSelectModel}
				handleSetAsDefault={handleSetAsDefaultModel}
				tooltipViewData={
					config?.OllamaEndpoints?.find(
						(v) => v.EndpointName === currentOllamaHost?.DisplayName,
					)?.LLMModels || []
				}
			/>
		</HStack>
	);
};
