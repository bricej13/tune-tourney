import type {Component} from 'solid-js';
import {Navbar} from "./components/Navbar";

// const fetchPosts = async () => pb.collection('posts').getList(1, 50, {
//     filter: 'created >= "2022-01-01 00:00:00"',
// });

const App: Component = () => {
    // const [posts] = createResource(fetchPosts)

    return (
        <div>
            <Navbar/>
        </div>
    );
};

export default App;
