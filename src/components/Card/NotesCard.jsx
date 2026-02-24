'use client';

import Image from 'next/image';
import './card.scss';
import { Fragment, useContext, useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Link from 'next/link';
import { formatDate } from '../../helpers/all';
import ConfirmModal from '../Modal/ConfirmModal';
import NotesEdit from '../Modal/NotesEdit';
import axios from 'axios';
import { UserContext } from '@/app/_context/User';
import logo from '@/assets/images/thumb-logo.jpg';
import { adminRoleObject } from '@/helpers/constant';

const NotesCard = ({ item, view, editAble }) => {
	const { setNotes } = useContext(UserContext);
	const [showModal, setShowModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);

	const handleDelete = async () => {
		const res = await axios.delete(`/api/admin/notes/${item._id}`);
		if (res.status === 200) {
			setNotes((prevVal) => {
				const updateVal = prevVal.filter((e) => e._id !== item._id);
				return updateVal;
			});
		}
	};

	return (
		<Fragment>
			{view === 'grid' ? (
				<div className='card shadow-lg grid-view'>
					{editAble && (
						<Dropdown
							setShowModal={setShowModal}
							setConfirmModal={setConfirmModal}
							item={item}
						/>
					)}
					<Link
						href={
							editAble
								? `/admin/notes/${item?._id}`
								: `/notes/${item?._id}`
						}
					>
						<figure>
							<Image
								src={item?.thumbnail || logo}
								alt='cardImg'
								height={200}
								width={200}
								loading='lazy'
								quality={70}
							/>
						</figure>
						<h2 className='card-title text-base-100 text-lg font-medium'>
							{item.title}
						</h2>
						<p className='text-gray-500 text-md font-normal history'>
							{item.description}
						</p>
						<p className='text-base-200 text-sm font-normal history'>
							{formatDate(
								item?.notesCreatedAt || item?.createdAt
							)}
						</p>
						{editAble && (
						<div className='mt-2'>
							<b>Categories: </b>
							{
								item?.studentCategory && item?.studentCategory.length > 0 &&
								<span>{item.studentCategory.map(cat => adminRoleObject[cat] || cat).join(', ')}</span>
							}
						</div>
						)}
					</Link>
				</div>
			) : ( 
				<div className='card shadow-lg list-view'>
					{editAble && (
						<Dropdown
							setShowModal={setShowModal}
							setConfirmModal={setConfirmModal}
							item={item}
						/>
					)}
					<Link
						href={
							editAble
								? `/admin/notes/${item?._id}`
								: `/notes/${item?._id}`
						}
					>
						<div className='card-horizontal justify-between'>
							<div className='cardheader'>
								<figure>
									<Image
										src={item?.thumbnail || logo}
										alt='cardImg'
										height={100}
										width={100}
										loading='lazy'
										quality={70}
									/>
								</figure>
								<div>
									<h2 className='card-title text-base-100 text-lg font-medium '>
										{item.title}
									</h2>
									<div className='text-base-200 text-sm font-normal history'>
										{formatDate(
											item?.notesCreatedAt ||
												item?.createdAt
										)}
									</div>
								</div>
							</div>
							<div className='cardbody p-0'>
								<div className='text-base-200 text-sm font-normal decs max-w-48'>
									{item.description}
								</div>
							</div>
						</div>
					</Link>
				</div>
			)}

			{showModal && (
				<NotesEdit
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle='Edit notes Details'
					item={item}
				/>
			)}

			{confirmModal && (
				<ConfirmModal
					showModal={confirmModal}
					setShowModal={setConfirmModal}
					modalTitle='Are you sure you want to delete this video?'
					onClick={handleDelete}
					id={item._id}
				/>
			)}
		</Fragment>
	);
};

export default NotesCard;
