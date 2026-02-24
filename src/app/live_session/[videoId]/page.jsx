import LiveSessionSingleVideo from '../../../components/LiveSessionSingleVideo';

export default function Page({ params: { videoId } }) {
	return <LiveSessionSingleVideo videoId={videoId} admin={false} />;
}
