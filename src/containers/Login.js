import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Dimensions, Alert } from 'react-native';
import Button from 'apsl-react-native-button';
import * as Actions from '../actions';
import { COLORS } from '../data/constants';

import { testEmail, testPassword } from '../private/private';

const { width } = Dimensions.get('window');

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      mode: 'login'
    };
  }
  onCreateAccount() {
    if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert('Password Error', 'Passwords don\'t match.');
      return;
    }
    this.props.actions.createAccountWithEmail(this.state.email, this.state.password);
  }
  onToggleMode(mode) {
    this.setState({
      mode,
      email: '',
      password: '',
      passwordConfirm: ''
    });
  }
  render() {
    const logo = <Text style={styles.logoText}>K.I.T.</Text>;
    if (!this.props.authChecked) {
      return (
        <LinearGradient
          colors={[COLORS.CONTACTS.PRIMARY, COLORS.CONTACTS.SECONDARY]}
          style={styles.container}
        >
          {logo}
          <ActivityIndicator color="white" size="large" />
        </LinearGradient>
      );
    }
    const loginButtonStyle =
      [styles.toggleButton, styles.loginToggle,
        this.state.mode === 'login' ? styles.selectedToggle : {}];
    const createButtonStyle =
      [styles.toggleButton, styles.createToggle,
        this.state.mode === 'create' ? styles.selectedToggle : {}];
    const loginTextStyle =
      [styles.toggleButtonText, this.state.mode === 'login' ? styles.selectedToggleText : {}];
    const createTextStyle =
      [styles.toggleButtonText, this.state.mode === 'create' ? styles.selectedToggleText : {}];
    const passwordConfirmBox = this.state.mode === 'create' && (
      <View style={styles.loginRow}>
        <Text style={styles.labelText}>confirm password</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={this.state.passwordConfirm}
            onChangeText={text => this.setState({ passwordConfirm: text })}
            secureTextEntry
          />
        </View>
      </View>
    );
    const loginButton = this.state.mode === 'login' && (
      <Button
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={() => this.props.actions.loginWithEmail(this.state.email, this.state.password)}
      >
        login
      </Button>
    );
    const createButton = this.state.mode === 'create' && (
      <Button
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={() => this.onCreateAccount()}
      >
        create an account
      </Button>
    );
    return (
      <LinearGradient
        colors={[COLORS.CONTACTS.PRIMARY, COLORS.CONTACTS.SECONDARY]}
        style={styles.container}
      >
        {logo}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={loginButtonStyle}
            onPress={() => this.onToggleMode('login')}
          >
            <Text style={loginTextStyle}>log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={createButtonStyle}
            onPress={() => this.onToggleMode('create')}
          >
            <Text style={createTextStyle}>sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <View style={styles.loginRow}>
            <Text style={styles.labelText}>email</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="pat@example.com"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
            </View>
          </View>
          <View style={styles.loginRow}>
            <Text style={styles.labelText}>password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={this.state.password}
                onChangeText={text => this.setState({ password: text })}
                secureTextEntry
              />
            </View>
          </View>
          {passwordConfirmBox}
        </View>
        {loginButton}
        {createButton}
      </LinearGradient>
    );
  }
}

Login.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func),
  authChecked: PropTypes.bool.isRequired,
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 72
  },
  button: {
    borderWidth: 2,
    borderColor: 'white',
    marginHorizontal: 10,
    marginTop: 15
  },
  buttonText: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: width - 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: 'transparent'
  },
  toggleButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  // loginToggle: {
  //   borderTopLeftRadius: 10,
  // },
  // createToggle: {
  //   borderTopRightRadius: 10
  // },
  selectedToggle: {
    backgroundColor: COLORS.CONTACTS.PRIMARY
  },
  selectedToggleText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    fontSize: 18
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16
  },
  loginContainer: {

  },
  loginRow: {
    width: width - 20,
    marginHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center'
  },
  labelText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 20,
    marginBottom: 5
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: width - 20
  },
  textInput: {
    color: '#333',
    fontSize: 18,
    width: 300,
    height: 30
  }
};

export default connect(mapStateToProps, mapDispatchToActions)(Login);
