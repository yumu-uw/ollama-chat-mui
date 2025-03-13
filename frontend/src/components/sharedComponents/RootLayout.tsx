import {
	AppBar,
	Box,
	Container,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import { Outlet } from "react-router";
import { HostSelectView } from "../topMenuBarComponents/HostSelectView";
import { RightButtonView } from "../topMenuBarComponents/RightButtonView";

export const RootLayout = () => {
	return (
		<>
			<Stack direction={"column"} sx={{ position: "relative", height: "65px" }}>
				<AppBar>
					<Toolbar>
						<Typography variant="h6" noWrap component="div" sx={{ pr: "2em" }}>
							Ollama Chat
						</Typography>
						<HostSelectView />
						<Box sx={{ flexGrow: 1 }} />
						<RightButtonView />
					</Toolbar>
				</AppBar>
			</Stack>

			<Container sx={{ height: "calc(100vh - 65px)", py: "1em" }}>
				<Outlet />
			</Container>
		</>
	);
};
