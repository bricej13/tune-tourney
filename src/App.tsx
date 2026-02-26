import type {Component} from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import pb from "./data/pb";
import {createResource, For} from "solid-js";
import {LoginForm} from "./components/LoginForm";
import userStore from "./state/userStore";

const fetchPosts = async () => pb.collection('posts').getList(1, 50, {
    filter: 'created >= "2022-01-01 00:00:00"',
});

const App: Component = () => {

    const {user} = userStore
    const [posts] = createResource(fetchPosts)

    return (
        <div>
            <div>Hello {user()?.name}</div>

            <LoginForm />
            <For each={posts.latest?.items}>
                {(post) =>
                    <div>
                        <h1 class='card-title' title={post.id}>{post.title}</h1>
                        <div innerHTML={post.article}>
                        </div>
                    </div>
                }

            </For>
        </div>
    );
};

export default App;
