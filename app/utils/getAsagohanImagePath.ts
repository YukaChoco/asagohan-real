const getAsagohanImagePath = (
  publicAsagohanURL: string,
  asagohanID: string,
) => {
  return `${publicAsagohanURL}${asagohanID}.png`;
};

export default getAsagohanImagePath;
