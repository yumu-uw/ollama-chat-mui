import {
	Alert,
	Link,
	Paper,
	Snackbar,
	type SnackbarCloseReason,
} from "@mui/material";
import { memo, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { BrowserOpenURL } from "wailsjs/runtime/runtime";
import { CustomCode } from "./CustomCode";

type Props = {
	mdStr: string;
};

export const MarkdownView = memo(({ mdStr }: Props) => {
	const [open, setOpen] = useState(false);

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	return (
		<>
			<Paper elevation={4} sx={{ width: "90%", mx: "0.5em", mb: "3em" }}>
				<Markdown
					className="markdown-body"
					rehypePlugins={[rehypeRaw, rehypeSanitize]}
					remarkPlugins={[remarkGfm]}
					components={{
						a: ({ node, ...props }) => (
							<Link
								sx={{
									color: "blue !important",
									"&:hover": { textDecoration: "underline" },
									cursor: "pointer",
								}}
								onClick={() => {
									if (props.href) {
										BrowserOpenURL(props.href);
									}
								}}
							>
								{props.href}
							</Link>
						),
						code(props) {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { node, ...rest } = props;
							const classAttr = rest.className;
							const value = rest.children;
							return <CustomCode classAttr={classAttr} value={value} />;
						},
					}}
				>
					{mdStr}
				</Markdown>
			</Paper>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				open={open}
				autoHideDuration={1500}
				onClose={handleClose}
			>
				<Alert
					onClose={handleClose}
					severity="error"
					variant="filled"
					sx={{ width: "100%" }}
				>
					ページを開けませんでした。
				</Alert>
			</Snackbar>
		</>
	);
});
