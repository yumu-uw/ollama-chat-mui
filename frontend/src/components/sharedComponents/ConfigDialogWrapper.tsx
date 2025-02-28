import { appThemeAtom } from "@/atom/appThemeAtom";
import { useAtomValue } from "jotai";
import { styled } from "styled-system/jsx";

const ConfigDialog = styled("dialog", {
	base: {
		margin: "auto",
		w: "90vw",
		borderRadius: "md",
		minH: "60vh",
		maxH: "80vh",
	},
	variants: {
		variants: {
			light: {
				color: "black",
			},
			dark: {
				color: "white",
				bg: "gray.700",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
	children: React.ReactNode;
};

export const ConfigDialogWrapper = ({ dialogRef, children }: Props) => {
	const appTheme = useAtomValue(appThemeAtom);
	return (
		<ConfigDialog variants={appTheme} ref={dialogRef}>
			{children}
		</ConfigDialog>
	);
};
