import { appThemeAtom } from "@/atom/appThemeAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import { Container } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
	alignContent?: string;
	minH?: string;
	maxH?: string;
	children: React.ReactNode;
};

export const ConfigDialogWrapper = ({
	dialogRef,
	alignContent,
	minH,
	maxH,
	children,
}: Props) => {
	const appTheme = useAtomValue(appThemeAtom);
	const setConfigDIalogIsOpen = useSetAtom(configDIalogIsOpenAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleCloseDialog = () => {
			setConfigDIalogIsOpen(false);
		};

		dialogRef.current?.addEventListener("close", handleCloseDialog);
	}, []);

	return (
		<dialog ref={dialogRef}>
			<Container sx={{ alignContent: alignContent, minHeight: minH, p: "1em" }}>
				{children}
			</Container>
		</dialog>
	);
};
