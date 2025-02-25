import { configAtom } from "@/atom/configAtom";
import { deepCopyObject } from "@/lib/util";
import { useAtom } from "jotai";
import { Trash2 } from "lucide-react";
import { Box, VStack, styled } from "styled-system/jsx";
import { UpdateOllamaEndpoints } from "wailsjs/go/main/App";

export const ListOllamaHostField = () => {
	const [config, setConfig] = useAtom(configAtom);

	const handleDeleteOllamaHost = (index: number) => {
		const newConfig = deepCopyObject(config);
		newConfig?.OllamaEndpoints.splice(index, 1);
		setConfig(newConfig);
		UpdateOllamaEndpoints(newConfig?.OllamaEndpoints || []);
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
				List Ollama Host
			</styled.h2>

			<Box overflowX="auto" w="100%">
				<Box maxHeight="600px" overflowY="auto">
					<styled.table
						border="1px solid gray"
						borderCollapse="collapse"
						width="100%"
						textAlign="left"
					>
						<styled.thead bg="gray.200">
							<styled.tr>
								<styled.th border="1px solid gray" px="4" py="2">
									DisplayName
								</styled.th>
								<styled.th border="1px solid gray" px="4" py="2">
									OllamaHostURL
								</styled.th>
								<styled.th border="1px solid gray" px="4" py="2" />
							</styled.tr>
						</styled.thead>

						<tbody>
							{config?.OllamaEndpoints.map((v, i) => {
								return (
									<tr key={`hostlist-${v.EndpointName}`}>
										<styled.td border="1px solid gray" px="4" py="2">
											{v.EndpointName}
										</styled.td>
										<styled.td border="1px solid gray" px="4" py="2">
											{v.EndpointUrl}
										</styled.td>
										<styled.td
											textAlign="center"
											border="1px solid gray"
											px="4"
											py="2"
										>
											<styled.button onClick={() => handleDeleteOllamaHost(i)}>
												<Trash2 color="black" />
											</styled.button>
										</styled.td>
									</tr>
								);
							})}
						</tbody>
					</styled.table>
				</Box>
			</Box>
		</VStack>
	);
};
