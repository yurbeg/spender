import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FIRESTORE_PATH_NAMES,ROUTE_CONSTANTS } from "../../constants/Path";
import { useNavigate } from "react-router-dom";
import { notification, Card, Row, Col, Spin, Typography,Button } from "antd";
import './index.css';

const { Title, Text } = Typography;

const History = () => {
    const navigate = useNavigate()
  const [state, setState] = useState({
    dataBase: [] as any[],
    loading: true,
    error: null as string | null,
  });

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

  const renderTransactionList = () => {
    return state.dataBase.map((transaction, index) => (
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
        style={{ marginTop: "20px", background:"#003152" }}
      >
        Go to Spender App
      </Button>
    </div>
  );
};

export default History;
