import { ConfigContext } from "@/context/configContext";
import { CurrentOllamaHostContext } from "@/context/currentOllamaHostContext";
import { deepCopyObject } from "@/lib/util";
import {
	Alert,
	Backdrop,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { use, useState } from "react";
import {
	GetOllamaModels,
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";
import { z } from "zod";

const DisplayNameScheme = z.string().nonempty();
const OllamaHostScheme = z.string().url();

const DefaultHost = "http://localhost:11434";
const DefaultDisplayName = "localhost";

type AddOllamaHostDialogProps = {
	open: boolean;
	onClose?: () => void;
};

export const AddOllamaHostDialog = ({
	open,
	onClose,
}: AddOllamaHostDialogProps) => {
	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { config, setConfig } = configContext;

	const isInitialSetup = config?.OllamaEndpoints.length === 0;

	const currentOllamaHostContext = use(CurrentOllamaHostContext);
	if (!currentOllamaHostContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { setCurrentOllamaHost } = currentOllamaHostContext;

	const [displayName, setDisplayName] = useState(DefaultDisplayName);
	const [ollamaHost, setOllamaHost] = useState(DefaultHost);
	const [displayNameEerrorMessage, setDisplayNameEerrorMessage] = useState("");
	const [hostErrorMessage, setHostErrorMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("");

	const resetState = () => {
		setDisplayName(DefaultDisplayName);
		setOllamaHost(DefaultHost);
		setDisplayNameEerrorMessage("");
		setHostErrorMessage("");
	};

	const handleSubmit = async () => {
		if (submitting) return;
		setSubmitting(true);
		try {
			let newDisplayNameErrorMessage = "";
			let newHostErrorMessage = "";
			if (!DisplayNameScheme.safeParse(displayName).success) {
				newDisplayNameErrorMessage = "Display Name can't be empty";
				setDisplayNameEerrorMessage(newDisplayNameErrorMessage);
			} else {
				newDisplayNameErrorMessage = "";
				setDisplayNameEerrorMessage("");
			}

			if (ollamaHost === "") {
				newHostErrorMessage = "Ollama Host is required";
				setHostErrorMessage(newHostErrorMessage);
			} else if (!OllamaHostScheme.safeParse(ollamaHost).success) {
				newHostErrorMessage = "Invalid URL format";
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
					setDisplayNameEerrorMessage("Display Name is already registered");
					return;
				}
			}

			const data = await GetOllamaModels(ollamaHost);
			if (data.startsWith("error:")) {
				throw new Error(data);
			}

			const models: string[] = [];
			data.split(",").map((v) => {
				models.push(v);
			});

			let defaultLLMModel = "";
			if (models.length > 0) {
				if (models.includes("phi4:latest")) {
					defaultLLMModel = "phi4:latest";
				} else {
					defaultLLMModel = models[0];
				}
			}

			const newOllamaEndpoint: model.OllamaEndpoint = {
				EndpointName: displayName,
				EndpointUrl: ollamaHost.replace(/\/$/, ""),
				LLMModels: models,
				DefaultLLMModel: defaultLLMModel,
			};

			if (isInitialSetup) {
				handleInitSetting(newOllamaEndpoint);
			} else {
				handleAddOllamaHost(newOllamaEndpoint);
			}
			handleOnClose();
		} catch (error) {
			console.error("Error adding Ollama host:", error);
			setSnackbarMsg(`Error: ${error}`);
		} finally {
			setSubmitting(false);
		}
	};

	const handleOnClose = () => {
		resetState();
		onClose?.();
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
		<Dialog
			open={open}
			onClose={(_, reason) => {
				if (reason === "backdropClick") return;
				onClose?.();
			}}
			fullWidth
		>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={submitting}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Snackbar
				open={snackbarMsg !== ""}
				autoHideDuration={5000}
				onClose={() => setSnackbarMsg("")}
			>
				<Alert severity="error" sx={{ width: "100%" }}>
					{snackbarMsg}
				</Alert>
			</Snackbar>
			<DialogTitle>
				{isInitialSetup ? "Ollama Chatへようこそ🚀" : "ホストの追加"}
			</DialogTitle>
			<DialogContent>
				{isInitialSetup && (
					<Typography variant="body2" color="default" sx={{ ml: 1, mb: 2 }}>
						初めにOllamaのホストを追加する必要があります。
						<br />
						他のホストを追加する場合は、以下のフォームに入力してください。
					</Typography>
				)}
				<Stack mt={1} gap={2} sx={{ width: "100%", alignItems: "center" }}>
					<TextField
						variant="outlined"
						label="Name*"
						placeholder="e.g. localhost"
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
						onChange={(e) => {
							setDisplayName(e.target.value);
							if (displayNameEerrorMessage !== "") {
								setDisplayNameEerrorMessage("");
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSubmit();
							}
						}}
					/>
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
						onChange={(e) => {
							setOllamaHost(e.target.value);
							if (hostErrorMessage !== "") {
								setHostErrorMessage("");
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSubmit();
							}
						}}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				{isInitialSetup ? (
					<Button
						onClick={handleSubmit}
						variant="contained"
						autoFocus
						disabled={submitting}
					>
						Connect
					</Button>
				) : (
					<>
						<Button onClick={handleOnClose}>Cancel</Button>
						<Button
							onClick={handleSubmit}
							variant="contained"
							autoFocus
							disabled={submitting}
						>
							Add
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};
