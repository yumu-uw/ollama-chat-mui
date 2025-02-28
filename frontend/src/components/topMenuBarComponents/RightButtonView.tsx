import { appThemeAtom } from "@/atom/appThemeAtom";
import hljs from "@/lib/custom-highlight";
import type { AppThemeModel } from "@/model/configModel";
import { useAtom } from "jotai";
import { Moon, Settings, Sun } from "lucide-react";
import { useRef } from "react";
import { Container, styled } from "styled-system/jsx";
import { UpdateAppTheme } from "wailsjs/go/main/App";
import { ConfigDialog } from "../configDialogComponents/ConfigDialog";
import { ConfigDialogWrapper } from "../sharedComponents/ConfigDialogWrapper";

export const RightButtonView = () => {
	const [appTheme, setAppTheme] = useAtom(appThemeAtom);
	const dialogRef = useRef<HTMLDialogElement>(null);
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
		<>
			<styled.button
				cursor={"pointer"}
				onClick={() => {
					switchAppTheme();
					hljs.highlightAll();
				}}
			>
				{appTheme === "light" ? <Sun color="black" /> : <Moon color="white" />}
			</styled.button>

			<styled.button
				cursor={"pointer"}
				onClick={() => {
					dialogRef.current?.showModal();
				}}
			>
				<Settings color={appTheme === "light" ? "black" : "white"} />
			</styled.button>

			<ConfigDialogWrapper dialogRef={dialogRef}>
				<Container minH={"60vh"} maxH={"80vh"} p={"1em"}>
					<ConfigDialog dialogRef={dialogRef} />
				</Container>
			</ConfigDialogWrapper>
		</>
	);
};
