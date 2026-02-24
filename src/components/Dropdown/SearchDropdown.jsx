'use client';

import Image from 'next/image';
import './dropdown.scss';
import { Fragment, useState } from 'react';
import EditIcon from '../../assets/images/svg/editdots.svg';

const SearchDropdown = ({ results, className, ...rest }) => {
	const classes = `${className || ''}`;
	const tabIndex = 1;

	return (
		<Fragment>
			<div
				className={`dropdown cursor-pointer dropdown-end ${classes}`}
				{...rest}
			>
				<div
					tabIndex={tabIndex}
					role='button'
					className=' m-1 text-base-100 editIcons'
				>
					<Image src={EditIcon} alt='icon' />
				</div>
				<ul
					tabIndex={tabIndex}
					className='dropdown-content z-10 menu p-2 mt-2 shadow bg-primary-content rounded-box w-48 dropdown-tag'
				>
					{results.videos?.map((video) => (
						<li key={video._id}>{video.title} (Video)</li>
					))}
					{results.notes?.map((note) => (
						<li key={note._id}>{note.title} (Note)</li>
					))}
					{results.gallery?.map((item) => (
						<li key={item._id}>{item.title} (Gallery)</li>
					))}
				</ul>
			</div>
		</Fragment>
	);
};

export default SearchDropdown;
