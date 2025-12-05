import { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { UserStore } from '../../store/store';
import { UserWithPassword } from '../../helpers/types/User';
import { Button, Form, Input } from 'antd';

type RegistrationFormProps = {
  onSubmit?: (values: UserWithPassword) => void;
  submitText?: string;
}

const RegistrationForm = ({ onSubmit, submitText }: RegistrationFormProps) => {
  const { user } = useSelector((state: UserStore) => state.userStore);
  const navigate = useNavigate();
  const { t } = useTranslation("register");

  const [form] = Form.useForm();

  const onFinish = (values: UserWithPassword) => {
    if (onSubmit) {
      onSubmit(values);
      return;
    }
  }

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (


    <Form layout="vertical"
      className="mt-6"
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        label={t("username")}
        name="login"
        rules={[{ required: true, message: t("loginRequired") }]}
      >
        <Input name="login" placeholder={t("login") + "..."} />
      </Form.Item>

      <Form.Item
        label={t("email")}
        name="email"
        rules={[
          { required: true, message: t("emailRequired") },
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.resolve();
              }
              if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)) {
                return Promise.reject(t("validEmail"));
              }
              return Promise.resolve();
            }
          })
        ]}
      >
        <Input name="email" placeholder={t("email") + "..."} />
      </Form.Item>

      <Form.Item
        label={t("firstName")}
        name="firstName"
        rules={[{ required: true, message: t("firstName") }]}
      >
        <Input name="firstName" placeholder={t("firstName") + "..."} />
      </Form.Item>

      <Form.Item
        label={t("lastName")}
        name="lastName"
        rules={[{ required: true, message: t("lastName") }]}
      >
        <Input name="lastName" placeholder={t("lastName") + "..."} />
      </Form.Item>
      <Form.Item
        label={t("password")}
        name="password"
        rules={[
          { required: true, message: t("passwordRequired") },
          { min: 8, message: t("passwordValidation1") },
          { max: 20, message: t("passwordValidation2") },
          () => ({
            validator(_, value) {
              if (!value) return Promise.resolve();

              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

              if (!regex.test(value)) {
                return Promise.reject(
                  new Error(t("passwordValidation3"))
                );
              }

              return Promise.resolve();
            }
          })
        ]}
      >
        <Input.Password name="password" placeholder={t("password") + "..."} />
      </Form.Item>

      <Form.Item
        label={t("confirmPassword")}
        name="passwordAgain"
        dependencies={['password']}
        rules={[
          { required: true, message: t("confirmPasswordRequired") },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("passwordMismatch")));
            }
          })
        ]}
      >
        <Input.Password name="passwordAgain" placeholder={t("confirmPassword") + "..."} />
      </Form.Item>
      <Button className="w-full" type="primary" htmlType="submit">{submitText || t("title")}</Button>
    </Form>
  )
}

export default RegistrationForm