import React, { Component } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import "./assets/mycss.css";

class VPhsl extends Component {
  player = {}

  onPlayerReady(player) {
    //console.log("Player is ready: ", player);
    this.player = player;
    //this.player.play();
  }

  onVideoPlay(duration) {
    //console.log("Video played at: ", duration);
  }

  onVideoPause(duration) {
    //console.log("Video paused at: ", duration);
  }

  onVideoTimeUpdate(duration) {
    //console.log("Time updated: ", duration);
  }

  onVideoSeeking(duration) {
    //console.log("Video seeking: ", duration);
  }

  onVideoSeeked(from, to) {
    //console.log(`Video seeked from ${from} to ${to}`);
  }

  onVideoEnd() {
    //console.log("Video ended");
  }

  render() {
    return (
      <ReactHlsPlayer
        src={this.props.src}
        //poster={this.props.poster}
        preload="auto"
        autoPlay={false}
        width={this.props.width}
        height={this.props.height}
        onPlay={this.onVideoPlay.bind(this)}
        onPause={this.onVideoPause.bind(this)}
        onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
        onSeeking={this.onVideoSeeking.bind(this)}
        onSeeked={this.onVideoSeeked.bind(this)}
        onError={(error) => console.log(error)}
      />
    );
  }
}
export default VPhsl;