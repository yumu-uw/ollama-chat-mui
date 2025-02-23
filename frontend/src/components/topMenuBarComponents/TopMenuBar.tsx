import { memo } from "react";
import { HStack, Spacer } from "styled-system/jsx";
import { HostSelectView } from "./HostSelectView";
import { RightButtonView } from "./RightButtonView";

export const TopMenuBar = memo(() => {
	return (
		<HStack>
			<HostSelectView />
			<Spacer />
			<RightButtonView />
		</HStack>
	);
});
