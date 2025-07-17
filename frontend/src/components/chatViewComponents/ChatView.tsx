import { Box } from "@mui/material";
import hljs from "highlight.js";
import { memo, useEffect } from "react";
import type { Chat } from "@/model/dataModels";
import { MarkdownView } from "./MarkdownView";
import { UserMessageView } from "./UserMessageView";

type Props = {
	chatHistory: Chat[];
};

export const ChatView = memo(({ chatHistory }: Props) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
	useEffect(() => {
		hljs.highlightAll();
	}, [chatHistory]);

	return (
		<Box>
			{chatHistory.map((value, index) => {
				if (value.role === "user") {
					return (
						<UserMessageView
							key={`usermsg-${
								// biome-ignore lint/suspicious/noArrayIndexKey: false positive
								index
							}`}
							message={value.content}
						/>
					);
				}
				if (value.role === "assistant") {
					return (
						<MarkdownView
							key={`assistantmsg-${
								// biome-ignore lint/suspicious/noArrayIndexKey: false positive
								index
							}`}
							mdStr={value.content}
						/>
					);
				}
			})}
		</Box>
	);
});
