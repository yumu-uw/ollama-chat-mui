import { use, useEffect, useRef, useState } from "react";
import "@/css/github-markdown.css";
import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { MessageInputArea } from "@/components/MessageInputArea";
import { ChatView } from "@/components/chatViewComponents/ChatView";
import { MarkdownView } from "@/components/chatViewComponents/MarkdownView";
import { UserMessageView } from "@/components/chatViewComponents/UserMessageView";
import { ConfigDialogIsOpenContext } from "@/context/configDIalogIsOpenContext";
import type { ConfigModel } from "@/model/configModel";
import type { Chat, ResponseData } from "@/model/dataModels";
import { Box, Stack } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { GetConfig, SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn, EventsOnce } from "wailsjs/runtime/runtime";

function App() {
	const setConfig = useSetAtom(configAtom);
	const [currentOllamaHost, setCurrentOllamaHost] = useAtom(
		currentOllamaHostAtom,
	);
	const configDialogIsOpenContext = use(ConfigDialogIsOpenContext);
	if (!configDialogIsOpenContext) {
		throw new Error("failed to get configDialogIsOpenContext");
	}

	const { setConfigDialogIsOpen } = configDialogIsOpenContext;

	const [input, setInput] = useState("");
	const [prevInput, setPrevInput] = useState("");
	const [sendDisabled, setSendDisabled] = useState(false);
	const [ollamaResopnse, setOllamaResopnse] = useState("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([]);

	const chatRef = useRef<HTMLDivElement>(null);

	// 設定ファイルの情報を取得
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		GetConfig().then((data) => {
			const newConfig: ConfigModel = {
				OllamaEndpoints: data.OllamaEndpoints,
				DefaultOllamaEndPointName: data.DefaultOllamaEndPointName,
				DefaultPrompt: data.DefaultPrompt,
			};
			setConfig(newConfig);

			EventsOn("refreshChat", () => {
				setChatHistory([]);
			});

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
		setInput("");
		EventsOn("receiveChat", (data: string) => {
			data.split(/\r?\n/).map((v) => {
				if (v !== "") {
					const j = JSON.parse(v) as ResponseData;
					setOllamaResopnse((prev) => prev + j.message.content);
				}
			});
		});

		EventsOnce("deleteEvent", (output: string) => {
			const newMessages: Chat[] = [
				...chatHistory,
				{
					role: "user",
					content: msg,
				},
				{
					role: "assistant",
					content: output,
				},
			];
			setPrevInput("");
			setOllamaResopnse("");
			setChatHistory(newMessages);
			setSendDisabled(false);
			EventsOff("receiveChat");
		});

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
		);
	}

	return (
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
				{prevInput && <UserMessageView message={prevInput} />}
				{ollamaResopnse !== "" && <MarkdownView mdStr={ollamaResopnse} />}
			</Box>
			<MessageInputArea
				input={input}
				sendDisabled={sendDisabled}
				setInput={setInput}
				callOllamaApi={callOllamaApi}
			/>
		</Stack>
	);
}

export default App;
