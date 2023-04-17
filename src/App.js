import React, { Component, Suspense } from 'react';
import 'rsuite/dist/rsuite.min.css'
import './assets/styles/utilities/_variables.scss'
const host = hostChecker();
import(`./assets/styles/brand/${host}.css`);
import './assets/styles/main.scss'
import { Provider } from 'react-redux';
import giveMeStore from './store';
import Init from './main';
import Loader from './components/loader';
import AppErrorBoundary from "./components/AppErrorBoundary";
import { withTranslation } from 'react-i18next';
import {Helmet} from "react-helmet";
import 'moment/locale/fr';
import 'moment/locale/en-gb';
import {hostChecker, hostName} from "utils";
import moment from "moment";
import {getLanguage} from "utils/localStorage";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";


function getFaviconEl() {
	return document.getElementById("favicon");
}

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			fav : hostChecker()
		}
	}

	componentDidMount() {
		let lng = getLanguage();
		moment.locale(lng);
	}

	render() {
		if (module.hot) {
			// Accept hot update
			module.hot.accept();
		}
		window.addEventListener('error', e => {
			if (/Loading chunk [\d]+ failed/.test(e.message)) {
				window.location.reload();
			}
		});
		const { t } = this.props;
		return (
			<AppErrorBoundary store={giveMeStore()}>
				<Provider store={giveMeStore()}>
					<div className='App'>
						<Helmet>
							<meta charSet="utf-8" />
							<title>{hostName()} - {t('Merchant Dashboard')}</title>
						</Helmet>
						<main>
							<Suspense fallback={
								<Loader/>
							}>
								<Init />
							</Suspense>
						</main>
					</div>
				</Provider>
			</AppErrorBoundary>
		);
	}
}

export default withTranslation()(App);

