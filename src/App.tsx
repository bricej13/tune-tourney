import type {Component} from 'solid-js';
import {CreateLeagueForm} from "./components/CreateLeague";
import {Router, Route} from "@solidjs/router";
import {LeagueDetails} from "./pages/LeagueDetails";
import {RoundDetails} from "./pages/RoundDetails";
import {Leagues} from "./pages/Leagues";
import {Layout} from "./pages/Layout";

const App: Component = () => {
    return (
        <Router root={Layout}>
            <Route path="/" component={Leagues} />
            <Route path="/leagues/create" component={CreateLeagueForm} />
            <Route path="/leagues/:id" component={LeagueDetails} />
            <Route path="/leagues/:leagueId/rounds/:roundId" component={RoundDetails} />
        </Router>
    );
};

export default App;
