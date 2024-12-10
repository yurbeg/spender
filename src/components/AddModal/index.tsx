import { FC, useState } from "react";
import { Modal, Form, Input, Select, DatePicker,notification} from "antd";
import { db } from "../../services/firebase";
import { FIRESTORE_PATH_NAMES } from "../../constants/Path";
import { doc,setDoc} from 'firebase/firestore';

import dayjs from "dayjs";

interface AddModalProps {
  isOpen: boolean;
  category: string | null;
  handleClose: () => void;
}

const { Option } = Select;


 const generateUid = ()=>{
    return Date.now().toString(36) + Math.round(Math.random() + 1000000).toString(36).substring(1,4);
}


const AddModal: FC<AddModalProps> = ({ isOpen, category, handleClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handleModalClose = () => {
    form.resetFields();
    handleClose();
  };
  interface FormValues {
    type: 'income' | 'spend';
    date: dayjs.Dayjs | null;
    amount: number;
  }

  const handleOk = async (values:FormValues) => {
    setLoading(true)
    const spendId = generateUid()

    const spendModal = {
        spendId,
        ...values,
        category,
        date: values.date ? values.date.format("YYYY-MM-DD HH:mm") : null,
    }
    try{
        const createDoc = doc(db,FIRESTORE_PATH_NAMES.SPEND_DATA,spendId)
        await setDoc(createDoc,spendModal)
        form.resetFields();
        console.log(spendModal);
        handleModalClose()
        notification.success({
            message:'Your spend me been created '
        })
     
    }catch{
        notification.error({
            message:'Error Ops'
        })
    }finally{
        setLoading(false)
    }
  };

  return (
    <Modal
      title={`Create spend for ${category}`}
      open={isOpen}
      onCancel={handleModalClose}
      onOk={()=>form.submit()}
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
          label="Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <Select placeholder="Choose type">
            <Option value="income">Income</Option>
            <Option value="spend">Spend</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Date and Time"
          rules={[{ required: true, message: "Please select a date and time" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select date and time"
            defaultValue={dayjs()}
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
      </Form>
    </Modal>
  );
};

export default AddModal;
