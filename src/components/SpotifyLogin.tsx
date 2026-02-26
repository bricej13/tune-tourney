import type {Component} from "solid-js";
import {createSignal} from "solid-js";
import userStore from "../state/userStore";

export const SpotifyLogin: Component = () => {
    const {login} = userStore

    const [loggingIn, setLoggingIn] = createSignal(false)


    const onLogin = async () => {
        try {
            setLoggingIn(true)
            login()
        } finally {
            setLoggingIn(false)
        }
    }

    return (
        <button disabled={loggingIn()} onClick={onLogin} class='btn btn-primary mt-4 w-full'>
            Login
        </button>
    )
}