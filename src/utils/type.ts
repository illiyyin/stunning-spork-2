export interface Pokemon {
  id: number
  image: string
  name: string
  url: string
  myPokemonName: string
  sprites: {
    front_default: string
  }
  moves: {
    move: {
      name: string
    }
  }[]
}
