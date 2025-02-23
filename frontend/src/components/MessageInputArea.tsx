import { appThemeAtom } from "@/atom/appThemeAtom";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { Circle, Divider, Flex, VStack, styled } from "styled-system/jsx";

const MessageInputAreaVStack = styled(VStack, {
	base: {
		gap: 2,
		p: "0.5em",
		borderRadius: "lg",
	},
	variants: {
		variants: {
			light: {
				bg: "gray.200",
				color: "black",
			},
			dark: {
				bg: "gray.700",
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

type Props = {
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	callOllamaApi(): void;
};

export const MessageInputArea = ({ input, setInput, callOllamaApi }: Props) => {
	const appTheme = useAtomValue(appThemeAtom);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// テキストエリアの高さを自動調節
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	return (
		<MessageInputAreaVStack variants={appTheme}>
			<styled.textarea
				ref={textareaRef}
				w={"100%"}
				placeholder="送信するメッセージ(Enterで改行、Alt+Enterで送信)"
				resize={"none"}
				rows={1}
				maxHeight={240}
				outline={{ _focus: "none" }}
				value={input}
				onKeyDown={(e) => {
					if (e.key === "Enter" && e.altKey) {
						e.preventDefault();
						callOllamaApi();
					}
				}}
				onChange={(e) => {
					setInput(e.target.value);
				}}
			/>
			<Divider />
			<Flex w={"100%"} justify={"flex-end"}>
				<Circle bg="gray.300" w={"2em"} h={"2em"}>
					<styled.button onClick={callOllamaApi}>
						<styled.img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LXVwIj48cGF0aCBkPSJtNSAxMiA3LTcgNyA3Ii8+PHBhdGggZD0iTTEyIDE5VjUiLz48L3N2Zz4=" />
					</styled.button>
				</Circle>
			</Flex>
		</MessageInputAreaVStack>
	);
};
