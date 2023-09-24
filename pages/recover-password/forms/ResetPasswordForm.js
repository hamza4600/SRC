import * as yup from "yup";
import {useAuthDispatch} from "../../../providers/AuthProvider";
import {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import {resetPassword, SignIn} from "../../../services/AuthService";
import urls from "../../../constants/urls";
import {NotificationContext} from "../../../providers/NotificationProvider";


const emailRequirement = yup.string().email('Must be a valid email').max(255).required('Email is required');

const schema = yup.object().shape({
  email: emailRequirement,
  password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Password Confirmation is required'),
  code: yup.string().max(255).required('Code confirmation is required'),
});

const ResetPasswordForm = () => {
  const [, notificationDispatch] = useContext(NotificationContext);
  const authDispatch = useAuthDispatch();
  const history = useHistory();
  const location = useLocation();
  const email = (location.state && location.state.email) || null;
  const [processing, setProcessing] = useState(false);

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email,
    }
  });

  const onSubmit = async data => {
    try {
      setProcessing(true);
      await resetPassword(email, data.code, data.password);
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
      history.push(urls.homePage.path);
    } catch (e) {
      console.log(e.message)
      switch(e.message) {
        case 'Invalid verification code provided, please try again.':
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You have entered an incorrect verification code, please double check the form.',
            }
          });
          setProcessing(false);
          break;
        case 'Attempt limit exceeded, please try after some time.':
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You have exceeded the password reset limit. Please try again after some time.',
            }
          });
          setProcessing(false);
          break;
        default:
          console.error('failed to reset password', e)
          setProcessing(false);
          throw e;
      }
      
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>E-Mail address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" {...register("email", {required: true})}
                      defaultValue={email} readOnly={processing || Boolean(email)}/>
        <Form.Text className={errors.email ? "text-danger" : "text-muted"}>
          {errors.email ? errors.email.message : "We'll never share your email with anyone else."}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="code">
        <Form.Label>Code</Form.Label>
        <Form.Control type="text" placeholder="Enter confirmation code" {...register("code", {required: true})}
                      readOnly={processing}/>
        <Form.Text className={errors.code ? "text-danger" : "text-muted"}>
          {errors.code ? errors.code.message : "Please enter the registration code we sent you"}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" {...register("password", {
          required: true,
          min: {value: 8, message: 'min characters not met'}
        })} readOnly={processing}/>
        <Form.Text className={errors.password ? "text-danger" : "text-muted"}>
          {errors.password ? errors.password.message : "8 characters minimum please"}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="passwordConfirmation">
        <Form.Label>Password Confirmation</Form.Label>
        <Form.Control type="password" {...register("passwordConfirmation", {
          required: true,
          min: {value: 8, message: 'min characters not met'}
        })} readOnly={processing}/>
        <Form.Text className={errors.passwordConfirmation ? "text-danger" : "text-muted"}>
          {errors.passwordConfirmation ? errors.passwordConfirmation.message : "Must match password"}
        </Form.Text>
      </Form.Group>
      <Button type="submit" disabled={processing}>Submit</Button>
    </Form>
  )
}

export default ResetPasswordForm;
