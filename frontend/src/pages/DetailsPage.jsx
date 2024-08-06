import Carousel from '../components/Carousel';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSingleProperty } from '../apis/eventApi';
import { Link, useParams } from 'react-router-dom';
import InvestorTable from '../components/InvestorsTable';
import { server_url } from '../config';
import toast from 'react-hot-toast';

const DetailsPage = ({ setProgress }) => {
	const { id } = useParams();
	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				setProgress(37);
				const response = await getSingleProperty(id);
				setProgress(100);
				setProperty(response.data.result);
			} catch (error) {
				setError('Failed to fetch property details.');
				console.error(error);
			} finally {
				setLoading(false);
				setProgress(100);
			}
		};

		fetchProperty();
	}, [id]);
	const handlePurachse = async (req, res) => {
		try {
			setProgress(30);
			const resp = await axios.post(
				`${server_url}/user/make-payment`,
				{
					receiverPublicKey: property.owner.public_address,
					amount: property.total_price.toString() + '.0000000',
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			);
			console.log(resp.data);
			setProgress(100);
			toast.success('Payment Successful');
		} catch (error) {
			console.error(error);
			toast.error('Payment Failed. Please try again.');
			setProgress(100);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;
	if (!property) return <div>No property found.</div>;

	return (
		<div className='mt-[80px] gap-3 flex flex-wrap w-screen h-auto overflow-y-hidden p-4'>
			<Carousel className='w-full md:w-1/2' property={property} />

			<div className='bg-gradient-to-r from-slate-200 to-stone-300 w-full md:w-[45vw] h-min rounded-2xl flex flex-col p-2 shadow-md'>
				<div className='bg-white p-4 flex flex-col gap-4 rounded-2xl'>
					<h3 className='text-xl font-bold text-black mb-2'>
						Property Details
					</h3>
					<p className='text-gray-700'>
						<strong>Price:</strong> ${property.total_price}
					</p>
					<p className='text-gray-700'>
						<strong>Tokens Available:</strong> {property.no_of_tokens}
					</p>
					<p className='text-gray-700'>
						<strong>Token Name:</strong> {property.token_name}
					</p>
					<p className='text-gray-700'>
						<strong>Address:</strong> {property.location.address},{' '}
						{property.location.city}, {property.location.state}
					</p>
					<p className='text-gray-700'>
						{/* <strong>Fraction Left:</strong> {property.no_of_tokens} / {property.total_fraction} */}
						<strong>Fraction Left:</strong> {property.percentageLeft}
					</p>
					<p className='text-gray-700'>
						<strong>Owner:</strong> {property.owner.username}
					</p>
					<p className='text-gray-700'>
						<strong>Listed At:</strong>{' '}
						{new Date(property.listed_at).toLocaleString()}
					</p>
				</div>
				<div className='flex justify-center p-2 gap-2'>
					<Link to={`/buy/${property._id}`}>
						<button className='text-white font-medium text-xl px-4 py-3 bg-[#7065F0] hover:bg-[#d7d4fc] hover:px-4 hover:py-3 rounded-[10px] hover:text-[#7065F0] transition-all'>
							<h1>INVEST NOW</h1>
						</button>
					</Link>
					<button
						onClick={handlePurachse}
						className='text-white font-medium text-xl px-4 py-3 bg-[#7065F0] hover:bg-[#d7d4fc] hover:px-4 hover:py-3 rounded-[10px] hover:text-[#7065F0] transition-all'
					>
						<h1>BUY 100% (in DIAM)</h1>
					</button>
				</div>

				<InvestorTable investors={property.investors} />
			</div>
		</div>
	);
};

export default DetailsPage;
