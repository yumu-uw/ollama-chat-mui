import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { OllamaHostForm } from "@/components/sharedComponents/OllamaHostForm";
import { deepCopyObject } from "@/lib/util";
import { Stack, Typography } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";

export const AddOllamaHostField = () => {
	const appTheme = useAtomValue(appThemeAtom);
	const [config, setConfig] = useAtom(configAtom);
	const setCurrentOllamaHost = useSetAtom(currentOllamaHostAtom);
	const setConfigDIalogIsOpen = useSetAtom(configDIalogIsOpenAtom);

	const [errorMessage, setErrorMessage] = useState("");

	const handleInitSetting = async (newOllamaEndpoint: model.OllamaEndpoint) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) {
			setErrorMessage("Config is undefined");
			return;
		}
		newConfig.OllamaEndpoints.push(newOllamaEndpoint);
		newConfig.DefaultOllamaEndPointName = newOllamaEndpoint.EndpointName;

		setConfig(newConfig);
		await UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
		await UpdateDefaultOllamaEndPointName(newOllamaEndpoint.EndpointName);
		if (newConfig.OllamaEndpoints.length === 1) {
			setCurrentOllamaHost({
				DisplayName: newOllamaEndpoint.EndpointName,
				Endpoint: newOllamaEndpoint.EndpointUrl,
				ModelName: newOllamaEndpoint.DefaultLLMModel,
			});
			setConfigDIalogIsOpen(false);
		}
	};

	const handleAddOllamaHost = async (
		newOllamaEndpoint: model.OllamaEndpoint,
	) => {
		const newConfig = deepCopyObject(config);
		newConfig?.OllamaEndpoints.push(newOllamaEndpoint);
		if (newConfig?.OllamaEndpoints.length === 1) {
			newConfig.DefaultOllamaEndPointName = newOllamaEndpoint.EndpointName;
		}
		setConfig(newConfig);
		await UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
	};

	return (
		<Stack
			sx={{
				p: "1em",
				width: "90%",
				alignItems: "flex-start",
				border: "1px solid",
				borderColor: "black",
				borderRadius: "1em",
			}}
		>
			<Typography variant="h5" gutterBottom>
				Add Ollama Host
			</Typography>
			<OllamaHostForm
				onSubmit={
					config?.OllamaEndpoints.length === 0
						? handleInitSetting
						: handleAddOllamaHost
				}
			/>
		</Stack>
	);
};
