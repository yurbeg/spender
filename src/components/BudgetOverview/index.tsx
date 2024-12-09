import { Table, Typography, Layout } from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;
const BudgetOverview = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const data = [
    {
      key: "1",
      description: "Income",
      amount: "+0",
    },
    {
      key: "2",
      description: "Spend",
      amount: "-0",
    },
  ];

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];
  return (
    <Layout style={{ background: "#fff" }}>
      <Content style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#4A90E2",
            fontFamily: "Courier New, monospace",
            fontStyle: "italic",
          }}
        >
          Spender App
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "18px",
            color: "#333",
          }}
        >
          Year: {year}
        </Text>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "18px",
            color: "#333",
          }}
        >
          Month: {month + 1}
        </Text>
      </Content>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        style={{ marginTop: "20px" }}
      />
    </Layout>
  );
};
export default BudgetOverview;
