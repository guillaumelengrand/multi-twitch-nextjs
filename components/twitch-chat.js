import {useState} from 'react';

export function TwitchChat({channel, width = '100%', height = '100%'}) {
    const [hostname, setHostname] = useState(null);
    if (typeof window !== 'undefined' && !hostname) {
        console.log(window.location.hostname);
        setHostname(window.location.hostname);
    }
    const src = `https://www.twitch.tv/embed/${channel}/chat?darkpopout&parent=${hostname}`;

    if (hostname) return <iframe src={src} height={height} width={width}></iframe>;
    else return null;
}
