import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")



function setCardType(type){
  const colors = {
    "visa": ["#436d99", "#2d57f2"],
    "mastercard": ["#df6f29", "#c69347"],
    "american express": ["#3B4095", "#6CB35E"],
    "default": ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])

  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: "01",
      to: "12",
    },
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47][0-9]{13}/,
      cardtype: "american express"
    },
    // {
    //   mask: "0000 0000 0000 0000",
    //   regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
    //   cardtype: "diners club"
    // },
    // {
    //   mask: "0000 0000 0000 0000",
    //   regex: /^6(?:011|5[0-9]{2})[0-9]{12}/,
    //   cardtype: "discover"
    // },
    // {
    //   mask: "0000 0000 0000 0000",
    //   regex: /^(?:2131|1800|35\d{3})\d{11}/,
    //   cardtype: "jcb"
    // },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  dispatch: function (appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g,"")
    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))
    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

const addButon = document.querySelector("#add-card")
addButon.addEventListener("click", () => {
  alert("Cartão Adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}