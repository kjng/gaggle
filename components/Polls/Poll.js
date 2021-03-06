import React, { Component } from 'react';
import { ListView, View, TextInput, Alert, Dimensions } from 'react-native';
import { Container, Content, Text, Button, Icon } from 'native-base';
import { firebaseDB, getCurrentUserId } from '../../firebase/firebaseHelpers';
import Option from './Option';

export default class Poll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.groupName ? this.props.groupName : 'Default',
      pollID: this.props.pollID,
      pollTxt: this.props.pollTxt,
      input: '',
      options: [],
      totalVotes: 0,
    };
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.addOption = this.addOption.bind(this);
    this.updateOption = this.updateOption.bind(this);
    this.removeOption = this.removeOption.bind(this);

    this.optionRef = firebaseDB.ref(`/groups/${this.state.group}/polls/${this.state.pollID}/options/`);
  }


  componentDidMount() {
    this.getOptions();
  }

  componentWillUnmount() {
    this.optionRef.off();
  }


  getOptions() {
    this.optionRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        let total = 0;
        snapshot.forEach((opt) => {
          total += opt.child('votes').val();
        });
        this.setState({
          options: snapshot.val(),
          totalVotes: total,
        }, () => {
          console.log('STATE votes', this.state.totalVotes);
        });
      } else {
        this.setState({
          options: [],
        });
      }
    });
  }

  addOption() {
    const optRef = this.optionRef.push();
    let options = this.state.options;
    let unique = true;
    for (var opt in options) {
      if(options[opt]['text'].toLowerCase() === this.state.input.toLowerCase()) {
        unique = false;
      }
    }
    if (unique) {
      optRef.set({
        text: this.state.input,
        votes: 0,
        id: optRef.key,
        responses: { 'dummy': 'data' },
      }, (error) => {
        if (error) {
          console.log('Transaction failed abnormally!', error);
        }
      }).then(() => {
        this.setState({
          input: '',
        });
      });
    } else {
      console.log('Sorry, no duplicate entries!');
      Alert.alert(
        'Oops!',
        `Sorry, no duplicate entries!`,
        [
          { text: 'Dismiss' },
        ],
      );
    }
  }

  updateOption(optionObj) {
    const userID = getCurrentUserId();
    this.optionRef.child(optionObj.id).transaction((opt) => {
      // if(!opt.responses.exists()) {
      //   opt.responses[userID] = false; //make sure it exists before changing
      // }
      if (opt) {
        if (opt.text.toLowerCase() === optionObj.text.toLowerCase()) {
          if (opt.responses[userID]) {
            opt.responses[userID] = null;
          } else {
            opt.responses[userID] = true;
          }
          opt.votes = optionObj.votes;

          //update totalVotes count
          if (opt.votes < optionObj.votes) {
            this.setState({
              totalVotes: this.state.totalVotes + 1,
            });
          } else {
            this.setState({
              totalVotes: this.state.totalVotes - 1,
            });
          }
        }
      } else {
        console.log('option is null');
      }
      return opt;
    }, (error, committed, snapshot) => {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      }
      console.log('UpdateOption Committed: ', committed, 'Option data: ', snapshot.val());
    });
  }


  removeOption(optionObj) {
    this.optionRef.child(optionObj.id).remove()
      .then(() => {
        console.log('Remove succeeded.');
      })
      .catch((error) => {
        console.log('Remove failed: ' + error.message);
      });
  }

  render() {
    return (
      <Container>
        <Content>
          <View style={{ flex: 1, paddingTop: 80, height: Dimensions.get('window').height - 50, marginLeft: -10 }}>
            { this.state.options.length === 0 &&
              <View>
                <Text
                  style={{
                    color: 'grey',
                    textAlign: 'center',
                    marginVertical: 10,
                  }}
                >
                  {'Enter options to choose from!'}
                </Text>
                <Icon
                    name={'ios-arrow-down'}
                    style={{
                      color: 'orange',
                      flexDirection: 'row',
                      textAlign: 'center',
                    }}
                />
                <Icon
                    name={'ios-arrow-down'}
                    style={{
                      color: 'orange',
                      flexDirection: 'row',
                      textAlign: 'center',
                    }}
                />
                <Icon
                    name={'ios-arrow-down'}
                    style={{
                      color: 'orange',
                      flexDirection: 'row',
                      textAlign: 'center',
                    }}
                />
                <Icon
                    name={'ios-arrow-down'}
                    style={{
                      color: 'orange',
                      flexDirection: 'row',
                      textAlign: 'center',
                    }}
                />
                <Icon
                    name={'ios-arrow-down'}
                    style={{
                      color: 'orange',
                      flexDirection: 'row',
                      textAlign: 'center',
                    }}
                />
                <Icon
                    name={'ios-arrow-down'}
                    style={{
                      color: 'orange',
                      flexDirection: 'row',
                      textAlign: 'center',
                    }}
                />
              </View>
            }

            <ListView
              enableEmptySections
              dataSource={this.ds.cloneWithRows(this.state.options)}
              renderRow={(rowData) =>
                <Option
                  id={rowData.id}
                  text={rowData.text}
                  votes={rowData.votes}
                  totalVotes={this.state.totalVotes}
                  responses={rowData.responses}
                  updateOption={this.updateOption}
                  removeOption={this.removeOption}
                />
              }
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: 'lightgrey',
            }}
          >
            <View style={{ flex: 3, height: 50 }}>
              <TextInput
                style={{
                  flex: 1,
                  borderColor: 'grey',
                  borderWidth: 1,
                  paddingLeft: 10,
                  margin: 10,
                }}
                placeholder="Enter a new option"
                value={this.state.input}
                onChangeText={(t) => this.setState({ input: t })}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}
            >
              <Button small onPress={this.addOption} disabled={this.state.input.length < 1}>
                <Text style={{ color: 'white' }}>Add</Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

Poll.propTypes = {
  groupName: React.PropTypes.string.isRequired,
  pollID: React.PropTypes.string.isRequired,
  pollTxt: React.PropTypes.string.isRequired,
};
