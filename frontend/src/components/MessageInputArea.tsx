import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Divider, IconButton, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

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
		<Stack
			sx={{
				px: "1em",
				borderRadius: "1em",
				bgcolor: "lightgray",
				color: "black",
				boxShadow: 3,
			}}
		>
			<TextField
				value={input}
				variant={"standard"}
				placeholder="送信するメッセージ(Enterで改行、Alt+Enterで送信)"
				multiline
				maxRows={6}
				sx={{
					w: "100%",
					resize: "none",
					py: "0.5em",
					"& .MuiInput-underline:before, & .MuiInput-underline:after": {
						borderBottom: "none",
					},
					"& .MuiInput-underline:hover:not(.Mui-disabled):before": {
						borderBottom: "none",
					},
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" && e.altKey) {
						e.preventDefault();
						if (sendDisabled) {
							return;
						}
						handleCallOllamaApi();
					}
				}}
				onChange={(e) => {
					setInput(e.target.value);
				}}
			/>
			<Divider sx={{ borderBottomWidth: 1, borderBottomColor: "black" }} />
			<Stack direction={"row"} sx={{ w: "100%", justifyContent: "flex-end" }}>
				<IconButton
					aria-label="send-message"
					sx={{ cursor: "pointer" }}
					onClick={handleCallOllamaApi}
					disabled={sendDisabled}
				>
					<SendOutlinedIcon fontSize="large" />
				</IconButton>
			</Stack>
		</Stack>
	);
};
