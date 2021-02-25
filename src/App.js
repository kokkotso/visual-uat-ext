/*global chrome*/
import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
	// grab active tab URL
	const [url, setUrl] = useState("");
	const [width, setWidth] = useState(0);
	const [screenshot, setScreenshot] = useState("");
	const [bugProblem, setBugProblem] = useState("");

	function captureScreen() {
		chrome.tabs.captureVisibleTab((dataUrl) => {
			setScreenshot(dataUrl);
		});
	}

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
				<p>The current URL is: {url}</p>
				<p>The window is {width}px wide</p>
				<h2>Report a Bug</h2>
				<form>
					<label for="bugProblem">Describe problem:</label>
					<input
						id="bugProblem"
						type="text"
						value={bugProblem}
						onChange={(ev) => setBugProblem(ev.target.value)}
					></input>
				</form>

				<button onClick={captureScreen}>Take Screenshot</button>
				{screenshot && (
					<div>
						<h2>Preview</h2>
						<img alt="screenshot" src={screenshot} />
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
