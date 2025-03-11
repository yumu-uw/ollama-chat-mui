import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { HashRouter, Route, Routes } from "react-router";
import { App2 } from "./App2";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path="app2" element={<App2 />} />
			</Routes>
		</HashRouter>
	</StrictMode>,
);
