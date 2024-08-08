import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage';
import BuyingPage from './pages/BuyingPage';
import Events from './pages/Events';
import LoginPage from './pages/Login';
import DashBoard from './pages/DashBoard';
import { Toaster } from 'react-hot-toast';
import SignUp from './pages/SignUp';
import LoadingBar from 'react-top-loading-bar';
import { useState } from 'react';
import ListingPage2 from './components/ListingPage2';
import CollapsibleSidebar from './components/CollapsibleSidebar';
import Navbar1 from './components/NavBar1';


function App() {
	const [progress, setProgress] = useState(0);
	return (
		<>
			<BrowserRouter>
			<CollapsibleSidebar />
				<LoadingBar
					color='#3120e2'
					height={4}
          shadow={true}
					progress={progress}
					onLoaderFinished={() => setProgress(0)}
				/>
				<Navbar1 setProgress={setProgress}/>
				<div className='main'>
					<Toaster />
					<Routes>
						<Route
							path='/listing'
							element={<ListingPage2 setProgress={setProgress} />}
						/>
						<Route
							path='/buy/:id'
							element={<BuyingPage setProgress={setProgress} />}
						/>
						<Route
							path='/details/:id'
							element={<DetailsPage setProgress={setProgress} />}
						/>
						<Route
							path='/'
							element={<Events setProgress={setProgress} />}
						/>
						<Route
							path='/login'
							element={<LoginPage setProgress={setProgress} />}
						/>
						<Route
							path='/dashboard'
							element={<DashBoard setProgress={setProgress} />}
						/>
						<Route
							path='/signup'
							element={<SignUp setProgress={setProgress} />}
						/>
					</Routes>
				</div>
			</BrowserRouter>
		</>
	);
}

export default App;
