/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const facts = {
  'london': "Big Ben is arguably London's most famous landmark. Surprisingly, it is actually meant to go by the name 'The Clock Tower', while Big Ben is the name of the bell.",
  'paris': "The Eiffel Tower was supposed to be a temporary installation, intended to stand for 20 years after being built for the 1889 World Fair.",
  'toronto': "Almost 25% of Canada's population lives within a 160 km radius of Toronto.",
  'sydney': "The Sydney Harbour Bridge is the widest long-span bridge and tallest steel arch bridge in the world, and the 5th longest spanning-arch bridge according to Guinness World Records.",
  'new delhi': "Delhi is the second most populous city in the world with 25 million inhabitants! Census, in 2015, recorded 18.2 million people living in the city."
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    let speechText = 'welcom to city fact.';
    let repromptText = 'Say tell me a fact to see the dialog action.';
    
    //responseBuilder.response.shouldEndSession = false;
    return responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const InProgressfactIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'factIntent' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    console.log("1  "+ JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.query.value));
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const factIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'factIntent';
    console.log(JSON.stringify("2 "+ handlerInput.requestEnvelope.request.intent.slots.query.value));
  },
  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    //const city = slotValue(handlerInput.requestEnvelope.request.intent.slots.city);
    let speechText = `Here's a fact about ${facts['london']}`;
    console.log("3 "+ JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.query.value));
    console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.city.value));
    //handlerInput.requestEnvelope.request.intent.slots.city 
    //responseBuilder.response.shouldEndSession = false;
    return responseBuilder
      .speak(speechText)
      .getResponse();
  },
};
const LogRequestInterceptor = {
  process(handlerInput) {
    // Log Request
    console.log("==== REQUEST ======");
    console.log(JSON.stringify(handlerInput));
    console.log(JSON.stringify(handlerInput.requestEnvelope.request.samples.value,  null, 2));
    console.log(JSON.stringify(handlerInput.attributesManager.getRequestAttributes()));
    console.log(JSON.stringify(handlerInput.requestEnvelope));
  }
}
/**
 * Response Interceptor to log the response made to Alexa
 */
const LogResponseInterceptor = {
  process(handlerInput, response) {
    // Log Response
    console.log("==== RESPONSE ======");
    console.log(JSON.stringify(response));
  }
}
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say tell me a fact about london';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

function slotValue(slot, useId){
  if(slot.value == undefined){
      return "undefined";
  }
  let value = slot.value;
  let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
  if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
      let resolutionValue = resolution.values[0].value;
      value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
  }
  return value;
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    InProgressfactIntentHandler,
    factIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();