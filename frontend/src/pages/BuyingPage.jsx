import React, { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import { getSingleProperty } from '../apis/eventApi';
import { useNavigate, useParams } from 'react-router-dom';
import { handlePayment, investInProperty } from '../apis/userApi';
import toast from 'react-hot-toast';

const BuyingPage = ({ setProgress }) => {
	const { id } = useParams();
	const totalPropertyPrice = 200;
	const totalTokens = 10;
	const [tokenCount, setTokenCount] = useState(0);
	const [percentage, setPercentage] = useState(0);
	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				setProgress(37);
				const response = await getSingleProperty(id);
				setProperty(response.data.result);
				setProgress(100);
			} catch (error) {
				setError('Failed to fetch property details.');
				console.error(error);
				setProgress(100);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty();
	}, [id]);

	const handleTokenChange = (e) => {
		const value = Math.max(
			0,
			Math.min(property.available_tokens, parseInt(e.target.value) || 0)
		);
		setTokenCount(value);
		setPercentage((value / property.available_tokens) * 100);
	};

	const handleBuy = async () => {
		if (tokenCount <= 0) {
			toast.error('Please enter a valid number of tokens to buy.');
			return;
		}

		try {
			setProgress(40);
			const tokens_left = property.no_of_tokens - tokenCount;
			console.log(tokens_left);
			await investInProperty(id, percentage, tokens_left);
			setProgress(60);
			await handlePayment(tokenCount, property.owner.public_address);
			setProgress(100);
			toast.success('💰 Invested successfully');
			setTokenCount(0);
			setPercentage(0);
			navigate('/'); // Redirect to the previous page
		} catch (error) {
			toast.error('Investment failed');
			console.error(error);
			setProgress(100);
			setError(error);
		}
	};

	if (loading) return <div>Loading...</div>;

	const isInvestmentAvailable = property && property.percentageLeft > 0;

	return (
		<div className='mt-[80px] gap-3 flex flex-wrap w-screen h-auto overflow-y-hidden p-4'>
			<Carousel className='w-full md:w-1/2' property={property} />

			<div className='bg-gradient-to-r buyingbox from-slate-200 to-stone-300 w-full md:w-[45vw] h-min rounded-2xl flex flex-col p-2 shadow-md'>
				<div className='bg-white p-4 flex flex-col gap-2 rounded-2xl'>
					<h3 className='text-2xl font-bold text-center text-black mb-2'>
						MAKE INVESTMENT
					</h3>
					<h4 className='text-lg text-center font-semibold text-gray-800 mb-4'>
						(Buying using tokens)
					</h4>
					<p className='text-gray-700'>
						<strong>Name of Token:</strong> {property.token_name}
					</p>
					<p className='text-gray-700'>
						<strong>Total Tokens:</strong> {property.no_of_tokens}
					</p>
					<p className='text-gray-700'>
						<strong>Property Price:</strong> ${property.total_price}
					</p>
					<p className='text-gray-700'>
						<strong>Token Price:</strong> $
						{property.total_price / property.no_of_tokens}
					</p>
					<p className='text-gray-700'>
						<strong>Tokens Left:</strong> {property.available_tokens}
					</p>
					<p className='text-gray-700'>
						<strong>Tokens Left After Transaction:</strong>{' '}
						{property.available_tokens - tokenCount}
					</p>
				</div>
				<div className='flex flex-col pt-3 px-1 gap-1'>
					<h3 className='text-black'>Number of Tokens to Buy</h3>
					<input
						type='number'
						min='0'
						max={property.available_tokens}
						value={tokenCount}
						onChange={handleTokenChange}
						className='border-2 bg-white border-white text-slate-800 font-mono font-medium rounded-md p-2'
						placeholder='Enter number of tokens to buy'
					/>

					<h3 className='mt-2 text-black'>Property Percentage</h3>
					<input
						type='text'
						value={`${percentage.toFixed(2)}%`}
						readOnly
						className='border bg-white border-white text-slate-800 font-mono font-medium rounded-md p-2'
						placeholder='Percentage of property'
					/>

					{isInvestmentAvailable ? (
						<button
							className='text-white mt-4 font-medium text-xl px-4 py-3 bg-[#7065F0] hover:bg-[#d7d4fc] rounded-[10px] hover:text-[#7065F0] transition-all'
							onClick={handleBuy}
						>
							<h1>BUY</h1>
						</button>
					) : (
						<div className='bg-red-500 mt-4 text-center text-white px-4 py-2 rounded-[12px]'>
							<h1>Investment is not available for this property.</h1>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BuyingPage;
