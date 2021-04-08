import { Route, Switch } from 'react-router-dom';
import Signup from './Pages/Auth/Signup/Signup';
import Login from './Pages/Auth/Login/Login';
import Home from './Pages/Home/Home';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/profile/:userId' component={Home} />
      </Switch>
    </div>
  );
}

export default App;
