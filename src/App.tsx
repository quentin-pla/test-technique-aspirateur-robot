import React from 'react';
import './assets/styles/App.scss';
import {BrowserRouter, Route} from "react-router-dom";
import {Configuration} from "./components/configuration/Configuration";

export const App = () => {
	return (
		<BrowserRouter>
			<Route exact path={"/test-technique-aspirateur-robot"}>
				<Configuration/>
			</Route>
		</BrowserRouter>
	);
}

export default App;
