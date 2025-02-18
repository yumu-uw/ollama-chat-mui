import { AppThemeContext } from "@/context/AppTheme";
import { memo, use } from "react";
import { Box, Flex, styled } from "styled-system/jsx";

const UserMsgBox = styled(Box, {
	base: { p: "0.5em", my: "1em", borderRadius: "md" },
	variants: {
		variants: {
			light: {
				bg: "gray.200",
			},
			dark: {
				bg: "gray.600",
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

type Props = {
	message: string;
};

export const UserMessageView = memo(({ message }: Props) => {
	const context = use(AppThemeContext);
	if (!context) {
		throw new Error("Header must be used within a ThemeProvider");
	}
	const { appTheme } = context;
	return (
		<Flex justify={"flex-end"}>
			<UserMsgBox variants={appTheme}>
				{message.split(/\r?\n/).map((v, index) => {
					return (
						<styled.p
							key={`preinput-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							fontWeight={600}
						>
							{v}
						</styled.p>
					);
				})}
			</UserMsgBox>
		</Flex>
	);
});
