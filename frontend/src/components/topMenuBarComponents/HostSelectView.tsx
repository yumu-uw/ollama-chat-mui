import { appThemeAtom } from "@/atom/appThemeAtom";
import { configAtom } from "@/atom/configAtom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { VStack, styled } from "styled-system/jsx";

const EndpointP = styled("p", {
	base: {
		fontSize: "xl",
	},
	variants: {
		variants: {
			light: {
				color: "black",
			},
			dark: {
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

const ModelP = styled("p", {
	base: {
		fontSize: "lg",
	},
	variants: {
		variants: {
			light: {
				color: "black",
			},
			dark: {
				color: "white",
			},
		},
	},
	defaultVariants: {
		variants: "light",
	},
});

export const HostSelectView = () => {
	const appTheme = useAtomValue(appThemeAtom);
	const [config, setConfig] = useAtom(configAtom);

	const [currentEndpointName, setCurrentEndpointName] = useState("");
	const [currentModelName, setCurrentModelName] = useState("");

	useEffect(() => {
		for (const endpoint of config?.OllamaEndpoints || []) {
			if (endpoint.Default) {
				setCurrentEndpointName(endpoint.Name);
			}
			for (const model of endpoint.LLMModels) {
				if (model.Default) {
					setCurrentModelName(model.ModelName);
				}
			}
		}
	}, [config]);

	return (
		<>
			<VStack alignItems={"flex-start"}>
				<EndpointP variants={appTheme}>{currentEndpointName}</EndpointP>
				<ModelP variants={appTheme}>{currentModelName}</ModelP>
			</VStack>
		</>
	);
};
