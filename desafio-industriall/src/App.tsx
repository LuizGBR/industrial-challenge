import { MainPage } from "./pages/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MinuteForm } from "./components/Form";
import { MinuteList } from "./components/List";


function App() {
  return (
		<BrowserRouter>
			<Routes>
				<Route path="/" 
					element={
					<MainPage isHomePage>
						<MinuteList /> 
					</MainPage>
				}/>
				<Route path="/minute-form"
					element={
					<MainPage >
						<MinuteForm />
					</MainPage>
				}>
					<Route path=":id"
						element={
							<MainPage >
								<MinuteForm />
							</MainPage>	
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
    
  );
}

export default App;
