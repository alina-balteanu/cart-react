import React, { Component } from "react";
const fx = require("money");

class Product extends Component {
  componentDidMount() {
    //money.js config
    fx.base = "USD";
    fx.rates = {
      EUR: 0.886,
      GBP: 0.756,
      USD: 1
    };
  }

  render() {
    return (
      <div className="product" id={this.props.id}>
        <span className="prod-name">{this.props.name}</span>
        <span className="prod-price">
          Price: <span className="prod-currency">{this.props.currSym}</span>
          <span className="prod-value value">
            {fx(this.props.price)
              .from(fx.base)
              .to(this.props.currTarget)
              .toFixed(2)}
          </span>
        </span>
        <button className="add-cart" onClick={this.props.delProd}>
          <i className="fas fa-shopping-cart icon-flipped" />
          Add to cart
        </button>
      </div>
    );
  }
}

export default Product;
