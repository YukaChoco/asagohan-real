const getUserIconPath = (publicUserIconsURL: string, userID: string) => {
  return `${publicUserIconsURL}${userID}.png`;
};

export default getUserIconPath;
