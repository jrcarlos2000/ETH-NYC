import React from "react";
import { Router, Route, Switch} from 'react-router-dom';
import history from "./history";
import MainPage from "./pages/MainPage";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import CreateOffer from "./pages/CreateOffer";
import { Connect } from "./Components/Connect";
import ShortstayOffer from "./pages/ShortstayOffer";

const App = () => {
    return(
            <Connect>
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={MainPage} />
                        <Route path="/feed" exact component={Feed} />
                        <Route path="/create" exact component={CreateOffer} />
                        <Route path="/profile" exact component={UserProfile} />
                        <Route path="/shortstay/:id" exact component={ShortstayOffer} />
                    </Switch>
                </Router>
            </Connect>
        )
}

export default App;