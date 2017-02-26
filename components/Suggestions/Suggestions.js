import React, { Component } from 'react';
import { Container, Header, Content, Text, Button } from 'native-base';
import getUserLocation from '../../location/location';
import { categories, getResultsFromKeyword } from '../../google/googlePlaces';
import CategoryButton from './CategoryButton';
import Results from './Results';

export default class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      results: [],
      showCategories: true,
      showResults: true,
    };

    this.getSuggestions = this.getSuggestions.bind(this);
  }

  componentWillMount() {
    getUserLocation().then((location) => {
      this.setState({ location });
    });
  }

  getSuggestions(category) {
    console.log(`Getting results for ${category}`);
    getResultsFromKeyword(this.state.location, category, 7500)
      .then((data) => {
        console.log(data.results);
        this.setState({ results: data.results });
      })
      .then(() => this.setState({ showCategories: false, showResults: true }));
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          {!this.state.showCategories &&
            <Button onPress={() => this.setState({ showCategories: true, showResults: false })}>
              <Text>Show Categories</Text>
            </Button>
          }

          {this.state.showCategories && categories.map(category => (
            <CategoryButton
              category={category}
              getSuggestions={this.getSuggestions}
              key={category}
            />
          ))}
          <Text>{this.props.groupName}</Text>
          <Text>{JSON.stringify(this.state.location)}</Text>
          {this.state.showResults &&
            <Results navigator={this.props.navigator} results={this.state.results} />
          }
        </Content>
      </Container>
    );
  }
}

Suggestions.propTypes = {
  groupName: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired,
};
