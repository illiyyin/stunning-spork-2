/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { css } from '@emotion/react'
import { PokemonContext } from './PokemonContext'
import { Link } from 'react-router-dom'

import capitalize from 'lodash.capitalize'
import slice from 'lodash.slice'

import RightArrow from '../image/chevron-right.svg'
import Pokedex from '../image/pokedex.png'
import Loading from '../image/cut-loop.webp'

const GET_ALL_POKEMON = gql`
  query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      count
      next
      previous
      status
      message
      results {
        id
        url
        name
        image
      }
    }
  }
`

const limitPokemon = {
  limit: 240,
  offset: 0,
}

function PokemonList(props) {
  const { pokemonOwned } = useContext(PokemonContext)
  const [tmpPoke, setTmpPoke] = useState([])
  const [checkOwned, setCheckOwned] = useState(false)
  const [limitShow, setLimitShow] = useState(12)
  const { loading, error, data } = useQuery(GET_ALL_POKEMON, {
    variables: limitPokemon,
  })
  const [myPokemon] = useState(() => {
    const localPokemon = localStorage.getItem('pokemon')
    return localPokemon ? JSON.parse(localPokemon) : []
  })
  useEffect(() => {
    localStorage.setItem('pokemon', JSON.stringify(myPokemon))
  }, [myPokemon])

  if (loading)
    return (
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
          loading="lazy"
        />
      </div>
    )
  if (error) return <p>Error :(</p>

  const pokemonData = data.pokemons.results

  var newArray = []

  if (!checkOwned) {
    pokemonOwned.forEach((x) => {
      newArray.push(x.myPokemonName)
    })

    let counts = []
    for (let i = 0; i < newArray.length; i++) {
      if (counts[newArray[i]]) {
        counts[newArray[i]] += 1
      } else {
        counts[newArray[i]] = 1
      }
    }

    setCheckOwned(true)
    setTmpPoke(counts)
  }

  return (
    <div
      css={css`
        width: auto;
        @media (min-width: 420px) {
          margin: 0 120px;
        }
        @media (min-width: 800px) {
          margin: 0 360px;
        }
      `}
    >
      <Link
        to="/myPokemon"
        css={css`
          text-decoration: none !important;
        `}
      >
        <div
          css={css`
            display: flex;
            margin: 2px 8px;
            justify-content: flex-end;
          `}
        >
          <p
            css={css`
              color: black;
              padding: 4px;
              margin: 8px;
              margin-right: 0;
              font-family: Poppins;
            `}
          >
            My Pokemon
          </p>

          <img
            src={Pokedex}
            alt="back"
            css={css`
              width: 24px;
              height: 24px;
              padding: 4px;
              margin: 8px;
              margin-right: 0;
              margin-left: 4px;
            `}
            loading="lazy"
          />

          <img
            src={RightArrow}
            alt="back"
            css={css`
              width: 24px;
              height: 24px;
              padding: 4px;
              margin: 8px;
              margin-right: 4px;
              margin-left: 0;
            `}
            loading="lazy"
          />
        </div>
      </Link>

      <div></div>
      <div
        css={css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-items: center;
        grid-gap: 16px;
        margin: 16px;
        }
      `}
      >
        {pokemonData ? (
          slice(pokemonData, 0, limitShow).map((data, index) => (
            <div
              key={index}
              css={css`
                text-align: center;
                background-color: #54a38f;
                border-radius: 16px;
                width: 108px;
              `}
            >
              <Link
                css={css`
                  text-decoration: none !important;
                `}
                to={'/pokemon/' + data.name}
                onClick={() => {
                  props.changeName(data.name)
                }}
              >
                <div
                  css={css`
                    background-color: #daf7dc;
                    border-radius: 16px;
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    &:hover {
                      background-color: #bcf0c0;
                    }
                  `}
                >
                  <img
                    css={css`
                      width: 96px;
                      height: 96px;
                      margin: auto;
                    `}
                    src={data.image}
                    alt={data.name}
                    loading="lazy"
                  />
                </div>
                <div
                  css={css`
                    padding: 4px 0;
                  `}
                >
                  <p
                    css={css`
                        justify-items: center;
                        align-items: center;
                        color:white;
                        font-size:14px;
                        margin:0;
                        font-family:Poppins;
                        }`}
                  >
                    {capitalize(data.name)}
                  </p>
                  <p
                    css={css`
                        justify-items: center;
                        align-items: center;
                        color:#DAF7DC;
                        font-size:12px;
                        font-weight:400;
                        margin:0;
                        font-family:Poppins;
                        }`}
                  >
                    {tmpPoke[data.name]
                      ? 'Owned : ' + tmpPoke[data.name]
                      : 'Owned : 0'}
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
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
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div
        css={css`
          margin: 32px;
          display: flex;
          justify-items: center;
        `}
      >
        <button
          css={css`
            margin: auto;
            background-color: #f4f4f4;
            border: none;
            width: 144px;
            padding: 8px 16px;
            font-weight: 400;
            border-radius: 32px;
            font-family: Poppins;
            font-size: 18px;
            color: #54a38f;
            &:hover {
              background-color: #e0e0e0;
            }
          `}
          onClick={() => setLimitShow(limitShow + 12)}
        >
          See more
        </button>
      </div>
    </div>
  )
}

export default PokemonList
