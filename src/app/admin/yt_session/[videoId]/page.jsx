"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import BackPage from "../../../../assets/images/svg/backPage.svg";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
export default function Page({ params: { videoId } }) {
    const [yturl, setYturl] = useState("");  
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const linkifyDescription = (description) => {
        const urlPattern =
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        return description.replace(
          urlPattern,
          '<a href="$1" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">$1</a>'
        );
      };
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await fetch(`/api/admin/yt_video/${videoId}`);
                const text = await response.text();
                const data = JSON.parse(text); 
                
                
                if (response.ok) {
                    setYturl(data.data.yturl);
                    setVideoData(data.data);
                } else {
                    throw new Error(data.message || "Error fetching video");
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        

        fetchVideoData();
    }, [videoId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!yturl) return <div>No video found</div>;

    const youtubeEmbedUrl = `${yturl}`;
    // const youtubeEmbedUrl = `https://player.vimeo.com/video/${yturl}`;
    
    return (
        <>
            <div className="mb-4">
                <Button
                    icon={BackPage}
                    iconPosition="left"
                    className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border border-blue-500 rounded btn-sm"
                    onClick={router.back}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
               <iframe src={youtubeEmbedUrl} frameborder="0" width="100%" height="100%"></iframe> 
            </div>
            <h2 className="card-title text-base-100 text-2xl font-bold mb-2 mt-4">
                {videoData.title}
            </h2>
            <p
                className="whitespace-pre-wrap text-base-content text-sm font-normal decs mb-4"
                dangerouslySetInnerHTML={{
                __html: linkifyDescription(videoData.description || ""),
                }}
            ></p>
            {/* <ReactPlayer
                    url={youtubeEmbedUrl}
                    width="100%"
                    height="100%"
                    controls={false}
                    playing={true}
                    config={{
                        vimeo: {
                            playerOptions: {
                                autoplay: true,  
                                loop: false,     
                                title: false,    
                                byline: false,   
                                portrait: false, 
                                controls: true,  
                                dnt: true,       
                                quality: "auto", 
                            },
                        },
                    }}
                /> */}
        </>
    );
}
