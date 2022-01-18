const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { eachLike } = require("@pact-foundation/pact").Matchers;
const { Order } = require("../lib/order");
const expect = chai.expect;
const { fetchOrders } = require("../lib/orderClient");
//const { provider } = require("../pact");
chai.use(chaiAsPromised);
const { Pact } = require("@pact-foundation/pact")


describe("Pact with Order API", () => {
    
    let provider = Pact;

    // Setup Pact
    // create the mock service which will respond to the apps queries over
    // HTTP as if it wre a real Order API.
    before(() => {

        provider = new Pact({
            port: 1234,
            log: path.resolve(process.cwd(), "logs", "pact.log"),
            dir: path.resolve(process.cwd(), "pacts"),
            consumer: "OrderWeb",
            provider: "OrderApi",
            logLevel: "INFO"
        });
        
        // Start the mock service!
        return provider.setup()

    },300000)

    afterEach( async () => await provider.verify());

    describe("given there are orders", () => {
        const orderProperties = {
          id: 1,
          items: {
              name: 'burger',
              quantity: 2,
              value: 100
          }
        };

    // Write a test
    describe('when a call to the API is made', () => {
        before( () => {
            return provider.addInteraction({
                state: 'there are orders',
                uponReceiving: 'a request for orders',
                withRequest: {
                path: '/orders',
                method: 'GET',
                },
                willRespondWith: {
                    body: eachLike(orderProperties),
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                },
            });
        });

        it('will receive the list of current orders', async () => {
            return await expect(fetchOrders()).to.eventually.have.deep.members([
                new Order(orderProperties.id, orderProperties.items),
            ])
        })
     })
   });

    // Write pact files to file
    after(() => {
    return provider.finalize();
    });

}); //end of Pact w/Order API