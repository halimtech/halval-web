import React from 'react'
import { Formik, Form } from "formik"
import { Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from "next/router"
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'


interface registerProps {

}


export const Register: React.FC<registerProps> = ({ }) => {

    const [, registering] = useRegisterMutation()
    const router = useRouter()

    return (
        <Wrapper variant="small">
            <Formik initialValues={{ email: "", username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await registering({ options: values })
                    if (response.data?.register.errors) {
                        // [{field:"username", message:"somethingwrong"}]
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user) {
                        //worked
                        console.log(response.data.register.user);
                        router.push("/")
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="email"
                            label="Email"
                            placeholder="email"
                            type="email"
                        />
                        <Box mt={3}>
                            <InputField
                                name="username"
                                label="Username"
                                placeholder="username"
                            />
                        </Box>
                        <Box mt={3}>
                            <InputField
                                name="password"
                                label="Password"
                                placeholder="password"
                                type="password"
                            /></Box>

                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                            register
                        </Button>

                    </Form>
                )}
            </Formik></Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Register)