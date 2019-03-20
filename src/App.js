import React, { Component } from 'react';
// import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DisplayNote from './components/left-side-bar/displayNote';
import PageNoteFound from './components/page-not-found/pageNotFound';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideBarOpen: false,
    };
    this.handleSideBarReaction = this.handleSideBarReaction.bind(this);
  }

  handleSideBarReaction() {
    const { isSideBarOpen } = this.state;
    this.setState({
      isSideBarOpen: !isSideBarOpen,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Router>
          <Switch>
            <Route path="/" component={DisplayNote} exact />
            <Route component={PageNoteFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]).isRequired,
};

export default withStyles(styles)(App);
