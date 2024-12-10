import { FC, useState } from "react";
import { Modal, Form, Input, DatePicker, notification, Select } from "antd";
import { db } from "../../services/firebase";
import { FIRESTORE_PATH_NAMES } from "../../constants/Path";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { useSelector } from "react-redux"; 

interface AddModalProps {
  isOpen: boolean;
  category: string | null;
  handleClose: () => void;
  setDataBase: (data: any[]) => void;
}

const generateUid = () => {
  return (
    Date.now().toString(36) +
    Math.round(Math.random() * 1000000)
      .toString(36)
      .substring(1, 4)
  );
};

const AddModal: FC<AddModalProps> = ({ isOpen, category, handleClose, setDataBase }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const uid = useSelector((state: any) => state.authSlice.uid);

  const handleModalClose = () => {
    form.resetFields();
    handleClose();
  };

  interface FormValues {
    type: "Income" | "Spend";
    date: dayjs.Dayjs | null;
    amount: number;
    description: string;
  }

  const handleOk = async (values: FormValues) => {
    if (!uid) {
      notification.error({
        message: "Error",
        description: "Could not retrieve user UID",
      });
      return;
    }

    setLoading(true);
    const transactionId = generateUid(); 
    try {
      const transactionData = {
        transactionId,
        ...values,
        category,
        date: values.date ? values.date.format("YYYY-MM-DD HH:mm") : null,
      };

      const userDocRef = doc(db, FIRESTORE_PATH_NAMES.USER_TRANSACTIONS, uid);

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const updatedTransactions = [...userDocSnapshot.data()?.transactions, transactionData];

        await updateDoc(userDocRef, {
          transactions: updatedTransactions,
        });

        if (setDataBase) {
          setDataBase(updatedTransactions); 
        }
      } else {
        await setDoc(userDocRef, {
          transactions: [transactionData],
        });

        if (setDataBase) {
          setDataBase([transactionData]); 
        }
      }

      form.resetFields();
      handleModalClose();
      notification.success({
        message: "Transaction has been added",
      });
    } catch (error) {
      notification.error({
        message: "Error while saving transaction",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Create transaction for ${category}`}
      open={isOpen}
      onCancel={handleModalClose}
      onOk={() => form.submit()}
      okText="Create transaction"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOk}
        initialValues={{
          date: dayjs(),
        }}
      >
        <Form.Item
          name="type"
          label="Transaction Type"
          rules={[{ required: true, message: "Please select a transaction type" }]}
        >
          <Select
            placeholder="Select type"
            options={[
              { label: "Income", value: "Income" },
              { label: "Spend", value: "Spend" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date and Time"
          rules={[{ required: true, message: "Please select a date and time" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select date and time"
            showTime
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please enter the amount" }]}
        >
          <Input type="number" placeholder="Enter amount" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input type="text" placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
