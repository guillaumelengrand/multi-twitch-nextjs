import {useEffect, useState} from 'react';
import {CloseSquare} from '../icons';

import TwitchApi from '@/lib/twitch-api';

export default function AddChannel({closeModal, addChan}) {
    const [searchString, setSearchString] = useState('');
    const [channelAdd, setChannelAdd] = useState('');
    const [results, setResults] = useState([]);
    const [favList, setFavList] = useState([]);

    useEffect(async () => {
        let saveFavList = localStorage.getItem('favList');
        if (saveFavList != null) setFavList(JSON.parse(saveFavList));
    }, []);
    useEffect(async () => {
        if (searchString.length > 2) {
            const streams = await TwitchApi.api.helix.search.searchChannels(searchString);
            //const channels = await TwitchApi.api.kraken.search.searchChannels(searchString);
            //console.log('channels: ', channels);
            console.log('streams', {streams: streams.data});
            setResults(streams.data);
        } else {
            setResults([]);
        }
    }, [searchString]);

    const addChannel = channel => {
        let newFavList = [...favList, {name: channel}];
        setFavList(newFavList);
        localStorage.setItem('favList', JSON.stringify(newFavList));
        // closeModal();
        setChannelAdd('');
        addChan(channel);
    };

    const removeFav = channel => {
        let newFavList = favList.filter(fav => fav.name != channel.name);
        localStorage.setItem('favList', JSON.stringify(newFavList));
        setFavList(newFavList);
    };

    return (
        <div className="h-full overflow-hidden">
            <div className="inline-block float-right cursor-pointer" onClick={closeModal}>
                <CloseSquare />
            </div>
            <div className="flex flex-row gap-1">
                <div className="flex flex-col items-center w-1/2 gap-1">
                    <h2>Search Channel</h2>
                    <input
                        className="w-full px-2 py-1 border border-black"
                        type="text"
                        placeholder="Rechercher une chaîne"
                        onChange={e => setSearchString(e.target.value)}
                        autoFocus={true}
                    />
                    <div className="w-full px-2 my-8 overflow-y-auto h-80">
                        {results.length > 0 &&
                            results.map(item => (
                                <div
                                    className="my-1 cursor-pointer"
                                    onClick={() => addChannel(item.displayName)}
                                    key={item.id}
                                >
                                    <img
                                        className="inline-block w-10 rounded-full"
                                        src={item.thumbnailUrl}
                                        alt={item.displayName}
                                    />
                                    <div className="inline-block px-2">{item.displayName}</div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex flex-col items-center w-1/2 gap-1">
                    <h2>Direct Add Channel</h2>
                    <input
                        className="w-full px-2 py-1 border border-black"
                        type="text"
                        placeholder="Ajouter une chaîne"
                        onChange={e => setChannelAdd(e.target.value)}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                addChannel(channelAdd);
                            }
                        }}
                        autoFocus={true}
                    />
                    <button className="w-1/2 border border-black rounded" onClick={e => addChannel(channelAdd)}>
                        Ajouter
                    </button>
                    <div className="flex flex-col w-full gap-1 px-2 overflow-y-auto border border-black h-80">
                        {favList?.map(fav => (
                            <div className="flex flex-row justify-between border-b border-black" key={fav.name}>
                                <button className="px-2" onClick={e => addChan(fav.name)}>
                                    {fav.name}
                                </button>
                                <button className="text-red-600" onClick={e => removeFav(fav)}>
                                    <CloseSquare />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
