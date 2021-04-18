import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useForgotPasswordMutation } from '../generated/graphql'
import { useState } from 'react'


const ForgotPassword: React.FC<{}> = ({ }) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation()
    return (<Wrapper variant="small">
        <Formik initialValues={{ email: "" }}
            onSubmit={async (values) => {
                await forgotPassword(values);
                setComplete(true);
            }}>
            {({ isSubmitting }) => complete ?
                <Box>We sent you an email if this account exists</Box>
                : <Form>
                    <Box mt={4}>
                        <InputField
                            name="email"
                            label="email"
                            placeholder="Email"
                            type="email"
                        /></Box>


                    <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                        Forgot Password
                </Button>


                </Form>
            }
        </Formik></Wrapper>)
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)