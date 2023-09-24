import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useState} from "react";
import {requestPasswordReset} from "../../../services/AuthService";
import urls from "../../../constants/urls";
import {useHistory} from "react-router-dom";

const schema = yup.object().shape({
    email: yup.string().email('Must be a valid email').max(255).required('Email is required')
});

const RequestPasswordResetForm = () => {

    const history = useHistory();
    const [processing, setProcessing] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async data => {
        try {
            setProcessing(true);
            const response = await requestPasswordReset(data.email);
            console.log('response', response);
            if (response.CodeDeliveryDetails.AttributeName === 'email') {
                history.push({
                    pathname: urls.resetPassword.path,
                    state: data,
                });
            } else {
                setProcessing(false);
                throw new Error(`unrecognizable confirmation process ${response.codeDeliveryDetails.AttributeName}`);
            }
            setProcessing(false);
        } catch (e) {
            console.error('failed to request password reset', e);
            setProcessing(false);
            throw e;
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>E-Mail address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" {...register("email", { required: true })} readOnly={processing} />
                <Form.Text className={errors.email ? "text-danger" : "text-muted"}>
                    {errors.email ? errors.email.message : "We'll never share your email with anyone else."}
                </Form.Text>
            </Form.Group>
            <Button type="submit" disabled={processing}>Submit</Button>
        </Form>
    );
}

export default RequestPasswordResetForm;
