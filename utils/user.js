export const DisplayName = ({ fullName }) => {
  return fullName ? fullName.split('')[0].toUpperCase() : 'Guest';
}
