import { FC } from 'react';
import { Card, Row, Col } from 'antd';
import { CarTwoTone, HistoryOutlined, DollarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import  BudgetOverview  from "../BudgetOverview"
import './index.css';  

const Main:FC = () => {
  return (
    <div className="main-container">
        <BudgetOverview />
      <Row gutter={[30, 0]} className="card-container">
        <Col span={6}>
          <Card title="Debits" className="custom-card">
            <DollarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Auto" className="custom-card">
            <CarTwoTone style={{ fontSize: '48px', color: 'black' }} />
          </Card>
        </Col>
        <Col span={6}>    
          <Card title="Buying" className="custom-card">
            <UnorderedListOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="History" className="custom-card">
            <HistoryOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Main;
