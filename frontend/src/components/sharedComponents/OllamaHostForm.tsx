import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { configDIalogIsOpenAtom } from "@/atom/configDIalogIsOpenAtom";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Box, VStack, styled } from "styled-system/jsx";
import { GetOllamaModels } from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";
import { z } from "zod";

const DisplayNameScheme = z.string().nonempty();
const OllamaHostScheme = z.string().url();

type Props = {
	onSubmit: (newOllamaEndpoint: model.OllamaEndpoint) => void;
};

export const OllamaHostForm = ({ onSubmit }: Props) => {
	const appTheme = useAtomValue(appThemeAtom);
	const config = useAtomValue(configAtom);
	const configDialogIsOpen = useAtomValue(configDIalogIsOpenAtom);

	const [displayName, setDisplayName] = useState("");
	const [ollamaHost, setOllamaHost] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async () => {
		if (!DisplayNameScheme.safeParse(displayName).success) {
			setErrorMessage("DisplayName can't be empty");
			return;
		}
		if (!OllamaHostScheme.safeParse(ollamaHost).success) {
			setErrorMessage("OllamaHost format is invalid");
			return;
		}

		for (const endpoint of config?.OllamaEndpoints ?? []) {
			if (endpoint.EndpointName === displayName) {
				alert("DisplayName is already registered");
				return;
			}
			if (endpoint.EndpointUrl === ollamaHost) {
				alert("OllamaHost is already registered");
				return;
			}
		}

		const data = await GetOllamaModels(ollamaHost);
		if (data.startsWith("error:")) {
			setErrorMessage(data.replace("error: ", ""));
			return;
		}

		const models: string[] = [];
		data.split(",").map((v) => {
			models.push(v);
		});

		const newOllamaEndpoint: model.OllamaEndpoint = {
			EndpointName: displayName,
			EndpointUrl: ollamaHost,
			LLMModels: models,
			DefaultLLMModel: models.length > 0 ? models[0] : "",
		};

		onSubmit(newOllamaEndpoint);
		setDisplayName("");
		setOllamaHost("");
		setErrorMessage("");
	};

	useEffect(() => {
		if (!configDialogIsOpen) {
			setDisplayName("");
			setOllamaHost("");
			setErrorMessage("");
		}
	}, [configDialogIsOpen]);

	return (
		<>
			<VStack w={"100%"} alignItems={"flex-start"}>
				<label htmlFor={"display-name"}>DisplayName</label>
				<styled.input
					id="display-name"
					type="text"
					p={"0.3em"}
					w={"100%"}
					placeholder="e.g. Ollama localhost"
					border={"1px solid"}
					borderColor={appTheme === "light" ? "black" : "gray.400"}
					borderRadius={"md"}
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
				/>
			</VStack>

			<VStack w={"100%"} alignItems={"flex-start"}>
				<label htmlFor={"endpoint-url"}>OllamaHost</label>
				<styled.input
					id="endpoint-url"
					type="text"
					p={"0.3em"}
					w={"100%"}
					placeholder="e.g. http://localhost:11434"
					border={"1px solid"}
					borderColor={appTheme === "light" ? "black" : "gray.400"}
					borderRadius={"md"}
					value={ollamaHost}
					onChange={(e) => setOllamaHost(e.target.value)}
				/>
			</VStack>

			<Box w={"100%"} textAlign={"center"}>
				<styled.button
					cursor={"pointer"}
					p={"0.5em"}
					border={"1px solid"}
					borderColor={appTheme === "light" ? "black" : "gray.400"}
					borderRadius={"md"}
					onClick={handleSubmit}
				>
					Add Ollama Host
				</styled.button>
				{errorMessage && <styled.p color={"red"}>{errorMessage}</styled.p>}
			</Box>
		</>
	);
};
