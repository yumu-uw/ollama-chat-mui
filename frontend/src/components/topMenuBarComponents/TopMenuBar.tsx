import { Stack } from "@mui/material";
import { memo } from "react";
import { HostSelectView } from "./HostSelectView";
import { RightButtonView } from "./RightButtonView";

export const TopMenuBar = memo(() => {
	return (
		<Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
			<HostSelectView />
			<RightButtonView />
		</Stack>
	);
});
