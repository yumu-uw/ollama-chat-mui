import { configAtom } from "@/atom/configAtom";
import { deepCopyObject } from "@/lib/util";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
	Alert,
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
	Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { useState } from "react";
import { UpdateOllamaEndpoints } from "wailsjs/go/main/App";

export const ListOllamaHostField = () => {
	const [config, setConfig] = useAtom(configAtom);

	const [open, setOpen] = useState(false);

	const handleDeleteOllamaHost = (index: number) => {
		const newConfig = deepCopyObject(config);
		if (
			newConfig?.DefaultOllamaEndPointName ===
			newConfig?.OllamaEndpoints[index].EndpointName
		) {
			setOpen(true);
			return;
		}
		newConfig?.OllamaEndpoints.splice(index, 1);
		setConfig(newConfig);
		UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
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
						</TableRow>
					</TableHead>
					<TableBody>
						{config?.OllamaEndpoints.map((v, i) => (
							<TableRow key={`hostlist-${v.EndpointName}`}>
								<TableCell>{v.EndpointName}</TableCell>
								<TableCell>{v.EndpointUrl}</TableCell>
								<TableCell align="center">
									<IconButton onClick={() => handleDeleteOllamaHost(i)}>
										<DeleteForeverIcon color={"inherit"} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
					Cannot delete default Ollama Host.
				</Alert>
			</Snackbar>
		</Stack>
	);
};
