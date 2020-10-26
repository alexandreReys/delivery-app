import { MaskService } from "react-native-masked-text";

function cpfMask(value) {
  if (value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }
}

function cnpjMask(value) {
  if (value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }
}

function phoneMask(value) {
  if (value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
      .replace(/(-\d{4})\d+?$/, "$1");
  }
}

function cepMask(value) {
  if (value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  }
}

function pisMask(value) {
  if (value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{5})(\d)/, "$1.$2")
      .replace(/(\d{5}\.)(\d{2})(\d)/, "$1$2-$3")
      .replace(/(-\d{1})\d+?$/, "$1");
  }
}

function moneyMask(value) {
  const config = {
    unit: "R$ ",
    separator: ",",
    delimiter: ".",
  };
  return MaskService.toMask("money", value, config);
}

export { cpfMask, cnpjMask, phoneMask, cepMask, pisMask, moneyMask };
