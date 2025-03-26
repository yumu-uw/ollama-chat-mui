import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
	Stack,
	Tooltip,
} from "@mui/material";
import { use, useState } from "react";
import { RefreshChatHistory } from "wailsjs/go/main/App";

export const RightButtonView = () => {
	const configDialogIsOpenContext = use(ConfigDialogIsOpenContext);
	if (!configDialogIsOpenContext) {
		throw new Error("failed to get configDialogIsOpenContext");
	}

	const { setConfigDialogIsOpen } = configDialogIsOpenContext;

	const [open, setOpen] = useState(false);

	const handleRefreshChat = () => {
		RefreshChatHistory();
		setOpen(false);
	};

	return (
		<>
			<Stack direction={"row"} gap={1}>
				<Tooltip title="チャット履歴をクリア">
					<IconButton
						aria-label="refresh"
						size="small"
						sx={{ cursor: "pointer", color: "white" }}
						onClick={() => {
							setOpen(true);
						}}
					>
						<RefreshOutlinedIcon fontSize="medium" />
					</IconButton>
				</Tooltip>

				<IconButton
					aria-label="setting"
					size="small"
					sx={{ cursor: "pointer", color: "white" }}
					onClick={() => {
						setConfigDialogIsOpen(true);
					}}
				>
					<SettingsOutlinedIcon fontSize="medium" />
				</IconButton>
			</Stack>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"チャット履歴をクリアしますか？"}
				</DialogTitle>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>キャンセル</Button>
					<Button
						sx={{ bgcolor: "red", color: "white" }}
						onClick={handleRefreshChat}
						autoFocus
					>
						クリア
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
