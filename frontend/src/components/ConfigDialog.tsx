import { configAtom } from "@/atom/configAtom";
import { useAtom } from "jotai";
import { VStack } from "styled-system/jsx";

export const ConfigDialog = () => {
	const [config, setConfig] = useAtom(configAtom);
	return (
		<VStack gap={2}>
			<label htmlFor={"endpoint-select"}>OllamaHost : </label>
			<select id="endpoint-select">
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
			</select>
		</VStack>
	);
};
