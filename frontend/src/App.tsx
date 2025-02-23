import { useEffect, useRef, useState } from "react";
import { Box, Container, Flex } from "styled-system/jsx";
import "./github-markdown.css";
import { useAtom } from "jotai";
import { GetConfig, SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn, EventsOnce } from "wailsjs/runtime/runtime";
import { appThemeAtom } from "./atom/appThemeAtom";
import { configAtom } from "./atom/configAtom";
import { MessageInputArea } from "./components/MessageInputArea";
import { ChatView } from "./components/chatViewComponents/ChatView";
import { MarkdownView } from "./components/chatViewComponents/MarkdownView";
import { UserMessageView } from "./components/chatViewComponents/UserMessageView";
import { TopMenuBar } from "./components/topMenuBarComponents/TopMenuBar";
import type { ConfigModel } from "./model/configModel";
import type { Chat, ResponseData } from "./model/dataModels";

function App() {
	const [appTheme, setAppTheme] = useAtom(appThemeAtom);
	const [config, setConfig] = useAtom(configAtom);

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
			};
			setConfig(config);
		});
	}, []);

	// チャットエリアを自動でスクロール
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [ollamaResopnse]);

	async function callOllamaApi() {
		const msg = input;
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
			setOllamaResopnse("");
			setChatHistory(newMessages);
			EventsOff("receiveChat");
		});

		SendChat(
			config?.OllamaEndpoints[0].Endpoint as string,
			config?.OllamaEndpoints[0].LLMModels[0].ModelName as string,
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
					{ollamaResopnse !== "" && (
						<>
							<UserMessageView message={prevInput} />
							<MarkdownView mdStr={ollamaResopnse} />
						</>
					)}
				</Box>
				<MessageInputArea
					input={input}
					setInput={setInput}
					setPrevInput={setPrevInput}
					sendChat={callOllamaApi}
				/>
			</Flex>
		</Container>
	);
}

export default App;
