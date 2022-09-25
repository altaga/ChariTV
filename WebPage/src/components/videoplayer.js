import React, { Component } from 'react';
import VideoPlayer from 'react-video-js-player';
import "./assets/mycss.css";

class VP extends Component {
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
      <VideoPlayer
        controls={true}
        src={this.props.src}
        //poster={this.props.poster}
        preload="auto"
        width={this.props.width}
        height={this.props.height}
        onReady={this.onPlayerReady.bind(this)}
        onPlay={this.onVideoPlay.bind(this)}
        onPause={this.onVideoPause.bind(this)}
        onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
        onSeeking={this.onVideoSeeking.bind(this)}
        onSeeked={this.onVideoSeeked.bind(this)}
        onEnd={this.onVideoEnd.bind(this)}
        onError={(error) => console.log(error)}
      />
    );
  }
}
export default VP;