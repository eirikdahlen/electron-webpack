import React, { Component } from 'react';
import './css/VideoPicker.css';
import PropTypes from 'prop-types';

class VideoPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: {},
      currentID: '',
      currentLabel: '',
    };
    this.loaded = false;
  }

  // Switches feed when a feed-button is clicked
  switchFeed = event => {
    const btnClicked = event.target;
    const clickedLabel = btnClicked.innerHTML;
    const clickedID = this.state.devices[clickedLabel];
    this.setState({ currentID: clickedID, currentLabel: clickedLabel });
    const buttons = document.querySelectorAll('.videoButton');
    buttons.forEach(btn => {
      btn.classList.remove('selectedFeed');
    });
    btnClicked.classList.add('selectedFeed');
  };

  // Takes in a list of devices and sets the state to the data needed
  setVideoObject = devices => {
    let feeds = {};
    devices.forEach(feed => {
      let { label } = feed;
      label = label.substr(0, label.indexOf('(') - 1);
      feeds[label] = feed.deviceId;
    });
    this.setState({ devices: feeds });
  };

  // Sets Cam Link as default cam to use, but if it is not connected we use the first cam
  setDefaultID = () => {
    let { devices } = this.state;
    const keys = Object.keys(devices);
    let ID = devices[keys[0]].currentID;
    let label = keys[0];
    keys.forEach(key => {
      if (key.includes('Cam Link')) {
        ID = devices[key];
        label = key;
      }
    });
    this.setState({ currentID: ID, currentLabel: label });
  };

  init = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const feeds = devices.filter(feed => {
        return feed.kind === 'videoinput';
      });
      this.setVideoObject(feeds);
      if (!this.loaded) {
        this.setDefaultID();
      }
      this.populateDropdown();
      this.loaded = true;
    });
  };

  // Creates buttons inside the dropdown menu based on the devices-state
  populateDropdown = () => {
    const dropdown = document.getElementById('video-dropdown-content');
    dropdown.innerHTML = '';
    Object.keys(this.state.devices).forEach(key => {
      const btn = document.createElement('button');
      btn.onclick = event => {
        this.switchFeed(event);
        this.props.handleClick(this.state.currentID);
      };
      btn.innerHTML = key;
      btn.classList.add('videoButton');
      if (key === this.state.currentLabel) {
        btn.classList.add('selectedFeed');
      }
      dropdown.appendChild(btn);
    });
  };

  // componentDidMount is built-in function that is called after the inital rendering of the component
  // Adds eventlistener on resizing window, and updates width and height in state accordingly.
  componentDidMount() {
    this.init();
    navigator.mediaDevices.ondevicechange = this.init;
  }

  render() {
    return (
      <div className={this.props.hidden ? 'hideVideoFeed' : 'VideoFeed'}>
        <div className="dropdown">
          <button className="dropbtn"></button>
          <div id="video-dropdown-content"></div>
        </div>
      </div>
    );
  }
}

VideoPicker.propTypes = {
  hidden: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default VideoPicker;
