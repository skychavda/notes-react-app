import React from 'react';
import { PropTypes, instanceOf } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline, AppBar, Toolbar, Typography, IconButton, TextField, Divider, Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import queryString from 'query-string';
import { withCookies, Cookies } from 'react-cookie';
import NodeListDrawer from '../note-list-drawer/noteListDrawer';
import { styles } from '../../material-element-style/style';
import WarningDialog from '../popup/warningDialog';

let NOTE_ID = 0;

class DisplayNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isAddNote: false,
      isNoteSaved: false,
      noteList: [],
      noteTitle: '',
      noteDiscription: '',
      latestNoteAdded: 0,
      welcomeLines: true,
      noteListLength: 0,
      noteTitleError: false,
      noteDiscriptionError: false,
      openDialog: false,
    };
    this.handleNoteDetailChange = this.handleNoteDetailChange.bind(this);
    this.getSideBarConditionFromLocalStorage = this.getSideBarConditionFromLocalStorage.bind(this);
    this.getNoteListArrayFromLocalStorage = this.getNoteListArrayFromLocalStorage.bind(this);
    this.addNewNote = this.addNewNote.bind(this);
    this.deletedNoteIsOpen = this.deletedNoteIsOpen.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
  }

  componentDidMount() {
    this.getSideBarConditionFromLocalStorage(); // get drawer condition from localstorage
    this.getNoteListArrayFromLocalStorage(); // get note list from local storage
  }

  getSideBarConditionFromLocalStorage() {
    const cachedSideBar = localStorage.getItem('isSideBarOpen');
    if (cachedSideBar === 'true') {
      this.setState({
        open: true,
      });
    }
    else {
      this.setState({
        open: false,
      });
    }
  }

  async getNoteListArrayFromLocalStorage() {
    const cachedNoteListArray = await localStorage.getItem('noteListArray');
    if (cachedNoteListArray) {
      const id = JSON.parse(cachedNoteListArray).map(note => note.id);
      if (id[id.length - 1] === undefined) {
        NOTE_ID = 0; // if list is empty
      }
      else {
        NOTE_ID = id[id.length - 1] + 1; // get the last id of array and increment by 1
      }
      this.setState({
        noteList: JSON.parse(cachedNoteListArray),
      });
    }
    this.showNote();
  }

  onCloseDialog() {
    const { history } = this.props;
    const query = { id: 0 };
    const searchString = queryString.stringify(query);
    history.push({
      search: searchString,
    });
    this.showNote(0);
  }

  handleDrawerOpen = () => {
    // const { open } = this.state;
    this.setState({ open: true }, () => {
      localStorage.setItem('isSideBarOpen', this.state.open);
    });
  };

  handleDrawerClose = () => {
    // const { open } = this.state;
    this.setState({ open: false }, () => {
      localStorage.setItem('isSideBarOpen', this.state.open);
    });
  };

  handleAddNote = () => {
    this.setState({
      isAddNote: true, isNoteSaved: false, noteTitle: '', noteDiscription: '', latestNoteAdded: '', welcomeLines: false,
    });
  }

  saveNote = async () => {
    const {
      noteList, noteTitle, noteDiscription, latestNoteAdded,
    } = this.state;
    const index = await noteList.findIndex(note => note.id === latestNoteAdded); // check weather note is exist or not
    if (index > -1) {
      this.updateNote(index, noteList, noteTitle, noteDiscription); // update existing note
    }
    else {
      this.addNewNote(noteList, noteDiscription, noteTitle); // add new note
    }
  }

  showNote = (noteId) => { // display note
    const { noteList } = this.state;
    const { history, location } = this.props;
    let value = queryString.parse(location.search);
    let index;
    /* if note id is passed by querystring id */
    if (noteId === undefined && value.id !== undefined) {
      value = queryString.parse(location.search);
      const id = parseInt(value.id, 10);
      index = noteList.findIndex(note => note.id === id);
    }
    else if (noteId !== undefined) {
      index = noteList.findIndex(note => note.id === noteId);
      const query = { id: noteId };
      const searchString = queryString.stringify(query);
      history.push({
        search: searchString,
      });
    }
    if (index > -1) {
      this.setState({
        noteTitle: noteList[index].notetitle, isNoteSaved: true, noteDiscription: noteList[index].notediscription, isAddNote: true, latestNoteAdded: noteList[index].id, welcomeLines: false,
      });
    }
    else if (index === -1) {
      this.setState({
        openDialog: true,
      });
    }
  }

  updateNote = (index, noteList, noteTitle, noteDiscription) => {
    noteList[index].notetitle = noteTitle;
    noteList[index].notediscription = noteDiscription;
    localStorage.setItem('noteListArray', JSON.stringify(noteList));
    this.setState({
      noteList,
    });
  }

  addNewNote = (noteList, noteDiscription, noteTitle) => {
    if (noteTitle === '' || noteDiscription === '') {
      this.setState({

      });
    }
    else {
      const noteId = NOTE_ID;
      const object = { id: NOTE_ID, notetitle: noteTitle, notediscription: noteDiscription };
      NOTE_ID += 1;
      noteList.push(object);
      this.setState({
        isNoteSaved: true, isAddNote: false, noteList, latestNoteAdded: noteId, noteListLength: noteList.length,
      }, () => {
        localStorage.setItem('noteListArray', JSON.stringify(noteList)); // store notelist array to local storage
      });
      const { cookies } = this.props;
      cookies.set('note', noteId, { path: '/', domain: '.letsnotes.ga' });
      this.showNote(noteId);
    }
  }

  deletedNoteIsOpen(noteId) { // if open note is delete then this method is called
    const { latestNoteAdded } = this.state;
    if (noteId === latestNoteAdded) {
      this.setState({
        noteTitle: '', isNoteSaved: false, noteDiscription: '', isAddNote: false, latestNoteAdded: noteId, welcomeLines: true,
      });
    }
  }

  handleNoteDetailChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    const { classes, theme } = this.props;
    const {
      open, isAddNote, isNoteSaved, noteTitle, noteDiscription, welcomeLines, noteListLength, latestNoteAdded, noteList, noteTitleError, noteDiscriptionError, openDialog,
    } = this.state;
    return (
      <div className={classes.root}>
        {openDialog && <WarningDialog onCloseDialog={this.onCloseDialog} />}
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap className={classes.title}>
              Notes
            </Typography>
            {isAddNote && <Button color="inherit" onClick={this.saveNote}>Save</Button>}
          </Toolbar>
        </AppBar>
        <NodeListDrawer classes={classes} theme={theme} open={open} noteListArray={noteList} latestNoteAdded={latestNoteAdded} onHandleDeletedNote={this.deletedNoteIsOpen} onHadnleDrwaer={this.handleDrawerClose} onHandleAddNote={this.handleAddNote} noteListLength={noteListLength} onHandleOpenNote={this.showNote} onHandleUpdateList={this.getNoteListArrayFromLocalStorage} />
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          {(isAddNote || isNoteSaved) && (
            <React.Fragment>
              <TextField
                name="noteTitle"
                autoFocus
                error={noteTitleError === true}
                id="outlined-bare"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ margin: 8 }}
                value={isNoteSaved === true ? noteTitle : noteTitle}
                placeholder="Enter Note Name"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.handleNoteDetailChange}
                required
                onKeyUp={this.saveNote}
              />
              <Divider variant="middle" />
              <TextField
                name="noteDiscription"
                id="outlined-bare"
                error={noteDiscriptionError === true}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ margin: 8 }}
                value={isNoteSaved === true ? noteDiscription : noteDiscription}
                placeholder="Enter your discription"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                onChange={this.handleNoteDetailChange}
                rows="10"
                onKeyUp={this.saveNote}
              />
            </React.Fragment>
          )}
          {welcomeLines && (
            <Typography align="center" noWrap variant="display2">
              Welcome to notes
            </Typography>
          )}
        </main>
      </div>
    );
  }
}

DisplayNote.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]).isRequired,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]).isRequired,
  history: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]),
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]),
  cookies: instanceOf(Cookies).isRequired,
};

DisplayNote.defaultProps = {
  history: [],
  location: [],
};

export default withCookies(withStyles(styles, { withTheme: true })(DisplayNote));
