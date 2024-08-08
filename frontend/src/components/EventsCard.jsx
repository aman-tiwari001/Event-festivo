import React from 'react';
import { Link } from 'react-router-dom';

function EventsCard({ events }) {
	// console.log(Math.floor((events.available_tickets / events.total_tickets)))
	return (
		<Link to={`/details/${events._id}`}>
			<div className='product-card bg-gradient-to-r border-[1px] from-zinc-300 to-white w-[300px] h-fit rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'>
				<img
					src={events.images[0]}
					alt='Product'
					className='w-full h-48 object-cover  rounded-2xl'
				/>
				<div className='flex justify-between p-2 items-center'>
					<div className='flex flex-col my-auto'>
						<h3 className='text-[15px] font-semibold text-gray-800 mb-2 w-[70%] text-wrap'>
							{events.title}
						</h3>
						<h2 className='text-green-600 font-bold'>{events.available_tickets} / <span className='text-black'>{events.total_tickets}</span></h2>
						
					</div>
					<div className='w-[28%] flex justify-center items-center'>
						<p className='text-white font-bold w-fit text-center p-2 rounded-lg bg-gradient-to-r border-[1px] from-purple-400 to-pink-500'>{events.ticket_price} Diams</p>
					</div>
				</div>

				<button className='btn btn-primary  bg-gradient-to-l border-[1px] from-purple-700 to-pink-500 rounded-none text-white text-xl font-light mt-4 w-full'>Book Now</button>
			</div>
		</Link>
	);
}

export default EventsCard;
