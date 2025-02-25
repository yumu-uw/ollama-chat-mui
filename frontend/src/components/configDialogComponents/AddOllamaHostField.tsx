import { configAtom } from "@/atom/configAtom";
import { deepCopyObject } from "@/lib/util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Box, VStack, styled } from "styled-system/jsx";
import { GetOllamaModels, UpdateOllamaEndpoints } from "wailsjs/go/main/App";
import type { model } from "wailsjs/go/models";
import { z } from "zod";

const DisplayNameScheme = z.string().min(1);
const OllamaHostScheme = z.string().url();

type Props = {
	dialogRef: React.RefObject<HTMLDialogElement | null>;
};

export const AddOllamaHostField = ({ dialogRef }: Props) => {
	const [config, setConfig] = useAtom(configAtom);

	const [displayName, setDisplayName] = useState("");
	const [ollamaHost, setOllamaHost] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const dialog = dialogRef.current;
		const handleCancel = () => {
			setDisplayName("");
			setOllamaHost("");
		};

		dialog?.addEventListener("close", handleCancel);
		return () => {
			dialog?.removeEventListener("close", handleCancel);
		};
	}, []);

	const callGetOllamaModelsApi = async () => {
		if (!DisplayNameScheme.safeParse(displayName).success) {
			alert("DisplayName can't empty");
			return;
		}
		if (!OllamaHostScheme.safeParse(ollamaHost).success) {
			alert("OllamaHost format is invalid");
			return;
		}

		// for (const endpoint of config?.OllamaEndpoints ?? []) {
		// 	if (endpoint.EndpointName === displayName) {
		// 		alert("DisplayName is already registered");
		// 		return;
		// 	}
		// 	if (endpoint.EndpointUrl === ollamaHost) {
		// 		alert("OllamaHost is already registered");
		// 		return;
		// 	}
		// }

		GetOllamaModels(ollamaHost).then((data: string) => {
			if (data.startsWith("error:")) {
				alert(data);
				return;
			}

			const models: string[] = [];
			data.split(",").map((v, i) => {
				models.push(v);
			});

			const newOllamaEndpoint: model.OllamaEndpoint = {
				EndpointName: displayName,
				EndpointUrl: ollamaHost,
				LLMModels: models,
				DefaultLLMModel: models.length > 0 ? models[0] : "",
			};

			const newConfig = deepCopyObject(config);
			newConfig?.OllamaEndpoints.push(newOllamaEndpoint);
			setConfig(newConfig);
			UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
			setDisplayName("");
			setOllamaHost("");
		});
	};

	return (
		<VStack
			p={"1em"}
			w={"100%"}
			alignItems={"flex-start"}
			border={"1px solid black"}
			borderRadius={"2xl"}
		>
			<styled.h2 fontSize={"2xl"} fontWeight={"extrabold"} pb={"1em"}>
				Add Ollama Host
			</styled.h2>
			<VStack w={"100%"} alignItems={"flex-start"}>
				<label htmlFor={"display-name"}>DisplayName</label>
				<styled.input
					id="display-name"
					type="text"
					p={"0.3em"}
					w={"100%"}
					placeholder="e.g. Ollama localhost"
					border={"1px solid black"}
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
					border={"1px solid black"}
					borderRadius={"md"}
					value={ollamaHost}
					onChange={(e) => setOllamaHost(e.target.value)}
				/>
			</VStack>

			<Box w={"100%"} textAlign={"center"}>
				<styled.button
					cursor={"pointer"}
					p={"0.5em"}
					border={"1px solid black"}
					borderRadius={"md"}
					onClick={callGetOllamaModelsApi}
				>
					Add Ollama Host
				</styled.button>
			</Box>
		</VStack>
	);
};
