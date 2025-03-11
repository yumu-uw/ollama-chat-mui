import { useEffect } from "react";
import { Link } from "react-router";

export const App2 = () => {
	useEffect(() => {
		console.log("App2");
	});
	return (
		<div>
			<h1>App2</h1>
			<p>huga</p>
			<Link to="/">App Page</Link>
		</div>
	);
};
