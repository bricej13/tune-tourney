import userStore from "../state/userStore";
import {Show} from "solid-js";
import { A } from "@solidjs/router";

export const Navbar = () => {
    const {user, avatar, logout, login} = userStore


    return <div class="navbar bg-primary shadow-sm text-primary-content">
        <div class="flex-1">
            <A href="/" class="btn btn-ghost text-xl">Tunes Tourney</A>
            <A href="/leagues/create" class="btn btn-ghost btn-sm ml-4">Create League</A>
        </div>
        <Show when={user()}>
            <div class="flex-none">
                <div class="dropdown dropdown-end">
                    <div tabIndex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="mask mask-squircle w-10">
                                <img
                                    title={user()?.name}
                                    alt={user()?.name}
                                    src={avatar()}/>
                            </div>
                    </div>
                    <ul
                        tabIndex="-1"
                        class="menu dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a>Settings</a></li>
                        <li onClick={logout}><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </Show>
        <Show when={!user()}>
            <button class="btn btn-neutral" onClick={login}>
                Login
            </button>
        </Show>
    </div>

}