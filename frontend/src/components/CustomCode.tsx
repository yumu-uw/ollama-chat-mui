// import CopyToClipboard from "react-copy-to-clipboard";
import { supportLangs } from "@/lib/custom-highlight";
// import { CopyIcon } from "@chakra-ui/icons";
// import { Badge, Box, IconButton, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { Box } from "styled-system/jsx";

interface Props {
	classAttr: string | undefined;
	value: React.ReactNode;
}

export default function CustomCode({ classAttr, value }: Props) {
	const [showCopyToClipboard, setShowCopyToClipboard] = useState(false);
	// const [tooltipIsDisabled, setTooltipIsDisabled] = useState<boolean>(true);
	// const [tooltipIsOpen, setTooltipIsOpen] = useState<boolean>(false);

	const onCopyHandler = () => {
		// setTooltipIsDisabled(false);
		// setTooltipIsOpen(true);
		// setTimeout(function () {
		// 	setTooltipIsDisabled(true);
		// 	setTooltipIsOpen(false);
		// }, 1000);
	};

	const classNames =
		classAttr !== undefined ? classAttr.split(":") : ["nohighlight", undefined];
	const lang = supportLangs[classNames[0] as string]
		? classNames[0]
		: "language-plaintext";
	if (classNames[0] === "nohighlight") {
		return <code className={classNames[0]}>{value}</code>;
	}
	return (
		<Box
			position="relative"
			// onMouseEnter={() => setShowCopyToClipboard(true)}
			// onMouseLeave={() => setShowCopyToClipboard(false)}
		>
			{/* {fileName !== undefined && (
				<Badge h="100%" py="0.3em" px="0.5em" backgroundColor="gray.400">
					{fileName}
				</Badge>
			)} */}
			{/* {showCopyToClipboard && (
				<CopyToClipboard
					text={value?.toString() as string}
					onCopy={() => {
						onCopyHandler();
					}}
				>
					<IconButton
						position="absolute"
						right="6px"
						variant="outline"
						colorScheme="teal"
						aria-label="Copy Code"
						size="sm"
						mt="6px"
						mr="6px"
						icon={
							<Tooltip
								label="Copied!"
								isDisabled={tooltipIsDisabled}
								isOpen={tooltipIsOpen}
							>
								<CopyIcon />
							</Tooltip>
						}
					/>
				</CopyToClipboard>
			)} */}
			<code className={lang}>{value}</code>
		</Box>
	);
}
