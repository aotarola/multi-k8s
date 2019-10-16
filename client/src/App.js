import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
    <Router>
    <div className="App">
        <Link to="/">Fib calculator version 2</Link>
        <Link to="/otherpage">Other Page</Link>
      <div>
        <Route exact path="/" component={Fib} />
        <Route  path="/otherpage" component={OtherPage} />
      </div>
    </div>
    </Router>
  );
}

export default App;
