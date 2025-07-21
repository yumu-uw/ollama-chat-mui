import { Send } from "@mui/icons-material";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
	input: string;
	sendDisabled: boolean;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	callOllamaApi(): void;
};

export const MessageInputArea = ({
	input,
	sendDisabled,
	setInput,
	callOllamaApi,
}: Props) => {
	const [debouncedCall, setDebouncedCall] = useState<() => void>(
		() => () => {},
	);
	const isComposingRef = useRef(false);

	useEffect(() => {
		const handler = setTimeout(() => {
			debouncedCall();
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [debouncedCall]);

	const handleCallOllamaApi = useCallback(() => {
		setDebouncedCall(() => callOllamaApi);
	}, [callOllamaApi]);

	return (
		<Stack direction="row" justifyContent="center">
			<Stack
				sx={{
					borderRadius: "0.5em",
					bgcolor: "grey.100",
					color: "black",
					boxShadow: 3,
					width: "100%",
					maxWidth: "md",
				}}
			>
				<TextField
					size="small"
					value={input}
					variant="filled"
					placeholder="送信するメッセージ(Enterで送信、Shift+Enterで改行)"
					multiline
					maxRows={6}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							if (isComposingRef.current) {
								isComposingRef.current = false;
								return;
							}
							if (e.shiftKey || isComposingRef.current) {
								return;
							}
							e.preventDefault();
							if (!sendDisabled) {
								handleCallOllamaApi();
							}
						}
					}}
					onCompositionStart={() => {
						isComposingRef.current = true;
					}}
					onChange={(e) => {
						setInput(e.target.value);
					}}
				/>
				<Stack direction={"row"} sx={{ w: "100%", justifyContent: "flex-end" }}>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						aria-label="send-message"
						sx={{ cursor: "pointer", m: "0.2em" }}
						onClick={handleCallOllamaApi}
						disabled={sendDisabled}
						size="small"
					>
						<Send />
					</IconButton>
				</Stack>
			</Stack>
		</Stack>
	);
};
