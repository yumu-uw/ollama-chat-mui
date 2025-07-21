import { ConfigContext } from "@/context/configContext";
import { CurrentOllamaHostContext } from "@/context/currentOllamaHostContext";
import { deepCopyObject } from "@/lib/util";
import { MenuItem, Select, type SelectChangeEvent, Stack } from "@mui/material";
import { use } from "react";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";

type SelectablePProps = {
	displayText: string;
	handleSelectt: (select: string) => void;
	tooltipViewData: string[];
};

const SelectableP = ({ ...rest }: SelectablePProps) => {
	const handleChange = (event: SelectChangeEvent) => {
		rest.handleSelectt(event.target.value as string);
	};
	return (
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
	);
};

export const HostSelectView = () => {
	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { config, setConfig } = configContext;

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
		setDefaultHost(select);
	};

	const handleSelectModel = (select: string) => {
		setCurrentOllamaHost((prev) => {
			const prevDisplayName = prev?.DisplayName as string;
			const prevEndpoint = prev?.Endpoint as string;
			const newModelName = select;
			return {
				DisplayName: prevDisplayName,
				Endpoint: prevEndpoint,
				ModelName: newModelName,
			};
		});
		setDefaultModel(currentOllamaHost.DisplayName, select);
	};

	const setDefaultHost = (host: string) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) return;
		newConfig.DefaultOllamaEndPointName = host;
		setConfig(newConfig);
		UpdateDefaultOllamaEndPointName(newConfig.DefaultOllamaEndPointName).then(
			(result) => {
				if (result !== "") {
					alert(result);
				}
			},
		);
	};

	const setDefaultModel = (host: string, model: string) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) return;
		for (const endpoint of newConfig.OllamaEndpoints) {
			if (endpoint.EndpointName === host) {
				endpoint.DefaultLLMModel = model;
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
		<Stack sx={{ alignItems: "flex-start" }} direction={"row"}>
			<SelectableP
				displayText={currentOllamaHost?.DisplayName || ""}
				handleSelectt={handleSelectOllamaHost}
				tooltipViewData={
					config?.OllamaEndpoints?.map((v) => {
						return v.EndpointName;
					}) || []
				}
			/>

			<SelectableP
				displayText={currentOllamaHost?.ModelName || ""}
				handleSelectt={handleSelectModel}
				tooltipViewData={
					config?.OllamaEndpoints?.find(
						(v) => v.EndpointName === currentOllamaHost?.DisplayName,
					)?.LLMModels || []
				}
			/>
		</Stack>
	);
};
