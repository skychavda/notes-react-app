import React from 'react';
import PropTypes, { number } from 'prop-types';
import {
  Drawer, List, Divider, IconButton, ListItem, TextField, Button, Typography, Menu, MenuItem,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { options, ITEM_HEIGHT } from '../../material-element-style/style';

class NoteListDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteList: props.noteListArray,
      filterNoteList: props.noteListArray,
      anchorEl: null,
      deleteNoteIndex: '',
      selectedListIndex: props.latestNoteAdded,
    };
    this.addNoteListToArray = this.addNoteListToArray.bind(this);
    this.handleSearchUser = this.handleSearchUser.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { noteListArray, latestNoteAdded } = this.props;
    if (prevProps.noteListArray !== noteListArray || prevProps.latestNoteAdded !== latestNoteAdded) {
      this.addNoteListToArray();
    }
  }

  handleClick = (event, id) => { // three dot menu open
    this.setState({ anchorEl: event.currentTarget, deleteNoteIndex: id });
  };

  handleClose = () => { // three dot menu close
    this.setState({ anchorEl: null });
  };

  handleDelete = () => { // delete note
    const { noteList, deleteNoteIndex } = this.state;
    const { onHandleUpdateList, onHandleDeletedNote } = this.props;
    const noteIndex = noteList.findIndex(note => note.id === deleteNoteIndex);
    if (noteIndex > -1) {
      noteList.splice(noteIndex, 1);
      this.setState({ anchorEl: null, noteList, selectedListIndex: '' }, () => {
        localStorage.setItem('noteListArray', JSON.stringify(noteList));
        onHandleUpdateList();
        onHandleDeletedNote(deleteNoteIndex);
      });
    }
  }

  handleDrawerClose = () => {
    const { onHadnleDrwaer } = this.props;
    onHadnleDrwaer();
  }

  openAddNote = () => { // make new note and allow to add note
    const { onHandleAddNote } = this.props;
    this.setState({ selectedListIndex: '' }, () => {
      onHandleAddNote();
    });
  }

  addNoteListToArray() { // add localstorage note list to state
    const { noteListArray, latestNoteAdded } = this.props;
    this.setState({
      noteList: noteListArray,
      filterNoteList: noteListArray,
      selectedListIndex: latestNoteAdded,
    });
  }

  handleSearchUser(e) { // search note within list
    const { filterNoteList } = this.state;
    const filterNoteLists = filterNoteList.filter(note => note.notetitle.toLowerCase().includes(e.target.value));
    this.setState({
      noteList: filterNoteLists,
    });
  }

  displayNote(noteId, index) { // display note when user click on note
    const { onHandleOpenNote } = this.props;
    this.setState({
      selectedListIndex: index,
    });
    onHandleOpenNote(noteId);
  }

  render() {
    const {
      open, classes, theme,
    } = this.props;
    const { noteList, anchorEl, selectedListIndex } = this.state;
    const openThreeDotMenu = Boolean(anchorEl);
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <TextField
          className="search-text-field"
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
          label="Search"
          variant="outlined"
          id="custom-css-outlined-input"
          type="search"
          onChange={e => this.handleSearchUser(e)}
        />
        <Button variant="outlined" className="add-note-btn" onClick={this.openAddNote}>Add</Button>
        <List style={{
          maxHeight: '800px',
          position: 'relative',
          overflow: 'auto',
        }}
        >
          {noteList.map((note, index) => (
            <div style={{ display: 'flex' }} className={classes.title} key={note.id}>
              <ListItem button key={note.id} onClick={() => this.displayNote(note.id, index)} className={classes.title} selected={selectedListIndex === index}>
                <Typography>
                  <span style={{ fontWeight: '600' }}>{note.notetitle}</span>
                  <br />
                  {note.notediscription}
                </Typography>
              </ListItem>
              <div>
                <IconButton
                  aria-label="More"
                  aria-owns={openThreeDotMenu ? 'long-menu' : undefined}
                  aria-haspopup="true"
                  onClick={e => this.handleClick(e, note.id)}
                  style={{ zIndex: '9999' }}
                >
                  <MoreVertIcon style={{ zIndex: '10' }} />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={openThreeDotMenu}
                  onClose={this.handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: 200,
                    },
                  }}
                >
                  <MenuItem key={options} onClick={this.handleDelete}>
                    {options}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}
        </List>
      </Drawer>
    );
  }
}

NoteListDrawer.propTypes = {
  onHandleOpenNote: PropTypes.func,
  onHadnleDrwaer: PropTypes.func,
  onHandleAddNote: PropTypes.func,
  onHandleUpdateList: PropTypes.func,
  open: PropTypes.bool,
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]),
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]),
  onHandleDeletedNote: PropTypes.func,
  noteListArray: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object, PropTypes.array]),
  latestNoteAdded: number,
};

NoteListDrawer.defaultProps = {
  onHandleOpenNote: () => null,
  onHadnleDrwaer: () => null,
  onHandleAddNote: () => null,
  onHandleUpdateList: () => null,
  open: true,
  classes: [],
  theme: [],
  onHandleDeletedNote: () => null,
  noteListArray: [],
  latestNoteAdded: 0,
};

export default NoteListDrawer;
