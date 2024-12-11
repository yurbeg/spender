import { FC, useState, useEffect } from "react";
import { Card, Row, Col, Button, Spin, notification } from "antd";
import {
  CarTwoTone,
  HomeOutlined,
  ShoppingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FIRESTORE_PATH_NAMES } from "../../constants/Path";
import BudgetOverview from "../BudgetOverview";
import AddModal from "../AddModal";
import { useSelector } from "react-redux";
import "./index.css";

const SpenderApp: FC = () => {
  const [state, setState] = useState({
    dataBase: [] as any[],
    loading: true,
    error: null as string | null,
  });
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const uid = useSelector((state: any) => state.authSlice.uid);

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

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleUpdateDataBase = (newData: any[]) => {
    setState((prevState) => ({
      ...prevState,
      dataBase: newData,
    }));
  };

  return (
    <div className="main-container">
      {state.loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
        </div>
      ) : state.error ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <span style={{ color: "red" }}>{state.error}</span>
        </div>
      ) : (
        <>
          <BudgetOverview dataBase={state.dataBase} />
          <Row gutter={[30, 0]} className="card-container">
            <Col span={6}>
              <Card
                title="Food"
                className="custom-card"
                onClick={() => handleCardClick("Food")}
              >
                <ShopOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Car"
                className="custom-card"
                onClick={() => handleCardClick("Car")}
              >
                <CarTwoTone style={{ fontSize: "48px", color: "black" }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Shopping"
                className="custom-card"
                onClick={() => handleCardClick("Shopping")}
              >
                <ShoppingOutlined
                  style={{ fontSize: "48px", color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Home"
                className="custom-card"
                onClick={() => handleCardClick("Home")}
              >
                <HomeOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} />
              </Card>
            </Col>
          </Row>
          <AddModal
            isOpen={isModalOpen}
            category={selectedCategory}
            handleClose={handleModalClose}
            setDataBase={handleUpdateDataBase}  
          />
          <div className="income-button-container">
      
            <Button type="primary"   style={{  background:"#003152" }} onClick={() => handleCardClick("Income")} >
              Income
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SpenderApp;