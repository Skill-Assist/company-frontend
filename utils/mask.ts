const Mask = {
  phone: (value: string) => {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d)/, "($1)$2")
      .replace(/(\d{5})(\d)/, " $1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  },
  cnpj: (value: string) => {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }
}

export default Mask
