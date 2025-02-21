import { appThemeAtom } from "@/atom/appThemeAtom";
import hljs from "@/lib/custom-highlight";
import type { AppThemeModel } from "@/model/configModel";
import { useAtom } from "jotai";
import { useRef } from "react";
import {
	Box,
	Container,
	HStack,
	Spacer,
	VStack,
	styled,
} from "styled-system/jsx";
import { UpdateAppTheme } from "wailsjs/go/main/App";
import { ConfigDialog } from "./ConfigDialog";

const CustomH1 = styled("h1", {
	base: {
		fontSize: "2em",
	},
	variants: {
		variants: {
			light: {
				color: "black",
			},
			dark: {
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

export const TopMenuBar = () => {
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
		UpdateAppTheme(newAppTheme as string).then((error) => {
			console.error(error);
		});
	};

	return (
		<>
			<HStack>
				<Box>
					<CustomH1 variants={appTheme}>Ollama Web Chat</CustomH1>
				</Box>
				<Spacer />
				<button
					type="button"
					onClick={() => {
						switchAppTheme();
						hljs.highlightAll();
					}}
				>
					{/* テーマ切り替えボタン */}
					{appTheme === "light" ? (
						<img
							alt="light"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtc3VuIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ii8+PHBhdGggZD0iTTEyIDJ2MiIvPjxwYXRoIGQ9Ik0xMiAyMHYyIi8+PHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiLz48cGF0aCBkPSJtMTcuNjYgMTcuNjYgMS40MSAxLjQxIi8+PHBhdGggZD0iTTIgMTJoMiIvPjxwYXRoIGQ9Ik0yMCAxMmgyIi8+PHBhdGggZD0ibTYuMzQgMTcuNjYtMS40MSAxLjQxIi8+PHBhdGggZD0ibTE5LjA3IDQuOTMtMS40MSAxLjQxIi8+PC9zdmc+"
						/>
					) : (
						<img
							alt="dark"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbW9vbiI+PHBhdGggZD0iTTEyIDNhNiA2IDAgMCAwIDkgOSA5IDkgMCAxIDEtOS05WiIvPjwvc3ZnPg=="
						/>
					)}
				</button>

				{/* 設定画面表示ボタン */}
				<button
					type="button"
					onClick={() => {
						dialogRef.current?.showModal();
					}}
				>
					{appTheme === "light" ? (
						<img
							alt="light"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtc2V0dGluZ3MiPjxwYXRoIGQ9Ik0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIi8+PC9zdmc+"
						/>
					) : (
						<img
							alt="dark"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtc2V0dGluZ3MiPjxwYXRoIGQ9Ik0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIi8+PC9zdmc+"
						/>
					)}
				</button>
			</HStack>

			<styled.dialog
				ref={dialogRef}
				position={"fixed"}
				margin={"auto"}
				w={"90vw"}
				h={"90vh"}
			>
				<Container p={"1em"}>
					<VStack>
						<ConfigDialog />
						<styled.button onClick={() => dialogRef.current?.close()}>
							close
						</styled.button>
					</VStack>
				</Container>
			</styled.dialog>
		</>
	);
};
