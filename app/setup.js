const initParams = {
  "srcDpaId": "0185ef9f-eece-410f-b81c-9c719a57ca24",
   "cardBrands": ["mastercard"],
   "dpaLocale": "en_US",
   "dpaData": {
     "dpaName": "SparkTmerch"
   },
   "services": [
     "INLINE_INSTALLMENTS"
   ],
   "dpaTransactionOptions": {
     "transactionAmount": {
       "transactionAmount": 123,
       "transactionCurrencyCode": "USD"
     },
     "merchantCountryCode": "US",
     "merchantCategoryCode": "4444"
   }
}

const installmentParams = {
    "dpaLocale": "en_US",
    "transactionAmount": {
      "transactionAmount": "123",
      "transactionCurrencyCode": "USD"
    },
    "merchantCategoryCode": "CATT"

}

const notEligibleInstallmentParams = {
   "dpaLocale": "en_US",
   "transactionAmount": {
    "transactionAmount": 1,
    "transactionCurrencyCode": "USD"
  },
  "merchantCategoryCode": "CATT"
}

 const srcDpaIds = {
    sandbox: '0185ef9f-eece-410f-b81c-9c719a57ca24',
    stage: 'b756a2b0-ef62-4c62-a6de-f72e75ce5f17',
    prod: '6441fbba-9602-4522-8ac6-bf12d1edc91a',
 }

 const merchants = {
   merchantCategoryCodes: {eligibleTrue:"0000",eligibleFalse:"CATT"},
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
  merchantCategoryCodes: {eligibleTrue:"0000",eligibleFalse:"CATT"},
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
