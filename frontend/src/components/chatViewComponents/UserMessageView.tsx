import { Box, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";

const RainbowBox = styled(Paper)`
  @property --angle {
	syntax: "<angle>";
	initial-value: 0deg;
	inherits: false;
  }
  @keyframes rotate {
	from {
	  --angle: 360deg;
	}
	to {
	  --angle: 0deg;
	}
  }
  border-bottom: 2px solid transparent;
  border-image: conic-gradient(
	from var(--angle),
	#ff5e62 0%,
	#ff9966 10%,
	#f9d423 20%,
	#a8e063 30%,
	#43cea2 40%,
	#1976d2 50%,
	#6a82fb 60%,
	#9d50bb 70%,
	#ff5e62 80%
  ) 1;
  animation: rotate 2s linear infinite;
`;

type Props = {
	message: string;
	imgBase64?: string;
	loading?: boolean;
};

export const UserMessageView = memo(({ message, imgBase64, loading }: Props) => {
	const CustomBox = loading ? RainbowBox : Paper;

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
				<CustomBox elevation={0} sx={{ padding: "0.5em", bgcolor: "grey.300" }}>
					{message.split(/\r?\n/).map((v, index) => {
						return (
							<Typography
								key={`preinput-${
									// biome-ignore lint/suspicious/noArrayIndexKey: using index as key is acceptable here
									index
								}`}
								variant="body1"
								sx={{ fontWeight: 400, fontSize: "0.9em" }}
							>
								{v}
							</Typography>
						);
					})}
				</CustomBox>
			</Stack>
		</Stack>
	);
});
