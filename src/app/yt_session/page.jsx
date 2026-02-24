'use client';
import React, { Fragment, useState } from 'react';
import Filter from '../../components/Filter';
import YoutubeSessionVideos from '../../components/YoutubeSessionVideos';

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
				title='Videos '
				type='ytSession'
				view={view}
				setView={setView}
				filterSelect={filterSelect}
				setFilterSelect={setFilterSelect}
			/>
            <YoutubeSessionVideos 
				view={view}
				setView={setView}
				filter={filterSelect}
			/>
		</Fragment>
	);
}

export default LiveSession;
