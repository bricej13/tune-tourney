import {createRoot, createSignal} from "solid-js";
import pb from "../data/pb";
import {AuthModel} from "pocketbase";

function createUserStore() {
    const [user, setUser] = createSignal<AuthModel>();
    const [avatar, setAvatar] = createSignal<string>();
    const [spotifyToken, setSpotifyToken] = createSignal<string | null>(localStorage.getItem("spotify_access_token"));

    pb.authStore.onChange(() => {
        setUser(pb.authStore.record);
        if (pb.authStore.record) {
            setAvatar(pb.files.getURL(pb.authStore.record, pb.authStore.record.avatar))
        } else {
            setAvatar(undefined)
            setSpotifyToken(null)
            localStorage.removeItem("spotify_access_token")
        }
    }, true)

    const loggedIn = () => !!user()
    const login = () => {
        pb.collection('users').authWithOAuth2({
            provider: 'spotify'
        }).then(r => {
            if (r.meta?.accessToken) {
                setSpotifyToken(r.meta.accessToken)
                localStorage.setItem("spotify_access_token", r.meta.accessToken)
            }
        })
    };
    const getSpotifyToken = () => {
        return pb.authStore.isValid
            ? Promise.resolve(spotifyToken()!)
            : pb.collection('users').authRefresh().then(r => r.meta?.accessToken)
    }

    const logout = () => {
        pb.authStore.clear()
        setAvatar(undefined)
        setSpotifyToken(null)
        localStorage.removeItem("spotify_access_token")
    };


    return {
        user, loggedIn, login, logout, avatar, getSpotifyToken
    };
}

export default createRoot(createUserStore);
