/*global chrome*/
import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const proxy = "http://localhost:8080";

function App() {
	const [url, setUrl] = useState("");
	const [width, setWidth] = useState(0);
	const [screenshot, setScreenshot] = useState("");
	const [summary, setSummary] = useState("");
	const [description, setDescription] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [issueLink, setIssueLink] = useState("");

	// Take screenshot
	function captureScreen() {
		chrome.tabs.captureVisibleTab((dataUrl) => {
			setScreenshot(dataUrl);
		});
	}

	// Submit ticket
	async function handleSubmit() {
		const response = await axios.post(`${proxy}/atlassian/new`, {
			summary: summary,
			description: description,
			url: url,
			screenWidth: width,
		});
		setIssueLink(response.data.self);
	}

	// Get data about tab & window
	useEffect(() => {
		const queryInfo = { active: true, lastFocusedWindow: true };

		// Get current URL
		chrome.tabs &&
			chrome.tabs.query(queryInfo, (tabs) => {
				console.log(tabs);
				const url = tabs[0].url;
				setUrl(url);
			});

		// Get window width
		chrome.windows &&
			chrome.windows.getLastFocused({}, (window) => {
				console.log(window);
				setWidth(window.width);
			});
	}, []);

	// Get user info from JIRA
	useEffect(() => {
		async function getUser() {
			const _user = await axios.get(`${proxy}/atlassian/user`);
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
				<p>Testing issues as JIRA user {userEmail}</p>
				<h2>Report a Bug</h2>
				<form>
					<input
						id="summary"
						type="text"
						value={summary}
						onChange={(ev) => setSummary(ev.target.value)}
					></input>
					<input
						id="description"
						type="text"
						value={description}
						onChange={(ev) => setDescription(ev.target.value)}
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
