import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Header, Footer, Content, Button, FooterTab, Text, ListItem, Icon } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import { firebaseDB, updateUserLocation } from '../../firebase/firebaseHelpers';
import GroupMapChat from '../GroupMapChat/GroupMapChat';
import UberButton from '../UberButton/UberButton';
import CreateJoinGroup from './CreateJoinGroup';
import Search from '../Search/Search';

const styles = StyleSheet.create({
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default class GroupView extends Component {
  constructor(props, context) {
    super(props, context);
    this._handleChangePage = this._handleChangePage.bind(this);
    this.state = {
      user: this.props.user,
      users: [],
      activeGroup: 'Default',
    };
    this.usersRef = firebaseDB.ref('/users');
  }

  componentWillMount() {
    this._usersListener();
  }

  componentWillUnmount() {
    this.usersRef.off('value');
  }

  _handleChangePage(name) {
    this.setState({
      activeGroup: name,
    }, () => {
      updateUserLocation(this.state.activeGroup);
    });
    this.props.navigator.push({
      component: GroupMapChat,
      title: name + ' Group',
      passProps: {
        user: this.props.user,
        groupName: name,
      },
      rightButtonTitle: 'Search',
      onRightButtonPress: () => {
        this.props.navigator.push({
          component: Search,
          title: 'Explore the Area',
          passProps: {
            groupName: name,
          },
        });
      },
    });
  }

  _usersListener() {
    this.usersRef.on('value', (snapshot) => {
      let usersArray = [];
      snapshot.forEach((childSnapshot) => {
        usersArray.push(childSnapshot.val());
      });
      this.setState({ users: usersArray });
    }).bind(this);
  }

  render() {
    const userList = this.state.users.map((user, i) => {
      //console.log('user', user);
      return (
        <Row style={styles.li} key={i}>
          <Text>
          Name: {user.displayName}{'\n'}
          Location: {user.location ? user.location.coords.longitude : 'null'}, {user.location ? user.location.coords.latitude : 'null'}
          </Text>
        </Row>
      );
    });

    const userGroups = this.state.user.groups.map((group, i) => {
      return (
        <Row
          key={i}
          style={styles.li}
          onPress={() => this._handleChangePage(group || '')}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{  }}
            >{group}</Text>
            <Icon
              name={'arrow-forward'}
            />
          </TouchableOpacity>
        </Row>
      );
    });

    return (
      <Container>
        <Header />
        <Content>
          <CreateJoinGroup user={this.state.user} />
          <Grid>
            {userGroups}
          </Grid>
          <Button block danger>
            <Text>Leave a Group?</Text>
          </Button>
        </Content>
        <Footer>
          <FooterTab>
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

