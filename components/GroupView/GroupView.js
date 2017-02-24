import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Footer, Content, Button, FooterTab, Text } from 'native-base';
import { firebaseRef, firebaseDB, updateUserLocation } from '../../firebase/firebaseHelpers';
import GroupMapChat from '../GroupMapChat/GroupMapChat';

const styles = StyleSheet.create({
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
});

export default class GroupView extends Component {
  constructor(props, context) {
    super(props, context);
    this._handleChangePage = this._handleChangePage.bind(this);
    this.state = {
      user: this.props.user,
      users: [],
    };

    this.usersRef = firebaseDB.ref('/users');

  }

  componentWillMount() {
    this._usersListener();
    console.log('user location function', updateUserLocation);
    updateUserLocation();
  }

  _handleChangePage(name) {
    this.props.navigator.push({
      component: GroupMapChat,
      title: name + ' Group',
      passProps: {
        user: this.props.user,
        groupName: name }
    });
  }

  componentWillMount() {
    this._usersListener();
  }

  _usersListener() {
    this.usersRef.on('value', function(snapshot) {
      let usersArray = [];
      snapshot.forEach(function(childSnapshot) {
        usersArray.push(childSnapshot.val());
      })
      this.setState({ users: usersArray});
    }.bind(this))
  }

  _makeUserList() {
     userList = this.state.users.map((user, i) => {
      return (
        <View style={styles.li} key={i}>
          <Text>{user.displayName}</Text>
          <Text>Location: {user.location.coords.longitude}, {user.location.coords.latitude}</Text>
        </View>
      );
    })
   };

    const userGroups = this.state.user.groups.map((group, i) => {
      return (
        <FooterTab key = {i}>
          <Button onPress={this._handleChangePage(group)}>
            <Text>{group}</Text>
          </Button>
        </FooterTab>
      );
    });

  render() {



    return (
      <Container>
        <Header />
        <Content>
          <View>
            <Text>Group Members</Text>
            {userList}
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={this._handleChangePage}>
              <Text>Next Page</Text>
            </Button>
          </FooterTab>
          {userGroups}
          <FooterTab>
            <Button onPress={this._handleChangePage('Default')}>
              <Text>Default</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

GroupView.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

