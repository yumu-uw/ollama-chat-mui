import hljs from "@/lib/custom-highlight";
import type { Chat } from "@/model/dataModels";
import { memo, useEffect } from "react";
import { MarkdownView } from "./MarkdownView";
import { UserMessageView } from "./UserMessageView";

type Props = {
	chatHistory: Chat[];
};

export const ChatView = memo(({ chatHistory }: Props) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		hljs.highlightAll();
	}, [chatHistory]);

	return (
		<>
			{chatHistory.map((value, index) => {
				if (value.role === "user") {
					return (
						<UserMessageView
							key={`usermsg-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							mdStr={value.content}
						/>
					);
				}
			})}
		</>
	);
});
