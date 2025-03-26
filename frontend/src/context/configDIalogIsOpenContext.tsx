import type React from "react";
import { type ReactNode, createContext, useState } from "react";

// Define the type for the context value
interface ConfigDialogIsOpenContextType {
	configDialogIsOpen: boolean;
	setConfigDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with default values
const ConfigDialogIsOpenContext =
	createContext<ConfigDialogIsOpenContextType | null>(null);

const ConfigDialogIsOpenProvider = ({ children }: { children: ReactNode }) => {
	const [configDialogIsOpen, setConfigDialogIsOpen] = useState(false);

	return (
		<ConfigDialogIsOpenContext
			value={{ configDialogIsOpen, setConfigDialogIsOpen }}
		>
			{children}
		</ConfigDialogIsOpenContext>
	);
};

export { ConfigDialogIsOpenContext, ConfigDialogIsOpenProvider };
