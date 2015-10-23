require('../stylesheets/style.css');
require('../stylesheets/calendar.css');
require('../stylesheets/classMenuBar.css');
require('../stylesheets/dashboard.css');

import React from 'react';
import HomePage from './pages/HomePage.jsx';

let mountNode = document.getElementById("mount_point");

React.render(
  <HomePage user_profile = {window.APP_PROPS}/>,
  mountNode
);
