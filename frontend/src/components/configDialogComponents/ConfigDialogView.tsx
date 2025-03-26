import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { use } from "react";
import { AddOllamaHostField } from "./AddOllamaHostField";
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

	const { configDialogIsOpen, setConfigDialogIsOpen } =
		configDialogIsOpenContext;

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
			<Stack direction="row" width="100%" justifyContent="flex-end">
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
					ESC
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
				<AddOllamaHostField />
				<ListOllamaHostField />
				<CustomPromptField />
			</Stack>
		</Dialog>
	);
};
