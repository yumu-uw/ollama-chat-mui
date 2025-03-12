import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { Button, IconButton, Stack } from "@mui/material";
import { AddOllamaHostField } from "./AddOllamaHostField";
import { ListOllamaHostField } from "./ListOllamaHostField";

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
};

export const ConfigDialog = ({ dialogRef }: Props) => {
	return (
		<Stack sx={{ width: "100%", alignItems: "flex-start" }} gap={8}>
			<Stack
				direction={"row"}
				sx={{ width: "100%", justifyContent: "flex-end" }}
			>
				<Stack gap={0}>
					<IconButton
						aria-label="close-dialog"
						size="small"
						sx={{ cursor: "pointer" }}
						onClick={() => dialogRef.current?.close()}
					>
						<HighlightOffOutlinedIcon fontSize="medium" />
					</IconButton>
					ESC
				</Stack>
			</Stack>
			<AddOllamaHostField />
			<ListOllamaHostField />
		</Stack>
	);
};
