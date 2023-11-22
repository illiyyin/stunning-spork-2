/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useState } from 'react'
import { css } from '@emotion/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PokemonContext } from './PokemonContext'
import capitalize from 'lodash.capitalize'
import { Link } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Trash from '../image/trash-2.svg'
import LeftArrow from '../image/chevron-left.svg'
import Pokeball from '../image/pokeball.png'

const PokemonDeck = () => {
  const { pokemonOwned, setPokemonOwned } = useContext(PokemonContext)

  const [openModal, setOpenModal] = useState(false)
  const [alertPokemon, setAlertPokemon] = useState()

  const [myPokemon] = useState(() => {
    const localPokemon = localStorage.getItem('pokemon')
    return localPokemon ? JSON.parse(localPokemon) : []
  })

  useEffect(() => {
    localStorage.setItem('pokemon', JSON.stringify(myPokemon))
  }, [myPokemon])

  const handleOpenModal = (e) => {
    setAlertPokemon(e)
    setOpenModal(true)
  }

  const handleCloseModal = (e) => {
    setOpenModal(false)
  }

  const handleRemovePokemon = async (e) => {
    var tmp = await pokemonOwned.filter((item) => item.myPokemonNickname !== e)
    await setPokemonOwned(tmp)
    await setOpenModal(false)
    await toast.success('Pokemon Removed', {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: false,
      theme: 'colored',
    })
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

      <AnimatePresence exitBeforeEnter>
        {openModal && (
          <>
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              css={css`
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 100vw;
                display: flex;
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
                  border-radius: 16px;
                  padding: 32px;
                  background-color: white;
                  margin: auto;
                  display: flex;
                  flex-direction: column;
                `}
              >
                <p
                  css={css`
                    width: 240px;
                    font-family: Poppins;
                    color: #54a38f;
                    text-align: center;
                    margin-bottom: 32px;
                  `}
                >
                  Are you sure want to remove {alertPokemon.myPokemonNickname} ?
                </p>

                <div
                  css={css`
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 16px;
                  `}
                >
                  <button
                    css={css`
                      background-color: #f4f4f4;
                      border: none;
                      padding: 12px 24px;
                      font-weight: 500;
                      border-radius: 8px;
                      font-family: Poppins;
                      font-size: 18px;
                      color: #54a38f;
                      &:hover {
                        background-color: #e0e0e0;
                      }
                    `}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>

                  <button
                    css={css`
                      background-color: #fe6060;
                      border: none;
                      padding: 12px 24px;
                      font-weight: 500;
                      border-radius: 8px;
                      font-family: Poppins;
                      font-size: 18px;
                      color: #ffffff;
                      &:hover {
                        background-color: #ff3f3f;
                      }
                    `}
                    onClick={() =>
                      handleRemovePokemon(alertPokemon.myPokemonNickname)
                    }
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Link
        to="/"
        css={css`
          text-decoration: none !important;
        `}
      >
        <div
          css={css`
            display: flex;
            margin: 2px 8px;
          `}
        >
          <img
            src={LeftArrow}
            alt="back"
            css={css`
              width: 24px;
              height: 24px;
              padding: 4px;
              margin: 8px;
              margin-left: 4px;
              margin-right: 0;
            `}
          />
          <img
            src={Pokeball}
            alt="back"
            css={css`
              width: 24px;
              height: 24px;
              padding: 4px;
              margin: 8px;
              margin-left: 0;
              margin-right: 4px;
            `}
          />

          <p
            css={css`
              color: black;
              padding: 4px;
              margin: 8px;
              margin-left: 0;
              font-family: Poppins;
            `}
          >
            Pokemon List
          </p>
        </div>
      </Link>

      <div>
        <p
          css={css`
            text-align: center;
            font-family: Poppins;
            font-size: 22px;
            font-weight: 600;
          `}
        >
          My Pokemon Collection
        </p>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          justifyItems: 'center',
          gridGap: '12px',
          margin: '48px 0',
        }}
      >
        {pokemonOwned.length > 0 ? (
          pokemonOwned.map((data, index) => (
            <>
              <div
                key={index}
                css={css`
                  width: '90%';
                `}
              >
                <div
                  css={css`
                    background-color: #daf7dc;
                    border-radius: 12px;
                    height: 96px;
                    display: flex;
                  `}
                >
                  <div
                    css={css`
                      margin: 2px 12px;
                    `}
                  >
                    <img
                      css={css`
                        width: 92px;
                        height: auto;
                      `}
                      src={data.pokemonImage}
                      alt={data.myPokemonName}
                    />
                  </div>

                  <div
                    css={css`
                      display: flex;
                      width: 100%;
                      justify-content: space-between;
                    `}
                  >
                    <div
                      css={css`
                        margin: auto 0;
                      `}
                    >
                      <p
                        css={css`
                                                        justify-items: center;
                                                        align-items: center;
                                                        color:#828282;
                                                        font-size:14px;
                                                        margin:0;
                                                        font-family:Poppins;
                                                    }`}
                      >
                        {capitalize(data.myPokemonName)}
                      </p>
                      <p
                        css={css`
                                                        margin:0;
                                                        width:120px;
                                                        white-space: nowrap; 
                                                        overflow: hidden;
                                                        text-overflow: ellipsis; 
                                                        justify-items: center;
                                                        align-items: center;
                                                        color:#54A38F;
                                                        font-size:20px;
                                                        font-family:Poppins;
                                                        font-weight:600;
                                                        @media (min-width: 420px) {
                                                            width: 100%;
                                                        }
                                                    }`}
                      >
                        {data.myPokemonNickname}
                      </p>
                    </div>

                    <div
                      css={css`
                        margin: auto 16px;
                        display: flex;
                        right: 0;
                        border-radius: 8px;
                        padding: 16px;
                        background-color: #bcf0c0;
                        &:hover {
                          background-color: #9be8a2;
                        }
                      `}
                      onClick={() => handleOpenModal(data)}
                    >
                      <img src={Trash} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))
        ) : (
          <p
            css={css`
              text-align: center;
              font-family: Poppins;
              font-size: 22px;
              font-weight: 400;
              background-color: #f4f4f4;
              padding: 6px 12px;
              border-radius: 24px;
              font-size: 12px;
            `}
          >
            You don't have any pokemon here
          </p>
        )}
      </div>
    </div>
  )
}

export default PokemonDeck
