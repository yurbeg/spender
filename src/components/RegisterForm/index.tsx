import { FC } from "react";
import { Form, Input, Button, Typography,notification } from "antd";
import { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,db} from '../../services/firebase';
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from 'firebase/firestore';
import { FIRESTORE_PATH_NAMES,ROUTE_CONSTANTS } from "../../constants/Path";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

const { Link } = Typography;

const RegisterForm: FC = () => {
  const [loading,setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const onFinish = async (values: RegisterFormData) => {
    setLoading(true)
    const { name, email, password } = values;

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = response.user;
      const createdDoc = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid);
      await setDoc(createdDoc, {
        uid, name, email
      });
      notification.success({
        message: 'Registration Successful',
        description: 'You have registered successfully!',
      });
      navigate(ROUTE_CONSTANTS.LOGIN);
      
    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div>
      <div className="form-content">
        <h2>Register</h2>
        <Form
          name="register_form"
          onFinish={onFinish}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
            ]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Typography.Text>Already have an account? </Typography.Text>
            <Link href={ROUTE_CONSTANTS.LOGIN}>Login</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
