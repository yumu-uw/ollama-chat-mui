import { appThemeAtom } from "@/atom/appThemeAtom";
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

// export const TooltipView = ({
// 	baseRef,
// 	isOpen,
// 	setIsOpen,
// 	data,
// 	handleSelectAction,
// }: Props) => {
// 	const [position, setPosition] = useState({ top: 0, left: 0 });

// 	const appTheme = useAtomValue(appThemeAtom);

// 	const tooltipRef = useRef<HTMLDivElement>(null);

// 	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
// 	useEffect(() => {
// 		if (!baseRef.current) return;
// 		const rect = baseRef.current.getBoundingClientRect();
// 		setPosition({
// 			top: rect.bottom + window.scrollY + 8,
// 			left: rect.left + window.scrollX + rect.width / 2,
// 		});
// 	}, []);

// 	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
// 	useEffect(() => {
// 		if (!isOpen) return;

// 		const handleClickOutside = (event: MouseEvent) => {
// 			if (
// 				baseRef.current?.contains(event.target as Node) ||
// 				tooltipRef.current?.contains(event.target as Node)
// 			) {
// 				return;
// 			}
// 			setIsOpen(false);
// 		};

// 		document.addEventListener("click", handleClickOutside);

// 		return () => {
// 			document.removeEventListener("click", handleClickOutside);
// 		};
// 	}, [isOpen]);

// 	return (
// 		<>
// 			{isOpen && (
// 				<Box
// 					ref={tooltipRef}
// 					sx={{
// 						top: `${position.top}px`,
// 						left: `${position.left}px`,
// 						position: "absolute",
// 						rounded: "md",
// 						boxShadow: "2xl",
// 						zIndex: "10",
// 						maxWidth: "600px",
// 						whiteSpace: "pre",
// 						color: "black",
// 						bg: "white",
// 					}}
// 				>
// 					{data.map((v) => (
// 						<Box key={`tooltip-${v}`}>
// 							<Button
// 								sx={{
// 									w: "100%",
// 									py: "0.5em",
// 									px: "1em",
// 									cursor: "pointer",
// 									textAlign: "left",
// 								}}
// 								onClick={() => {
// 									handleSelectAction(v);
// 									setIsOpen(false);
// 								}}
// 							>
// 								{v}
// 							</Button>
// 						</Box>
// 					))}
// 				</Box>
// 			)}
// 		</>
// 	);
// };

export const TooltipView = ({
	baseRef,
	isOpen,
	setIsOpen,
	data,
	handleSelectAction,
}: Props) => {
	const appTheme = useAtomValue(appThemeAtom);

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
