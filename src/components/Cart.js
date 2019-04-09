import React, { Component } from "react";
import CartProduct from "./CartProduct";

class Cart extends Component {
  render() {
    const list = this.props.cartList;

    return list.map(product => (
      <CartProduct
        delCart={this.props.delCart}
        name={product.name}
        price={product.price}
        id={product.id}
        key={product.id}
        desc={product.description}
        currSym={this.props.currSym}
        currTarget={this.props.currTarget}
        calcTotal={this.props.calcTotal}
      />
    ));
  }
}

export default Cart;
