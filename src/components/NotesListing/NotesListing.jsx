import Image from 'next/image';
import Link from 'next/link';
import './notesListing.scss';
import { formatTimestampDate } from '@/helpers/all';
import logo from '@/assets/images/thumb-logo.jpg';

const NotesListing = ({ className, val, title, btnLabel, admin }) => {
	const classes = `${
		className || ''
	} py-36 grid gap-4 justify-center relative`;
	return (
		<div className='card shadow-lg listingCard mb-4'>
			<Link
				href={
					admin
						? `/admin/notes/${val?._id}`
						: `/notes/${val?._id}`
				}
			>
				<div className='flex gap-4 items-center p-2'>
					<div className='cardheader'>
						<figure>
							<Image
								className='aspect-video w-52 rounded-xl'
								src={
									val?.thumbnail ||
									logo
								}
								alt='Thumnail'
								height={100}
								width={100}
								loading='lazy'
								quality={70}
							/>
						</figure>
					</div>
					<div className='cardbody p-0'>
						<h2 className='card-title text-base-100 text-lg font-medium min-w-48 max-w-48'>
							{val.title}
						</h2>
						<div className='text-base-200 text-sm font-normal decs '>
							{val.description}
						</div>
						<div className='text-base-200 text-sm font-normal history'>
							{formatTimestampDate(val.notesCreatedAt)}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default NotesListing;
