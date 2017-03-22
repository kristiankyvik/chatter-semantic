import React from "react";
import { IndexRoute, Router, Route, createMemoryHistory } from "react-router";

import App from "./App.jsx";
import RoomListParent from "./components/RoomListParent.jsx";
import Room from "./components/Room.jsx";
import RoomParent from "./components/RoomParent.jsx";
import NewRoomParent from "./components/NewRoomParent.jsx";
import MainNewRoom from "./components/MainNewRoom.jsx";
import AddUsers from "./components/AddUsers.jsx";

const routes = (
  <Route path="/" component={ App }>
    <IndexRoute component={ RoomListParent }/>
    <Route path="/room(/:roomId)" component={ RoomParent } >
      <IndexRoute component={ Room } />
      <Route path="/room(/:roomId)/addusers" component={ AddUsers } />
    </Route>
    <Route path="/newroom" component={ NewRoomParent } >
      <IndexRoute component={ MainNewRoom } />
    </Route>
  </Route>
);

const history = createMemoryHistory('/');


const ChatterApp = React.createClass({

  render () {
    return (
      <Router history={ history }>
        {routes}
      </Router>
    );
  }
});

export default ChatterApp;
