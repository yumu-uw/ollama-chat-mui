import { appThemeAtom } from "@/atom/appThemeAtom";
import hljs from "@/lib/custom-highlight";
import type { AppThemeModel } from "@/model/configModel";
import { useAtom } from "jotai";
import { Moon, Settings, Sun } from "lucide-react";
import { useRef } from "react";
import { Container, VStack, styled } from "styled-system/jsx";
import { UpdateAppTheme } from "wailsjs/go/main/App";
import { ConfigDialog } from "../configDialogComponents/ConfigDialog";

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
				{/* テーマ切り替えボタン */}
				{appTheme === "light" ? <Sun color="black" /> : <Moon color="white" />}
			</styled.button>

			{/* 設定画面表示ボタン */}
			<styled.button
				cursor={"pointer"}
				onClick={() => {
					dialogRef.current?.showModal();
				}}
			>
				<Settings color={appTheme === "light" ? "black" : "white"} />
			</styled.button>

			<styled.dialog
				ref={dialogRef}
				position={"fixed"}
				margin={"auto"}
				w={"90vw"}
				h={"90vh"}
				borderRadius={"md"}
			>
				<Container p={"1em"}>
					<VStack>
						<ConfigDialog dialogRef={dialogRef} />
					</VStack>
				</Container>
			</styled.dialog>
		</>
	);
};
