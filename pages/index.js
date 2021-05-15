import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

import NavBar from '@/components/navBar';

import TwitchApi from '../lib/twitch-api';
import {useState, useEffect} from 'react';

export default function Home() {
    const [games, setGames] = useState(null);
    const [streams, setStreams] = useState(null);
    useEffect(async () => {
        if (!games) setGames((await TwitchApi.getTopGames()).data);
        if (!streams) setStreams((await TwitchApi.getStreams()).data);

        //console.log(streams);
        //console.log('games ', games);
    });
    const testHandler = async () => {
        //var value = await TwitchApi.isStreamLive('ultia');
        const user = await TwitchApi.api.helix.users.getUserById('50597026');
        console.log(user);
        const {data: videos} = await TwitchApi.api.helix.videos.getVideosByUser('50597026');
        console.log('videos: ', videos);
        //return value;
    };

    const updateGames = async () => {
        var newGames = (await TwitchApi.getTopGames()).data;
        setGames(newGames);
        console.log('Games ', games);
    };
    const updateStreams = async () => {
        var newStreams = (await TwitchApi.getStreams()).data;
        setStreams(newStreams);
        console.log('Streams: ', streams);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Multi-Twitch</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="mt-2">
                <Link href="/">
                    <a></a>
                </Link>
                <div className="px-2 py-1 border border-black cursor-pointer" onClick={testHandler}>
                    Button Test
                </div>
            </header>

            <NavBar />

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Mutli-<a href="https://twitch.tv">Twitch.tv</a>
                </h1>

                <div className="flex flex-wrap justify-center">
                    <div className="mr-1">
                        <div className="inline-block mb-2">Top Games</div>
                        <div className="inline-block cursor-pointer" onClick={updateGames}>
                            <img src="/refresh-cw.svg" alt="refresh" />
                        </div>
                        <ul>
                            {games &&
                                games.map((game, i) => (
                                    <li key={game.id} className="mb-1 border border-black">
                                        <Link href={`/game/${game.name}`}>
                                            <a className="grid grid-flow-col auto-cols-max place-items-center">
                                                <div className="px-2 py-1">{i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
                                                <div className="w-1/3">
                                                    <img
                                                        src={game.boxArtUrl
                                                            .replace('{width}', 144)
                                                            .replace('{height}', 190)}
                                                    />
                                                </div>
                                                <div className="">{game.name}</div>
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="w-1/2">
                        <div className="inline-block px-1 mb-2">Top Streams Fr</div>
                        <div className="inline-block cursor-pointer" onClick={updateStreams}>
                            <img src="/refresh-cw.svg" alt="refresh" />
                        </div>
                        <ul>
                            {streams &&
                                streams.map((stream, i) => (
                                    <li key={stream.id} className="mb-1 border border-black">
                                        <Link href={`/user/${stream.userId}`}>
                                            <a
                                                /*href={`https://twitch.tv/${stream.userName}`}*/
                                                className="grid grid-flow-col grid-cols-4"
                                            >
                                                <div className="px-2 py-1">{i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
                                                <div className="w-1/3">
                                                    <img
                                                        className=""
                                                        src={stream.thumbnailUrl
                                                            .replace('{width}', 440)
                                                            .replace('{height}', 248)}
                                                    />
                                                </div>
                                                <span className="inline-block">
                                                    <div>{stream.userDisplayName}</div>
                                                    <div className="text-sm">{stream.gameName}</div>
                                                </span>
                                                <span className="inline-block">{stream.viewers}</span>
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>
    );
}
