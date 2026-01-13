export const transform = () => {
  return {
    to: (value: string[]) => value.join(','),
    from: (value: string) => value.split(','),
  }
}