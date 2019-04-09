import React, { Component } from "react";
import Product from "./Product";

class Products extends Component {
  render() {
    const list = this.props.list;

    return list.map(product => (
      <Product
        delProd={this.props.delProd}
        name={product.name}
        price={product.price}
        id={product.id}
        key={product.id}
        desc={product.description}
        currSym={this.props.currSym}
        currTarget={this.props.currTarget}
      />
    ));
  }
}

export default Products;
