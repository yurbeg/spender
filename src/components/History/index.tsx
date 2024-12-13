import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FIRESTORE_PATH_NAMES, ROUTE_CONSTANTS } from "../../constants/Path";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notification, Card, Row, Col, Spin, Typography, Button, Select } from "antd";
import './index.css';

const { Title, Text } = Typography;

const History = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [state, setState] = useState({
        dataBase: [] as any[],
        loading: true,
        error: null as string | null,
    });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
    const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

    const uid = useSelector((state: any) => state.authSlice.uid);

    const navigateToSpenderApp = () => {
        navigate(ROUTE_CONSTANTS.SPENDERAPP); 
    };

    useEffect(() => {
        if (!uid) return;

        const userDocRef = doc(db, FIRESTORE_PATH_NAMES.USER_TRANSACTIONS, uid);

        const unsubscribe = onSnapshot(
            userDocRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setState({
                        dataBase: userData.transactions || [],
                        loading: false,
                        error: null,
                    });
                } else {
                    setState({ dataBase: [], loading: false, error: null });
                }
            },
            (error) => {
                setState({ dataBase: [], loading: false, error: error.message });
                notification.error({
                    message: "Error loading transactions",
                    description: error.message,
                });
            }
        );

        return () => unsubscribe();
    }, [uid]);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredTransactions(
                state.dataBase.filter((transaction) => transaction.category === selectedCategory)
            );
        } else {
            setFilteredTransactions(state.dataBase);
        }
    }, [selectedCategory, state.dataBase]);

    const handleCategoryChange = (value: string | null) => {
        setSelectedCategory(value);
        if (value) {
            setSearchParams({ category: value });
        } else {
            setSearchParams({});
        }
    };

    const renderTransactionList = () => {
        return filteredTransactions.map((transaction, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={transaction.transactionId || index}>
                <Card
                    hoverable
                    className="transaction-card"
                    title={transaction.category}
                    extra={<Text>{transaction.date}</Text>}
                >
                    <p><strong>Type:</strong> {transaction.type}</p>
                    <p><strong>Description:</strong> {transaction.description}</p>
                    <p><strong>Amount:</strong> {transaction.amount} {transaction.currency}</p>
                </Card>
            </Col>
        ));
    };

    return (
        <div className="history-container">
            <Title level={2}>Transaction History</Title>
            <Select
                placeholder="Select Category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                allowClear
                style={{ marginBottom: "20px", width: "200px" }}
            >
                <Select.Option value={false}>All Categories</Select.Option>
                <Select.Option value="Food">Food</Select.Option>
                <Select.Option value="Car">Car</Select.Option>
                <Select.Option value="Shopping">Shopping</Select.Option>
                <Select.Option value="Home">Home</Select.Option>
                <Select.Option value="Income">Income</Select.Option>

            </Select>
            {state.loading ? (
                <div className="spin-container">
                    <Spin size="large" />
                </div>
            ) : state.error ? (
                <Text type="danger">{state.error}</Text>
            ) : (
                <Row gutter={[16, 16]}>{renderTransactionList()}</Row>
            )}

            <Button
                type="primary"
                onClick={navigateToSpenderApp}
                style={{ marginTop: "20px", background: "#003152" }}
            >
                Go to Spender App
            </Button>
        </div>
    );
};

export default History;
