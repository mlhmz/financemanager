export const CurrencyCell = ({ amount }: { amount?: number }) => {
  if (amount === undefined) {
    return <></>;
  }

  const getClassNameByAmount = () => {
    if (amount === 0) {
      return "";
    }
    if (amount > 0) {
      return "text-green-600"
    }
    return "text-red-600"
  }
  
  return <span className={getClassNameByAmount()}>{amount} €</span>;
}