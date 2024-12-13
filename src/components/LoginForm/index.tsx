import { FC, useState } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ROUTE_CONSTANTS } from "../../constants/Path";
import { auth } from "../../services/firebase";
import { useDispatch } from "react-redux";
import { login } from "../../state-managment/slice/authSlice";
import { useNavigate } from "react-router-dom";
import "./index.css";

const { Link } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user?.uid;
      if (uid) {
        dispatch(login({ uid }));
        notification.success({
          message: "Login Successful",
          description: "You have logged in successfully!",
        });

        navigate(ROUTE_CONSTANTS.SPENDERAPP);
      } else {
        throw new Error("Failed to retrieve user UID.");
      }
    } catch (error) {
      notification.error({
        message: "Login Error",
        description: "There was an error logging you in.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-content">
        <h2>Login</h2>
        <Form
          name="login_form"
          onFinish={onFinish}
          initialValues={{
            remember: true,
          }}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not a valid E-mail!",
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
            ]}
          >
            <Input.Password placeholder="Password"/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
          </Form.Item>

          <Form.Item  className="form-item-right">
            <Typography.Text>Don't have an account? </Typography.Text>
            <Link href={ROUTE_CONSTANTS.REGISTER}>Register</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
