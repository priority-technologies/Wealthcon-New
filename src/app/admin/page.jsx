'use client';

import { Fragment, useState } from 'react';
import Select from '../../components/Input/Select';
import Typography from '../../components/Typography';
import Dashboard from '@/components/Dashboard';
import usePreventActions from '@/hooks/usePreventActions';

export default function Adminpage() {
	//usePreventActions();
	const [filter, setFilter] = useState('year');

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	return (
		<Fragment>
			<div className='flex justify-between items-center flex-wrap mb-5 '>
				<Typography
					tag='h1'
					size='text-xl'
					weight='font-semibold'
					color='text-base-content'
					className='block text-left'
				>
					Dashboard
				</Typography>
				<div className='filter-wrapper flex justify-between items-center flex-wrap gap-2'>
					<Select
						label='Filter by'
						options={[
							{ label: 'Year', value: 'year' },
							{ label: 'Month', value: 'month' },
							{ label: 'Week', value: 'week' },
						]}
						className='border rounded-none w-full p-4 pr-10'
						value={filter}
						onChange={handleFilterChange}
					/>
				</div>
			</div>
			<Dashboard filter={filter} />
		</Fragment>
	);
}
