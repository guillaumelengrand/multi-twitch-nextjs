import NavBar from '@/components/navBar';
import TwitchApi from '@/lib/twitch-api';
import Link from 'next/link';

export default function Game({game, streams}) {
    return (
        <div>
            <NavBar />
            <main>
                <img src={game.box_art_url.replace('{width}', 144).replace('{height}', 190)} alt={game.name} />
                <h1>{game.name}</h1>
                <div>{game.id}</div>

                <div className="flex flex-wrap justify-center">
                    {streams.map((stream, i) => (
                        <div className="w-1/5 px-1" key={stream.id}>
                            <Link href={`/streams/${stream.user_name}`}>
                                <a>
                                    <img
                                        src={stream.thumbnail_url.replace('{width}', 440).replace('{height}', 248)}
                                        alt="url"
                                    />
                                    <div>
                                        <img
                                            className="inline-block w-8 p-1 rounded-full"
                                            src={stream.user.profile_image_url}
                                        />
                                        {stream.user_name} - {stream.language}
                                    </div>
                                    <div className="truncate">{stream.title}</div>
                                    <div>Viewers: {stream.viewer_count}</div>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps(context) {
    const {gameName} = context.query;

    const game = await TwitchApi.api.helix.games.getGameByName(gameName);
    const {data: streams} = await game.getStreams();
    var streamsClean = [];
    for (let index = 0; index < streams.length; index++) {
        const stream = streams[index];
        const user = await stream.getUser();
        //console.log(user);
        stream._data.user = user._data;
        streamsClean.push(stream._data);
    }
    //console.log(streamsClean);

    return {props: {game: game._data, streams: streamsClean}};
}
