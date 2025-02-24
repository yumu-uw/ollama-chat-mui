import { useEffect, useRef, useState } from "react";
import { Box, Container, Flex } from "styled-system/jsx";
import "./css/github-markdown.css";
import { useAtom, useSetAtom } from "jotai";
import { GetConfig, SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn, EventsOnce } from "wailsjs/runtime/runtime";
import { appThemeAtom } from "./atom/appThemeAtom";
import { configAtom } from "./atom/configAtom";
import { currentOllamaHostAtom } from "./atom/currentOllamaHostAtom";
import { MessageInputArea } from "./components/MessageInputArea";
import { ChatView } from "./components/chatViewComponents/ChatView";
import { MarkdownView } from "./components/chatViewComponents/MarkdownView";
import { UserMessageView } from "./components/chatViewComponents/UserMessageView";
import { TopMenuBar } from "./components/topMenuBarComponents/TopMenuBar";
import type { ConfigModel } from "./model/configModel";
import type { Chat, ResponseData } from "./model/dataModels";

function App() {
	const setAppTheme = useSetAtom(appThemeAtom);
	const setConfig = useSetAtom(configAtom);
	const [currentOllamaHost, setCurrentOllamaHost] = useAtom(
		currentOllamaHostAtom,
	);

	const [input, setInput] = useState("");
	const [prevInput, setPrevInput] = useState("");
	const [ollamaResopnse, setOllamaResopnse] = useState("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([
		{
			role: "system",
			content:
				"You are a helpful, respectful and honest coding assistant. Always reply using markdown. Be clear and concise, prioritizing brevity in your responses.",
		},
	]);

	const chatRef = useRef<HTMLDivElement>(null);

	// 設定ファイルの情報を取得
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		GetConfig().then((data) => {
			switch (data.AppTheme) {
				case "light":
					setAppTheme("light");
					break;
				case "dark":
					setAppTheme("dark");
					break;
				default:
					setAppTheme("light");
					break;
			}
			document.body.setAttribute("data-theme", data.AppTheme);
			const config: ConfigModel = {
				OllamaEndpoints: data.OllamaEndpoints,
				DefaultOllamaEndPointName: data.DefaultOllamaEndPointName,
			};
			setConfig(config);

			for (const endpoint of config?.OllamaEndpoints || []) {
				if (endpoint.EndpointName === config.DefaultOllamaEndPointName) {
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
		<Container>
			<Flex
				direction={"column"}
				gap={"8"}
				h={"100vh"}
				w={"100%"}
				padding={"1em"}
				justify={"space-between"}
			>
				<TopMenuBar />
				<Box
					ref={chatRef}
					marginEnd={"auto"}
					overflow={"auto"}
					w={"100%"}
					h={"100%"}
					pr={"1.5em"}
				>
					<ChatView chatHistory={chatHistory} />
					{prevInput && <UserMessageView message={prevInput} />}
					{ollamaResopnse !== "" && <MarkdownView mdStr={ollamaResopnse} />}
				</Box>
				<MessageInputArea
					input={input}
					setInput={setInput}
					callOllamaApi={callOllamaApi}
				/>
			</Flex>
		</Container>
	);
}

export default App;
