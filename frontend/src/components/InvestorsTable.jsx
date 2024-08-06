import React from 'react';

const InvestorTable = ({ investors }) => {
  return (
    <div className="bg-[#b1b1b1] w-full h-[270px] overflow-y-auto p-4 rounded-lg">
        <p className='text-black text-[20px] text-center font-semibold -translate-y-2'>Investors List</p>
      <table className="min-w-full bg-white text-black rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200">Index</th>
            <th className="py-2 px-4 border-b border-gray-200">Username</th>
            <th className="py-2 px-4 border-b border-gray-200">Percentage Invested</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{investor.investor.username}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{investor.share_per.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestorTable;
