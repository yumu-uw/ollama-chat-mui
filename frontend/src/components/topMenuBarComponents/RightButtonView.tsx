import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { IconButton, Stack } from "@mui/material";
import { useSetAtom } from "jotai";
import { ConfigDialogView } from "../configDialogComponents/ConfigDialogView";

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

			<ConfigDialogView />
		</Stack>
	);
};
