import { ConfigContext } from "@/context/configContext";
import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import { CurrentOllamaHostContext } from "@/context/currentOllamaHostContext";
import { deepCopyObject } from "@/lib/util";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import {
	GetOllamaModels,
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";
import { z } from "zod";

const DisplayNameScheme = z.string().nonempty();
const OllamaHostScheme = z.string().url();

export const AddOllamaHostField = () => {
	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { config, setConfig } = configContext;

	const configDialogIsOpenContext = use(ConfigDialogIsOpenContext);
	if (!configDialogIsOpenContext) {
		throw new Error("failed to get configDialogIsOpenContext");
	}
	const { configDialogIsOpen, setConfigDialogIsOpen } =
		configDialogIsOpenContext;

	const currentOllamaHostContext = use(CurrentOllamaHostContext);
	if (!currentOllamaHostContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { setCurrentOllamaHost } = currentOllamaHostContext;

	const [displayName, setDisplayName] = useState("");
	const [ollamaHost, setOllamaHost] = useState("");

	const [displayNameEerrorMessage, setDisplayNameEerrorMessage] = useState("");
	const [hostErrorMessage, setHostErrorMessage] = useState("");

	const handleSubmit = async () => {
		let newDisplayNameErrorMessage = "";
		let newHostErrorMessage = "";
		if (!DisplayNameScheme.safeParse(displayName).success) {
			newDisplayNameErrorMessage = "DisplayName can't be empty";
			setDisplayNameEerrorMessage(newDisplayNameErrorMessage);
		} else {
			newDisplayNameErrorMessage = "";
			setDisplayNameEerrorMessage("");
		}

		if (!OllamaHostScheme.safeParse(ollamaHost).success) {
			newHostErrorMessage = "OllamaHost format is invalid";
			setHostErrorMessage(newHostErrorMessage);
		} else {
			newHostErrorMessage = "";
			setHostErrorMessage("");
		}

		if (newDisplayNameErrorMessage !== "" || newHostErrorMessage !== "") {
			return;
		}
		setDisplayNameEerrorMessage("");
		setHostErrorMessage("");

		for (const endpoint of config?.OllamaEndpoints ?? []) {
			if (endpoint.EndpointName === displayName) {
				alert("DisplayName is already registered");
				return;
			}
		}

		const data = await GetOllamaModels(ollamaHost);
		if (data.startsWith("error:")) {
			return;
		}

		const models: string[] = [];
		data.split(",").map((v) => {
			models.push(v);
		});

		const newOllamaEndpoint: model.OllamaEndpoint = {
			EndpointName: displayName,
			EndpointUrl: ollamaHost.replace(/\/$/, ""),
			LLMModels: models,
			DefaultLLMModel: models.length > 0 ? models[0] : "",
		};

		if (config?.OllamaEndpoints.length === 0) {
			handleInitSetting(newOllamaEndpoint);
		} else {
			handleAddOllamaHost(newOllamaEndpoint);
		}
		setDisplayName("");
		setOllamaHost("");
		setDisplayNameEerrorMessage("");
		setHostErrorMessage("");
	};

	const handleInitSetting = async (newOllamaEndpoint: model.OllamaEndpoint) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) {
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
			setConfigDialogIsOpen(false);
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

	useEffect(() => {
		if (!configDialogIsOpen) {
			setDisplayName("");
			setOllamaHost("");
			setDisplayNameEerrorMessage("");
			setHostErrorMessage("");
		}
	}, [configDialogIsOpen]);

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
			<Stack gap={2} sx={{ width: "100%", alignItems: "center" }}>
				<Stack sx={{ width: "100%", alignItems: "flex-start" }}>
					<TextField
						variant="outlined"
						label="DisplayName*"
						placeholder="e.g. Ollama localhost"
						error={displayNameEerrorMessage !== ""}
						helperText={displayNameEerrorMessage}
						slotProps={{ inputLabel: { shrink: true } }}
						sx={{
							p: "0.3em",
							width: "100%",
							borderColor: "1px solid black",
							borderRadius: "1em",
						}}
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
				</Stack>

				<Stack sx={{ width: "100%", alignItems: "flex-start" }}>
					<TextField
						variant="outlined"
						label="Ollama Host URL*"
						placeholder="e.g. http://localhost:11434"
						error={hostErrorMessage !== ""}
						helperText={hostErrorMessage}
						slotProps={{ inputLabel: { shrink: true } }}
						sx={{
							p: "0.3em",
							width: "100%",
							borderColor: "1px solid black",
							borderRadius: "1em",
						}}
						value={ollamaHost}
						onChange={(e) => setOllamaHost(e.target.value)}
					/>
				</Stack>

				<Box sx={{ width: "100%", textAlign: "center" }}>
					<Button
						variant="contained"
						sx={{
							cursor: "pointer",
							p: "1em",
						}}
						onClick={handleSubmit}
					>
						Add
					</Button>
				</Box>
			</Stack>
		</Stack>
	);
};
