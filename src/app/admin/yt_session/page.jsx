'use client';

import React, { Fragment, useState } from 'react';
import YoutubeSessionVideos from '../../../components/YoutubeSessionVideos';
import Filter from '../../../components/Filter';

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
				title='Videos For NRI'
				type='ytSession'
				view={view}
				setView={setView}
				admin='true'
				filterSelect={filterSelect}
				setFilterSelect={setFilterSelect}
			/>
            <YoutubeSessionVideos 
				view={view}
				setView={setView}
				editAble='true'
				filter={filterSelect}
			/>
		</Fragment>
	);
}

export default LiveSession;
