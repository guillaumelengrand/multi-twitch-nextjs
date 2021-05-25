import {useEffect, useState} from 'react';
import {Menu} from '../icons';
import TwitchApi from '@/lib/twitch-api';

export default function FollowTab({addStream}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [followList, setFollowList] = useState(() => []);
    useEffect(async () => {
        if (followList.length === 0) {
            updateFollows();
        }
    }, [followList]);

    const updateFollows = async () => {
        setIsLoading(true);
        const user = await TwitchApi.getUserByName();
        let request = TwitchApi.api.helix.users.getFollowsPaginated({user: user._data.id});
        let follows = await request.getAll();
        let followLiveList = [];
        for (let index = 0; index < follows.length; index++) {
            const elt = follows[index];
            const userStream = await TwitchApi.api.helix.streams.getStreamByUserId(elt._data.to_id);
            if (userStream) {
                followLiveList.push(userStream._data);
            }
        }
        setFollowList(followLiveList);
        setIsLoading(false);
    };

    const openTab = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="text-white bg-gray-700">
            <div className="p-1 cursor-pointer" onClick={openTab}>
                <Menu />
            </div>
            <div className={`relative ${isOpen ? 'block' : 'hidden'}`}>
                <div className="absolute top-0 left-0 z-10 overflow-auto text-white bg-gray-700 h-screen-96 w-52 overscroll-auto">
                    <div className="flex flex-row justify-between mt-1 ml-1 mr-2">
                        <div>Chaîne Suivie</div>
                        <img
                            className="h-6 cursor-pointer"
                            src="/refresh-cw.svg"
                            alt="refresh"
                            onClick={() => {
                                if (!isLoading) updateFollows();
                            }}
                        />
                    </div>
                    {isLoading ? (
                        <div className="text-center animate-pulse">
                            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"></svg>isLoading
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {followList
                                .sort((a, b) => {
                                    return b.viewer_count - a.viewer_count;
                                })
                                .map(elt => (
                                    <div
                                        className="flex flex-row items-center justify-between px-1 mb-1 cursor-pointer"
                                        key={elt.id}
                                        onClick={() => addStream(elt.user_name)}
                                    >
                                        <div className="flex flex-col w-3/4">
                                            <div>{elt.user_name}</div>
                                            <div className="text-xs truncate">{elt.game_name}</div>
                                        </div>
                                        <div className="text-center">
                                            {elt.viewer_count > 1000
                                                ? `${Math.round(elt.viewer_count / 100) / 10} k`
                                                : elt.viewer_count}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
