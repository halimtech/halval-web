import { Box, Button, Flex, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery()
    const [, logout] = useLogoutMutation()
    let body = null
    //data is loading
    if (fetching) {

        //user is not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white" mr={2}>Register</Link>
                </NextLink>
            </>
        )
        //user is logged in
    } else {
        body = (<Flex>
            <Box mr={2} >{data.me.username}</Box>
            <Button variant="link" onClick={() => {
                logout()
            }}
            >Logout</Button>
        </Flex>)
    }
    return (
        <Flex bg='teal' p={4} >

            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}