import { FC, useEffect, useState } from "react";
import { Table, Typography, Layout } from "antd";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;
const { Content } = Layout;

const BudgetOverview: FC<{ dataBase: any[] }> = ({ dataBase }) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const { currency } = useSelector(
    (state: { authSlice: { currency: string } }) => state.authSlice
  );
  const [conversionRates, setConversionRates] = useState<{
    [key: string]: number;
  } | null>(null);

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${currency}`
        );
        const data = await response.json();
        setConversionRates(data.rates);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    fetchConversionRates();
  }, []);


  
  const convertAmount = (amount: number) => {
    if (!conversionRates || !conversionRates[currency]) return amount;
    return (amount * conversionRates[currency]).toFixed(2);
  };

  const totalSpend = dataBase
    .filter((arrItem) => arrItem.type === "Spend")
    .reduce((acc, value) => acc + +value.amount, 0);

  const income = dataBase
    .filter((arrItem) => arrItem.type === "Income")
    .reduce((acc, value) => acc + +value.amount, 0);

  const data = [
    {
      key: "1",
      description: "Income",
      amount: `+${convertAmount(income)} ${currency}`,
    },
    {
      key: "2",
      description: "Spend",
      amount: `-${convertAmount(totalSpend)} ${currency}`,
    },
    {
      key: "3",
      description: "Total",
      amount: ` ${convertAmount(income - totalSpend)} ${currency}`,
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
