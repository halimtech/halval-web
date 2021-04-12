import { dedupExchange, fetchExchange } from "urql"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generated/graphql"
import { betterUpdate } from "./betterUpdate"
import { cacheExchange } from "@urql/exchange-graphcache"


export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                logout: (_result, args, cache, info) => {
                    betterUpdate<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },

                login: (_result, args, cache, info) => {
                    betterUpdate<LoginMutation, MeQuery>(cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.Login.errors) {
                                return query
                            } else {
                                return {
                                    me: result.Login.user
                                }
                            }
                        }
                    )

                },
                Register: (_result, args, cache, info) => {
                    betterUpdate<RegisterMutation, MeQuery>(cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    me: result.register.user
                                }
                            }
                        }
                    )

                }
            }
        }
    }), ssrExchange, fetchExchange]
})

