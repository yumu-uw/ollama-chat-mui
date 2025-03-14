import { Box, Button, Fade, Popper } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

type Props = {
	baseRef: React.RefObject<HTMLDivElement | null>;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	data: string[];
	handleSelectAction: (select: string) => void;
};

export const TooltipView = ({
	baseRef,
	isOpen,
	setIsOpen,
	data,
	handleSelectAction,
}: Props) => {
	const tooltipRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				baseRef.current?.contains(event.target as Node) ||
				tooltipRef.current?.contains(event.target as Node)
			) {
				return;
			}
			setIsOpen(false);
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			{isOpen && (
				<Box
					ref={tooltipRef}
					sx={{
						position: "absolute",
						borderRadius: 1,
						boxShadow: 24,
						zIndex: 10,
						maxWidth: "600px",
						whiteSpace: "pre",
						color: "black",
						backgroundColor: "white",
					}}
				>
					{data.map((v) => (
						<Box key={`tooltip-${v}`}>
							<Button
								sx={{
									w: "100%",
									py: "0.5em",
									px: "1em",
									cursor: "pointer",
									textAlign: "left",
								}}
								onClick={() => {
									handleSelectAction(v);
									setIsOpen(false);
								}}
							>
								{v}
							</Button>
						</Box>
					))}
				</Box>
			)}
		</>
	);
};
