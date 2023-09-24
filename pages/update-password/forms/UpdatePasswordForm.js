import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {updatePassword} from "../../../services/AuthService";
import {useHistory} from "react-router";
import urls from "../../../constants/urls";
import {useState, useContext} from "react";
import {NotificationContext} from "../../../providers/NotificationProvider";

const schema = yup.object().shape({
  oldPassword: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  newPasswordConfirm: yup.string().oneOf([yup.ref('newPassword'), null], 'Must match New Password').required('New Password Confirmation is required'),
});

const UpdatePasswordForm = () => {
  const [, notificationDispatch] = useContext(NotificationContext);
  const history = useHistory();
  const [processing, setProcessing] = useState(false);
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async data => {
    try {
      setProcessing(true);
      await updatePassword(data.oldPassword, data.newPassword);
      history.push(urls.homePage.path);
      setProcessing(false);
    } catch (e) {
      console.log(e.message)
      switch(e.message) {
        case 'Incorrect username or password.':
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You have entered an incorrect password, please double check the form.',
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
          setProcessing(false);
        console.error('failed to update password', e);
        throw e;
      }
    }
  };

  console.log('errors', errors);
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="oldPassword">
        <Form.Label>Old Password</Form.Label>
        <Form.Control type="password" {...register("oldPassword", {
          required: true,
          min: {value: 8, message: 'min characters not met'}
        })} readOnly={processing}/>
        <Form.Text className={errors.oldPassword ? "text-danger" : "text-muted"}>
          {errors.oldPassword ? errors.oldPassword.message : "8 characters minimum please"}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control type="password" {...register("newPassword", {
          required: true,
          min: {value: 8, message: 'min characters not met'}
        })} readOnly={processing}/>
        <Form.Text className={errors.newPassword ? "text-danger" : "text-muted"}>
          {errors.newPassword ? errors.newPassword.message : "8 characters minimum please"}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPasswordConfirm">
        <Form.Label>New Password Confirmation</Form.Label>
        <Form.Control type="password" {...register("newPasswordConfirm", {
          required: true,
          min: {value: 8, message: 'min characters not met'}
        })} readOnly={processing}/>
        <Form.Text className={errors.newPasswordConfirm ? "text-danger" : "text-muted"}>
          {errors.newPasswordConfirm ? errors.newPasswordConfirm.message : "Must match new password"}
        </Form.Text>
      </Form.Group>
      <Button type="submit" disabled={processing}>Submit</Button>
    </Form>
  );
}

export default UpdatePasswordForm;
