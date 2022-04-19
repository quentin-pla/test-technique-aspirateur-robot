import React from 'react';
import './App.scss';
import {BrowserRouter, Route} from "react-router-dom";
import {Configuration} from "./components/configuration/Configuration";

/**
 * Main component
 */
export const App = () => {
	return (
		<BrowserRouter>
			<Route exact path={"/"}>
				<Configuration/>
			</Route>
		</BrowserRouter>
	);
}

export default App;
