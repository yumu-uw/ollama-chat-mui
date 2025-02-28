import { CircleX } from "lucide-react";
import { Flex, VStack, styled } from "styled-system/jsx";
import { AddOllamaHostField } from "./AddOllamaHostField";
import { ListOllamaHostField } from "./ListOllamaHostField";

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
};

export const ConfigDialog = ({ dialogRef }: Props) => {
	return (
		<VStack gap={8} w={"100%"} alignItems={"flex-start"}>
			<Flex w={"100%"} justify={"flex-end"}>
				<VStack gap={0}>
					<styled.button
						onClick={() => {
							dialogRef.current?.close();
						}}
					>
						<CircleX cursor="pointer" />
					</styled.button>
					ESC
				</VStack>
			</Flex>
			<AddOllamaHostField />
			<ListOllamaHostField />
		</VStack>
	);
};
