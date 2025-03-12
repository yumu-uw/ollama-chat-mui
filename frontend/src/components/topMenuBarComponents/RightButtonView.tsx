import { appThemeAtom } from "@/atom/appThemeAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import type { AppThemeModel } from "@/model/configModel";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { IconButton, Stack } from "@mui/material";
import hljs from "highlight.js";
import { useAtom, useSetAtom } from "jotai";
import { useRef } from "react";
import { UpdateAppTheme } from "wailsjs/go/main/App";
import { AddOllamaHostField } from "../configDialogComponents/AddOllamaHostField";
import { ListOllamaHostField } from "../configDialogComponents/ListOllamaHostField";
import { FullScreenDialog } from "../sharedComponents/FullScreenDialog";

export const RightButtonView = () => {
	const [appTheme, setAppTheme] = useAtom(appThemeAtom);
	const setConfigDIalogIsOpen = useSetAtom(configDIalogIsOpenAtom);

	const switchAppTheme = () => {
		if (document.body.getAttribute("data-theme") === "light") {
			document.body.setAttribute("data-theme", "dark");
		} else {
			document.body.setAttribute("data-theme", "light");
		}
		const newAppTheme = document.body.getAttribute("data-theme");
		setAppTheme(newAppTheme as AppThemeModel);
		UpdateAppTheme(newAppTheme as string).then((data: string) => {
			if (data !== "") {
				console.error(data);
			}
		});
	};
	return (
		<Stack direction={"row"} gap={1}>
			<IconButton
				aria-label="switch-theme"
				size="small"
				sx={{ cursor: "pointer" }}
				onClick={() => {
					switchAppTheme();
					hljs.highlightAll();
				}}
			>
				{appTheme === "light" ? (
					<LightModeOutlinedIcon sx={{ color: "black" }} fontSize="medium" />
				) : (
					<DarkModeOutlinedIcon sx={{ color: "white" }} fontSize="medium" />
				)}
			</IconButton>

			<IconButton
				aria-label="setting"
				size="small"
				sx={{ cursor: "pointer" }}
				onClick={() => {
					setConfigDIalogIsOpen(true);
				}}
			>
				{appTheme === "light" ? (
					<SettingsOutlinedIcon sx={{ color: "black" }} fontSize="medium" />
				) : (
					<SettingsOutlinedIcon sx={{ color: "white" }} fontSize="medium" />
				)}
			</IconButton>

			<FullScreenDialog>
				<AddOllamaHostField />
				<ListOllamaHostField />
			</FullScreenDialog>
		</Stack>
	);
};
