const Verifier = require("@pact-foundation/pact").Verifier;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
//const getPort = require("get-port");
const { server } = require("../server.js");
const { providerName, pactFile } = require("../pact.js");
chai.use(chaiAsPromised);
let port;
let opts;

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
    
    // Tell Pact where to find the contract files and where the Order
    // API will be running
    const port = 1234
    const opts = {
      provider: providerName,
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [pactFile],
      /* pactBrokerUrl: 'https://test.pact.dius.com.au/',
      pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
      pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
      publishVerificationResult: true, */
      tags: ['prod'],
      providerVersion: '1.0.' + process.env.HOSTNAME,
    }
  
    // Start the API
    before(async () => {
      await server.listen(port, () => {
        console.log(`Provider service listening on http://localhost:${port}`)
      })
    })
  
    // Run the provider verification task
    //it('should validate the expectations of Order Web', () => {
      //return new Verifier().verifyProvider(opts)
    it("should validate the expectations of User Web", () => {
        return new Verifier()
          .verifyProvider(opts)
          .then((output) => {
            console.log("Pact Verification Complete!");
            console.log(output);
          })
          .catch((e) => {
            console.error("Pact verification failed :(", e);
          });
      });


  })