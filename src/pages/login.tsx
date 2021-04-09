import React from 'react'
import { Formik, Form } from "formik"
import { Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from "next/router"


interface registerProps {

}


export const Login: React.FC<registerProps> = ({ }) => {

    const [, loginin] = useLoginMutation()
    const router = useRouter()

    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await loginin({ options: values })
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
                            name="username"
                            label="Username"
                            placeholder="username"
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

export default Login