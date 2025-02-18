import { useEffect, useRef, useState } from "react";
import { Box, Container, Flex } from "styled-system/jsx";
import "./github-markdown.css";
import { SendChat2 } from "wailsjs/go/main/App";
import { EventsOff, EventsOn, EventsOnce } from "wailsjs/runtime/runtime";
import ChatView from "./components/ChatView";
import { MarkdownView } from "./components/MarkdownView";
import { MessageInputArea } from "./components/MessageInputArea";
import { TopMenuBar } from "./components/TopMenuBar";
import { UserMessageView } from "./components/UserMessageView";
import type { Chat, RequestData, ResponseData } from "./model/dataModels";

function App() {
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

	// チャットエリアを自動でスクロール
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [ollamaResopnse]);

	async function sendChat() {
		const msg = input;
		setInput("");
		const data: RequestData = {
			model: "qwen2.5-coder:7b",
			messages: [
				...chatHistory,
				{
					role: "user",
					content: msg,
				},
			],
			stream: true,
		};
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		};

		const decoder = new TextDecoder();
		const response = await fetch("http://localhost:11434/api/chat", options);
		const reader = response.body?.getReader();
		if (!reader) {
			console.error("No readable stream available.");
			return;
		}

		let output = "";
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			decoder
				.decode(value)
				.split(/\r?\n/)
				.map((v) => {
					if (v !== "") {
						const j = JSON.parse(v) as ResponseData;
						output += j.message.content;
						setOllamaResopnse((prev) => prev + j.message.content);
					}
				});
		}
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
	}

	async function sendChat2() {
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
			console.log(newMessages);
			setOllamaResopnse("");
			setChatHistory(newMessages);
			EventsOff("receiveChat");
		});

		SendChat2([
			...chatHistory,
			{
				role: "user",
				content: msg,
			},
		]);
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
					sendChat={sendChat2}
				/>
			</Flex>
		</Container>
	);
}

export default App;
