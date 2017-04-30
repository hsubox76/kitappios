import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';

const activeColor = {
  r: 0,
  g: 149,
  b: 156
};

const inactiveValue = 204;

class FacebookTabBar extends Component {
  constructor() {
    super();
    this.tabIcons = [];
    this.setAnimationValue = this.setAnimationValue.bind(this);
  }

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  // color between activeColor and grey inactiveColor
  iconColor(progress) {
    const red = activeColor.r + (inactiveValue - activeColor.r) * progress;
    const green = activeColor.g + (inactiveValue - activeColor.g) * progress;
    const blue = activeColor.b + (inactiveValue - activeColor.b) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    const activeColorString = `rgb(${activeColor.r},${activeColor.g},${activeColor.b})`;
    const inactiveColorString = `rgb(${inactiveValue},${inactiveValue},${inactiveValue})`;
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              this.props.goToPage(i);
            }}
            style={styles.tab}
          >
            <Icon
              name={tab}
              size={40}
              color={this.props.activeTab === i ? activeColorString : inactiveColorString}
              ref={(icon) => { this.tabIcons[i] = icon; }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

FacebookTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
  scrollValue: PropTypes.object,
  style: PropTypes.object,
  setPageIndex: PropTypes.func,
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 55,
    flexDirection: 'row',
    paddingTop: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});

export default FacebookTabBar;
