import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
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
import { useSetAtom } from "jotai";
import { useState } from "react";
import { RefreshChatHistory } from "wailsjs/go/main/App";
import { ConfigDialogView } from "../configDialogComponents/ConfigDialogView";

export const RightButtonView = () => {
	const setConfigDIalogIsOpen = useSetAtom(configDIalogIsOpenAtom);

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
						setConfigDIalogIsOpen(true);
					}}
				>
					<SettingsOutlinedIcon fontSize="medium" />
				</IconButton>

				<ConfigDialogView />
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
