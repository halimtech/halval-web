import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { Provider, createClient, fetchExchange, dedupExchange } from 'urql'
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache"
import theme from '../theme'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql"

function betterUpdate<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: 'include',
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
  }), fetchExchange]
})

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
