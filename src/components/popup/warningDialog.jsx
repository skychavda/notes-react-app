import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';

class WarningDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const { onCloseDialog } = this.props;
    this.setState({ open: false });
    onCloseDialog();
  };

  render() {
    const { open } = this.state;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Caution'}
          {' '}
          <span role="img" aria-label="caution">🚫</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'No note found with provided id'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            {'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

WarningDialog.propTypes = {
  onCloseDialog: PropTypes.func,
};

WarningDialog.defaultProps = {
  onCloseDialog: () => null,
};

export default WarningDialog;
