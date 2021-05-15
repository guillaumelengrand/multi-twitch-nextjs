import Head from 'next/head';
import Link from 'next/link';
import TwitchApi from '@/lib/twitch-api';
import NavBar from '@/components/navBar';
import TwitchVideo from '@/components/twitch-video';

export default function User({user, videos}) {
    const testHandler = async () => {
        //var value = await TwitchApi.isStreamLive('ultia');
        const videosCall = await TwitchApi.api.helix.videos.getVideosByUser(user.id);
        //console.log(user);
        //const {data: videos} = await TwitchApi.api.helix.videos.getVideosByUser('50597026');
        //console.log('videos: ', videos);
        console.log('videos: ', videosCall);
        //return value;
        //https://static-cdn.jtvnw.net/cf_vods/d1m7jfoe9zdc1j/01059d1f8c53339027e7_squeezie_41682804445_1620067729//thumb/thumb0-440x248.jpg
    };
    return (
        <div className="min-h-screen" style={{backgroundImage: `url(${user.offline_image_url})`}}>
            <Head>
                <title>{user.display_name}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-wrap justify-center text-white bg-black">
                <NavBar />
                <div className="px-2 py-1 border border-black cursor-pointer" onClick={testHandler}>
                    Button Test
                </div>
            </div>

            <main className="px-10 py-10 mx-auto text-white bg-black bg-opacity-75">
                <div className="w-20 mx-auto">
                    <img className="rounded-full" src={user.profile_image_url} />
                    <Link href={`/streams/${user.display_name}`}>
                        <a>
                            <h1 className="text-2xl capitalize">{user.display_name}</h1>
                        </a>
                    </Link>
                </div>

                <div className="w-1/2 mx-auto h-1/2">
                    <TwitchVideo channel={user.display_name} />
                </div>

                <p>{user.description}</p>

                <div>Videos</div>
                <div className="flex flex-wrap p-2 border border-black">
                    {videos &&
                        videos.map((video, i) => (
                            <div className="w-1/5 px-1" key={video.id}>
                                <img
                                    src={
                                        video.thumbnail_url
                                            ? video.thumbnail_url.replace('%{width}', 440).replace('%{height}', 248)
                                            : 'https://vod-secure.twitch.tv/_404/404_processing_320x180.png'
                                    }
                                    alt="video"
                                />
                                {/*<div>{video.thumbnail_url.replace('{width}', 440).replace('{height}', 248)}</div>*/}
                                <div>{video.title}</div>
                            </div>
                        ))}
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps(context) {
    const {id} = context.query;

    const user = await TwitchApi.api.helix.users.getUserById(id);
    //console.log('user: ', user._data);

    const {data: videos} = await TwitchApi.api.helix.videos.getVideosByUser(user._data.id);

    //console.log('user: ', videos);
    var videosClean = [];
    for (let index = 0; index < videos.length; index++) {
        const video = videos[index];
        videosClean.push(video._data);
    }
    //console.log('user: ', videosClean);

    return {
        props: {user: user._data, videos: videosClean},
    };
}
