import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { ROUTE_CONSTANTS } from "./constants/Path";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SpenderApp from "./components/SpenderApp";
import Header from "./components/Header";
import "./App.css";

function App() {
  const { isAuth } = useSelector(
    (state: { authSlice: { isAuth: boolean; isLogin: boolean } }) =>
      state.authSlice
  );
  return (
      <Router>
        <Header /> 
        <Routes>
          <Route index element={isAuth ? <SpenderApp /> : <LoginForm />} />
          <Route path={ROUTE_CONSTANTS.REGISTER} element={<RegisterForm />} />
          <Route path={ROUTE_CONSTANTS.LOGIN} element={<LoginForm />} />
          <Route
            path={ROUTE_CONSTANTS.SPENDERAPP}
            element={!isAuth ? <LoginForm /> : <SpenderApp />}
          />
        </Routes>
      </Router>
  );
}

export default App;
