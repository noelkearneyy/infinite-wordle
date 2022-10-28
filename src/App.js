import logo from './logo.svg';
import './App.css';
import Homepage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
import { Route, Routes } from 'react-router-dom';
import SettingsModal from './Components/SettingsModal';
import { useState } from 'react';


function App() {
  const [settings, setSettings] = useState();
  console.log('hi')

  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/settings' element={<SettingsModal setSettings={setSettings}/>} />
      <Route path='/play' element={<GamePage />} />
    </Routes>
  );
}

export default App;
