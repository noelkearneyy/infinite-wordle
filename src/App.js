// import logo from './logo.svg';
import './App.css';
import Homepage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SettingsPage from './Pages/SettingsPage';


function App() {
  const [settings, setSettings] = useState({
    wordLength: 5,
    tries: 6,
});

  const location = useLocation();
  const data = location.state?.savedSettings;

  useEffect(()=>{
    if(data !== undefined) {
      setSettings(data)
    }
  },[data])

  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/settings' element={<SettingsPage settings={settings} />} />
      <Route path='/play' element={<GamePage settings={settings} />} />
    </Routes>
  );
}

export default App;
