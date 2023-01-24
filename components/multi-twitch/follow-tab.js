import {useEffect, useState} from 'react';
import {Menu} from '../icons';
import TwitchApi from '@/lib/twitch-api';

export default function FollowTab({addStream}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userPseudo, setUserPseudo] = useState(null);
    const [followList, setFollowList] = useState(() => []);

    useEffect(async () => {
        if (!isLoading && userPseudo != null) {
            updateFollows();
        }
    }, []);
    useEffect(async () => {
        if (userPseudo != null && followList.length === 0) {
            updateFollows();
        }
    }, [followList]);
    useEffect(() => {
        if (userPseudo != null) updateFollows();
    }, [userPseudo]);

    const askForPseudo = () => {
        if (typeof window !== 'undefined') {
            let pseudo = localStorage.getItem('twitchPseudo');

            if (pseudo === null) {
                pseudo = prompt('entrer votre pseudo twitch:', 'yunne42');
                if (pseudo != null) {
                    localStorage.setItem('twitchPseudo', pseudo);
                    setUserPseudo(pseudo);
                }
            } else {
                setUserPseudo(pseudo);
            }
        }
    };

    const updateFollows = async () => {
        setIsLoading(true);
        const user = await TwitchApi.getUserByName(userPseudo);
        let request = TwitchApi.api.helix.users.getFollowsPaginated({user: user._data.id});
        let follows = await request.getAll();
        let followLiveList = [];
        for (let index = 0; index < follows.length; index++) {
            const elt = follows[index];
            // const userStream = await TwitchApi.api.helix.streams.getStreamByUserId(elt._data.to_id);

            const user = await TwitchApi.api.helix.users.getUserByName(elt._data.to_name);
            if (user) {
                const userStream = await user.getStream();
                if (userStream !== null) {
                    console.log({streamer: user._data, stream: userStream._data});
                    followLiveList.push({...user._data, stream: userStream._data});
                }
            }

            // if (userStream) {
            //     console.log({streamer: elt._data, stream: userStream._data});
            //     followLiveList.push(userStream._data);
            // }
        }
        setFollowList(followLiveList);
        setIsLoading(false);
    };

    const openTab = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="text-white bg-gray-700">
            <div
                className="p-1 cursor-pointer"
                onClick={() => {
                    askForPseudo();
                    openTab();
                }}
            >
                <Menu />
            </div>
            <div className={`relative ${isOpen ? 'block' : 'hidden'}`}>
                <div className="absolute top-0 left-0 z-20 overflow-auto text-white bg-gray-700 h-screen-96 w-52 overscroll-auto">
                    <div className="flex flex-row items-center justify-between mx-2 mt-1 mb-4">
                        <div className="flex flex-col items-center font-bold">
                            <div>Chaîne Suivie</div>
                            <div>{userPseudo}</div>
                        </div>
                        <img
                            className="h-6 cursor-pointer"
                            src="/refresh-cw.svg"
                            alt="refresh"
                            onClick={() => {
                                if (!isLoading) updateFollows();
                            }}
                        />
                    </div>
                    {isLoading && (
                        <div className="text-center animate-pulse">
                            Updating List
                            <svg className="w-5 h-5 mr-3 text-white animate-spin" viewBox="0 0 24 24"></svg>
                        </div>
                    )}
                    {
                        <div className="flex flex-col">
                            {followList
                                .sort((a, b) => {
                                    return b.stream?.viewer_count - a.stream?.viewer_count;
                                })
                                .map(elt => (
                                    <div
                                        className="flex flex-row items-center justify-between gap-2 px-1 mb-1 cursor-pointer"
                                        key={elt.id}
                                        onClick={() => addStream(elt.display_name)}
                                    >
                                        <div className="flex flex-col items-center">
                                            <img
                                                className="h-8 rounded-full"
                                                src={elt.profile_image_url}
                                                alt={elt.display_name}
                                            />
                                        </div>
                                        <div className="flex flex-col w-2/4">
                                            <div className="font-bold">{elt.display_name}</div>
                                            <div className="text-xs truncate">{elt.stream.game_name}</div>
                                        </div>
                                        <div className="text-center">
                                            {elt.stream.viewer_count > 1000
                                                ? `${Math.round(elt.stream.viewer_count / 100) / 10} k`
                                                : elt.stream.viewer_count}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
