import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import { PlaylistRemoveOutlined, Settings } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
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
				<Tooltip title="チャット履歴を削除">
					<IconButton
						aria-label="refresh"
						size="small"
						sx={{ cursor: "pointer", color: "white" }}
						onClick={() => {
							setOpen(true);
						}}
					>
						<PlaylistRemoveOutlined fontSize="medium" />
					</IconButton>
				</Tooltip>

				<Tooltip title="設定">
					<IconButton
						aria-label="setting"
						size="small"
						sx={{ cursor: "pointer", color: "white" }}
						onClick={() => {
							setConfigDialogIsOpen(true);
						}}
					>
						<Settings fontSize="medium" />
					</IconButton>
				</Tooltip>
			</Stack>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent id="alert-dialog-title">
					チャット履歴を削除しますか？
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleRefreshChat} autoFocus>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
