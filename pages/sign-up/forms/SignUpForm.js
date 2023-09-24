import {useContext,useEffect} from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { SignUp } from "../../../services/AuthService";
import { useHistory } from "react-router";
import urls from "../../../constants/urls";
import {useState} from "react";
import {NotificationContext} from "../../../providers/NotificationProvider";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const phoneRegex = /^(?:\d{2}-\d{3}-\d{3}-\d{3}|\d{11})$/
const schema = yup.object().shape({
    fullName: yup.string().max(255).required('Name is required'),
    phoneNumber: yup.string().matches(phoneRegex, 'Phone Number is invalid').required('Phone Number is required'),
    email: yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required')
});


const SignUpForm = () => {
    
    // TODO: disable form when processing sign in
    const [processing, setProcessing] = useState();
  
    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handlePhoneNumberChange = (value, country, event, formattedValue) => {
        setValue('phoneNumber', value, { shouldDirty: true})
      }
    
    useEffect(() => {
        const subscription = watch((value, { name, type }) => console.log());
        return () => subscription.unsubscribe();
      }, [watch]);

    const history = useHistory();
    const defaultPhone = ""
    const notificationDispatch = useContext(NotificationContext);

    const onSubmit = async data => {

        try {
            setProcessing(true);
            const response = await SignUp(data.fullName,"+" + data.phoneNumber, data.email, data.password);
            if (response.codeDeliveryDetails.AttributeName === 'email') {
                history.push({
                    pathname: urls.confirmEmailPage.path,
                    state: data,
                });
            } else {
                setProcessing(false);
                throw new Error(`unrecognizable confirmation process ${response.codeDeliveryDetails.AttributeName}`);
            }
        } catch (e) {
            // exceptions to handle:
            //  UsernameExistsException
            //  InvalidParameterException
            switch(e.message) {
                case "An account with the given email already exists.":
                  notificationDispatch({
                    type: 'error',
                    payload: {
                      message: 'Seems you already have an account. Please login instead!',
                    }
                  });
                  setProcessing(false);
                  break;
                case "Invalid phone number format.":
                  notificationDispatch({
                    type: 'error',
                    payload: {
                      message: 'Phone number format is invalid. Please check the form!',
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

    return (
        <Form onSubmit={handleSubmit(onSubmit)} data-testid="SignUpform" autoComplete="off">
            <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" autoComplete="off" placeholder="Enter full name" {...register("fullName", { required: true })} readOnly={processing} />
                <Form.Text className={errors.fullName ? "text-danger" : "text-muted"}>
                    {errors.fullName ? errors.fullName.message : "We'll never share your name with anyone else."}
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>E-mail address</Form.Label>
                <Form.Control type="text" autoComplete="off" placeholder="Enter email" {...register("email", { required: true })} readOnly={processing} />
                <Form.Text className={errors.email ? "text-danger" : "text-muted"}>
                    {errors.email ? errors.email.message : "We'll never share your email with anyone else."}
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <PhoneInput
                
                    specialLabel=''
                    value={defaultPhone}
                    onChange={handlePhoneNumberChange}
                    country={'us'}
                    inputStyle={{
                        width: "100%"
                    }}
                    inputProps={{
                    name: 'phoneNumber'
                    
                }} />
                <Form.Text className={errors.phoneNumber ? "text-danger" : "text-muted"}>
                        {errors.phoneNumber ? errors.phoneNumber.message : "Select your country then enter the digits of your phone number"}
                </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" autoComplete="off" {...register("password", { required: true, min: {value: 8, message: 'min characters not met'} })} readOnly={processing} />
                <Form.Text className={errors.password ? "text-danger" : "text-muted"}>
                    {errors.password ? errors.password.message : "8 characters minimum please"}
                </Form.Text>
            </Form.Group>
            <Button type="submit" disabled={processing}>Submit</Button>
        </Form>
    );
}

export default SignUpForm;
