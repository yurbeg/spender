import {FC} from 'react';
import { Dropdown,Button, } from 'antd';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../../state-managment/slice/authSlice';
import { Link } from 'react-router-dom';
import  {ROUTE_CONSTANTS} from "../../constants/Path"

import './index.css';

const Header: FC = () => {
    const dispatch = useDispatch()
    const {isAuth} = useSelector((state: { authSlice: { isAuth: boolean,isLogin:boolean} }) => state.authSlice);
    const handleLogOut = ()=>{
            dispatch(logout())
    }
    const items = [
        {
          label: "Home",
          key: "0",
        },
        {
          label: "Settings",
          key: "Settings",
        },
        {
          label: "logout",
          key: "1",
          onClick:()=>handleLogOut()
        },
      ];
    return (
        <div className="header-container">
            <div className="logo-section">
                <p>SPENDER</p>
            </div>
            <div className="menu">
               {isAuth ? <Dropdown trigger={['click']} menu={{items}}>
                    <p style={{ cursor: 'pointer' }}>Menu</p>
                </Dropdown>: <Link to={ROUTE_CONSTANTS.LOGIN}><Button>Sign in</Button></Link>}
            </div>
        </div>
    );
};

export default Header;
