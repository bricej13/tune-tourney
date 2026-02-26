import {createSignal, createRoot} from "solid-js";
import pb from "../data/pb";
import {AuthModel} from "pocketbase";

function createUserStore() {
    const [user, setUser] = createSignal<AuthModel>();
    const [avatar, setAvatar] = createSignal<string>();

    pb.authStore.onChange(() => {
        setUser(pb.authStore.record);
        if (pb.authStore.record) {
            setAvatar(pb.files.getURL(pb.authStore.record, pb.authStore.record.avatar))
        } else setAvatar(undefined)
    }, true)

    const loggedIn = () => !!user()
    const login = () => {
        pb.collection('users').authWithOAuth2({
            provider: 'spotify'
        })
    };

    const logout = () => {
        pb.authStore.clear()
        setAvatar(undefined)
    };


    return {
        user, loggedIn, login, logout, avatar
    };
}

export default createRoot(createUserStore);
