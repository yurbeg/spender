import { FC, useEffect } from 'react';
import { Dropdown, Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCurrency } from '../../state-managment/slice/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from "../../constants/Path";

import './index.css';

const Header: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuth, currency } = useSelector((state: { authSlice: { isAuth: boolean; currency: string } }) => state.authSlice);

    const handleCurrencyChange = (value: string) => {
        dispatch(setCurrency(value));
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("currency", value); 
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true }); 
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const currencyFromURL = searchParams.get("currency");
        if (currencyFromURL && currencyFromURL !== currency) {
            dispatch(setCurrency(currencyFromURL)); 
        }
    }, [location.search, currency, dispatch]);

    const handleLogOut = () => {
        dispatch(logout());
        navigate(ROUTE_CONSTANTS.LOGIN)
    };
    const handleHistoryClick = ()=>{
      navigate(ROUTE_CONSTANTS.HISTORY)
    }
    const items = [
        {
            label: "History",
            key: "0",
            onClick: () => handleHistoryClick(),
        },
        {
            label: "Logout",
            key: "1",
            onClick: () => handleLogOut(),
        },
    ];

    return (
        <div className="header-container">
            <div className="logo-section">
                <p>SPENDER</p>
            </div>
            <div className="menu">
                

                {isAuth ? (
                  <>
                  <Select 
                    value={currency} 
                    onChange={handleCurrencyChange}
                >
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="AMD">AMD</Select.Option>
                    <Select.Option value="EUR">EUR</Select.Option>
                    <Select.Option value="GBP">GBP</Select.Option>
                    <Select.Option value="RUB">RUB</Select.Option>
                </Select>
                <Dropdown trigger={['click']} menu={{ items }}>
                        <p style={{ cursor: 'pointer' }}>Menu</p>
                    </Dropdown>
                  </>
                  
                   
                ) : (
                    <Link to={ROUTE_CONSTANTS.LOGIN}>
                        <Button>Sign in</Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
