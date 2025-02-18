import { createContext, useState } from "react";

type AppThemeContextType = {
	appTheme?: "light" | "dark";
	toggleAppTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextType | null>(null);

type AppThemeProviderProps = {
	defaultTheme?: "light" | "dark";
	children: React.ReactNode;
};
const AppThemeProvider = ({
	defaultTheme = "light",
	children,
}: AppThemeProviderProps) => {
	const [appTheme, setAppTheme] = useState(defaultTheme);

	const toggleAppTheme = () => {
		setAppTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<AppThemeContext value={{ appTheme, toggleAppTheme }}>
			{children}
		</AppThemeContext>
	);
};

export { AppThemeProvider, AppThemeContext };
