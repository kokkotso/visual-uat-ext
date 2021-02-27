/*global chrome*/
import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const proxy = "http://localhost:8080";

function App() {
	// grab active tab URL
	const [url, setUrl] = useState("");
	const [width, setWidth] = useState(0);
	const [screenshot, setScreenshot] = useState("");
	const [bugProblem, setBugProblem] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [issueLink, setIssueLink] = useState("");

	function captureScreen() {
		chrome.tabs.captureVisibleTab((dataUrl) => {
			setScreenshot(dataUrl);
		});
	}

	async function handleSubmit() {
		const response = await axios.post(`${proxy}/atlassian/new`, {
			title: bugProblem,
		});
		setIssueLink(response.data.self);
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

	useEffect(() => {
		async function getUser() {
			const _user = await axios.get("http://localhost:8080/atlassian/users");
			console.log("getUser ran");
			setUserEmail(_user.data.emailAddress);
		}
		getUser();
	});

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>The current URL is: {url}</p>
				<p>The window is {width}px wide</p>
				<p>Your JIRA email is {userEmail}</p>
				<h2>Report a Bug</h2>
				<form>
					<input
						id="bugProblem"
						type="text"
						value={bugProblem}
						onChange={(ev) => setBugProblem(ev.target.value)}
					></input>
				</form>
				<button onClick={handleSubmit}>Submit issue</button>
				{issueLink && (
					<p>
						Go to issue: <a href={issueLink}>{issueLink}</a>
					</p>
				)}
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
