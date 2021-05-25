import TwitchApi from '@/lib/twitch-api';

export default function Follows(req, res) {
    const user = await TwitchApi.getUserByName();
    //console.log('user:', user._data);
    let request = TwitchApi.api.helix.users.getFollowsPaginated({user: user._data.id}); //const follows = await request.getAll();
    console.log(request);
    let follows = await request.getAll();
    //console.log(follows);
    /*if (request.cursor) {
        let next = await request.getNext();
        console.log(next);
    }*/

    let followLiveList = [];

    for (let index = 0; index < follows.length; index++) {
        const elt = follows[index];
        const followedUser = await elt.getFollowedUser();
        //console.log(elt._data);
        //console.log(followedUser._data);
        const userStream = await followedUser.getStream();
        if (userStream) {
            //console.log(userStream);
            followLiveList.push(userStream._data);
        }
    }
}
