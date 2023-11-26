/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { css } from '@emotion/react'
import { Link } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'
import BackArrow from '../image/chevron-left.svg'
import Gotcha from '../image/gotcha.png'
import Loading from '../image/cut-loop.webp'
import Egg from '../image/egg.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { capitalize } from '../utils'
import { usePokemonContext } from './PokemonContext'
import { Pokemon } from '../utils/type'

const PokemonDetail = () => {
  const { addPokemon, pokemonsOwned } = usePokemonContext()
  const [openModal, setOpenModal] = useState(false)
  const [nickname, setNickname] = useState('')
  const [failCatch, setFailCatch] = useState(false)
  const [limitMoves, setLimitMoves] = useState(12)

  const { id: name } = useParams()

  const GET_POKEMON = gql`
    query pokemon($name: String!) {
      pokemon(name: $name) {
        id
        name
        sprites {
          front_default
        }
        moves {
          move {
            name
          }
        }
        types {
          type {
            name
          }
        }
      }
    }
  `

  const { loading, error, data } = useQuery<{ pokemon: Pokemon }>(GET_POKEMON, {
    variables: { name },
  })

  const pokemonData = data?.pokemon

  const handleOpenModal = () => {
    var randomValue = Math.floor(Math.random() * 100)

    if (randomValue <= 50) {
      setOpenModal(true)
    } else {
      setFailCatch(true)
    }
  }

  const checkSameName = (name: string) => {
    return pokemonsOwned.some((item) => item.myPokemonName === name)
  }

  const handleCatchPokemon = (name: string) => {
    if (!data?.pokemon) {
      toast.error('Pokemon not found', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'colored',
      })
      return
    }

    const isSameName = checkSameName(name)
    if (isSameName) {
      toast.error(
        'You have a Pokemon with a same name, try find another name',
        {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'colored',
        },
      )
      return
    }

    const newPokemon = {
      ...data.pokemon,
      myPokemonName: nickname,
      image: data?.pokemon.sprites.front_default,
    }

    addPokemon(newPokemon)

    toast.success('Pokemon Added to Collection', {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'colored',
    })
    setOpenModal(false)
  }

  if (error) return <p>Error :(</p>

  return (
    <div
      css={css`
        width: auto;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        @media (min-width: 420px) {
          margin: 0 120px;
        }
        @media (min-width: 800px) {
          margin: 0 360px;
        }
      `}
    >
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
      {loading ? (
        <div
          css={css`
            background-color: #f8f7fb;
            position: fixed;

            top: 0;
            left: 0;
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
      ) : null}

      <AnimatePresence>
        {failCatch && (
          <>
            <motion.div
              key="modal"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              css={css`
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100vw;
                background-color: rgba(47, 72, 88, 0.6);
              `}
            >
              <motion.div
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 100,
                  opacity: 0,
                }}
                css={css`
                  margin: 0 auto;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  justify-items: center;
                `}
              >
                <img
                  css={css`
                    width: 180px;
                  `}
                  src={Egg}
                  alt=""
                />
              </motion.div>
              <motion.div
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 100,
                  opacity: 0,
                }}
                css={css`
                  border-radius: 16px;
                  padding: 32px;
                  margin: 0 auto;
                  width: 240px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                `}
              >
                <button
                  onClick={() => setFailCatch(false)}
                  css={css`
                    margin-top: 4px;
                    background-color: #f4f4f4;
                    border: none;
                    padding: 8px 16px;
                    font-weight: 500;
                    border-radius: 32px;

                    font-size: 16px;
                    color: #54a38f;
                    &:hover {
                      background-color: #e0e0e0;
                    }
                  `}
                >
                  Try Again
                </button>
              </motion.div>
            </motion.div>
          </>
        )}

        {openModal && (
          <>
            <motion.div
              key="modal"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              css={css`
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100vw;
                background-color: rgba(47, 72, 88, 0.6);
              `}
            >
              <motion.div
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 100,
                  opacity: 0,
                }}
                css={css`
                  margin: 0 auto;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  justify-items: center;
                `}
              >
                <img
                  css={css`
                    width: 180px;
                  `}
                  src={Gotcha}
                  alt=""
                />
              </motion.div>

              <motion.div
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 100,
                  opacity: 0,
                }}
                css={css`
                  border-radius: 16px;
                  padding: 32px;
                  background-color: white;
                  margin: 0 auto;
                  width: 240px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                `}
              >
                <p
                  css={css`
                    width: auto;

                    color: #54a38f;
                    text-align: center;
                  `}
                >
                  Input your pokemon name
                </p>
                <input
                  css={css`
                    width: 100%;
                    padding: 12px 20px;
                    margin: 0;
                    box-sizing: border-box;
                    border: none;
                    background-color: #f4f4f4;
                    color: #54a38f;
                    outline: none;
                    border-radius: 8px;
                    &:focus {
                      border: 3px solid #daf7dc;
                    }
                  `}
                  type="text"
                  onChange={(e) => setNickname(e.target.value)}
                  value={nickname}
                />
                <button
                  onClick={() => handleCatchPokemon(nickname)}
                  css={css`
                    margin-top: 32px;
                    background-color: #54a38f;
                    border: none;
                    padding: 8px 16px;
                    font-weight: 500;
                    border-radius: 32px;

                    font-size: 18px;
                    color: white;
                    &:hover {
                      background-color: #458776;
                    }
                  `}
                >
                  Give Name
                </button>
                <button
                  onClick={() => setOpenModal(false)}
                  css={css`
                    margin-top: 4px;
                    background-color: #f4f4f4;
                    border: none;
                    padding: 8px 16px;
                    font-weight: 500;
                    border-radius: 32px;

                    font-size: 16px;
                    color: #54a38f;
                    &:hover {
                      background-color: #e0e0e0;
                    }
                  `}
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        css={css`
          display: flex;
          margin: 2px 8px;
        `}
      >
        <Link
          to="/"
          css={css`
            text-decoration: none !important;
          `}
        >
          <img
            src={BackArrow}
            alt="back"
            css={css`
              padding: 4px;
              margin: 8px 4px;
            `}
          />
        </Link>

        <p
          css={css`
            color: black;
            width: 100%;
            padding: 4px;
            margin: 10px;
            margin-left: 0;
            text-align: center;
          `}
        >
          Detail Pokemon
        </p>
      </div>

      <div
        css={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          css={css`
            height: 100%;
            display: flex;
            justify-content: space-between;
            margin: 0 32px;
          `}
        >
          <div>
            <div>
              <p
                css={css`
                  margin: 0;
                  font-weight: 700;
                  font-size: 32px;

                  background: linear-gradient(
                    30deg,
                    rgba(47, 72, 88, 1) 20%,
                    rgba(84, 163, 143, 1) 60%,
                    rgba(218, 247, 220, 1) 100%
                  );
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                `}
              >
                {capitalize(pokemonData?.name)}
              </p>

              <div
                css={css`
                  display: flex;
                  margin-top: 4px;
                `}
              >
                {pokemonData&&pokemonData.types !== null
                  ? pokemonData.types.map((data, index) => (
                      <p
                        key={index}
                        css={css`
                          margin: 0;
                          margin-right: 8px;
                          background-color: #f4f4f4;
                          padding: 6px 12px;
                          border-radius: 24px;
                          font-size: 12px;
                        `}
                      >
                        {data.type.name}
                      </p>
                    ))
                  : null}
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              css={css`
                background-color: #54a38f;
                border: none;
                padding: 8px 16px;
                font-weight: 600;
                border-radius: 32px;

                font-size: 18px;
                margin-top: 48px;
                color: #ffffff;
                &:hover {
                  background-color: #458776;
                }
              `}
            >
              Catch me
            </button>
          </div>

          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <img
              css={css`
                width: 144px;
                height: auto;
              `}
              src={pokemonData?.sprites.front_default}
              alt={pokemonData?.name}
            />
          </div>
        </div>

        <div
          css={css`
            background-color: #f4f4f4;
            border-radius: 48px 48px 0 0;
            padding: 18px;
            display: flex;
            flex-direction: column;
            margin-top: 32px;
          `}
        >
          <p
            css={css`
              color: #54a38f;
              padding: 0 16px;
              margin-bottom: 0;
              font-size: 24px;
              font-weight: 600;
            `}
          >
            Move list :
          </p>
          <ul
            css={css`
              margin: 2px 8px;
              overflow: hidden;
              max-height: 100%;
              flex-shrink: 1;
            `}
          >
            {pokemonData
              ? pokemonData.moves.slice(0, limitMoves).map((data, index) => (
                  <li
                    css={css`
                      list-style-image: url(https://cdn-icons-png.flaticon.com/16/188/188918.png);
                    `}
                  >
                    <p
                      key={index}
                      css={css`
                        margin: 4px;
                        font-size: 16px;
                        font-weight: 400;
                      `}
                    >
                      {data.move.name}
                    </p>
                  </li>
                ))
              : null}
          </ul>
          {pokemonData && limitMoves < pokemonData?.moves.length ? (
            <button
              css={css`
                background-color: #54a38f;
                border: none;
                padding: 8px 16px;
                font-weight: 400;
                border-radius: 32px;

                font-size: 14px;
                color: #ffffff;
                &:hover {
                  background-color: #458776;
                }
              `}
              onClick={() => setLimitMoves(pokemonData?.moves.length)}
            >
              See all moves
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail
