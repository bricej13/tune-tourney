import type {Component} from "solid-js";
import userStore from "../state/userStore";
import {createSignal, Show} from "solid-js";

export const LoginForm: Component = () => {
    const {login} = userStore

    const [username, setUsername] = createSignal('')
    const [password, setPassword] = createSignal('')
    const [loggingIn, setLoggingIn] = createSignal(false)

    const [formError, setFormError] = createSignal('')
    const [usernameError, setUsernameError] = createSignal('')
    const [passwordError, setPasswordError] = createSignal('')

    const onLogin = async (e) => {
        e.preventDefault()
        try {
            setLoggingIn(true)
            await login(username(), password())
            setFormError('')
            setUsernameError('')
            setPasswordError('')
        } catch (e) {
            setFormError(e.response?.message)
            setUsernameError(e.response.data?.identity?.message)
            setPasswordError(e.response.data?.password?.message)
        } finally {
            setLoggingIn(false)
        }
    }

    return (
        <form onSubmit={onLogin} class='w-full max-w-md'>
            <Show when={!!formError()}>
                <div role="alert" className="alert alert-error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{formError()}</span>
                </div>
            </Show>

            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Username</span>
                </div>
                <input value={username()}
                       onInput={(e) => setUsername(e.currentTarget.value)}
                       type="text" placeholder="Username" className="input input-bordered w-full"/>
                <Show when={!!usernameError()}>
                    <div className="label">
                        <span className="label-text text-error">{usernameError()}</span>
                    </div>
                </Show>
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Password</span>
                </div>
                <input value={password()}
                       onInput={(e) => setPassword(e.currentTarget.value)}
                       placeholder='Password'
                       type="password" className="input input-bordered w-full"/>
                <Show when={!!passwordError()}>
                    <div className="label">
                        <span className="label-text text-error">{passwordError()}</span>
                    </div>
                </Show>
            </label>
            <button disabled={loggingIn()} type="submit" class='btn btn-primary mt-4 w-full'>
                <Show when={loggingIn()} fallback={'Submit'}>
                    <span className="loading loading-spinner"></span>
                </Show>
            </button>
        </form>
    )
}