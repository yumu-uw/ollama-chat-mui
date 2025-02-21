import { useEffect, useRef, useState } from "react";
import { Box, Container, Flex } from "styled-system/jsx";
import "./github-markdown.css";
import { useAtom } from "jotai";
import { LoadConfig, SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn, EventsOnce } from "wailsjs/runtime/runtime";
import { configAtom } from "./atom/configAtom";
import ChatView from "./components/ChatView";
import { MarkdownView } from "./components/MarkdownView";
import { MessageInputArea } from "./components/MessageInputArea";
import { TopMenuBar } from "./components/TopMenuBar";
import { UserMessageView } from "./components/UserMessageView";
import type { AppTheme, ConfigModel } from "./model/configModel";
import type { Chat, ResponseData } from "./model/dataModels";

function App() {
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
		LoadConfig().then((data) => {
			let appTheme: AppTheme;
			switch (data.AppTheme) {
				case "light":
					appTheme = "light";
					break;
				case "dark":
					appTheme = "dark";
					break;
				default:
					appTheme = "light";
					break;
			}

			const config: ConfigModel = {
				OllamaEndpoints: data.OllamaEndpoints,
				AppTheme: appTheme,
			};
			setConfig(config);
			// console.log(config);
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
