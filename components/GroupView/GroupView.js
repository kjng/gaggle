import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Left, Right, Body, Footer, Content, Form, Item, Input, Icon, Button, Title, FooterTab } from 'native-base';
import GroupMapChat from '../GroupMapChat/GroupMapChat.js';
import GetUsers from './GetUsers.js';
import firebaseRef from '../../firebase/config.js';
import firebase from 'firebase';
import MapDisplay from '../MapDisplay/MapDisplay.js';


const firebasedb = firebase.database();

export default class GroupView extends Component {
  constructor(props, context) {
    super(props, context);
    this._handleChangePage = this._handleChangePage.bind(this);
    this.state = {
      users: []
    };

    this.usersRef = firebase.database().ref('/users');
  }

  _handleChangePage() {
    this.props.navigator.push({
      component: GroupMapChat,
      title: 'GroupNameGoesHere',
      passProps: {
        user: this.props.user
      }
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

  render() {

    const userList = this.state.users.map((user, i) => {
      return (
        <View key={i}>
          <Text> {'\u2022'} {user.displayName}</Text>
          <Text></Text>
        </View>
      )
    });

    return (
      <Container>
        <Header>
          <Left></Left>
          <Body></Body>
          <Right></Right>
        </Header>
        <Content>
          <View>
             <MapDisplay />
          </View>
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
        </Footer>
      </Container>
    );
  }
}
