import React from 'react';
import Image from 'next/image';
import './graphCard.scss';
import Inc from '../../assets/images/svg/inc.svg';
import Decs from '../../assets/images/svg/decs.svg';

function GraphCard({title, value, percentage, graphIndex}) {
  return (
    <>
    <div className="stats shadow bg-primary-content">
        <div className="stat">
            <div className="stat-title text-base-200 text-sm font-medium mb-2">{title}</div>
            <div className="stat-value text-base-100 font-medium mb-2">{value}</div>
            {graphIndex === "profit" && (
              <div className="stat-desc text-sm font-medium text-base-100 flex">
                <Image src={Inc} alt="profit" />
                <span className='success me-1'>{percentage}%</span> this year
              </div>
            )}
            {graphIndex === "loss" && (
              <div className="stat-desc text-sm font-medium text-base-100 flex">
                <Image src={Decs} alt="loss" />
                <span className='danger me-1'>{percentage}%</span> this year
              </div>
            )}
        </div>
    </div>
    </>
  )
}

export default GraphCard
