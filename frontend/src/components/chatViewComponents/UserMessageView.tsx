import { Box, Paper, Stack, Typography } from "@mui/material";
import { memo } from "react";

type Props = {
	message: string;
};

export const UserMessageView = memo(({ message }: Props) => {
	return (
		<Stack
			direction={"row"}
			sx={{ mx: "0.5em", mb: "1em", justifyContent: "flex-end" }}
		>
			<Box flex={1} />
			<Paper elevation={4} sx={{ padding: "0.5em" }}>
				{message.split(/\r?\n/).map((v, index) => {
					return (
						<Typography
							key={`preinput-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							variant="body1"
							sx={{ fontWeight: 500 }}
						>
							{v}
						</Typography>
					);
				})}
			</Paper>
		</Stack>
	);
});
