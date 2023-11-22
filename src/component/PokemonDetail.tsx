/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { css } from '@emotion/react'
import { Link } from 'react-router-dom';

import { useQuery, gql } from "@apollo/client";
import concat from 'lodash.concat';
import { PokemonContext } from './PokemonContext';
import capitalize from 'lodash.capitalize';
import slice from 'lodash.slice';
import BackArrow from '../image/chevron-left.svg'
import Gotcha from '../image/gotcha.png'
import Loading from '../image/cut-loop.webp'
import Egg from '../image/egg.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'


const PokemonDetail = (value) => {
    const initialState = {
        myPokemonNickname: '',


    }

    const { pokemonOwned, setPokemonOwned } = useContext(PokemonContext)
    const [openModal, setOpenModal] = useState(false)
    const [newPokemon, setNewPokemon] = useState(initialState)
    const [alertName, setAlertName] = useState(false)
    const [failCatch, setFailCatch] = useState(false)
    const [hadSameNickname, setHadSameNickname] = useState(true)
    const [limitMoves, setLimitMoves] = useState(12)
    const [myPokemon, setMyPokemon] = useState(() => {
        const localPokemon = localStorage.getItem('pokemon')
        return localPokemon ? JSON.parse(localPokemon) : []
        }   
    )

    const url = useParams()

    useEffect(() => {
        localStorage.setItem('pokemon', JSON.stringify(myPokemon))
    }, [myPokemon])

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
        `;

    const pokemonName = { name: value.name }
    const pokemonNamefromUrl = { name: url.id }

    const { loading, error, data } = useQuery(GET_POKEMON, {
        variables: value.name !== null ?
            pokemonName : pokemonNamefromUrl
        }
    );

    const {myPokemonNickname} = newPokemon

    const handleOpenModal = async e => {
        var min = 1
        var max = 100
        var c = false
        var randomValue = Math.floor(Math.random(min, max) * 100)

        if (randomValue <= 50) {
            c = true
        } else {
            c = false
        }
        if (c) {
            await setOpenModal(true)
        } else {
            await setFailCatch(true)
        }
    }

    const handleCloseModal = e => {
        setOpenModal(false)
    }

    var listPokemonName = []

    pokemonOwned.forEach(x => {
        listPokemonName.push(x.myPokemonNickname)
    })

    const handleNickname = e => {
        setNewPokemon({ ...newPokemon, [e.target.name]: e.target.value })
    }

    const handleCatchPokemon = (event) => {
        setHadSameNickname(false)

        let newPokemons = { ...newPokemon, myPokemonName: pokemonData.name, pokemonImage: pokemonData.sprites.front_default }

        listPokemonName.forEach(x => {
            if (x !== newPokemon.myPokemonNickname) {
                setAlertName(false)
            } else {
                setAlertName(true)
                setHadSameNickname(true)
            }
        })

        if (hadSameNickname === false) {
            let tmpPok = concat(myPokemon, newPokemons)
            setMyPokemon(tmpPok)
            setPokemonOwned(tmpPok)
            setOpenModal(false)
            setNewPokemon({ ...newPokemon, myPokemonNickname: '' })
            setHadSameNickname(false)

            toast.success('Pokemon Added to Collection', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'colored'
            })
        }

    }

    if (loading) 
        return (
            <div css={css`
                background-color:#F8F7FB;
                width:100vw;
                height:100vh;
                display:flex;
                flex-direction:column;
                justify-content:center;
            `}>
                <img 
                    src={Loading} 
                    css={css`
                        margin:auto;
                        width:360px;
                        height:auto;
                    `} 
                    alt='loading' />
            </div>
        )

    if (error) return <p>Error :(</p>


    const pokemonData = data.pokemon

    return (
        <div
            css={css`
                display:flex;
                flex-direction:column;
                width: auto;
                min-height:100vh;
                @media (min-width:420px){
                    margin:0 120px;
                }
                @media (min-width:800px){
                    margin:0 360px;
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

            <AnimatePresence exitBeforeEnter >
                {failCatch && (
                    <>
                        <motion.div
                            key="modal"
                            initial={{

                                opacity: 0
                            }}

                            animate={{

                                opacity: 1
                            }}

                            exit={{

                                opacity: 0
                            }}
                            css={css`
                                position:fixed;
                                top:0;
                                left:0;
                                height:100vh;
                                display:flex;
                                flex-direction:column;
                                justify-content: center;
                                width:100vw;
                                background-color:rgba(47, 72, 88, .6);
                            `}
                        >
                            <motion.div
                                initial={{
                                    y: 100,
                                    opacity: 0
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1
                                }}

                                exit={{
                                    y: 100,
                                    opacity: 0
                                }}
                                css={css`
                                    margin:0 auto;
                                    display:flex;
                                    flex-direction:row;
                                    justify-content:center;
                                    justify-items:center;
                                    `}>
                                <img css={css`
                                    width:180px;
                                    `}
                                    src={Egg} alt='' />

                            </motion.div>
                            <motion.div
                                initial={{
                                    y: 100,
                                    opacity: 0
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1
                                }}

                                exit={{
                                    y: 100,
                                    opacity: 0
                                }}
                                transition={{ delay: 1.6 }}

                                css={css`
                                    border-radius:16px;
                                    padding:32px ;
                                    margin:0 auto;
                                    width:240px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                `}
                            >
                                <button
                                    onClick={() => setFailCatch(false)}
                                    css={css`
                                        margin-top:4px;
                                        background-color:#F4F4F4;
                                        border: none;
                                        padding:8px 16px ;
                                        font-weight:500;
                                        border-radius:32px;
                                        font-family:Poppins;
                                        font-size:16px;
                                        color:#54A38F;
                                        &:hover{
                                            background-color:#E0E0E0;
                                        }
                                    `}
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        </motion.div>
                    </>
                )
                }

                {openModal && (
                    <>
                        <motion.div
                            key="modal"
                            initial={{

                                opacity: 0
                            }}

                            animate={{

                                opacity: 1
                            }}

                            exit={{

                                opacity: 0
                            }}
                            css={css`
                                position:fixed;
                                top:0;
                                left:0;
                                height:100vh;
                                display:flex;
                                flex-direction:column;
                                justify-content: center;
                                width:100vw;
                                background-color:rgba(47, 72, 88, .6);
                            `}
                        >

                            <motion.div
                                initial={{
                                    y: 100,
                                    opacity: 0
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1
                                }}

                                exit={{
                                    y: 100,
                                    opacity: 0
                                }}
                                css={css`
                                    margin:0 auto;
                                    display:flex;
                                    flex-direction:row;
                                    justify-content:center;
                                    justify-items:center;
                                `}
                            >
                                <img 
                                    css={css`width:180px;`}
                                    src={Gotcha} 
                                    alt=''/>
                            </motion.div>

                            <motion.div
                                initial={{
                                    y: 100,
                                    opacity: 0
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1
                                }}

                                exit={{
                                    y: 100,
                                    opacity: 0
                                }}
                                transition={{ delay: 1.6 }}

                                css={css`
                                    border-radius:16px;
                                    padding:32px ;
                                    background-color:white;
                                    margin:0 auto;
                                    width:240px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                `}
                            >

                                <p 
                                    css={css`
                                        width:auto;
                                        font-family:Poppins;
                                        color:#54A38F;
                                        text-align:center;
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
                                        background-color: #F4F4F4;
                                        color: #54A38F;
                                        outline:none;
                                        border-radius:8px;
                                        &:focus{
                                            border: 3px solid #DAF7DC;
                                        }
                                    `}

                                    type="text" 
                                    onInput={handleNickname} 
                                    name="myPokemonNickname" 
                                    value={myPokemonNickname} />

                                {alertName && (
                                    <p 
                                        css={css`
                                            color:#FE6060;
                                            text-align:center;
                                            font-family:Poppins;
                                        `}
                                    >
                                        nama pokemon sudah dipakai
                                    </p>

                                )}
                                <button
                                    onClick={handleCatchPokemon}
                                    css={css`
                                        margin-top:32px;
                                        background-color:#54A38F;
                                        border: none;
                                        padding:8px 16px ;
                                        font-weight:500;
                                        border-radius:32px;
                                        font-family:Poppins;
                                        font-size:18px;
                                        color:white;
                                        &:hover{
                                            background-color:#458776;
                                        }
                                    `}
                                >
                                    Give Name
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    css={css`
                                        margin-top:4px;
                                        background-color:#F4F4F4;
                                        border: none;
                                        padding:8px 16px ;
                                        font-weight:500;
                                        border-radius:32px;
                                        font-family:Poppins;
                                        font-size:16px;
                                        color:#54A38F;
                                        &:hover{
                                            background-color:#E0E0E0;
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
                    display:flex;
                    margin:2px 8px;
                `}
            >
                <Link 
                    to='/' 
                    css={css`text-decoration: none!important;`}>

                    <img 
                        src={BackArrow} 
                        alt="back" 
                        css={css`
                            padding:4px;
                            margin:8px 4px ;
                        `} 
                    />

                </Link>

                <p 
                    css={css`
                        color:black;
                        width:100%;
                        padding:4px;
                        margin:10px ;
                        margin-left:0;
                        text-align:center;
                        font-family: Poppins;
                    `}
                >
                    Detail Pokemon
                </p>
            </div>

            {
                <>
                    <div 
                        css={css`
                            display:flex;
                            margin: 32px;
                            margin-top:0;
                        `}
                    >
                        <div css={css`
                            display:flex;
                            width:100%;
                            justify-content:space-between;
                            margin:0 ;
                        `}>
                            <div css={css`
                                display:flex;
                                flex-direction:column;
                                height:100%;
                                justify-content:space-between;
                                margin:0;
                            `}>
                                <div>

                                    <p css={css`
                                        margin:0;
                                        font-weight:700;
                                        font-size: 32px;
                                        font-family:Poppins;
                                        background: linear-gradient(30deg, rgba(47,72,88,1) 20%, rgba(84,163,143,1) 60%, rgba(218,247,220,1) 100%);
                                        -webkit-background-clip: text;
                                        -webkit-text-fill-color: transparent;
                                    `}>
                                        {capitalize(pokemonData.name)}
                                    </p>

                                    <div css={css`
                                        display:flex;
                                        margin-top:4px;
                                    `}>
                                        {pokemonData.types !== null ?
                                            pokemonData.types.map((data, index) => (
                                                <p key={index} 
                                                    css={css`
                                                        margin:0;
                                                        margin-right:8px;
                                                        background-color:#F4F4F4;
                                                        padding: 6px 12px;
                                                        border-radius:24px;
                                                        font-size:12px;
                                                        font-family:Poppins;
                                                `}>
                                                    {data.type.name}
                                                </p>
                                            )) 
                                            : 
                                                null
                                        }

                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleOpenModal(pokemonData)} 
                                    css={css`
                                        background-color:#54A38F;
                                        border: none;
                                        padding:8px 16px ;
                                        font-weight:600;
                                        border-radius:32px;
                                        font-family:Poppins;
                                        font-size:18px;
                                        margin-top:48px;
                                        color:#ffffff;
                                        &:hover{
                                            background-color:#458776;
                                        }
                                `}>
                                    Catch me
                                </button>

                            </div>
                            <div
                                css={css`
                                    display:flex;
                                    align-items:center;
                            `}>

                                <img css={css`
                                    width:144px;
                                    height:auto;
                                    margin:auto;
                                    right:0;
                                    `}
                                    src={pokemonData.sprites.front_default} 
                                    alt={pokemonData.name} />
                            </div>
                        </div>
                    </div>

                    <div css={css`
                        background-color:#F4F4F4;
                        border-radius:48px 48px 0 0;
                        padding:18px;
                        display:flex;
                        flex-direction:column;
                        height:100%;
                        margin-top:36px;
                        margin-bottom:0;
                    `}>

                        <p css={css`
                            color:#54A38F;
                            padding: 0 16px;
                            margin-bottom:0;
                            font-size:24px;
                            font-weight: 600;
                            font-family: Poppins
                        `}>
                            Move list :
                        </p>
                        <div css={css`
                        padding:2px 8px;
                        `}>
                            <ul >

                                {pokemonData.moves !== null ?
                                    slice(pokemonData.moves, 0, limitMoves).map((data, index) => (
                                        <li css={css`
                                list-style-image: url(https://cdn-icons-png.flaticon.com/16/188/188918.png);
                                `}>

                                            <p key={index} css={css`
                                margin:4px;
                                font-size:16px;
                                font-weight: 400;
                                font-family: Poppins
                                `}>
                                                {data.move.name}
                                            </p>
                                        </li>
                                    )) : null}

                            </ul>
                            {limitMoves !== pokemonData.moves.length ?
                                <button
                                    css={css`
                                        background-color:#54A38F;
                                        border: none;
                                        padding:8px 16px ;
                                        font-weight:400;
                                        border-radius:32px;
                                        font-family:Poppins;
                                        font-size:14px;
                                        color:#ffffff;
                                        &:hover{
                                            background-color:#458776;
                                        }
                                    `}
                                    onClick={() => setLimitMoves(pokemonData.moves.length)}>
                                    See all moves
                                </button>
                                : 
                                    null
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default PokemonDetail
