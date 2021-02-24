/*global chrome*/
import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
	// grab active tab URL
	const [url, setUrl] = useState("");
	const [width, setWidth] = useState(0);

	/**
	 * Get current URL
	 */
	useEffect(() => {
		const queryInfo = { active: true, lastFocusedWindow: true };

		chrome.tabs &&
			chrome.tabs.query(queryInfo, (tabs) => {
				console.log(tabs);
				const url = tabs[0].url;
				setUrl(url);
			});

		chrome.windows &&
			chrome.windows.getLastFocused({}, (window) => {
				console.log(window);
				setWidth(window.width);
			});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<p>The current URL is: {url}</p>
				<p>The window is {width}px wide</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
