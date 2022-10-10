const initParams = {
  srcDpaId: null, // will be set by testing playground at runtime
  cardBrands: null, // cardbrands will be set by testing playground at runtime
  dpaTransactionOptions: {
    transactionAmount: {
      transactionAmount: 123,
      transactionCurrencyCode: 'USD',
    },
    threeDsPreference: 'NONE',
    consumerEmailAddressRequested: true,
    consumerNameRequested: true,
    consumerPhoneNumberRequested: true,
    payloadTypeIndicatorCheckout: 'PAYMENT',
    payloadTypeIndicatorPayload: 'PAYMENT',
    dpaBillingPreference: 'FULL',
    dpaShippingPreference: 'FULL',
    dpaAcceptedBillingCountries: [],
    dpaAcceptedShippingCountries: [],
    dpaLocale: 'en_US',
    paymentOptions: [
      {
        dpaDynamicDataTtlMinutes: 15,
        dpaPanRequested: false,
        dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_LONG_FORM',
      },
    ],
  },
  dpaData: {
    dpaName: 'SparkTmerch',
    dpaPresentationName: 'SparkTmerch',
  },
}

const installmentParams = {
    dpaLocale: "en_US",
    transactionAmount: {
      "transactionAmount": "123",
      "transactionCurrencyCode": "USD"
    },
    merchantCategoryCode: "0000"
    
}

const notEligibleInstallmentParams = {
   dpaLocale: "en_US",
   transactionAmount: {
    "transactionAmount": 123,
    "transactionCurrencyCode": "USD"
  },
  merchantCategoryCode: "CATT"  
}

 const srcDpaIds = {
    sandbox: '2360e9a2-17a7-4766-b08a-a3aef372c643',
    stage: 'b756a2b0-ef62-4c62-a6de-f72e75ce5f17',
    prod: '6441fbba-9602-4522-8ac6-bf12d1edc91a',
 }

 const merchants = {
   merchantCategoryCodes: {US:"0000",GB:"0000"},
   merchantCountryCodes: {US:"US",GB:"GB"}
 }

const config = {
  envs: {
    sandbox: 'https://sandbox.src.mastercard.com/srci/integration/2/lib.js',
    stage: 'https://stage.src.mastercard.com/srci/integration/2/lib.js',
    prod: 'https://src.mastercard.com/srci/integration/2/lib.js'
  },
  env: 'sandbox',
  flow: null,
  cardBrands: ['mastercard'],
  merchantCategoryCodes: {US:"0000",GB:"0000"},
  merchantCountryCodes: {US:"US",GB:"GB"}
}

const shopperIdentity = {
        value: 'mc01272022@mailinator.com',        
        //value: 'elias.hadgu@mastercard.com',
        //value: 'fake.email@test.com', //change to this when testing for non-existing accounts
        type: 'email'
}

const data = {
  loadTimes: {},
  methods: {},
  srcSdks: []
}

window.perfConfig = config
window.perfData = data
