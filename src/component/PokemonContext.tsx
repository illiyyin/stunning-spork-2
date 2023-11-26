import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Pokemon } from '../utils/type'

type PokemonContext = {
  pokemonsOwned: Pokemon[]
  setPokemonsOwned: Dispatch<SetStateAction<Pokemon[]>>
  getPokemonOwned: (value: string) => number
  addPokemon: (value: Pokemon) => void
  removePokemon: (value: string) => void
}
export const PokemonContext = createContext<PokemonContext>(
  {} as PokemonContext,
)
export const usePokemonContext = () => useContext(PokemonContext)

export const PokemonProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [pokemonsOwned, setPokemonsOwned] = useState<Pokemon[]>([])

  useEffect(() => {
    const localPokemon = localStorage.getItem('pokemon')
    if (localPokemon) {
      setPokemonsOwned(JSON.parse(localPokemon))
    } else {
      setPokemonsOwned([])
      localStorage.setItem('pokemon', JSON.stringify([]))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pokemon', JSON.stringify(pokemonsOwned))
  }, [pokemonsOwned])

  const getPokemonOwned = (name: string) => {
    const pokemon = pokemonsOwned.filter((item) => item.name === name)
    return pokemon.length || 0
  }

  const addPokemon = (pokemon: Pokemon) => {
    setPokemonsOwned((prev) => [...prev, pokemon])
  }

  const removePokemon = (name: string) => {
    setPokemonsOwned((prev) =>
      prev.filter((item) => item.myPokemonName !== name),
    )
  }

  return (
    <PokemonContext.Provider
      value={{
        pokemonsOwned,
        setPokemonsOwned,
        getPokemonOwned,
        addPokemon,
        removePokemon,
      }}
    >
      {children}
    </PokemonContext.Provider>
  )
}
