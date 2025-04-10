import { use, useEffect, useRef, useState } from "react";
import "@/css/github-markdown.css";
import { MessageInputArea } from "@/components/MessageInputArea";
import { ChatView } from "@/components/chatViewComponents/ChatView";
import { MarkdownView } from "@/components/chatViewComponents/MarkdownView";
import { UserMessageView } from "@/components/chatViewComponents/UserMessageView";
import { ConfigContext } from "@/context/configContext";
import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import { CurrentOllamaHostContext } from "@/context/currentOllamaHostContext";
import type { ConfigModel } from "@/model/configModel";
import type { Chat, ResponseData } from "@/model/dataModels";
import {
	Alert,
	Box,
	Snackbar,
	type SnackbarCloseReason,
	Stack,
} from "@mui/material";
import { GetConfig, SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn } from "wailsjs/runtime/runtime";

function App() {
	const configContext = use(ConfigContext);
	if (!configContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { setConfig } = configContext;

	const configDialogIsOpenContext = use(ConfigDialogIsOpenContext);
	if (!configDialogIsOpenContext) {
		throw new Error("failed to get configDialogIsOpenContext");
	}
	const { setConfigDialogIsOpen } = configDialogIsOpenContext;

	const currentOllamaHostContext = use(CurrentOllamaHostContext);
	if (!currentOllamaHostContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { currentOllamaHost, setCurrentOllamaHost } = currentOllamaHostContext;

	const [open, setOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const [input, setInput] = useState("");
	const [imgBase64, setImgBase64] = useState("");
	const [prevInput, setPrevInput] = useState("");
	const [prevImgBase64, setPrevImgBase64] = useState("");
	const [sendDisabled, setSendDisabled] = useState(false);
	const [ollamaResopnse, setOllamaResopnse] = useState("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([]);

	const chatRef = useRef<HTMLDivElement>(null);

	// 初期設定
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		GetConfig().then((data) => {
			const newConfig: ConfigModel = {
				OllamaEndpoints: data.OllamaEndpoints,
				DefaultOllamaEndPointName: data.DefaultOllamaEndPointName,
				DefaultPrompt: data.DefaultPrompt,
			};
			setConfig(newConfig);

			if (newConfig.OllamaEndpoints.length === 0) {
				setTimeout(() => {
					setConfigDialogIsOpen(true);
				}, 500);
				return;
			}

			for (const endpoint of newConfig.OllamaEndpoints || []) {
				if (endpoint.EndpointName === newConfig.DefaultOllamaEndPointName) {
					setCurrentOllamaHost({
						DisplayName: endpoint.EndpointName,
						Endpoint: endpoint.EndpointUrl,
						ModelName: endpoint.DefaultLLMModel,
					});
					break;
				}
			}
		});

		// チャット履歴のリフレッシュイベントを登録
		EventsOn("refreshChat", () => {
			setChatHistory([]);
		});

		// 受信したメッセージを表示するイベントを登録
		EventsOn("receiveChat", (data: string) => {
			data.split(/\r?\n/).map((v) => {
				if (v !== "") {
					const j = JSON.parse(v) as ResponseData;
					setOllamaResopnse((prev) => prev + j.message.content);
				}
			});
		});

		return () => {
			// チャット履歴のリフレッシュイベントを解除
			EventsOff("refreshChat");

			// 受信したメッセージを表示するイベントを解除
			EventsOff("receiveChat");
		};
	}, []);

	// チャットエリアを自動でスクロール
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [ollamaResopnse]);

	function callOllamaApi() {
		if (input === "") {
			return;
		}
		setSendDisabled(true);
		const msg = input;
		setPrevInput(msg);
		setPrevImgBase64(imgBase64);
		setInput("");
		setImgBase64("");

		SendChat(
			currentOllamaHost?.Endpoint as string,
			currentOllamaHost?.ModelName as string,
			[
				...chatHistory,
				{
					role: "user",
					content: msg,
					images: imgBase64 ? [imgBase64] : [],
				},
			],
		).then((data) => {
			if (data.startsWith("error:")) {
				setSnackBarMessage("Ollamaサーバーとの通信に失敗しました。");
				setOpen(true);
			} else {
				const newMessages: Chat[] = [
					...chatHistory,
					{
						role: "user",
						content: msg,
						images: imgBase64 ? [imgBase64] : [],
					},
					{
						role: "assistant",
						content: data,
						images: [],
					},
				];
				setChatHistory(newMessages);
			}

			setPrevInput("");
			setPrevImgBase64("");
			setOllamaResopnse("");
			setSendDisabled(false);
		});
	}

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	return (
		<>
			<Stack
				direction={"column"}
				gap={4}
				sx={{
					height: "100%",
					width: "100%",
					justifyContent: "space-between",
				}}
			>
				<Box
					ref={chatRef}
					sx={{
						height: "100%",
						marginEnd: "auto",
						overflow: "auto",
					}}
				>
					<ChatView chatHistory={chatHistory} />
					{prevInput && (
						<UserMessageView
							message={prevInput}
							imgBase64={prevImgBase64 !== "" ? prevImgBase64 : undefined}
						/>
					)}
					{ollamaResopnse !== "" && <MarkdownView mdStr={ollamaResopnse} />}
				</Box>
				<MessageInputArea
					input={input}
					imgBase64={imgBase64}
					setImgBase64={setImgBase64}
					sendDisabled={sendDisabled}
					setInput={setInput}
					callOllamaApi={callOllamaApi}
				/>
			</Stack>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={"error"} sx={{ width: "100%" }}>
					{snackBarMessage}
				</Alert>
			</Snackbar>
		</>
	);
}

export default App;
