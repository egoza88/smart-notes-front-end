import React from 'react';
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
import './App.css';

const axios = require('axios');

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    };
  }

  render() {
    return(
      <div className="app-container">
        <SidebarComponent 
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}></SidebarComponent>
        {
          this.state.selectedNote ?
          <EditorComponent selectedNote={this.state.selectedNote}
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          noteUpdate={this.noteUpdate}></EditorComponent> :
          null
        }
      </div>
    );
  }

  componentDidMount = () => {
    axios.get("https://secure-escarpment-47914.herokuapp.com/notes/")
    .then(serverUpdate => {
      const notes = serverUpdate.data.map(doc => {
        doc['id'] = doc.id;
        doc['body'] = doc.content;
        doc['title'] = doc.header;
        return doc;
      });
      console.log(notes);
      this.setState({ notes: notes });
    })
    .catch();
  }

  selectNote = (note, index) => this.setState({ selectedNoteIndex: index, selectedNote: note });
  noteUpdate = async (id, noteObj) => {
    const options = {
      headers: {'Content-Type': 'application/json'}
    };

    var data = await axios.post('https://secure-escarpment-47914.herokuapp.com/notes/save/', {
      id: id,
      header: noteObj.title,
      content: noteObj.body,
      timestamp: Math.floor(Date.now() / 1000)
    }, options)
    .then(function (response) {
      console.log(response.data);
      console.log("SENDED");
      return response.data;
    })
    .catch(function (error) {
      console.log("ERROR");
    });

    this.state.selectedNote.title = noteObj.title;
    this.state.selectedNote.body = data.content;
    // this.componentDidMount();
    console.log(data.content);
  }
  
  newNote = async (title) => {
    const note = {
      id: '0',
      title: title,
      body: ''
    };

    const options = {
      headers: {'Content-Type': 'application/json'}
    };

    const newFromDB = await axios.post('https://secure-escarpment-47914.herokuapp.com/notes/save/', {
      header: title,
      content: "<p></p>",
      timestamp: Math.floor(Date.now() / 1000)
    }, options)
    .then(function (response) {
      return response.data;
    }).catch(function (response) {
      console.log("ERROR" + response)
    });

    const newID = newFromDB.id;
    note.id = newID;
    await this.setState({ notes: [...this.state.notes, note] });
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note => _note.id === newID)[0]);
    this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex });
  }
  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    await this.setState({ notes: this.state.notes.filter(_note => _note !== note) });
    if(this.state.selectedNoteIndex === noteIndex) {
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    } else {
      this.state.notes.length > 1 ?
      this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1) :
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    }

    axios.delete('https://secure-escarpment-47914.herokuapp.com/notes/delete/' + note.id, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then("DELETED: " + note.id); 
  }
}

export default App;
