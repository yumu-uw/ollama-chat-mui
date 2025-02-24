import { Flex, VStack, styled } from "styled-system/jsx";
import { AddOllamaHostField } from "./AddOllamaHostField";

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
};

export const ConfigDialog = ({ dialogRef }: Props) => {
	return (
		<VStack gap={4} w={"100%"} alignItems={"flex-start"}>
			<Flex w={"100%"} justify={"flex-end"}>
				<VStack gap={0}>
					<styled.button onClick={() => dialogRef.current?.close()}>
						<styled.img
							cursor={"pointer"}
							alt="closeDialog"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2lyY2xlLXgiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PHBhdGggZD0ibTE1IDktNiA2Ii8+PHBhdGggZD0ibTkgOSA2IDYiLz48L3N2Zz4="
						/>
					</styled.button>
					ESC
				</VStack>
			</Flex>
			<AddOllamaHostField dialogRef={dialogRef} />

			{/* <select id="endpoint-select">
				{config?.OllamaEndpoints?.map((endpoint, index) => (
					<option
						key={`endpoint-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						value={endpoint.Endpoint}
					>
						{endpoint.Name}
					</option>
				))}
			</select> */}
		</VStack>
	);
};
