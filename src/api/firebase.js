import * as firebase from 'firebase';
import { firebaseConfig } from '../private/private';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
