import { FC, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { CarTwoTone, HomeOutlined, ShoppingOutlined, ShopOutlined } from '@ant-design/icons';
import BudgetOverview from '../BudgetOverview';
import AddModal from '../AddModal';
import './index.css';

const Main: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true); 
  };

  const handleModalClose = () => {
    setIsModalOpen(false); 
    setSelectedCategory(null);
  };

  return (
    <div className="main-container">
      <BudgetOverview />
      <Row gutter={[30, 0]} className="card-container">
        <Col span={6}>
          <Card
            title="Food"
            className="custom-card"
            onClick={() => handleCardClick('Food')}
          >
            <ShopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Car"
            className="custom-card"
            onClick={() => handleCardClick('Car')}
          >
            <CarTwoTone style={{ fontSize: '48px', color: 'black' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Shopping"
            className="custom-card"
            onClick={() => handleCardClick('Shopping')}
          >
            <ShoppingOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Home"
            className="custom-card"
            onClick={() => handleCardClick('Home')}
          >
            <HomeOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      <AddModal
        isOpen={isModalOpen}
        category={selectedCategory}
        handleClose={handleModalClose}
      />
    </div>
  );
};

export default Main;
