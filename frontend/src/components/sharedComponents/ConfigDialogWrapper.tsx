import { appThemeAtom } from "@/atom/appThemeAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Container, styled } from "styled-system/jsx";

const StyledConfigDialogWrapper = styled("dialog", {
	base: {
		margin: "auto",
		w: "90vw",
		borderRadius: "md",
		_scrollbarThumb: {
			borderRadius: "10px",
			border: "2px solid transparent",
			backgroundClip: "content-box",
		},
	},
	variants: {
		variants: {
			light: {
				color: "black",
				scrollbarColor: "#a9a9a9 #eeeeee",
				_scrollbarTrack: {
					backgroundColor: "#eeeeee",
				},
				_scrollbarThumb: {
					background: "#a9a9a9",
				},
			},
			dark: {
				color: "white",
				bg: "gray.700",
				scrollbarColor: "#3D3C3B #1D2A39",
				_scrollbarTrack: {
					backgroundColor: "#000000",
				},
				_scrollbarThumb: {
					background: "#3D3C3B",
				},
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

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
		<StyledConfigDialogWrapper
			variants={appTheme}
			ref={dialogRef}
			minH={minH}
			maxH={maxH}
		>
			<Container alignContent={alignContent} minH={minH} maxH={maxH} p={"1em"}>
				{children}
			</Container>
		</StyledConfigDialogWrapper>
	);
};
