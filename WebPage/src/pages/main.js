import React, { Component } from 'react';
import Header from "../components/header"
import Streamers from '../components/streamers';

class Main extends Component {
    render() {
        return (
            <>
                <Header />
                <Streamers />
            </>
        );
    }
}

export default Main;