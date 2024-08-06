import React from 'react';
import { Link } from 'react-router-dom';

function EventsCard({ property }) {
	return (
		<Link to={`/details/${property._id}`}>
			<div className='product-card bg-white w-[300px] h-fit rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out p-4'>
				<img
					src={property.images[0]}
					alt='Product'
					className='w-full h-48 object-cover mb-4 rounded-2xl'
				/>
				<div className='flex justify-between p-2 items-center'>
					<div className='flex flex-col my-auto'>
						<h3 className='text-[15px] font-semibold text-gray-800 mb-2 w-[70%] text-wrap'>
							{property.title}
						</h3>

						<p className='text-black'>{property.total_price}</p>
					</div>
					<div className='w-[30%] flex justify-center'>
						<div
							className='radial-progress text-[#399e45] w-[50px] h-[50px] font-bold'
							style={{
								'--value': `${Math.floor(property.percentageLeft)}`,
								'--size': '12rem',
								'--thickness': '4px',
							}}
							role='progressbar'
						>
							{Math.floor(property.percentageLeft)}
						</div>
					</div>
				</div>

				<button className='btn btn-primary mt-4 w-full'>Buy Now</button>
			</div>
		</Link>
	);
}

export default EventsCard;
