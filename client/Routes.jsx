import React from 'react';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';

import App from "./App.jsx";
import RoomList2 from "./components/RoomList2.jsx";
import Profile from "./components/Profile.jsx";
import Room from "./components/Room.jsx";
import MainSettings from "./components/MainSettings.jsx";
import RoomParent from "./components/RoomParent.jsx";
import NewRoomParent from "./components/NewRoomParent.jsx";
import MainNewRoom from "./components/MainNewRoom.jsx";
import AddUsers from "./components/AddUsers.jsx";

const Routes = React.createClass({

  render () {
    return (
      <Router history={ hashHistory }>
        <Route path="/" component={App}>
          <IndexRoute component={RoomList2}/>
          <Route path="/profile" component={ Profile } />
          <Route path="/room(/:roomId)" component={ RoomParent } >
            <IndexRoute component={ Room } />
            <Route path="/room(/:roomId)/settings" component={ MainSettings } />
            <Route path="/room(/:roomId)/addusers" component={ AddUsers } />
          </Route>
          <Route path="/newroom" component={ NewRoomParent } >
            <IndexRoute component={ MainNewRoom } />
            <Route path="/newroom/addusers" component={ AddUsers } />
          </Route>
        </Route>
      </Router>
    );
  }
});

export default Routes;
