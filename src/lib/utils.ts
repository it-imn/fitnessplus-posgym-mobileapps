export function convertToRupiah(angka: string) {
  var rupiah = "";
  var angkarev = angka.toString().split("").reverse().join("");
  for (var i = 0; i < angkarev.length; i++) {
    if (i % 3 === 0) {
      rupiah += angkarev.substr(i, 3) + ".";
    }
  }
  return (
    "Rp " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
}

export function currencyFormat(num: number) {
  return "Rp " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "Rp1,");
}

export const fonts = {
  primary: {
    200: "Rubik-Light",
    300: "Rubik-Regular",
    400: "Rubik-Medium",
    600: "Rubik-SemiBold",
    700: "Rubik-Bold",
    800: "Rubik-ExtraBold",
    900: "Rubik-Black",
  },
};

export const colors = {
  _gold: "#EFDF9B",
  _gold2: "#F5E8A4",
  _gold3: "#9D6E36",
  _gold4: "#B18A4F",
  _grey: "#132B35",
  _grey2: "#f3f3fd",
  _grey3: "#7E8299",
  _grey4: "#ACACAC",
  _grey5: "#E4E4E4",
  _cream: "#C0B492",
  _darkcream: "#A09C9C",
  _black: "#343434",
  _black2: "#191919",
  _black3: "#000000AA",
  _red: "#CD5050",
  _yellow: "#FACC15",
  _green: "#228300",
  _green2: "#24BCAC",
  _choco: "#832F2F",
  _blue: "#04CCFC",
  _blue2: "#0494D4",
  _blue3: "#D0F1FF",
  _blue4: "#0EA4C5", //background login
  _backBlue: "#E6F4FB",
  _backGreen: "#E6F5ED",
  _backOrange: "#FFF3E5",
  _white: "#F8F8FF",
  _white2: "#FFFFFFAA",
  _btnBoard: "#141D53",
};
