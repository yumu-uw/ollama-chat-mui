import { ConfigContext } from "@/context/configContext";
import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import { deepCopyObject } from "@/lib/util";
import {
	Alert,
	type AlertColor,
	type AlertPropsColorOverrides,
	Box,
	Button,
	Snackbar,
	type SnackbarCloseReason,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";
import { use, useEffect, useState } from "react";
import { UpdatePrompt } from "wailsjs/go/main/App";
import { z } from "zod";

const PromptScheme = z.string().nonempty();

export const CustomPromptField = () => {
	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { config, setConfig } = configContext;

	const configDialogIsOpenContext = use(ConfigDialogIsOpenContext);
	if (!configDialogIsOpenContext) {
		throw new Error("failed to get configDialogIsOpenContext");
	}

	const { configDialogIsOpen } = configDialogIsOpenContext;

	const [prompt, setPrompt] = useState(config?.DefaultPrompt ?? "");
	const [promptErrorMessage, setPromptErrorMessage] = useState("");
	const [open, setOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const [severity, setSeverity] = useState<
		OverridableStringUnion<AlertColor, AlertPropsColorOverrides> | undefined
	>();

	const handleSubmit = async () => {
		if (!PromptScheme.safeParse(prompt).success) {
			setPromptErrorMessage("Prompt can't be empty");
			return;
		}
		setPromptErrorMessage("");
		const newConfig = deepCopyObject(config);
		if (!newConfig) {
			return;
		}
		newConfig.DefaultPrompt = prompt;
		setConfig(newConfig);
		UpdatePrompt(prompt).then((result) => {
			if (result === "") {
				setOpen(true);
				setSeverity("success");
				setSnackBarMessage("プロンプトを更新しました");
			} else {
				setOpen(true);
				setSeverity("error");
				setSnackBarMessage("プロンプト更新時にエラーが発生しました");
			}
		});
	};

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	useEffect(() => {
		if (!configDialogIsOpen) {
			setPromptErrorMessage("");
		}
	}, [configDialogIsOpen]);

	return (
		<>
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
					Setting Prompt
				</Typography>
				<Stack gap={2} sx={{ width: "100%", alignItems: "center" }}>
					<Stack sx={{ width: "100%", alignItems: "flex-start" }}>
						<TextField
							variant="outlined"
							label="Prompt*"
							placeholder="e.g. Ollama localhost"
							multiline
							maxRows={4}
							error={promptErrorMessage !== ""}
							helperText={promptErrorMessage}
							slotProps={{ inputLabel: { shrink: true } }}
							sx={{
								p: "0.3em",
								width: "100%",
								borderColor: "1px solid black",
								borderRadius: "1em",
							}}
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
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
							Update
						</Button>
					</Box>
				</Stack>
			</Stack>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
					{snackBarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};
