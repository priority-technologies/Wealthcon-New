'use client';

import { Fragment, useContext, useEffect, useState } from 'react';
import './modal.scss';
import CloseIcon from '../../assets/images/svg/closeIcon.svg';
import Button from '../Button';
import Typography from '../Typography';
import { formatTimestamp } from '@/helpers/all';
import { useRouter } from 'next/navigation';

const Announcement = ({ data }) => {
	const [showModal, setShowModal] = useState(false);
	const router = useRouter();
	useEffect(() => {
		if (data) {
			const storedValue = window?.sessionStorage?.getItem('announcement');
			if (!storedValue) {
				setShowModal(true);
				window?.sessionStorage?.setItem('announcement', 'true');
			}
		}
	}, [data]);

	const closeModal = () => {
		setShowModal(false);
		window?.sessionStorage?.setItem('announcement', 'false');
	};

	if (!data) return null;

	return (
		<Fragment>
			<dialog id='uploader' className='modal' open={showModal}>
				<div className='modal-box rounded-none py-10 bg-primary-content max-w-5xl w-full card-frame'>
					{/* close button */}
					<Button
						size='btn-sm'
						variant='btn-ghost'
						className='absolute right-2 top-2'
						iconPosition='left'
						icon={CloseIcon}
						onClick={closeModal}
					></Button>
					<Typography
						tag='h4'
						size='text-3xl'
						weight='font-semibold'
						color='text-base-content'
						className='block text-center mb-5'
					>
						Announcement 📢
					</Typography>

					<Typography
						tag='p'
						size='text-base'
						weight='font-medium'
						color='text-base-200'
						className='block text-center mb-4 whitespace-pre-wrap'
					>
						{data.message}
					</Typography>

					<Typography
						tag='p'
						size='text-base'
						weight='font-medium'
						color='text-base-200'
						className='block text-center mb-4'
					>
						{/* {formatTimestamp(data.datetime)} */}
					</Typography>
					<div className='flex items-center justify-center'>
							<Button
								onClick={()=>{closeModal();router.push("/announcement")}}
								variant='btn-primary'
								className='btn-sm mt-2 px-7'
							>See more</Button>
					</div>
				</div>
			</dialog>
		</Fragment>
	);
};

export default Announcement;
