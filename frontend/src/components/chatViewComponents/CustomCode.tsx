import { appThemeAtom } from "@/atom/appThemeAtom";
import { supportLangs } from "@/lib/custom-highlight";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useAtomValue } from "jotai";
import { useState } from "react";

interface Props {
	classAttr: string | undefined;
	value: React.ReactNode;
}

export const CustomCode = ({ classAttr, value }: Props) => {
	const appTheme = useAtomValue(appThemeAtom);

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
		setTimeout(() => {
			setHasCopied(false);
		}, 1500);
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

				{!hasCopied && (
					<Box>
						<IconButton
							aria-label="copy-code"
							size="small"
							sx={{
								cursor: "pointer",
								color: appTheme === "light" ? "black" : "white",
							}}
							onClick={handleCopyButton}
						>
							<ContentCopyOutlinedIcon />
							コピーする
						</IconButton>
					</Box>
				)}
				{hasCopied && (
					<Box>
						<IconButton
							aria-label="copied-code"
							size="small"
							sx={{
								cursor: "pointer",
								color: appTheme === "light" ? "black" : "white",
							}}
						>
							<CheckOutlinedIcon />
							コピーしました！
						</IconButton>
					</Box>
				)}
			</Stack>
			<code className={lang}>{value}</code>
		</Stack>
	);
};
