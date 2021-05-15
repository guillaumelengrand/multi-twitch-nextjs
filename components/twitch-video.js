import {useState} from 'react';

export default function TwitchVideo({
    channel,
    width = '100%',
    height = '100%',
    allowfullscreen = true,
    autoplay = false,
}) {
    const [hostname, setHostname] = useState(null);
    if (typeof window !== 'undefined' && !hostname) {
        console.log(window.location.hostname);
        setHostname(window.location.hostname);
    }
    const src = `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=${autoplay}`;
    if (hostname) return <iframe src={src} height={height} width={width} allowFullScreen={allowfullscreen}></iframe>;
    else return null;
}
