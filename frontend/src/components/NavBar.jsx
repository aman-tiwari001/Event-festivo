import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { Horizon } from 'diamante-sdk-js';
import toast from 'react-hot-toast';
import { fundAccountWithTestDiam } from '../apis/userApi';
import { BsTicketPerforated } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { FaBitcoin } from "react-icons/fa";


const navbarItems = [
	{
		icon: <BsTicketPerforated className='text-lg md:text-[25px] z-50' />,
		label: 'Buy',
		link: '/',
	},
	{
		icon: <IoIosAddCircleOutline className='text-lg md:text-[25px] z-50' />,
		label: 'List',
		link: '/listing',
	},
	{
		icon: <RiAccountPinCircleLine className='text-lg md:text-[25px] z-50' />,
		label: 'Account',
		link: '/dashboard',
	},
];

function Navbar({ setProgress }) {
	const server = new Horizon.Server('https://diamtestnet.diamcircle.io');
	const location = useLocation();
	const [selected, setSelected] = useState('');
	const [balance, setBalance] = useState(0);

	const navigate = useNavigate();

	const fetchDiamBalance = async () => {
		try {
			const response = await server.loadAccount(
				localStorage.getItem('public_address')
			);
			setBalance(response.balances[0].balance);
		} catch (error) {
			console.error('Failed to fetch balance:', error);
		}
	};
	const publicAddress = localStorage.getItem('public_address');
	const addressLen = publicAddress ? publicAddress.length : 0;

	const handleItemClick = (label) => {
		if (label === 'Buy' || label === 'Sell') {
			setSelected(label);
		}
	};

	const handleFundAcc = async () => {
		try {
			setProgress(40);
			const resp = await fundAccountWithTestDiam();
			setProgress(100);
			console.log(resp);
			toast.success('Account funded successfully!');
		} catch (error) {
			toast.error('Failed to fund account!');
			console.log('Failed to fund account:', error);
			setProgress(100);
		}
		setBalance('Fetching...');
	};

	useEffect(() => {
		fetchDiamBalance();
	}, [balance]);

	return (
		<>
			{location.pathname !== '/login' && location.pathname !== '/signup' && (
				<div className='w-screen h-[80px] flex fixed top-0 mb-[100px] items-center justify-between px-4 md:px-8 backdrop-blur z-50'>
					<Link to='/'>
						<div className='flex items-center'>
							<img
								src='/eflogo.png'
								alt='logo'
								className='object-cover'
								width={70}
							/>
							<h2 className='text-lg md:text-[25px] font-bold shadow-xl text-[#7065F0] ml-2 md:ml-4 hidden md:block overflow-hidden'>
							EventÓfestivo
							</h2>
						</div>
					</Link>

					<div className='flex items-center justify-center ml-auto md:ml-0'>
						<div className='flex gap-4 ml-4 md:ml-8'>
							{navbarItems.map((item, index) => (
								<div
									key={index}
									onClick={() => handleItemClick(item.label)}
									className={`relative flex items-center gap-2 text-white md:px-4 md:py-2 bg-transparent hover:bg-[#d7d4fc] hover:p-2 md:hover:px-4 md:hover:py-3 hover:rounded-[10px] hover:text-[#6559f1] transition-all cursor-pointer ${
										(item.label === 'Buy' || item.label === 'Sell') &&
										selected === item.label
											? 'bg-[#d7d4fc] p-2 md:px-4 md:py-3 rounded-[10px] text-[#6559f1] transition-all'
											: ''
									}`}
								>
									<Link to={item.link} className='flex gap-2 items-center'>
										{item.icon}
										<h2 className='font-bold hidden md:block'>{item.label}</h2>
									</Link>
								</div>
							))}
						</div>
					</div>

					<div className='text-black flex rounded-2xl gap-x-2 p-1'>
						{publicAddress && (
							<div
								onClick={() => {
									navigator.clipboard.writeText(publicAddress);
									toast.success('Public address copied to clipboard!', {
										style: {
											background: '#7065F0',
											color: 'white',
										},
									});
								}}
								className='cursor-pointer border-1 flex items-center p-1 bg-gray-300 rounded-lg'
							>
								<IoWalletOutline size={36} />

								{publicAddress.slice(0, 5) +
									'...' +
									publicAddress.slice(addressLen - 5)}
							</div>
						)}

						<div className='flex items-center border-1 p-1 gap-x-2 bg-gray-300 rounded-md '>
							<img src='/diam.png' width={45} alt='' />
							<p>{Number.parseFloat(balance).toFixed(2)} DIAMS</p>
						</div>
					</div>
					<div onClick={handleFundAcc} className='flex gap-3 items-center ml-2'>
						<div className='relative flex items-center gap-2 text-white md:px-4 md:py-3 bg-green-500 hover:bg-green-700 hover:p-2 md:hover:px-4 md:hover:py-3 rounded-[10px] transition-all cursor-pointer'>
							<h2 className='font-bold hidden md:block'><FaBitcoin size={36} /> Fund</h2>
						</div>
					</div>

					<div className='flex gap-3 items-center ml-2'>
						<div
							onClick={() => {
								localStorage.clear();
								navigate('/login');
							}}
						>
							<div className='relative flex items-center gap-2 text-white md:px-4 md:py-3 bg-[#7065F0] hover:bg-[#d7d4fc] hover:p-2 md:hover:px-4 md:hover:py-3 rounded-[10px] hover:text-[#7065F0] transition-all cursor-pointer'>
								<FiLogOut className='text-[16px] md:text-[25px] z-50' />
								<h2 className='font-bold hidden md:block'>Logout</h2>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Navbar;
