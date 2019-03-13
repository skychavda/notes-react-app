import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import LeftSideBar from '../src/components/left-side-bar/leftSideBar';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideBarOpen: false,
    }
    this.handleSideBarReaction = this.handleSideBarReaction.bind(this);
  }

  handleSideBarReaction() {
    this.setState({
      isSideBarOpen: !this.state.isSideBarOpen,
    })
  }

  render() {
    const { classes } = this.props;
    const { isSideBarOpen } = this.state;
    console.log('Line ---- 32', isSideBarOpen);
    console.log('Line ---- 22', classes);
    return (
      <div className={classes.root}>
        <Button onClick={this.handleSideBarReaction} variant="text" color="primary">Menu</Button>
        <Grid container>
          <Grid item xs={3} className={isSideBarOpen === true ? "show-side-bar" : "hide-side-bar"}>
            <LeftSideBar />
          </Grid>
          <Grid item xs={9}>
            <LeftSideBar />
          </Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(App);
