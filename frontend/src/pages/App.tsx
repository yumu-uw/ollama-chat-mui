import { use, useEffect, useRef, useState } from "react";
import "@/css/github-markdown.css";
import {
	Alert,
	Box,
	Snackbar,
	type SnackbarCloseReason,
	Stack,
} from "@mui/material";
import { GetConfig, SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn } from "wailsjs/runtime/runtime";
import { ChatView } from "@/components/chatViewComponents/ChatView";
import { MarkdownView } from "@/components/chatViewComponents/MarkdownView";
import { UserMessageView } from "@/components/chatViewComponents/UserMessageView";
import { MessageInputArea } from "@/components/MessageInputArea";
import { ConfigContext } from "@/context/configContext";
import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import { CurrentOllamaHostContext } from "@/context/currentOllamaHostContext";
import type { ConfigModel } from "@/model/configModel";
import type { Chat, ResponseData } from "@/model/dataModels";

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
	const { configDialogIsOpen, setConfigDialogIsOpen } =
		configDialogIsOpenContext;

	const currentOllamaHostContext = use(CurrentOllamaHostContext);
	if (!currentOllamaHostContext) {
		throw new Error("failed to get currentOllamaHostContext");
	}
	const { currentOllamaHost, setCurrentOllamaHost } = currentOllamaHostContext;

	const [open, setOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const [input, setInput] = useState("");
	const [prevInput, setPrevInput] = useState("");
	const [sendDisabled, setSendDisabled] = useState(false);
	const [waitingResponse, setWaitingResponse] = useState(false);
	const [ollamaResopnse, setOllamaResopnse] = useState("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([]);

	const chatRef = useRef<HTMLDivElement>(null);

	// 初期設定
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional non-exhaustive deps
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
			setWaitingResponse(false);
			try {
				data.split(/\r?\n/).map((v) => {
					if (v !== "") {
						const j = JSON.parse(v) as ResponseData;
						setOllamaResopnse((prev) => prev + j.message.content);
					}
				});
			} catch (_e) {
				setOllamaResopnse((prev) => `${prev}Error·parsing·response·data.`);
				setSendDisabled(false);
				setSnackBarMessage("Response data parsing error.");
			}
		});

		return () => {
			// チャット履歴のリフレッシュイベントを解除
			EventsOff("refreshChat");

			// 受信したメッセージを表示するイベントを解除
			EventsOff("receiveChat");
		};
	}, []);

	// チャットエリアを自動でスクロール
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional non-exhaustive deps
	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [ollamaResopnse]);

	// チャットの初期状態でWelcomeメッセージをアニメーション表示する。
	useEffect(() => {
		if (currentOllamaHost?.DisplayName === "") return;
		if (configDialogIsOpen) return;
		if (chatHistory.length === 0) {
			setOllamaResopnse("");
			setSendDisabled(true);
			const welcomeMessage = "ようこそ！何かお手伝いできることはありますか？";
			for (let i = 0; i < welcomeMessage.length; i++) {
				setTimeout(
					() => {
						setOllamaResopnse((prev) => prev + welcomeMessage[i]);
						if (i === welcomeMessage.length - 1) {
							setOllamaResopnse("");
							setChatHistory([
								{
									role: "assistant",
									content: welcomeMessage,
								},
							]);
							setSendDisabled(false);
						}
					},
					500 + i * 10,
				);
			}
		}
	}, [chatHistory, currentOllamaHost.DisplayName, configDialogIsOpen]);

	function callOllamaApi() {
		if (input === "") {
			return;
		}
		setSendDisabled(true);
		setWaitingResponse(true);
		const msg = input;
		setPrevInput(msg);
		setInput("");

		SendChat(
			currentOllamaHost?.Endpoint as string,
			currentOllamaHost?.ModelName as string,
			[
				...chatHistory,
				{
					role: "user",
					content: msg,
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
					},
					{
						role: "assistant",
						content: data,
					},
				];
				setChatHistory(newMessages);
			}

			setPrevInput("");
			setOllamaResopnse("");
			setSendDisabled(false);
		});
	}

	const handleClose = (
		_event: React.SyntheticEvent | Event,
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
				sx={{
					height: "100%",
					width: "100%",
					justifyContent: "space-between",
				}}
			>
				<Box
					ref={chatRef}
					sx={{
						padding: "0 0.5em 1em 0.5em",
						height: "100%",
						marginEnd: "auto",
						overflow: "auto",
					}}
				>
					<ChatView chatHistory={chatHistory} />
					{prevInput && (
						<UserMessageView message={prevInput} loading={waitingResponse} />
					)}
					{ollamaResopnse !== "" && <MarkdownView mdStr={ollamaResopnse} />}
				</Box>
				<MessageInputArea
					input={input}
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
