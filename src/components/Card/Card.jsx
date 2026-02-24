import Image from 'next/image';
import './card.scss';
import { Fragment } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Link from 'next/link';
import logo from '@/assets/images/thumb-logo.jpg';

const Card = ({ item, view, editAble }) => {
	return (
		<Fragment>
			{view === 'grid' ? (
				<div className='card shadow-lg grid-view'>
					{editAble && <Dropdown item={item} />}
					<Link href={`/admin/live_session/${item?._id}`}>
						<figure>
							<Image
								src={item?.thumbnail || logo}
								alt='Thumbnail'
								height={200}
								width={200}
								loading='lazy'
								quality={70}
							/>
						</figure>
						<h2 className='card-title text-base-100 text-lg font-medium'>
							{item?.title}
						</h2>
						<p className='text-base-200 text-sm font-normal decs'>
							{item?.description}
						</p>
						<p className='text-base-200 text-sm font-normal history'>
							{item?.videoCreatedAt || item?.createdAt}
						</p>
					</Link>
				</div>
			) : (
				<div className='card shadow-lg list-view'>
					{editAble && <Dropdown item={item} />}
					<Link href={`/admin/live_session/${item?._id}`}>
						<div className='card-horizontal justify-between'>
							<div className='cardheader'>
								<figure>
									<Image
										src={item?.thumbnail || logo}
										alt='Thumbnail'
										height={100}
										width={100}
										loading='lazy'
										quality={70}
									/>
								</figure>
								<h2 className='card-title text-base-100 text-lg font-medium'>
									{item?.title}
								</h2>
							</div>
							<div className='cardbody p-0'>
								<div className='text-base-200 text-sm font-normal desc  max-w-48'>
									{item?.description}
								</div>
								<div className='text-base-200 text-sm font-normal history'>
									{item?.videoCreatedAt || item?.createdAt}
								</div>
							</div>
						</div>
					</Link>
				</div>
			)}
		</Fragment>
	);
};

export default Card;
