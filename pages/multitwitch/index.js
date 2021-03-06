import NavBar from '@/components/navBar';
import {TwitchChat} from '@/components/twitch-chat';
import TwitchVideo from '@/components/twitch-video';
import {CloseSquare, MinusSquare, PlusCircle} from '@/components/icons';
import Modal from 'react-modal';
import React, {useState} from 'react';
import {useRouter} from 'next/router';
import AddChannel from '@/components/multi-twitch/add-channel';
import FollowTab from '@/components/multi-twitch/follow-tab';

import TwitchApi from '@/lib/twitch-api';
import Head from 'next/head';

const customStyles = {
    content: {
        top: '20%',
        left: '20%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-40%',
        //transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '50%',
    },
};

Modal.setAppElement('#__next');

export default function MutliTwitch({channels}) {
    const router = useRouter();
    const [channelsState, setChannelsState] = useState(channels);
    const [channelsReduce, setChannelsReduce] = useState([]);
    const [chatChannel, setChatChannel] = useState(() => (channels && channels.length > 0 ? channels[0] : ''));
    const [modalIsOpen, setIsOpen] = useState(false);

    const closeChan = channel => {
        const newChannels = channelsState.filter(item => item != channel);
        router.push(
            {
                pathname: '/multitwitch',
                query: {channels: newChannels.join()},
            },
            undefined,
            {shallow: true},
        );
        if (newChannels.length > 0 && channel === chatChannel) setChatChannel(newChannels[0]);
        setChannelsState(newChannels);
    };
    const reducechan = channel => {
        const newChannels = channelsState.filter(item => item != channel);
        if (newChannels.length > 0 && channel === chatChannel) setChatChannel(newChannels[0]);
        setChannelsState(newChannels);
        var newReduceChan = [...channelsReduce];
        newReduceChan.push(channel);
        setChannelsReduce(newReduceChan);
    };
    const openChannel = channel => {
        const newReduceChan = channelsReduce.filter(item => item != channel);

        var newChannels = [...channelsState];
        newChannels.push(channel);
        setChannelsState(newChannels);

        setChannelsReduce(newReduceChan);
    };
    const addChan = channel => {
        var newChannels = [...channelsState];
        if (channelsState.includes(channel)) return;
        newChannels.push(channel);
        router.push(
            {
                pathname: '/multitwitch',
                query: {channels: newChannels.join()},
            },
            undefined,
            {shallow: true},
        );
        setChatChannel(channel);
        setChannelsState(newChannels);
    };
    const changeChat = channel => {
        setChatChannel(channel);
    };
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //subtitle.style.color = '#f00';
    }

    return (
        <div className="flex flex-col h-screen bg-black">
            <Head>
                <title>multiTwitch - Multi-Twitch</title>
            </Head>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <AddChannel closeModal={() => setIsOpen(false)} addChan={addChan} />
            </Modal>

            <div className="flex flex-row-reverse">
                <div className="px-2 pt-1 font-bold bg-green-500 cursor-pointer w-28" onClick={() => setIsOpen(true)}>
                    <PlusCircle className="inline-block" /> <span>Ajouter</span>
                </div>
                <div className="w-full pt-1 text-white">
                    <NavBar />
                </div>
                <div>
                    <FollowTab addStream={addChan} />
                </div>
            </div>
            <div className={`flex flex-row h-full`}>
                <div className="flex flex-col w-5/6 ">
                    <div
                        className={`flex ${
                            channelsState && channelsState.length === 2 ? 'flex-col' : 'flex-wrap'
                        } justify-center h-full`}
                    >
                        {channelsState &&
                            channelsState.map(channel => (
                                <div
                                    className={`relative ${
                                        channelsState.length <= 2 ? 'w-full h-full' : 'w-1/2'
                                    } border border-red-900 hover-trigger`}
                                    key={channel}
                                >
                                    <TwitchVideo channel={channel} />
                                    <div className="absolute z-10 px-2 pt-1 text-white bg-black bg-opacity-75 top-1 right-1 hover-target">
                                        <div
                                            className="inline-block text-blue-900 cursor-pointer"
                                            onClick={() => reducechan(channel)}
                                        >
                                            <MinusSquare />
                                        </div>
                                        <div
                                            className="inline-block text-red-900 cursor-pointer"
                                            onClick={() => closeChan(channel)}
                                        >
                                            <CloseSquare />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="flex flex-row justify-center">
                        {channelsReduce.map((channel, i) => (
                            <div
                                className="inline-block px-2 mr-1 bg-white border-t-2 border-l-2 border-r-2 border-purple-600 rounded-t cursor-pointer"
                                onClick={() => openChannel(channel)}
                                key={i}
                            >
                                {channel}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center w-1/5 ">
                    {channels && (
                        <React.Fragment>
                            <div className="py-1 text-white">{chatChannel}</div>
                            {channelsState.map(channel => (
                                <div
                                    className={`h-full w-full ${chatChannel != channel ? 'hidden' : ''}`}
                                    key={`${channel}-chat`}
                                >
                                    <TwitchChat channel={channel} />
                                </div>
                            ))}
                            <div className="flex flex-wrap">
                                {channelsState.length > 1 &&
                                    channelsState.map((channel, i) => (
                                        <div
                                            className="inline-block px-2 mr-1 bg-white border-t-2 border-l-2 border-r-2 border-purple-600 rounded-t cursor-pointer"
                                            onClick={() => changeChat(channel)}
                                            key={i}
                                        >
                                            {channel}
                                        </div>
                                    ))}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const {channels} = context.query;
    if (!channels) return {props: {channels: []}};
    const tmp = decodeURI(channels);
    const channelArray = tmp.split(',');
    return {
        props: {
            channels: channelArray,
        },
    };
}
