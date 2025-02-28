import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { OllamaHostForm } from "@/components/sharedComponents/OllamaHostForm";
import { deepCopyObject } from "@/lib/util";
import { useAtom, useAtomValue } from "jotai";
import { VStack, styled } from "styled-system/jsx";
import { UpdateOllamaEndpoints } from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";

export const AddOllamaHostField = () => {
	const appTheme = useAtomValue(appThemeAtom);
	const [config, setConfig] = useAtom(configAtom);

	const handleAddOllamaHost = async (
		newOllamaEndpoint: model.OllamaEndpoint,
	) => {
		const newConfig = deepCopyObject(config);
		newConfig?.OllamaEndpoints.push(newOllamaEndpoint);
		if (newConfig?.OllamaEndpoints.length === 1) {
			newConfig.DefaultOllamaEndPointName = newOllamaEndpoint.EndpointName;
		}
		setConfig(newConfig);
		await UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
	};

	return (
		<VStack
			p={"1em"}
			w={"100%"}
			alignItems={"flex-start"}
			border={"1px solid"}
			borderColor={appTheme === "light" ? "black" : "gray.400"}
			borderRadius={"2xl"}
		>
			<styled.h2 fontSize={"2xl"} fontWeight={"extrabold"} pb={"1em"}>
				Add Ollama Host
			</styled.h2>
			<OllamaHostForm onSubmit={handleAddOllamaHost} />
		</VStack>
	);
};
