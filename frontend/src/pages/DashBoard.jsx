import { useEffect, useState } from 'react';
import MyInvestment from '../components/MyInvestment';
import Transaction from '../components/MyTransaction';
import Listings from '../components/MyListings';
import { getDiamAccountTransactions, getUserDetails } from '../apis/userApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function DashBoard({setProgress}) {
	const [activeTab, setActiveTab] = useState('My Investments');
	const [user, setUser] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const handleTabClick = async (tab) => {
		setActiveTab(tab);
		toast.promise(
			getDiamAccountTransactions().then((transactions) =>
				setTransactions(transactions._embedded.records)
			),
			{
				loading: 'Fetching Transactions from chain...',
				success: 'Transactions fetched',
				error: 'Failed to load Transactions',
			}
		);
	};

	useEffect(() => {
		const getUser = async () => {
			try {
        setProgress(45);
				setLoading(true);
				const response = await getUserDetails();
        setProgress(100);
				setUser(response.data.result);
				setLoading(false);
			} catch (error) {
        console.error('Error fetching user details:', error);
				setLoading(false);
        setProgress(100);
			}
		};
		getUser();
	}, []);
	if (loading) {
		return <p>Loading...</p>;
	}
	return (
		<div className='mt-[90px] p-6'>
			<h1 className='text-2xl font-bold mb-4 text-[#7065F0]'>
				<p className='text-black'>
					Hello,{' '}
					<span className='text-[#7065F0]'>{user.username || 'Guest'}</span>
					{user?.location
						? ` from ${user.location.city}, ${user.location.country}`
						: ''}
				</p>
				{/* Welcome to Dashboard , Keep the track of your Estate */}
			</h1>
			<div className='flex space-x-4 border-b'>
				<button
					className={`py-2 px-4 ${
						activeTab === 'My Investments'
							? 'bg-[#7065F0] text-white rounded-[6px]'
							: 'bg-[#9c9c9c] text-white rounded-[6px]'
					}`}
					onClick={() => handleTabClick('My Investments')}
				>
					My Investments
				</button>
				<button
					className={`py-2 px-4 ${
						activeTab === 'My Listings'
							? 'bg-[#7065F0] text-white rounded-[6px]'
							: 'bg-[#9c9c9c] text-white rounded-[6px]'
					}`}
					onClick={() => handleTabClick('My Listings')}
				>
					My Listings
				</button>
				<button
					className={`py-2 px-4 ${
						activeTab === 'My Transaction'
							? 'bg-[#7065F0] text-white rounded-[6px]'
							: 'bg-[#9c9c9c] text-white rounded-[6px]'
					}`}
					onClick={() => handleTabClick('My Transaction')}
				>
					My Transactions
				</button>
			</div>
			<div className='mt-4'>
				{activeTab === 'My Investments' && (
					<div className='flex flex-col gap-2'>
						{/* <MyInvestment
              src={
                "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg"
              }
              propertyName="Modern Residents"
              propertyAddress="123 Main St, Springfield"
            />

            <MyInvestment
              src={
                "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?cs=srgb&dl=pexels-jessica-bryant-592135-1370704.jpg&fm=jpg"
              }
              propertyName="La Villa"
              propertyAddress="223 Main St, Washington DC"
            /> */}
						{user.my_investments.map((investment) => (
							<Link to={`/details/${investment.property._id}`}>
								<MyInvestment
									key={investment.property._id}
									src={investment.property.images[0]}
									propertyName={investment.property.title}
									propertyAddress={investment.property.location.address}
									share_per={investment.share_per}
									total_price={investment.property.total_price}
								/>
							</Link>
						))}
					</div>
				)}

				{activeTab === 'My Listings' && (
					<div className='flex flex-col gap-2'>
						{user.my_listings.map((investment) => (
							<Link to={`/details/${investment.property._id}`}>
								<Listings
									key={investment.property._id}
									src={investment.property.images[0]}
									propertyName={investment.property.title}
									propertyAddress={investment.property.location.address}
									percentageLeft={investment.property.percentageLeft}
									total_price={investment.property.total_price}
								/>
							</Link>
						))}
					</div>
				)}
				{activeTab === 'My Transaction' && transactions.length ? (
					<>
						<p className='text-gray-600'>Transaction list for your account fetched from Diamante chain.</p>
						<table className='min-w-full rounded-xl text-black border-2 border-black'>
							<thead>
								<tr className='border-b-2 border-black'>
									<th className='border-b-2 border-black p-2 text-left'>
										Date
									</th>
									<th className='border-b-2 border-black p-2 text-left'>
										Hash
									</th>
									<th className='border-b-2 border-black p-2 text-left'>
										Source Account
									</th>
									<th className='border-b-2 border-black p-2 text-left'>Fee</th>
									<th className='border-b-2 border-black p-2 text-left'>
										Success
									</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((item, indx) => (
									<tr
										className={`border-t border-black ${
											indx % 2 == 0 ? 'bg-indigo-300' : 'bg-white'
										}`}
									>
										<td className='border-t border-black p-2'>
											{new Date(item.created_at).toLocaleDateString()}
										</td>
										<td
											onClick={() => {
												navigator.clipboard.write(item.hash);
												toast.success('Copied to clipboard!');
											}}
											className='border-t border-black p-2 cursor-pointer'
										>
											{item.hash.slice(0, 7) +
												'...' +
												item.hash.slice(
													item.hash.length - 7,
													item.hash.length - 1
												)}
										</td>
										<td
											onClick={() => {
												navigator.clipboard.write(item.source_account);
												toast.success('Copied to clipboard!');
											}}
											className='border-t border-black p-2 cursor-pointer'
										>
											{item.source_account}
										</td>
										<td className='border-t border-black p-2'>
											{item.fee_charged}
										</td>
										<td className='border-t border-black p-2'>
											{item.successful ? '✅' : '❌'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				) : (
					<p className='text-black text-center text-xl mx-auto my-16'>
						No Transactions found!
					</p>
				)}
			</div>
		</div>
	);
}

export default DashBoard;
