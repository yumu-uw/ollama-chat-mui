import { AddOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, DialogTitle, Stack, Tooltip, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { use, useState } from "react";
import { ConfigContext } from "@/context/configContext";
import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import { AddOllamaHostDialog } from "./AddOllamaHostDialog";
import { CustomPromptField } from "./CustomPromptField";
import { ListOllamaHostField } from "./ListOllamaHostField";

type Props = {
	justifyContent?: string;
};

export const ConfigDialogView = ({ ...rest }: Props) => {
	const configDialogIsOpenContext = use(ConfigDialogIsOpenContext);
	if (!configDialogIsOpenContext) {
		throw new Error("failed to get configDialogIsOpenContext");
	}

	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { config } = configContext;

	const [openAddHostDialog, setOpenAddHostDialog] = useState(false);

	const handleAddHostDialogClose = () => {
		setOpenAddHostDialog(false);
	};

	const { configDialogIsOpen, setConfigDialogIsOpen } =
		configDialogIsOpenContext;

	// 初期設定でホストがない場合はダイアログを開く
	// タイミングでconfig?.OllamaEndpointsが存在するにもかかわらず0が取得されることがあるため
	// setTimeoutを使用して遅延させている
	const debouncedInitialOpenHostDialog = () => {
		const handler = setTimeout(() => {
			if (configDialogIsOpen && config?.OllamaEndpoints.length === 0) {
				setOpenAddHostDialog(true);
			}
		}, 300);
		return () => {
			clearTimeout(handler);
		};
	};
	debouncedInitialOpenHostDialog();

	const handleClose = () => {
		console.log("close");
		setConfigDialogIsOpen(false);
	};

	return (
		<Dialog
			open={configDialogIsOpen}
			onClose={handleClose}
			maxWidth={"md"}
			fullWidth
		>
			<Stack
				direction="row"
				width="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				<DialogTitle>設定</DialogTitle>
				<Stack gap={0} alignItems="center" sx={{ pt: "1em", pr: "1em" }}>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
						sx={{ cursor: "pointer" }}
					>
						<CloseIcon />
					</IconButton>
				</Stack>
			</Stack>
			<Stack
				gap={4}
				sx={{
					p: "1em",
					height: "100%",
					alignItems: "center",
					justifyContent: rest.justifyContent,
				}}
			>
				<Box sx={{ width: "100%" }}>
					<Stack direction="row" justifyContent="flex-start" gap={0.5}>
						<Typography variant="h6" gutterBottom>
							* Hosts
						</Typography>
						<Tooltip title="ホストの追加">
							<IconButton
								size="small"
								sx={{ cursor: "pointer", mb: "0.5em" }}
								onClick={() => {
									setOpenAddHostDialog(true);
								}}
							>
								<AddOutlined />
							</IconButton>
						</Tooltip>
					</Stack>
					<ListOllamaHostField />
				</Box>
				<Box sx={{ width: "100%" }}>
					<Typography variant="h6" gutterBottom>
						* Prompts
					</Typography>
					<CustomPromptField />
				</Box>
				<AddOllamaHostDialog
					open={openAddHostDialog}
					onClose={handleAddHostDialogClose}
				/>
			</Stack>
		</Dialog>
	);
};
