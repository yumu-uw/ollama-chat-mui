import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import type { TransitionProps } from "@mui/material/transitions";
import { useAtom } from "jotai";
import React from "react";

type Props = {
	justifyContent?: string;
	children: React.ReactNode;
};

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<unknown>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

export const FullScreenDialog = ({ ...rest }: Props) => {
	const [configDIalogIsOpen, setConfigDIalogIsOpen] = useAtom(
		configDIalogIsOpenAtom,
	);

	const handleClose = () => {
		console.log("close");
		setConfigDIalogIsOpen(false);
	};

	return (
		<Dialog
			fullScreen
			open={configDIalogIsOpen}
			onClose={handleClose}
			slots={{ transition: Transition }}
		>
			<AppBar sx={{ position: "relative" }}>
				<Toolbar>
					<Stack gap={0} alignItems="center" justifyContent="center">
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
							sx={{ margin: "auto" }}
						>
							<CloseIcon />
						</IconButton>
						ESC
					</Stack>
				</Toolbar>
			</AppBar>
			<Stack
				gap={4}
				sx={{
					p: "1em",
					width: "100%",
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
