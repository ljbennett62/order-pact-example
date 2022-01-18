const request = require("superagent");
const { Order } = require("./order");

const fetchOrders = async () => {
    //return await request.get(`${API_ENDPOINT}/orders`).then(
    return await request.get(`http://localhost:1234/orders`).then(
      res => {
        return res.body.map((o) => {
          return new Order(o.id, o.items)
        })
      },
      err => {
        throw new Error(`Error from response: ${err.body}`)
      }
    )
  }

  module.exports = {
    fetchOrders,
  };