import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { server_url } from '../config';

function SignUp({setProgress}) {
	const [searchQuery] = useSearchParams();
	const public_address = searchQuery.get('public_address');
	const [username, setUsername] = useState(public_address || '');
	const [location, setLocation] = useState({
		address: '',
		city: '',
		state: '',
		country: 'India',
	});
	const [error, setError] = useState('');
	const [secretKey, setSecretKey] = useState('<Your-Secret-Key>');
	const [showSecretKey, setShowSecretKey] = useState(false);
	const navigate = useNavigate();

	const countries = [
		'India',
		'USA',
		'UK',
		'Russia',
		'Germany',
		'Canada',
		'Japan',
	];

	const cities = {
		India: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
		USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
		UK: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool'],
		Russia: [
			'Moscow',
			'Saint Petersburg',
			'Novosibirsk',
			'Yekaterinburg',
			'Kazan',
		],
		Germany: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
		Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton'],
		Japan: ['Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka'],
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		if (username.trim() === '') {
			setError('Required field');
			return;
		} else if (location.address.trim() === '') {
			setError('Required field');
			return;
		}

		setError('');
		console.log('Signing up with username:', username);

		try {
			setProgress(26);
			const resp = await axios.post(`${server_url}/auth/signup`, {
				username,
				location,
			});
			setSecretKey(resp.data.result.secret_key);
			localStorage.setItem('access_token', resp.data.access_token);
			localStorage.setItem('public_address', resp.data.result.public_address);
			setProgress(60);
			setShowSecretKey(true);
			toast.success('Welcome to EventÓfestivo 🎉');
			console.log(resp.data);
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.error)
			setProgress(100);
		}
	};

	return (
		<div className='relative h-[100vh] w-screen flex items-center justify-center'>
			{showSecretKey && (
				<div className='text-black absolute top-[30vh] right-[30.2vw] border-2 border-black bg-white p-4 rounded-xl z-30'>
					<h1 className='text-3xl'>Secret Key</h1>
					<p>
						{secretKey}{' '}
						<BiCopy
							onClick={() => {
								navigator.clipboard.writeText(secretKey);
								toast('Copied to clipboard!', {
									style: {
										background: '#7065F0',
										color: 'white',
									},
								});
							}}
							className='cursor-pointer'
							size={27}
						/>{' '}
					</p>
					<p>
						Note: Copy and save this secret key, you will need it for next
						login!
					</p>
					<p>❌ Don't share it with anyone!</p>
					<div className='mx-auto text-right my-2'>
						<button
							onClick={() => {
								navigate('/');
								toast.success('Welcome to EventÓfestivo 🎉');
							}}
							className='btn btn-primary'
						>
							Okay
						</button>
					</div>
				</div>
			)}
			<video
				autoPlay
				loop
				muted
				className='absolute top-0 left-0 w-full h-full object-cover'
			>
				<source src='/login_bg.mp4' type='video/mp4' />
			</video>
			<div className='absolute top-0 left-0 w-full h-full bg-[#00000070]'></div>
			<div className='relative z-10 bg-white p-8 rounded-lg shadow-md w-[40%] max-md:w-[90%]'>
				<h2 className='text-2xl font-bold text-black text-center mx-auto flex justify-center items-center'>
					<p> Welcome to</p>
					<img src='/dslogo.png' width={110} alt='' />
					<p className='text-[#7065F0]'>EventÓfestivo</p>
				</h2>
				<form onSubmit={handleSignUp}>
					<div>
						<label htmlFor='username' className='text-black'>
							Username
						</label>
						<input
							type='text'
							id='username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm input-primary'
						/>
						{error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
					</div>

					<label className='my-4'>
						<span className='text-black'>Country</span>
						<select
							onChange={(e) =>
								setLocation({ ...location, country: e.target.value })
							}
							name='country'
							className='select select-primary w-full'
						>
							{countries.map((country) => (
								<option value={country} key={country}>
									{country}
								</option>
							))}
						</select>
					</label>

					<label className='my-4'>
						<span className='text-black'>City</span>
						<select
							onChange={(e) =>
								setLocation({ ...location, city: e.target.value })
							}
							name='city'
							className='select select-primary w-full'
						>
							<option>Select City</option>
							{cities[location.country].map((city) => (
								<option value={city} key={city}>
									{city}
								</option>
							))}
						</select>
					</label>

					<label htmlFor='address' className='text-black mt-2'>
						Residential Address
					</label>
					<input
						type='text'
						id='address'
						value={location.address}
						onChange={(e) =>
							setLocation({ ...location, address: e.target.value })
						}
						className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
					{error && <p className='mt-2 text-sm text-red-600'>{error}</p>}

					<button
						type='submit'
						className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-4'
					>
						Sign Up
					</button>
					<p className='text-gray-600'>
						Already a user?{' '}
						<Link to='/login'>
							<span className='text-indigo-700'>Log In</span>
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
