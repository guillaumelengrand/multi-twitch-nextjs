import TwitchVideo from '@/components/twitch-video';
import {CloseSquare, MinusSquare} from '@/components/icons';
export default function PlayerContainer({channel, clickHandler}) {
    const closeChan = () => {};
    return (
        <div className="relative w-1/2 border border-red-900 hover-trigger">
            <TwitchVideo channel={channel} />
            <div className="absolute z-10 px-2 pt-1 text-white bg-black bg-opacity-75 top-1 right-1 hover-target">
                <div className="inline-block text-blue-900 cursor-pointer">
                    <MinusSquare />
                </div>
                <div className="inline-block text-red-900 cursor-pointer" onClick={clickHandler}>
                    <CloseSquare />
                </div>
            </div>
        </div>
    );
}
