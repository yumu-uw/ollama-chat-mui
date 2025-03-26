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
import { ConfigDialogIsOpenProvider } from "./context/configDIalogIsOpenContext";
import { CurrentOllamaHostProvider } from "./context/currentOllamaHostContext";
import { App2 } from "./pages/App2";

ScreenGetAll().then((data) => {
	for (const screen of data) {
		if (screen.isCurrent) {
			WindowSetSize(1024, screen.height * 0.8);
		}
	}
});

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ConfigDialogIsOpenProvider>
			<CurrentOllamaHostProvider>
				<HashRouter>
					<Routes>
						<Route element={<RootLayout />}>
							<Route index element={<App />} />
							<Route path="app2" element={<App2 />} />
						</Route>
					</Routes>
				</HashRouter>
			</CurrentOllamaHostProvider>
		</ConfigDialogIsOpenProvider>
	</StrictMode>,
);
