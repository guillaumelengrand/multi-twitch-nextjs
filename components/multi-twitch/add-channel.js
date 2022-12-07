import {useEffect, useState} from 'react';
import {CloseSquare} from '../icons';

import TwitchApi from '@/lib/twitch-api';

export default function AddChannel({closeModal, addChan}) {
    const [searchString, setSearchString] = useState('');
    const [results, setResults] = useState([]);

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
        closeModal();
        addChan(channel);
    };
    return (
        <div className="h-full">
            <div className="inline-block float-right cursor-pointer" onClick={closeModal}>
                <CloseSquare />
            </div>
            <h2>Search Channel</h2>
            <input
                className="px-2 py-1 border border-black"
                type="text"
                placeholder="Rechercher"
                onChange={e => setSearchString(e.target.value)}
                autoFocus={true}
            />
            <div className="px-2 my-8 overflow-y-auto h-80">
                {results.length > 0 &&
                    results.map(item => (
                        <div className="my-1 cursor-pointer" onClick={() => addChannel(item.displayName)} key={item.id}>
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
    );
}
