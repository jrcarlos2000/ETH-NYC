import React from "react";
import { Router, Route, Switch} from 'react-router-dom';
import history from "./history";
import MainPage from "./pages/MainPage";
import ShortstayFeed from "./pages/shortstay/ShortstayFeed";
import UserProfile from "./pages/UserProfile";
import CreateShortstay from "./pages/shortstay/CreateShortstay";
import CreateHackerhouse from "./pages/hackerhouse/CreateHackerhouse";
import HackerhouseFeed from "./pages/hackerhouse/HackerhouseFeed";
import Hackerhouse from "./pages/hackerhouse/Hackerhouse";
import { Connect } from "./Components/Connect";
import ShortstayOffer from "./pages/shortstay/ShortstayOffer";

const App = () => {
    return(
            <Connect>
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={MainPage} />
                        <Route path="/feed" exact component={ShortstayFeed} />
                        <Route path="/create" exact component={CreateShortstay} />
                        <Route path="/profile" exact component={UserProfile} />
                        <Route path="/shortstay/:id" exact component={ShortstayOffer} />
                        <Route path="/hackerhouse/create" exact component={CreateHackerhouse} />
                        <Route path="/hackerhouse/feed" exact component={HackerhouseFeed} />
                        <Route path="/hackerhouse/:id" exact component={Hackerhouse} />
                    </Switch>
                </Router>
            </Connect>
        )
}

export default App;