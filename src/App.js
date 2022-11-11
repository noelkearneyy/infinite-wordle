import logo from './logo.svg';
import './App.css';
import Homepage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import SettingsPage from './Pages/SettingsPage';


function App() {
  const [settings, setSettings] = useState();
  console.log('hi')

  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/settings' element={<SettingsPage setSettings={setSettings}/>} />
      <Route path='/play' element={<GamePage />} />
    </Routes>
  );
}

export default App;
