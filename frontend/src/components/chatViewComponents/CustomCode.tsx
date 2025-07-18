import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { Alert, Box, Card, IconButton, Snackbar, SnackbarCloseReason, Stack } from "@mui/material";
import { useState } from "react";
import { supportLangs } from "@/lib/custom-highlight";

interface Props {
	classAttr: string | undefined;
	value: React.ReactNode;
}

export const CustomCode = ({ classAttr, value }: Props) => {
	const [hasCopied, setHasCopied] = useState<boolean>(false);

	const classNames =
		classAttr !== undefined ? classAttr.split(":") : ["nohighlight", undefined];
	const lang = supportLangs[classNames[0] as string]
		? classNames[0]
		: "language-plaintext";
	if (classNames[0] === "nohighlight") {
		return <code className={classNames[0]}>{value}</code>;
	}

	const handleCopyButton = async () => {
		setHasCopied(true);
		await navigator.clipboard.writeText(value?.toString() as string);
	};

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === "clickaway") {
			return;
		}

		setHasCopied(false);
	};

	return (
		<Stack>
			<Stack
				direction={"row"}
				sx={{
					p: "0.5em",
					justifyContent: "space-between",
					fontWeight: "bold",
					bgcolor: "lightgray",
					color: "black",
					alignItems: "center",
				}}
			>
				{classAttr?.split("-")[1]}
				<Box>
					<IconButton
						aria-label="copy-code"
						size="small"
						sx={{
							cursor: "pointer",
						}}
						onClick={handleCopyButton}
					>
						<ContentCopyOutlinedIcon />
					</IconButton>
				</Box>

				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={hasCopied}
					autoHideDuration={1500}
					onClose={handleClose}
				>
					<Alert severity="success" sx={{ width: "100%" }}>
						コピーしました
					</Alert>
				</Snackbar>
			</Stack>
			<Card variant="outlined">
				<code className={lang}>{value}</code>
			</Card>
		</Stack>
	);
};
