import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity,
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
      mode: null
    };
  }
  onCreateAccount() {
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
    const logo = <View style={styles.logo}><Text style={styles.logoText}>K.I.T.</Text></View>;
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
    const loginButton = (
      <Button
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={() => this.props.actions.loginWithEmail(this.state.email, this.state.password)}
      >
        login
      </Button>
    );
    const createButton = (
      <Button
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={() => this.onCreateAccount()}
      >
        create account
      </Button>
    );
    if (!this.state.mode) {
      return (
        <LinearGradient
          colors={[COLORS.CONTACTS.PRIMARY, COLORS.CONTACTS.SECONDARY]}
          style={styles.container}
        >
          {logo}
          <View style={styles.entryButtons}>
            <Button
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => this.setState({ mode: 'login' })}
            >
              login
            </Button>
            <Button
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => this.setState({ mode: 'create' })}
            >
              create a new account
            </Button>
          </View>
        </LinearGradient>
      );
    }
    return (
      <LinearGradient
        colors={[COLORS.CONTACTS.PRIMARY, COLORS.CONTACTS.SECONDARY]}
        style={styles.container}
      >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {logo}
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
                  secureTextEntry={true}
                />
              </View>
            </View>
          </View>
          <View style={styles.loginActionButtons}>
            {this.state.mode === 'login' && loginButton}
            {this.state.mode === 'create' && createButton}
            <Button
              style={[styles.button, styles.cancelButton]}
              textStyle={styles.buttonText}
              onPress={() => this.setState({
                mode: null,
                email: '',
                password: '',
                passwordConfirm: ''
              })}
            >
              cancel
            </Button>
          </View>
        </KeyboardAvoidingView>
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
    flex: 1,
    borderWidth: 2,
    borderColor: 'white',
    marginHorizontal: 10,
    marginTop: 15
  },
  buttonText: {
    color: 'white',
    backgroundColor: 'transparent',
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
    borderRadius: 5,
    paddingHorizontal: 10,
    width: width - 20
  },
  textInput: {
    color: '#333',
    fontSize: 18,
    width: 300,
    height: 40
  },
  entryButtons: {
    height: 150,
    width: width - 20
  },
  loginActionButtons: {
    width: width - 20,
    flexDirection: 'row'
  },
  cancelButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.55)'
  }
};

export default connect(mapStateToProps, mapDispatchToActions)(Login);
