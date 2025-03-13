import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { useAtom } from "jotai";

type Props = {
	justifyContent?: string;
	children: React.ReactNode;
};

export const ConfigDialogView = ({ ...rest }: Props) => {
	const [configDIalogIsOpen, setConfigDIalogIsOpen] = useAtom(
		configDIalogIsOpenAtom,
	);

	const handleClose = () => {
		console.log("close");
		setConfigDIalogIsOpen(false);
	};

	return (
		<Dialog
			open={configDIalogIsOpen}
			onClose={handleClose}
			maxWidth={"md"}
			fullWidth
		>
			<Stack direction="row" width="100%" justifyContent="flex-end">
				<Stack gap={0} alignItems="center" sx={{ pt: "1em", pr: "1em" }}>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
						sx={{ cursor: "pointer" }}
					>
						<CloseIcon />
					</IconButton>
					ESC
				</Stack>
			</Stack>
			<Stack
				gap={4}
				sx={{
					p: "1em",
					height: "100%",
					alignItems: "center",
					justifyContent: rest.justifyContent,
				}}
			>
				{rest.children}
			</Stack>
		</Dialog>
	);
};
