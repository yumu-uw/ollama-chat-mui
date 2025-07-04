import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./pages/App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
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
	</StrictMode>,
);
