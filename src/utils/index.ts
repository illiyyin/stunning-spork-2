export const capitalize = (input: string | undefined) => {
  if (!input) return ''
  const rest = input.slice(1)
  const final = `${input[0].toUpperCase()}${rest}`
  return final
}
