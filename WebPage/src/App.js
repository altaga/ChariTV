// Basic
import { Component } from "react";

// Router
import {
  Routes,
  Route,
} from "react-router-dom";

// Utils
import { ContextProvider } from "./utils/contextModule";

// Pages
import Main from "./pages/main";
import Streamer from "./pages/streamer";

class App extends Component {
  render() {
    return (
      <ContextProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/streamer/:pub" element={<Streamer />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </ContextProvider>
    );
  }
}

export default App;
