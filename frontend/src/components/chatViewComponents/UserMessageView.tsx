import { Box, Paper, Stack, Typography } from "@mui/material";
import { memo } from "react";

type Props = {
	message: string;
	imgBase64?: string;
};

export const UserMessageView = memo(({ message, imgBase64 }: Props) => {
	return (
		<Stack
			direction={"row"}
			sx={{ mx: "0.5em", mb: "1em", justifyContent: "flex-end" }}
		>
			<Box flex={1} />
			<Stack direction={"column"} gap={2}>
				{imgBase64 && (
					<img
						src={`data:image/png;base64,${imgBase64}`}
						width={"400px"}
						alt="User uploaded"
					/>
				)}
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
		</Stack>
	);
});
