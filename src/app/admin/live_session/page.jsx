'use client';

import React, { Fragment, useState } from 'react';
import LiveSessionVideo from '../../../components/LiveSessionVideos';
import Filter from '../../../components/Filter';
import usePreventActions from '@/hooks/usePreventActions';

function LiveSession() {
	//usePreventActions();
	const [view, setView] = useState('grid');
	const [filterSelect, setFilterSelect] = useState({
		sortBy: null,
		category: null,
	});

	return (
		<Fragment>
			<Filter
				title='Videos'
				type='liveSession'
				view={view}
				setView={setView}
				admin='true'
				filterSelect={filterSelect}
				setFilterSelect={setFilterSelect}
			/>
			<LiveSessionVideo
				view={view}
				setView={setView}
				editAble='true'
				filter={filterSelect}
			/>
		</Fragment>
	);
}

export default LiveSession;
