'use client';

import React, { Fragment, useState } from 'react';
import Filter from '../../../components/Filter';
import NotesComponent from '../../../components/NotesComponent';
import usePreventActions from '@/hooks/usePreventActions';

function Notes() {
	//usePreventActions();
	const [view, setView] = useState('grid');
	const [filterSelect, setFilterSelect] = useState({
		sortBy: null,
	});

	return (
		<Fragment>
			<Filter
				title='Notes'
				type='notes'
				view={view}
				setView={setView}
				admin='true'
				filterSelect={filterSelect}
				setFilterSelect={setFilterSelect}
			/>
			<NotesComponent
				view={view}
				setView={setView}
				editAble='true'
				filter={filterSelect}
			/>
		</Fragment>
	);
}

export default Notes;
