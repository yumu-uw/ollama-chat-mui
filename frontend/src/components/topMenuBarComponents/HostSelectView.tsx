import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { deepCopyObject } from "@/lib/util";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { useRef, useState } from "react";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import { TooltipView } from "./TooltipView";

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
		<Box sx={{ position: "relative" }}>
			<Stack direction={"row"} ref={rest.ref} sx={{ alignItems: "center" }}>
				<Typography
					sx={{
						cursor: "pointer",
						fontSize: "subtitle1",
						color: "white",
					}}
				>
					{rest.displayText}
				</Typography>
				<IconButton
					aria-label="select-host"
					size="small"
					sx={{ cursor: "pointer", color: "white" }}
					onClick={() => rest.setSelectIsOpen(!rest.selectIsOpen)}
				>
					<ExpandMoreIcon fontSize="small" />
				</IconButton>
			</Stack>
			<TooltipView
				baseRef={rest.ref}
				isOpen={rest.selectIsOpen}
				setIsOpen={rest.setSelectIsOpen}
				data={rest.tooltipViewData}
				handleSelectAction={rest.handleSelectt}
			/>
			<Button
				sx={{
					cursor: "pointer",
					fontSize: "small",
					color: "lightgray",
					px: 0,
				}}
				onClick={rest.handleSetAsDefault}
			>
				Set as default
			</Button>
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
		<Stack sx={{ alignItems: "flex-start" }} direction={"row"} gap={6}>
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
		</Stack>
	);
};
