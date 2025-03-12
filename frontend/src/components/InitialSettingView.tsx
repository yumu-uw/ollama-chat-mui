import { configAtom } from "@/atom/configAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { deepCopyObject } from "@/lib/util";
import { Stack, Typography } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";
import { OllamaHostForm } from "./sharedComponents/OllamaHostForm";

export const InitialSettingView = () => {
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

	return (
		<Stack
			sx={{
				p: "1em",
				width: "90%",
				alignItems: "flex-start",
				border: "1px solid black",
				borderRadius: "1em",
			}}
		>
			<Typography variant="h5" gutterBottom sx={{ pb: "1em" }}>
				Add First Ollama Host
			</Typography>
			<OllamaHostForm onSubmit={handleInitSetting} />
			{errorMessage && <Typography>{errorMessage}</Typography>}
		</Stack>
	);
};
