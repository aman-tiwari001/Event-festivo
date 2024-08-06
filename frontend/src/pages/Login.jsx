import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { server_url } from '../config';

function LoginPage({ setProgress }) {
	const [username, setUsername] = useState('');
	const [secretKey, setSecretKey] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		if (username.trim() === '') {
			setError('Required Field');
			return; // Early return to prevent further execution
		}
		if (secretKey.trim() === '') {
			setError('Required Field');
			return; // Early return to prevent further execution
		}
		setError(''); // Clear error if both fields are valid

		try {
			setProgress(30);
			const resp = await axios.post(`${server_url}/auth/login`, {
				username,
				secret_key: secretKey,
			});
			setProgress(60);
			localStorage.setItem('access_token', resp.data.access_token);
			localStorage.setItem('public_address', resp.data.result.public_address);
			navigate('/');
			toast.success('Welcome to EventÓfestivo 🎉');
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.error);
			setError('Login failed. Please try again.'); // Set error for failed login
			setProgress(100);
		}
	};

	const handleWalletConnect = async () => {
		setProgress(40);
		let public_address = '';
		if (!window.diam) {
			toast.error('Please install Diam Wallet extension.');
			return;
		}
		window.diam
			.connect()
			.then((result) => {
				toast.success(`Wallet connected succesfully`);
				public_address = result.message[0];
				localStorage.setItem('public_address', public_address);
				navigate(`/signup?public_address=${public_address}`);
			})
			.catch((error) => console.error(`Error: ${error}`));
	};

	useEffect(() => setProgress(100), []);

	return (
		<div className='relative h-[100vh] w-screen flex items-center justify-center'>
			<video
				autoPlay
				loop
				muted
				className='absolute top-0 left-0 w-full h-full object-cover'
			>
				<source src='/login_bg.mp4' type='video/mp4' />
			</video>
			<div className='absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-[#00000032]'></div>
			<div className='relative z-10 bg-[#0000009e] backdrop-blur-lg border-[1px] border-slate-700 p-8 rounded-lg shadow-md w-[90%] max-w-md'>
				<h2 className='text-2xl font-bold mb-4 text-white text-center'>
					Welcome to <span className='text-[#7065F0]'>EventÓfestivo</span>
				</h2>
				<form onSubmit={handleLogin}>
					<div className='mb-4 mt-4'>
						<label
							htmlFor='username'
							className='block text-sm font-medium text-white'
						>
							Username
						</label>
						<input
							type='text'
							id='username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<div className='mb-4 mt-4'>
						<label
							htmlFor='secret_key'
							className='block text-sm font-medium text-white'
						>
							Secret Key
						</label>
						<input
							type='text'
							id='secret_key' // Ensure the id is correct
							value={secretKey}
							onChange={(e) => setSecretKey(e.target.value)}
							className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>

					{error && <p className='mt-2 text-sm text-red-600'>{error}</p>}

					<button
						type='submit'
						className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-4'
					>
						Login
					</button>
					<p className='text-white'>
						Not a user?{' '}
						<Link to='/signup'>
							<span className='text-indigo-700'>Sign Up</span>
						</Link>
					</p>
				</form>
				<hr className='bg-gray-900 my-3' />
				<p className='text-center text-white'>OR</p>
				<button
					className='
					w-full
					py-2
					px-4
					border
					border-transparent
					rounded-md
					shadow-sm
					text-md
					font-medium
					text-white
					bg-green-600
					hover:bg-green-700
					focus:outline-none
					focus:ring-2
					focus:ring-offset-2
					focus:ring-indigo-500
					my-4'
					onClick={handleWalletConnect}
				>
					Connect Diam Wallet
				</button>
			</div>
		</div>
	);
}

export default LoginPage;
