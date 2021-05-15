import TwitchApi from '@/lib/twitch-api';
import useScript from 'hooks/use-script';
import Head from 'next/head';
import {useEffect, useState} from 'react';
export default function TwitchEmbed({channel}) {
    const [twitchLoad, setTwitchLoad] = useState(false);
    useEffect(() => {
        try {
            if (!twitchLoad && typeof Twitch != 'undefined') {
                new Twitch.Embed('twitch-embed', {
                    width: '100%',
                    height: '100%',
                    channel: channel,
                    // Only needed if this page is going to be embedded on other websites
                    //parent: ['embed.example.com', 'othersite.example.com', 'localhost:3000'],
                });
                setTwitchLoad(true);
            }
        } catch (err) {
            console.error('twitch crash ', err);
        }
    });

    return (
        <div className="h-full">
            <Head>
                <script src="https://embed.twitch.tv/embed/v1.js"></script>
            </Head>
            <div id="twitch-embed" className="h-full"></div>
        </div>
    );
}
