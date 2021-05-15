import NavBar from '@/components/navBar';
import TwitchEmbed from '@/components/twitch-embed';

export default function Stream({streamerName}) {
    console.log('is Twitch load');
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <TwitchEmbed channel={streamerName} />
        </div>
    );
}

export function getServerSideProps(context) {
    const {streamerName} = context.query;

    return {props: {streamerName: streamerName}};
}
