import React from 'react';
import './App.scss';
import {BrowserRouter, Route} from "react-router-dom";
import ErrorBoundary from "./services/ErrorBoundary";
import {Configuration} from "./components/configuration/Configuration";

/**
 * Main component
 */
export const App = () => {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<Route exact path={"/"}>
					<Configuration/>
				</Route>
			</BrowserRouter>
		</ErrorBoundary>
	);
}

export default App;
