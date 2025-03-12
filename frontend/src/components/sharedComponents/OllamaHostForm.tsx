import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { GetOllamaModels } from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";
import { z } from "zod";

const DisplayNameScheme = z.string().nonempty();
const OllamaHostScheme = z.string().url();

type Props = {
	onSubmit: (newOllamaEndpoint: model.OllamaEndpoint) => void;
};

export const OllamaHostForm = ({ onSubmit }: Props) => {
	const appTheme = useAtomValue(appThemeAtom);
	const config = useAtomValue(configAtom);
	const configDialogIsOpen = useAtomValue(configDIalogIsOpenAtom);

	const [displayName, setDisplayName] = useState("");
	const [ollamaHost, setOllamaHost] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async () => {
		if (!DisplayNameScheme.safeParse(displayName).success) {
			setErrorMessage("DisplayName can't be empty");
			return;
		}
		if (!OllamaHostScheme.safeParse(ollamaHost).success) {
			setErrorMessage("OllamaHost format is invalid");
			return;
		}

		for (const endpoint of config?.OllamaEndpoints ?? []) {
			if (endpoint.EndpointName === displayName) {
				alert("DisplayName is already registered");
				return;
			}
			// if (endpoint.EndpointUrl === ollamaHost) {
			// 	alert("OllamaHost is already registered");
			// 	return;
			// }
		}

		const data = await GetOllamaModels(ollamaHost);
		if (data.startsWith("error:")) {
			setErrorMessage(data.replace("error: ", ""));
			return;
		}

		const models: string[] = [];
		data.split(",").map((v) => {
			models.push(v);
		});

		const newOllamaEndpoint: model.OllamaEndpoint = {
			EndpointName: displayName,
			EndpointUrl: ollamaHost,
			LLMModels: models,
			DefaultLLMModel: models.length > 0 ? models[0] : "",
		};

		onSubmit(newOllamaEndpoint);
		setDisplayName("");
		setOllamaHost("");
		setErrorMessage("");
	};

	useEffect(() => {
		if (!configDialogIsOpen) {
			setDisplayName("");
			setOllamaHost("");
			setErrorMessage("");
		}
	}, [configDialogIsOpen]);

	return (
		<Stack gap={2} sx={{ width: "100%", alignItems: "center" }}>
			<Stack sx={{ width: "100%", alignItems: "flex-start" }}>
				<TextField
					variant="outlined"
					placeholder="e.g. Ollama localhost"
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
					placeholder="e.g. http://localhost:11434"
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
					Add Ollama Host
				</Button>

				{errorMessage && (
					<Typography variant="body1" gutterBottom>
						{errorMessage}
					</Typography>
				)}
			</Box>
		</Stack>
	);
};
