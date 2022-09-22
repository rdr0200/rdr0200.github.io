if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', sourceSv2)
} else {
  sourceSv2()
}

async function sourceSv2() {
  const { perfConfig, perfData } = window
  const script = document.createElement('script')

  console.log(perfConfig.envs[perfConfig.env]);
  script.src = perfConfig.envs[perfConfig.env]
  const sv2LoadPromose = new Promise((r) => {
    window['__sv2LoadPromose__'] = r
  })

  document.head.appendChild(script)

  return sv2LoadPromose
}

function getEnvironment() {
    const script = document.createElement('script')
    let envi = document.querySelector('input[name="envi"]:checked').value;
    script.src = perfConfig.envs[envi];

    const sv2LoadPromose = new Promise((r) => {
        window['__sv2LoadPromose__'] = r
      })

      document.head.appendChild(script)
}

function toggleBootStrapIsRecognized(){
     let envi = document.querySelector('input[name="enablewinit"]:checked').value;
     localStorage.setItem('mcsrc.enablenewinit', document.querySelector('input[name="enablewinit"]:checked').value);
}

async function getInitParamsHandler(params) {
  try {
    const initResolver = await window.click2payInstance.init(params);
    return initResolver;
  }catch(e) {
    console.log(e);
  }
}

let cardBrands;
let installmentsEligible

async function loadInit(countryCode) {
  const { perfConfig } = window
  window.click2payInstance = new window.Click2Pay({debug:true})

  try {

    let params = initParams;
    params.cardBrands = perfConfig.cardBrands
    params.srcDpaId = srcDpaIds[perfConfig.env]

    let isInstallmentEligiblePromise;

    if (countryCode === merchants.merchantCountryCodes.US)
        isInstallmentEligiblePromise =  isInstallmentEligibleHandler(installmentParams);
    else {
        isInstallmentEligiblePromise =  isInstallmentEligibleHandler(notEligibleInstallmentParams);
    }
    isInstallmentEligiblePromise.then(eligible => {
        console.log("isInstallmentEligible", eligible);
        installmentsEligible = eligible;

        if (eligible.eligible) {
            document.querySelector('#installmentEligible').disabled = false;
            document.querySelector('#installmentEligible').innerText = "Installment Eligible";
        }else {
             document.querySelector('#installmentEligible').disabled = true;
             document.querySelector('#installmentEligible').innerText = "Installment Not Eligible";
        }
        document.querySelector('#srcui').innerText = "";
    })

    const initResolverPromise = getInitParamsHandler(params);
    initResolverPromise.then(initResolver => {
        console.log("init", initResolver);
        cardBrands = initResolver.availableCardBrands;

        document.querySelector('#checkoutNewUser').disabled = false;
        document.querySelector('#checkoutReturningUser').disabled = false;

         clearCheckoutFrame();
    });
  }catch(e) {
    console.log(e);
  }
}

async function getCardsHandler() {
  try {
    const cards = await window.click2payInstance.getCards();
    console.log("cards: ",cards);
    return cards;
  }catch(e) {
    console.log(e);
  }
}

async function lookupHandler(email) {
  console.log(email);
  try {
    const identityLookupParam = { email: email }

    const consumerPresent =  await window.click2payInstance.idLookup(identityLookupParam);
    return consumerPresent

  }catch(e) {
    console.log(e);
  }
}

async function validate(otp) {
  try {
    const validated = await window.click2payInstance.validate ({
      value: otp,
    });
    console.log('validated:', validated)
    return validated;
  }catch(e) {
    console.log(e);
  }
}

async function initiateIdentityValidation(validationChannelId) {
  const initiateIdentityValidationParams = {
    requestedValidationChannelId: validationChannelId
  }
  try {
    var initiateValidation;
    if (validationChannelId === undefined) {
      // when sending the first OTP
      initiateValidation = await window.click2payInstance.initiateValidation();
    } else {
      initiateValidation = await window.click2payInstance.initiateValidation(initiateIdentityValidationParams);
    }
    return initiateValidation;
  }catch(e) {
    console.log(e);
  }
}

async function encryptCardHandler() {
  const { perfConfig } = window

  try {
    const encryptedCard = await window.click2payInstance.encryptCard({
      primaryAccountNumber:'5120350100064537',
      panExpirationMonth:'12',
      panExpirationYear:'23',
      cardSecurityCode:'123',
    })

    return encryptedCard;
  }catch(e) {
    console.log(e)
  }
}

async function checkoutWithNewCardHandler2(encryptCard, iframe) {
  try {
    const windowRef = iframe.contentWindow;
    const param = { ...encryptCard, windowRef,}
    const resp = await window.click2payInstance.checkoutWithNewCard(param);
    console.log("created new c2p account", resp);
    return resp;
  } catch(e) {
    console.log(e);
  }
}


async function checkoutWithNewCardHandler() {
  try {
    const encryptCard = encryptCardHandler();
    encryptCard.then(val => {

      const encryptCard = val;
      const iframe = document.createElement("iframe");
      iframe.style.width = '420px'
      iframe.style.height='820px'
      document.querySelector('#srcui').append(iframe);
      return checkoutWithNewCardHandler2(encryptCard, iframe)
      
  });
  } catch(e) {
    console.log(e);
  }
  
}

async function checkoutWithCardHandler(srcDigitalCardId) {
  try {
    const param = {
      windowRef: window.open('', 'src-window'),
      srcDigitalCardId: srcDigitalCardId
    }
    const resp = await window.click2payInstance.checkoutWithCard(param);
    return resp;
  } catch(e) {
    console.log(e)
  }
  
}

async function isInstallmentEligibleHandler(param) {
    try {
        const resp = await window.click2payInstance.isInstallmentsEligible(param);

        return resp;
    }catch(e) {
        console.log(e);
    }
}

async function installmentCheckoutHandler(param) {
    try {
        const resp = await window.click2payInstance.checkoutWithInstallments(param);

        return resp;
    }catch(e) {
        console.log(e);
    }
}

function displayCards(cardList, cards) {
  cardList.loadCards(cards);
  cardList.addEventListener('selectSrcDigitalCardId', function (event) {
    cardCheckoutPromise = checkoutWithCardHandler(event.detail);
    cardCheckoutPromise.then(cardCheckout => {
      console.log("card checkout", cardCheckout);

    });
  });

  console.log('validated cards:', cards);
  document.body.appendChild(cardList)
}

function OTPRejectedHandler(otpPrompt) {
  // TODO: add logic for too many retries error
  console.log("OTP is incorrect!")
  otpPrompt.setAttribute("error-reason", "CODE_INVALID");
}

function verifyOTP(otpFromField, otpPrompt) {
  const validatedCardsPromise = validate(otpFromField);
  validatedCardsPromise.then(validatedCards => {
    console.log('validate promise',validatedCardsPromise)
    if (validatedCards === undefined) { // check if OTP is incorrect
      OTPRejectedHandler(otpPrompt);
    } else {
      console.log("OTP is correct!");
      otpPrompt.remove();
      
      const cardList = document.createElement("src-card-list")
      displayCards(cardList,validatedCards);
    }
    
    
  })//.catch(OTPRejectedHandler(otpPrompt))
}

function requestAlternateOTP(otpPrompt, inititateValidation) {
  otpPrompt.remove();
  const otpChannelSelection = document.createElement("src-otp-channel-selection");
  otpChannelSelection.setAttribute("type", "overlay")
  otpChannelSelection.setAttribute("card-brands", cardBrands.toString())
  otpChannelSelection.setAttribute("display-cancel-option", true)
  otpChannelSelection.identityValidationChannels = inititateValidation.supportedValidationChannels;
  document.body.appendChild(otpChannelSelection);
  otpChannelSelection.addEventListener('continue', function ({ detail }) {
    console.log('user clicked continue - selectedChannel:', detail);
    if (detail.identityType == "GUEST") { // SHOULD CHECKOUT BE GREYED OUT HERE?

      checkoutWithNewCardHandler();
    } else {
      requestOTP(detail.validationChannelId);
    }
    otpChannelSelection.remove();
  });
  otpChannelSelection.onclose = event => {
    otpChannelSelection.remove();
  };
}

function requestOTP(validationChannelId) {
  console.log("card brands", cardBrands);
  console.log("validation channel", validationChannelId);
  const initiateValidationPromise = initiateIdentityValidation(validationChannelId);
  initiateValidationPromise.then(inititateValidation => {
    console.log('initiate validation', inititateValidation);
    const otpPrompt = document.createElement("src-otp-input")
    otpPrompt.setAttribute("type", "overlay")
    otpPrompt.setAttribute('masked-identity-value', inititateValidation.maskedValidationChannel);
    otpPrompt.setAttribute('network-id', inititateValidation.network);
    otpPrompt.setAttribute("card-brands", cardBrands.toString())
    otpPrompt.setAttribute("display-cancel-option", true)

    document.body.appendChild(otpPrompt);
    let otpFromField;
    otpPrompt.addEventListener('alternateRequested', event => {
      requestAlternateOTP(otpPrompt, inititateValidation);
    });
    otpPrompt.addEventListener('otpChanged', event => {
      otpFromField = event.detail
      console.log('OTP CHANGED: ', event);
    });
    otpPrompt.addEventListener('continue', event => {
      verifyOTP(otpFromField, otpPrompt);
    });
    otpPrompt.onclose = event => {
      otpPrompt.remove();
    };            
  }).catch((error) => {
    console.log("ERROR",error);
  });
}

function installmentsEligibleService() {
    if(installmentsEligible.eligible) {
        document.querySelector('#srcui').append(JSON.stringify(installmentsEligible));

        toggleButton(true)
    }
}

function click2PayService(email) {
  toggleButton(true)
  if (email == 'fake.email@test.com') { // CREATE CONST VARIABLE FOR THIS
    document.querySelector('#checkoutReturningUser').disabled = true;
  } else if (email == 'mc01272022@mailinator.com') { // CREATE CONST VARIABLE FOR THIS
    document.querySelector('#checkoutNewUser').disabled = true;
  }
  const cardsPromise = getCardsHandler();
  cardsPromise.then(cards => {
    if (cards.length === 0) {
      console.log("User has no cards saved in cookies");
      const consumerPresentPromise = lookupHandler(email);
      consumerPresentPromise.then(consumerPresent => {
        console.log('consumerPresent', consumerPresent)
        if (consumerPresent.consumerPresent) {
          console.log("User has an account");
          requestOTP();
        }else {
          console.log("User needs to make account")
          document.querySelector('#checkoutNewUser').disabled = true;
          const checkoutWithNewCardPromise = checkoutWithNewCardHandler();

          checkoutWithNewCardPromise.then(checkoutWithNewCard => { // this doesn't wait until checkoutWithNewCardHandler is done
            console.log("new card checkout",checkoutWithNewCard);
          });
        }
      })
    }else {
      console.log("User has cards saved in cookies")
      const cardList = document.createElement("src-card-list")
      displayCards(cardList,cards);
    }
  });
}

function clearCheckoutFrame(){
    var iframes = document.querySelector("#srcui").querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
        iframes[i].parentNode.removeChild(iframes[i]);
    }
}

function toggleButton(toggle){
    document.querySelector('#checkoutNewUser').disabled = toggle;
    document.querySelector('#checkoutReturningUser').disabled = toggle;
    document.querySelector('#installmentEligible').disabled = toggle;
}
