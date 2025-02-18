import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppThemeProvider } from "./context/AppTheme";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AppThemeProvider defaultTheme="light">
			<App />
		</AppThemeProvider>
	</StrictMode>,
);
