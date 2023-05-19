import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './authComponents/Login';
import Heart from './mlComponents/Heart';
import Diabetes from './mlComponents/Diabetes';
import Register from './authComponents/Register';
import Navbar from './Navbar';

function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/heart" element={<Heart/>}/>
        <Route exact path="/diabetes" element={<Diabetes/>}/>
      </Routes>
    </>
  );
}

export default App;
