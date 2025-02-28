import { appThemeAtom } from "@/atom/appThemeAtom";
import { useAtomValue } from "jotai";
import { Container, styled } from "styled-system/jsx";

const StyledConfigDialogWrapper = styled("dialog", {
	base: {
		margin: "auto",
		w: "90vw",
		borderRadius: "md",
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
