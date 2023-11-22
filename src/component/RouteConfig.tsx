// @ts-ignore
/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, lazy, Suspense } from 'react'
import { PokemonContext } from './PokemonContext'
import Loading from '../image/cut-loop.webp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import { css } from '@emotion/react'

const PokemonList = lazy(() => import('./PokemonList'))
const PokemonDetail = lazy(() => import('./PokemonDetail'))
const PokemonDeck = lazy(() => import('./PokemonDeck'))

const client = new ApolloClient({
  uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
  cache: new InMemoryCache(),
})

function RouteConfig() {
  const [pokemon, setPokemon] = useState(null)
  const [pokemonOwned, setPokemonOwned] = useState(() => {
    const localPokemon = localStorage.getItem('pokemon')
    return localPokemon ? JSON.parse(localPokemon) : []
  })

  useEffect(() => {
    localStorage.setItem('pokemon', JSON.stringify(pokemonOwned))
  }, [pokemonOwned])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PokemonList />
    },
    {
      path: "/pokemon/:id",
      element: <PokemonDetail />
    },
    {
      path: "/myPokemon",
      element: <PokemonDeck />
    },
  ])

  return (
    <ApolloProvider client={client}>
      <PokemonContext.Provider value={{ pokemonOwned, setPokemonOwned }}>
        <Suspense
          fallback={
            <div
              css={css`
                    background-color: #f8f7fb;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  `}
            >
              <img
                src={Loading}
                css={css`
                      margin: auto;
                      width: 360px;
                      height: auto;
                    `}
                alt="loading"
              />
            </div>
          }
        >
          <RouterProvider router={router} />

        </Suspense>
      </PokemonContext.Provider>
    </ApolloProvider>
  )
}

export default RouteConfig
