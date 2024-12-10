import { useEffect, useState,FC } from "react";
import { db } from "../../services/firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { Table, Typography, Layout } from "antd";
import { FIRESTORE_PATH_NAMES } from "../../constants/Path";


const { Title, Text } = Typography;
const { Content } = Layout;



const BudgetOverview:FC= () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const [dataBase, setDataBase] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, FIRESTORE_PATH_NAMES.SPEND_DATA));
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());
        setDataBase(fetchedData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const totalSpend  = dataBase.filter((arrItem)=>{
    return arrItem.type === "Spend"
  }).reduce((acc,value)=>{
    return acc +  +value.amount
},0)
const income  = dataBase.filter((arrItem)=>{
  return arrItem.type === "Income"
}).reduce((acc,value)=>{
  return acc +  +value.amount
},0)

  console.log(totalSpend);
  
  const data = [
    {
      key: "1",
      description: "Income",
      amount: `+${income}`,
    },
    {
      key: "2",
      description: "Spend",
      amount:` -${totalSpend}`,
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
        loading={loading}
      />
    </Layout>
  );
};

export default BudgetOverview;
