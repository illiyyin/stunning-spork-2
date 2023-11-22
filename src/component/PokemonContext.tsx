import { createContext } from 'react'

export const PokemonContext = createContext(() => {
  const localPokemon = localStorage.getItem('pokemon')
  return localPokemon ? JSON.parse(localPokemon) : []
})
