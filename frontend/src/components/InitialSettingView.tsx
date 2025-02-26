import { configAtom } from "@/atom/configAtom";
import { currentOllamaHostAtom } from "@/atom/currentOllamaHostAtom";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { VStack, styled } from "styled-system/jsx";
import {
	UpdateDefaultOllamaEndPointName,
	UpdateOllamaEndpoints,
} from "wailsjs/go/main/App";
import { OllamaHostForm } from "./sharedComponents/OllamaHostForm";
import type { model } from "wailsjs/go/models";
import { deepCopyObject } from "@/lib/util";

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
};

export const InitialSettingView = ({ dialogRef }: Props) => {
	const [config, setConfig] = useAtom(configAtom);
	const setCurrentOllamaHost = useSetAtom(currentOllamaHostAtom);
	const [errorMessage, setErrorMessage] = useState("");

	const handleInitSetting = async (newOllamaEndpoint: model.OllamaEndpoint) => {
		const newConfig = deepCopyObject(config);
		if (!newConfig) {
			setErrorMessage("Config is undefined");
			return;
		}
		newConfig.OllamaEndpoints.push(newOllamaEndpoint);
		newConfig.DefaultOllamaEndPointName = newOllamaEndpoint.EndpointName;

		setConfig(newConfig);
		await UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
		await UpdateDefaultOllamaEndPointName(newOllamaEndpoint.EndpointName);
		if (newConfig.OllamaEndpoints.length === 1) {
			setCurrentOllamaHost({
				DisplayName: newOllamaEndpoint.EndpointName,
				Endpoint: newOllamaEndpoint.EndpointUrl,
				ModelName: newOllamaEndpoint.DefaultLLMModel,
			});
			dialogRef.current?.close();
		}
	};

	return (
		<VStack
			p={"1em"}
			w={"100%"}
			h={"100%"}
			alignItems={"flex-start"}
			border={"1px solid black"}
			borderRadius={"2xl"}
		>
			<styled.h2 fontSize={"2xl"} fontWeight={"extrabold"} pb={"1em"}>
				Add First Ollama Host
			</styled.h2>
			<OllamaHostForm onSubmit={handleInitSetting} />
			{errorMessage && <styled.p color={"red"}>{errorMessage}</styled.p>}
		</VStack>
	);
};
