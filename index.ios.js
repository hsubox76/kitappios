/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import KitApp from './src/KitApp.js';

class Main extends Component {
  render() {
    return (
      <KitApp />
    );
  }
}

AppRegistry.registerComponent('kitappios', () => Main);
