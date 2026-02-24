'use client';

import LiveSessionSingleVideo from '../../../../components/LiveSessionSingleVideo';
import usePreventActions from '@/hooks/usePreventActions';

export default function Page({ params: { videoId } }) {
	//usePreventActions();
	return <LiveSessionSingleVideo videoId={videoId} admin={true} />;
}
