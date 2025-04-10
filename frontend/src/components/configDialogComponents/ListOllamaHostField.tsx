import { ConfigContext } from "@/context/configContext";
import { deepCopyObject } from "@/lib/util";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import {
	Alert,
	type AlertColor,
	type AlertPropsColorOverrides,
	IconButton,
	Paper,
	Snackbar,
	type SnackbarCloseReason,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";
import { use, useState } from "react";
import { GetOllamaModels, UpdateOllamaEndpoints } from "wailsjs/go/main/App";

export const ListOllamaHostField = () => {
	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { config, setConfig } = configContext;

	const [open, setOpen] = useState(false);
	const [severity, setSeverity] = useState<
		OverridableStringUnion<AlertColor, AlertPropsColorOverrides> | undefined
	>(undefined);
	const [snackbarMsg, setSnackbarMsg] = useState("");

	const handleUpdateModels = async (index: number) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) {
			return;
		}
		const endpointUrl = newConfig.OllamaEndpoints[index].EndpointUrl;
		const data = await GetOllamaModels(endpointUrl);
		if (data.startsWith("error:")) {
			setSnackbarMsg("Cannot update LLM models.");
			setSeverity("error");
			setOpen(true);
			return;
		}

		// newConfig.OllamaEndpoints[index].LLMModels = JSON.parse(data);
		const models: string[] = [];
		data.split(",").map((v) => {
			models.push(v);
		});

		newConfig.OllamaEndpoints[index].LLMModels = models;
		setConfig(newConfig);
		UpdateOllamaEndpoints(newConfig.OllamaEndpoints || []).then(() => {
			setSnackbarMsg("LLM models updated.");
			setSeverity("success");
			setOpen(true);
		});
	};

	const handleDeleteOllamaHost = (index: number) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) {
			return;
		}
		if (
			newConfig.DefaultOllamaEndPointName ===
			newConfig.OllamaEndpoints[index].EndpointName
		) {
			setSnackbarMsg("Cannot delete default Ollama Host.");
			setSeverity("error");
			setOpen(true);
			return;
		}
		newConfig.OllamaEndpoints.splice(index, 1);
		setConfig(newConfig);
		UpdateOllamaEndpoints(newConfig.OllamaEndpoints || []).then(() => {
			setSnackbarMsg("Ollama Host deleted.");
			setSeverity("success");
			setOpen(true);
		});
	};

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbarMsg("");
		setOpen(false);
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
				List Ollama Host
			</Typography>

			<TableContainer component={Paper} sx={{ maxHeight: "600px" }}>
				<Table stickyHeader aria-label="ollama host table">
					<TableHead>
						<TableRow
							sx={{
								bgcolor: "gray",
							}}
						>
							<TableCell>DisplayName</TableCell>
							<TableCell>OllamaHostURL</TableCell>
							<TableCell />
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{config?.OllamaEndpoints.map((v, i) => (
							<TableRow key={`hostlist-${v.EndpointName}`}>
								<TableCell>{v.EndpointName}</TableCell>
								<TableCell>{v.EndpointUrl}</TableCell>
								<TableCell align="center">
									<Tooltip title="モデル情報を更新">
										<IconButton onClick={() => handleUpdateModels(i)}>
											<UpdateOutlinedIcon />
										</IconButton>
									</Tooltip>
								</TableCell>
								<TableCell align="center">
									<Tooltip title="ホストを削除">
										<IconButton onClick={() => handleDeleteOllamaHost(i)}>
											<DeleteForeverIcon color={"error"} />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
					{snackbarMsg}
					Cannot delete default Ollama Host.
				</Alert>
			</Snackbar>
		</Stack>
	);
};
