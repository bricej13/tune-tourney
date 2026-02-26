import {createSignal, createRoot, onMount, createEffect} from "solid-js";
import pb from "../data/pb";
import {AuthModel, RecordModel} from "pocketbase";

function createUserStore() {
    const [user, setUser] = createSignal<AuthModel>();

    pb.authStore.onChange(() => setUser(pb.authStore.model!), true)

    const loggedIn = () => !!user()
    const login = (async (username: string, password: string): Promise<AuthModel> => {
        const authData = await pb.collection('users').authWithPassword(
            username,
            password
        );
        return authData.record
    });
    const createAccount = (async (): Promise<RecordModel> => {
        const data = {
            "username": "test1",
            "email": "test@example.com",
            "emailVisibility": false,
            "password": "Pupp1355",
            "passwordConfirm": "Pupp13557",
            "name": "test man"
        };

        await pb.collection('users').create(data);
    });
    const logout = () => {
        pb.authStore.clear()
    };


    return {
        user, loggedIn, login, createAccount, logout
    };
}

export default createRoot(createUserStore);
