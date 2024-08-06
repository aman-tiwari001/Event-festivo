import { useEffect, useState } from 'react';
import EventsCard from '../components/EventsCard';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { getAllProperty } from '../apis/propertyApi';
import { useNavigate } from 'react-router-dom';

const Properties = ({ setProgress }) => {
	const [propertyList, setPropertyList] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
	const [percentageRange, setPercentageRange] = useState({ min: 0, max: 100 });
	const [sortBy, setSortBy] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
		const getAllProperties = async () => {
			try {
				setProgress(60);
				if (!localStorage.getItem('access_token')) {
					navigate('/login');
					return;
				}
				const response = await getAllProperty();
				setProgress(100);
				setPropertyList(response.data.result);
				setFilteredProducts(response.data.result);
			} catch (error) {
				console.error('Error fetching properties:', error);
			}
		};
		getAllProperties();
	}, []);

	useEffect(() => {
		const filteredByPrice = propertyList.filter(
			(item) =>
				parseFloat(item.total_price) >= priceRange.min &&
				parseFloat(item.total_price) <= priceRange.max
		);

		const filteredByPercentage = filteredByPrice.filter((item) => {
			return (
				item.percentageLeft >= percentageRange.min &&
				item.percentageLeft <= percentageRange.max
			);
		});

		const sortedProducts = filteredByPercentage.sort((a, b) => {
			if (sortBy === 'priceAsc') {
				return a.total_price - b.total_price;
			} else if (sortBy === 'priceDesc') {
				return b.total_price - a.total_price;
			}
			return 0;
		});

		const filteredBySearch = sortedProducts.filter((item) =>
			item.title.toLowerCase().includes(searchTerm.toLowerCase())
		);

		setFilteredProducts(filteredBySearch);
	}, [propertyList, priceRange, percentageRange, sortBy, searchTerm]);

	const handleSortChange = () => {
		setSortBy((prev) => (prev === 'priceAsc' ? 'priceDesc' : 'priceAsc'));
	};

	return (
		<div>
			<div className='flex flex-wrap mt-[90px] p-5 rounded-md shadow-md text-black'>
				{/* Price Range Filter */}
				<div className='w-full sm:w-[25%] mb-4 sm:mb-0 sm:mr-4'>
					<label className='block mb-2'>Price Range:</label>
					<div className='flex items-center mt-2'>
						<input
							type='range'
							min='0'
							max='1000000'
							step='30000'
							value={priceRange.max}
							onChange={(e) =>
								setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
							}
							className='w-1/2 mr-2'
						/>
						<span>${priceRange.max}</span>
					</div>
				</div>

				{/* Percentage Range Filter */}
				<div className='w-full sm:w-[25%] mb-4 sm:mb-0 sm:mr-4'>
					<label className='block mb-2'>Percentage Left:</label>
					<div className='flex items-center mt-2'>
						<input
							type='range'
							min='0'
							max='100'
							step='10'
							value={percentageRange.max}
							onChange={(e) =>
								setPercentageRange({
									...percentageRange,
									max: parseInt(e.target.value),
								})
							}
							className='w-1/2 mr-2'
						/>
						<span>{percentageRange.max}%</span>
					</div>
				</div>

				{/* Sorting Button */}
				<div className='w-full sm:w-[15%] mb-4 sm:mb-0'>
					<label className='block mb-2'>Sort</label>
					<div className='flex items-center'>
						<button
							onClick={handleSortChange}
							className='p-2 rounded-md mr-2 bg-black w-[80px] h-[40px] flex justify-center items-center'
						>
							{sortBy === 'priceAsc' ? (
								<p className='flex gap-1 justify-center items-center'>
									<RiArrowUpSLine className='text-green-500 text-[20px] font-bold' />
									<p className='text-white'>Asc</p>
								</p>
							) : (
								<p className='flex gap-1 justify-center items-center'>
									<RiArrowDownSLine className='text-red-500 text-[20px] font-bold' />
									<p className='text-white'>Des</p>
								</p>
							)}
						</button>
					</div>
				</div>

				{/* Search Input */}
				<div className='w-full sm:w-[30%]'>
					<label className='block mb-2'>Search:</label>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='Search...'
						className='w-full p-2 border border-gray-300 rounded-md text-white'
					/>
				</div>
			</div>

			<div className='card-section justify-center sm:justify-between px-5 mt-5'>
				{filteredProducts.length === 0 ? (
					<p>No properties found.</p>
				) : (
					filteredProducts.map((property) => (
						<EventsCard key={property._id} property={{ ...property }} />
					))
				)}
			</div>
		</div>
	);
};

export default Properties;
