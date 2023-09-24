import { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import { SignIn } from "../../../services/AuthService";
import { useAuthDispatch } from "../../../providers/AuthProvider";
import { NotificationContext } from "../../../providers/NotificationProvider"

const schema = yup.object().shape({
  email: yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required')
});

const SignInForm = () => {

  // TODO: disable form when processing sign in
  const [, notificationDispatch] = useContext(NotificationContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const authDispatch = useAuthDispatch();
  const history = useHistory();
  const [ processing, setProcessing ] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async data => {
    try {
      setProcessing(true);
      const {
        userSession,
        attributes,
      } = await SignIn(data.email, data.password);

      authDispatch({
        type: 'login_success',
        payload: {
          userSession,
          attributes,
        }
      });

      const callbackUrl = queryParams.get('url')
      history.push(callbackUrl);
    } catch (e) {
      console.log('message?', e.message);
      switch (e.message) {
        case "User is not confirmed.":
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You already confirmed this email. Please login instead!',
            }
          });
          setProcessing(false);
          break;
        case "User does not exist.":
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'It doesn\'t seem we found your user, please sign up.',
            }
          });
          setProcessing(false);
          break;
        default:
          setProcessing(false);
          throw e;
      }

    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>E-mail address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" {...register("email", { required: true })}
          readOnly={processing} />
        <Form.Text className={errors.email ? "text-danger" : "text-muted"}>
          {errors.email ? errors.email.message : "We'll never share your email with anyone else."}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" {...register("password", {
          required: true,
          min: { value: 8, message: 'min characters not met' }
        })} readOnly={processing} />
        <Form.Text className={errors.password ? "text-danger" : "text-muted"}>
          {errors.password ? errors.password.message : "8 characters minimum please"}
        </Form.Text>
      </Form.Group>
      <Button type="submit" disabled={processing}>Submit</Button>
    </Form>
  );
}

export default SignInForm;