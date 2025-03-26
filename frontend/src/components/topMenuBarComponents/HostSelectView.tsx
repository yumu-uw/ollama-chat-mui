import { configAtom } from "@/atom/configAtom";
import { CurrentOllamaHostContext } from "@/context/currentOllamaHostContext";
import { deepCopyObject } from "@/lib/util";
import {
	Button,
	MenuItem,
	Select,
	type SelectChangeEvent,
	Stack,
} from "@mui/material";
import { useAtom } from "jotai";
import { use } from "react";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";

type SelectablePProps = {
	displayText: string;
	handleSelectt: (select: string) => void;
	handleSetAsDefault: () => void;
	tooltipViewData: string[];
};

const SelectableP = ({ ...rest }: SelectablePProps) => {
	const handleChange = (event: SelectChangeEvent) => {
		rest.handleSelectt(event.target.value as string);
	};
	return (
		<Stack
			gap={1}
			direction={"column"}
			sx={{ alignItems: "center", justifyContent: "center" }}
		>
			<Select
				sx={{
					color: "white",
					border: "none",
					"& .MuiSvgIcon-root": {
						color: "white",
					},
					"& .MuiOutlinedInput-notchedOutline": {
						border: "none",
					},
					"& .MuiSelect-select": {
						paddingTop: 0,
						paddingBottom: 0,
					},
				}}
				value={rest.displayText}
				onChange={handleChange}
			>
				{rest.tooltipViewData.map((v) => (
					<MenuItem key={`menu-${v}`} value={v}>
						{v}
					</MenuItem>
				))}
			</Select>
			<Button
				sx={{
					cursor: "pointer",
					fontSize: "small",
					color: "lightgray",
					p: 0,
				}}
				onClick={rest.handleSetAsDefault}
			>
				Set as default
			</Button>
		</Stack>
	);
};

export const HostSelectView = () => {
	const [config, setConfig] = useAtom(configAtom);

	const currentOllamaHostContext = use(CurrentOllamaHostContext);
	if (!currentOllamaHostContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}

	const { currentOllamaHost, setCurrentOllamaHost } = currentOllamaHostContext;

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
