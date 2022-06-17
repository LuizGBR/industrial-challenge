import { MainPage } from "./pages/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateMinute } from "./pages/CreateMinute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
          element={
          <MainPage isHomePage>
            <div /> 
          </MainPage>
        } />
        <Route path="/minute"
          element={
          <MainPage >
            <CreateMinute />
          </MainPage>
        } />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
