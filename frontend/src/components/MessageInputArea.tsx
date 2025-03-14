import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import { Divider, IconButton, Stack, TextField } from "@mui/material";

type Props = {
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	callOllamaApi(): void;
};

export const MessageInputArea = ({ input, setInput, callOllamaApi }: Props) => {
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
						callOllamaApi();
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
					onClick={callOllamaApi}
				>
					<ArrowCircleUpOutlinedIcon fontSize="large" />
				</IconButton>
			</Stack>
		</Stack>
	);
};
