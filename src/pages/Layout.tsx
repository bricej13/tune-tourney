import type { ParentComponent } from "solid-js";
import { Navbar } from "../components/Navbar";

export const Layout: ParentComponent = (props) => {
    return (
        <>
            <Navbar />
            <main>
                {props.children}
            </main>
        </>
    );
};
