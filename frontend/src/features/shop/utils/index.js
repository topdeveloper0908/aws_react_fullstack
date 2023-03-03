export const formatAsDollars = (price) => {
  //format the price
  let p = price.toString();
  let dollars;
  let cents;

  //if there is a decimal point, split the value into dollars and cents
  if (p.includes(".")) {
    dollars = p.split(".")[0];
    cents = p.split(".")[1];
  } else {
    dollars = p;
    cents = "00";
  }

  //now add commas to the dollars portion of the p
  if (dollars.length > 3) {
    const splitDollars = dollars.split("").reverse();
    const totalDigits = dollars.length;
    dollars = "";
    for (let i = 0; i < totalDigits; i++) {
      if (i !== 0 && i % 3 === 0) {
        dollars += "," + splitDollars[i];
      } else dollars += splitDollars[i];
    }
    dollars = dollars.split("").reverse().join("");
  }

  //fill in or truncate cents
  if (cents.length > 2) {
    cents = cents.substring(0, 2);
  }

  if (cents.length < 2) {
    cents = cents.concat("0");
  }

  const formattedPrice = `${dollars}.${cents}`;

  return formattedPrice;
};
