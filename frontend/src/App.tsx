import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Box, Circle, Divider, Flex, styled } from "styled-system/jsx";
import { SendChat } from "wailsjs/go/main/App";
import { EventsOff, EventsOn, EventsOnce } from "wailsjs/runtime";
import CustomCode from "./components/CustomCode";
import "github-markdown-css/github-markdown-light.css";
import hljs from "./lib/custom-highlight";

function App() {
	const [input, setInput] = useState("");
	const [response, setResponse] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	async function sendChat() {
		setInput("");
		setResponse("");
		EventsOn("receiveChat", (data) => {
			console.info(data);
			setResponse((prev) => prev + data);
		});
		EventsOnce("deleteEvent", () => {
			const codes = document.querySelectorAll("pre code");
			for (const code of codes) {
				if (code.attributes.getNamedItem("data-highlighted") !== null) {
					code.attributes.removeNamedItem("data-highlighted");
				}
			}
			hljs.highlightAll();
			EventsOff("receiveChat");
		});
		SendChat(input);
	}

	return (
		<>
			<Flex
				direction={"column"}
				h={"100vh"}
				w={"100vw"}
				padding={"1em"}
				justify={"space-between"}
			>
				<Box marginEnd={"auto"} overflow={"auto"} w={"100%"}>
					<Markdown
						className="markdown-body"
						rehypePlugins={[rehypeRaw, rehypeSanitize]}
						remarkPlugins={[remarkGfm]}
						components={{
							code(props) {
								const { node, ...rest } = props;
								const classAttr = rest.className;
								const value = rest.children;
								return <CustomCode classAttr={classAttr} value={value} />;
							},
						}}
					>
						{response}
					</Markdown>
				</Box>
				<Flex
					direction={"column"}
					gap={2}
					p={"0.5em"}
					borderRadius={"lg"}
					bg={"gray.100"}
				>
					<styled.textarea
						ref={textareaRef}
						placeholder="送信するメッセージ"
						resize={"none"}
						rows={1}
						maxHeight={240}
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Divider />
					<Flex justify={"flex-end"}>
						<Circle bg="gray.300" w={"2em"} h={"2em"}>
							<styled.button onClick={sendChat}>
								<styled.img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LXVwIj48cGF0aCBkPSJtNSAxMiA3LTcgNyA3Ii8+PHBhdGggZD0iTTEyIDE5VjUiLz48L3N2Zz4=" />
							</styled.button>
						</Circle>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
}

export default App;
