import React from 'react'
import { Formik, Form } from "formik"
import { Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from "next/router"
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'


interface registerProps {

}


export const Login: React.FC<registerProps> = ({ }) => {

    const [, loginin] = useLoginMutation()
    const router = useRouter()

    return (
        <Wrapper variant="small">
            <Formik initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await loginin(values)
                    if (response.data?.Login.errors) {
                        // [{field:"username", message:"somethingwrong"}]
                        setErrors(toErrorMap(response.data.Login.errors))
                    } else if (response.data?.Login.user) {
                        //worked
                        console.log(response.data.Login.user);
                        router.push("/")
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            label="Username or Email"
                            placeholder="username or Email"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                label="Password"
                                placeholder="password"
                                type="password"
                            /></Box>

                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                            Login
                        </Button>

                    </Form>
                )}
            </Formik></Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Login)