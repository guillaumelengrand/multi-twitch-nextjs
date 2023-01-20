import {ApiClient} from 'twitch';
//import { StaticAuthProvider } from "twitch-auth";
import {ClientCredentialsAuthProvider} from 'twitch-auth';

/*const clientId = "ofetjp4q2vv5z5oltu2mtzrzepcwsg";
const accessToken = "1n3uhzp61jigqwmnihlosxd74y5nfe";
const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });*/

// const clientId = process.env.CLIENTID;
// const clientSecret = process.env.CLIENTSECRET;
const clientId = 'ofetjp4q2vv5z5oltu2mtzrzepcwsg';
const clientSecret = 'hqvwlc12aqqcohd63wgqtasnkzy5k5';
// console.log({clientId, clientSecret});
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({authProvider});

async function isStreamLive(userName) {
    const user = await apiClient.helix.users.getUserByName(userName);
    if (!user) {
        return false;
    }

    return (await user.getStream()) !== null;
}

async function getTopGames() {
    var topGames = await apiClient.helix.games.getTopGames();
    if (!topGames) return false;
    return topGames;
}

async function getUserByName(userId = 'yunne42') {
    var user = await apiClient.helix.users.getUserByName(userId);
    //console.log('User: ', user);
    return user;
}

var TwitchApi = {api: apiClient, isStreamLive: isStreamLive, getTopGames: getTopGames, getUserByName: getUserByName};

TwitchApi.getStreams = async (lang = 'fr') => {
    var streams = await apiClient.helix.streams.getStreams({language: lang});
    if (!streams) return null;
    return streams;
};

export default TwitchApi;
