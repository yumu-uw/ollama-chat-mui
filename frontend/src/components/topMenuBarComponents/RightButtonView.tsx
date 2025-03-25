import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { IconButton, Stack } from "@mui/material";
import { useSetAtom } from "jotai";
import { AddOllamaHostField } from "../configDialogComponents/AddOllamaHostField";
import { ConfigDialogView } from "../configDialogComponents/ConfigDialogView";
import { CustomPromptField } from "../configDialogComponents/CustomPromptField";
import { ListOllamaHostField } from "../configDialogComponents/ListOllamaHostField";

export const RightButtonView = () => {
	const setConfigDIalogIsOpen = useSetAtom(configDIalogIsOpenAtom);

	return (
		<Stack direction={"row"} gap={1}>
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

			<ConfigDialogView>
				<AddOllamaHostField />
				<ListOllamaHostField />
				<CustomPromptField />
			</ConfigDialogView>
		</Stack>
	);
};
