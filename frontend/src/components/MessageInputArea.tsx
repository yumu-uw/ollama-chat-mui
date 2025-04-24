import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
	Box,
	Divider,
	IconButton,
	Stack,
	TextField,
	Tooltip,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LoadImgBase64 } from "wailsjs/go/main/App";

type Props = {
	input: string;
	imgBase64: string;
	sendDisabled: boolean;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	setImgBase64: React.Dispatch<React.SetStateAction<string>>;
	callOllamaApi(): void;
};

export const MessageInputArea = ({
	input,
	imgBase64,
	setImgBase64,
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
				{/* <Tooltip title="画像を選択">
					<IconButton
						aria-label="send-message"
						sx={{ cursor: "pointer" }}
						onClick={() => {
							LoadImgBase64().then((result) => {
								if (result.startsWith("error: ")) {
									console.error(result);
									return;
								}
								setImgBase64(result);
							});
						}}
						disabled={sendDisabled}
					>
						<AddOutlinedIcon fontSize="large" />
					</IconButton>
				</Tooltip> */}
				<Box sx={{ flexGrow: 1 }} />
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
