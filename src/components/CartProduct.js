import React, { Component } from "react";
const fx = require("money");

class CartProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1
    };
  }
  componentDidMount() {
    //money.js config
    fx.base = "USD";
    fx.rates = {
      EUR: 0.886,
      GBP: 0.756,
      USD: 1
    };
  }
  componentDidUpdate() {
    this.props.calcTotal();
  }

  quantChange = e => {
    this.setState({
      value: e.target.value <= 0 ? 1 : e.target.value
    });
  };

  render() {
    return (
      <div className="item-details" id={this.props.id}>
        <div className="prod-detail">
          {this.props.name}
          <i
            className="fas fa-info-circle"
            title={this.props.desc || "No description available"}
          />
        </div>
        <input
          className="quantity-detail"
          type="number"
          value={this.state.value}
          min="1"
          max="20"
          onChange={this.quantChange}
        />
        <div className="price-div">
          <span>{this.props.currSym}</span>
          <span className="value-detail value">
            {(
              fx(this.props.price)
                .from(fx.base)
                .to(this.props.currTarget)
                .toFixed(2) * this.state.value
            ).toFixed(2)}
          </span>
        </div>
        <i
          className="delete-icon far fa-trash-alt"
          onClick={this.props.delCart}
        />
      </div>
    );
  }
}

export default CartProduct;
