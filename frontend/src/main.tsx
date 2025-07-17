import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./pages/App";
import "@fontsource/noto-sans-jp/300.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router";
import { ScreenGetAll, WindowSetSize } from "wailsjs/runtime/runtime";
import { RootLayout } from "./components/sharedComponents/RootLayout";
import { ConfigProvider } from "./context/configContext";
import { ConfigDialogIsOpenProvider } from "./context/configDIalogIsOpenContext";
import { CurrentOllamaHostProvider } from "./context/currentOllamaHostContext";

ScreenGetAll().then((data) => {
	for (const screen of data) {
		if (screen.isCurrent) {
			WindowSetSize(1024, screen.height * 0.6);
		}
	}
});

const theme = createTheme({
	typography: {
		fontFamily: [
			"Noto Sans",
			"Noto Sans JP",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Arial",
			"sans-serif",
		].join(","),
	},
});

// biome-ignore lint/style/noNonNullAssertion: usage of non-null assertion is safe here
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<ConfigProvider>
				<ConfigDialogIsOpenProvider>
					<CurrentOllamaHostProvider>
						<HashRouter>
							<Routes>
								<Route element={<RootLayout />}>
									<Route index element={<App />} />
								</Route>
							</Routes>
						</HashRouter>
					</CurrentOllamaHostProvider>
				</ConfigDialogIsOpenProvider>
			</ConfigProvider>
		</ThemeProvider>
	</StrictMode>,
);
