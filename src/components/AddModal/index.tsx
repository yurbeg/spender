import { FC, useState } from "react";
import { Modal, Form, Input, DatePicker, notification, Select } from "antd";
import { db } from "../../services/firebase";
import { FIRESTORE_PATH_NAMES } from "../../constants/Path";
import { doc, setDoc } from "firebase/firestore";
import dayjs from "dayjs";

interface AddModalProps {
  isOpen: boolean;
  category: string | null;
  handleClose: () => void;
}

const generateUid = () => {
  return (
    Date.now().toString(36) +
    Math.round(Math.random() + 1000000)
      .toString(36)
      .substring(1, 4)
  );
};

const AddModal: FC<AddModalProps> = ({ isOpen, category, handleClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    const spendId = generateUid();
    console.log(values);
    
    try {
      const spendModal = {
        spendId,
        ...values,
        category,
        date: values.date ? values.date.format("YYYY-MM-DD HH:mm") : null,
      };
      const createDoc = doc(db, FIRESTORE_PATH_NAMES.SPEND_DATA, spendId);
      await setDoc(createDoc, spendModal);
      form.resetFields();
      handleModalClose();
      notification.success({
        message: "Your spend has been created",
      });
    } catch {
      notification.error({
        message: "Error Ops",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Create spend for ${category}`}
      open={isOpen}
      onCancel={handleModalClose}
      onOk={() => form.submit()}
      okText="Create spend"
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
