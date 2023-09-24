import {useContext} from "react";
import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {ConfirmEmail, resendConfirmation, SignIn} from "../../../services/AuthService";
import {useAuthDispatch} from "../../../providers/AuthProvider";
import {useHistory, useLocation} from "react-router";
import urls from "../../../constants/urls";
import {useState} from "react";
import {NotificationContext} from "../../../providers/NotificationProvider";

const emailRequirement = yup.string().email('Must be a valid email').max(255).required('Email is required');

const schema = yup.object().shape({
  email: emailRequirement,
  password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  code: yup.string().max(255).required('Code confirmation is required'),
});

const PasswordField = ({password, register, errors, processing}) => {

  if (password) return null;

  return (
    <Form.Group className="mb-3" controlId="password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" autoComplete="off" {...register("password", {
        required: true,
        min: {value: 8, message: 'min characters not met'}
      })} disabled={processing}/>
      <Form.Text className={errors.password ? "text-danger" : "text-muted"}>
        {errors.password ? errors.password.message : "8 characters minimum please"}
      </Form.Text>
    </Form.Group>
  )
}

/**
 * There are 2 ways that the user can get here.
 *      1) by url directly, in which case the location.state will be undefined
 *      2) redirected from the sign up page, in which case the location.state will have
 *         email and password.
 *
 * If user comes directly to URL, we will require password. Otherwise, we use their credentials
 *      Automatically.
 */
const ConfirmEmailForm = () => {
  const authDispatch = useAuthDispatch();
  const history = useHistory();
  const location = useLocation();
  const [, notificationDispatch] = useContext(NotificationContext);
  const email = (location.state && location.state.email) || null;
  const password = (location.state && location.state.password) || null;
  const [processing, setProcessing] = useState(false);

  const {register, handleSubmit, formState: {errors}, watch} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email,
      password,
    }
  });

  const onSubmit = async data => {
    const signInEmail = email || data.email
    const signInPassword = password || data.password

    try {
      setProcessing(true);
      await ConfirmEmail(data.email, data.code);
      const {
        userSession,
        attributes,
      } = await SignIn(signInEmail, signInPassword);

      authDispatch({
        type: 'login_success',
        payload: {
          userSession,
          attributes,
        }
      });
      history.push(urls.homePage.path);
    } catch (e) {
      // exceptions to handle:
      //  UserNotFoundException
      //  NotAuthorizedException: User cannot be confirmed. Current status is CONFIRMED
      //  CodeMismatchException: Invalid verification code provided, please try again.

      switch(e.message) {
        case "User cannot be confirmed. Current status is CONFIRMED":
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You already confirmed this email. Please login instead!',
            }
          });
          setProcessing(false);
          break;
        case "Invalid verification code provided, please try again.":
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'Invalid verification code. Please check the form!',
            }
          });
          setProcessing(false);
          break;
        default:
          console.error('failed to submit email confirmation', e);
          setProcessing(false);
          throw e;
      }
    }
  };

  let disableCodeResend = true;
  const resendCodeEmail = email || watch('email');
  try {
    emailRequirement.validateSync(resendCodeEmail);
    disableCodeResend = false;
  } catch (e) {
  }

  const resendCode = async (email) => {
    console.log('resendCode');
    try {
      setProcessing(true);
      await resendConfirmation({email});
      setProcessing(false);
    } catch (e) {
      console.log('failed to submit email confirmation', e)
      setProcessing(false);
      throw e;
    }
  }
  console.log(errors);

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
      <PasswordField password={password} register={register} errors={errors} processing={processing}/>
      <Form.Group className="mb-3" controlId="code">
        <Form.Label>Code</Form.Label>
        <Form.Control type="text" placeholder="Enter confirmation code" {...register("code", {required: true})}
                      readOnly={processing}/>
        <Form.Text className={errors.code ? "text-danger" : "text-muted"}>
          {errors.code ? errors.code.message : "Please enter the registration code we sent you"}
        </Form.Text>
      </Form.Group>
      <Button type="submit" disabled={processing}>Submit</Button>
      <Button variant="link" onClick={() => resendCode(resendCodeEmail)} disabled={processing || disableCodeResend}>Resend
        confirmation E-Mail</Button>
    </Form>
  );
}

export default ConfirmEmailForm;
