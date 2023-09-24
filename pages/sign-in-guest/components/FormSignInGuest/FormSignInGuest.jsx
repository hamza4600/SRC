import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import { useAuthDispatch } from "../../../../providers/AuthProvider";
import { SignInAsGuestService } from '../../../../services/SignInAsGuestService'
import { RenewSessionListener } from '../../../../common/listeners/RenewSessionListener/RenewSessionListener'

const signInGuestSchema = yup.object().shape({
  fullName: yup.string().max(255).required("Name is required"),
});

const FULL_NAME_MESSAGE = "We'll never share your name with anyone else."

const FormSignInGuest = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const authDispatch = useAuthDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInGuestSchema),
  });

  const startListener = (ttl) => {
    const fifteenMinutesInMs = 900000;
    const durationInMilliseconds = ttl - fifteenMinutesInMs

    return (
      <RenewSessionListener durationInMilliseconds={durationInMilliseconds} />
    )
  }

  const onSubmit = async (data) => {
    setIsLoading(true);    

    try {
      const response = await SignInAsGuestService(data)
      authDispatch({
        type: 'user_as_a_guest',
        payload: {
          attributes: {
            name: data.fullName
          }
        }
      })
      startListener(response.ttl);
      const callbackUrl = queryParams.get('url') || '/';
      history.push(callbackUrl);
    } catch (err) {
      return;
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-4" controlId="fullName">
        <Form.Label>Full name</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          placeholder="Enter full name"
          {...register("fullName", { required: true })}
          readOnly={isLoading}
        />
        <Form.Text className={errors.fullName ? "text-danger" : "text-muted"}>
          {errors.fullName ? errors.fullName.message : FULL_NAME_MESSAGE}
        </Form.Text>
      </Form.Group>
      <Button type="submit" disabled={isLoading}>Submit</Button>
    </Form>
  );
};

export default FormSignInGuest;
