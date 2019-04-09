import React, { Component } from "react";
import axios from "axios";
import Products from "./components/Products";
import Cart from "./components/Cart";
import "./App.scss";
const fx = require("money");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      originalList: [],
      cartList: [],
      currSym: "$",
      currTarget: "USD"
    };
  }
  componentDidMount() {
    //money.js config
    fx.base = "USD";
    fx.rates = {
      EUR: 0.886,
      GBP: 0.756,
      USD: 1,
      YEN: 111.352
    };

    axios
      .get("http://private-32dcc-products72.apiary-mock.com/product")
      .then(res => {
        let temp = res.data;
        temp.sort((a, b) => {
          return parseFloat(b.price) - parseFloat(a.price);
        });

        this.setState({
          list: temp,
          originalList: temp
        });
      })
      .catch(error => console.log(error));
    let dropMenu = document.querySelector(".curr-wrapper");
    dropMenu.onclick = this.handleCurr;
    document.onclick = this.toggleHide;

    let dynamicContent = this.getParameterByName("dc");

    if (dynamicContent === "USD") {
      this.setState({
        currSym: "$",
        currTarget: "USD"
      });
    } else if (dynamicContent === "EUR") {
      this.setState({
        currSym: "€",
        currTarget: "EUR"
      });
    } else if (dynamicContent === "GBP") {
      this.setState({
        currSym: "£",
        currTarget: "GBP"
      });
    } else {
      this.setState({
        currSym: "$",
        currTarget: "USD"
      });
    }
  }
  componentDidUpdate() {
    this.calculateTotal();
  }

  //delete from products and add to cart
  deleteProduct = e => {
    let prodId = parseInt(e.currentTarget.parentNode.id);
    this.setState({
      cartList: [
        ...this.state.cartList,
        ...this.state.list.filter(el => parseInt(el.id) === prodId)
      ],

      list: this.state.list.filter(el => parseInt(el.id) !== prodId)
    });
  };

  //delete from cart and add to products
  deleteCart = e => {
    let prodId = parseInt(e.currentTarget.parentNode.id);

    this.setState({
      list: [
        ...this.state.list,
        ...this.state.cartList.filter(el => parseInt(el.id) === prodId)
      ].sort((a, b) => {
        return parseFloat(b.price) - parseFloat(a.price);
      }),

      cartList: this.state.cartList.filter(el => parseInt(el.id) !== prodId)
    });
  };

  //calculate total
  calculateTotal() {
    let values = Array.from(document.querySelectorAll(".value-detail"));

    let total = 0;
    if (values.length) {
      for (let i = 0; i < values.length; i++) {
        total += Number(values[i].textContent);
      }
      let totalEl = document.querySelector(".total-val");
      totalEl.textContent = total.toFixed(2);
    }
  }

  //toggle curr menu
  toggleHide = e => {
    e.preventDefault();
    if (!e.target.classList.contains("menu")) {
      document.querySelector(".curr-wrapper").classList.add("hide");
    } else {
      let parent = e.target.parentNode;
      let dropMenu = parent.querySelector(".curr-wrapper");
      if (dropMenu && dropMenu.classList.contains("hide")) {
        dropMenu.classList.remove("hide");
      } else if (dropMenu && !dropMenu.classList.contains("hide")) {
        dropMenu.classList.add("hide");
      }
    }
  };

  //changes curr for all values, when curr menu is used
  handleCurr = e => {
    e.preventDefault();
    let currName = e.target.getAttribute("data-curr-name");
    let currSymbol = e.target.getAttribute("data-template");
    let values = document.querySelectorAll(".value");
    this.setState({ currTarget: currName });

    values.forEach(el => {
      let parent = el.parentNode.parentNode;
      let [productItem] = this.state.list.filter(
        el => el.id == parent.id || el.id == parent.parentNode.id
      );

      if (productItem) {
        el.textContent = fx(productItem.price)
          .from(fx.base)
          .to(currName)
          .toFixed(2);
      }
    });

    this.setState({ currSym: currSymbol });
  };

  //parse url function
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    // name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, ""));
  }

  render() {
    return (
      <div className="App">
        <nav id="nav">
          <button className="currency menu">Currency</button>
          <div className="curr-wrapper hide menu">
            <div
              className="dollars curr menu"
              data-template="&#36;"
              data-curr-name="USD"
            >
              &#36; USD
            </div>
            <div
              className="pounds curr menu"
              data-template="&#163;"
              data-curr-name="GBP"
            >
              &#163; GBP
            </div>
            <div
              className="euro curr menu"
              data-template="&euro;"
              data-curr-name="EUR"
            >
              &euro; EUR
            </div>
          </div>
        </nav>
        <main id="main">
          <div className="main-wrapper">
            <h1>Checkout page</h1>
            <div className="content-wrapper">
              <div className="products-wrapper" id="prod-wrapper">
                <Products
                  list={this.state.list}
                  delProd={this.deleteProduct}
                  currSym={this.state.currSym}
                  currTarget={this.state.currTarget}
                />
              </div>
              <div className="cart-wrapper">
                <span className="prod-cart-text">
                  {this.state.cartList < 1
                    ? "No products in your shopping cart"
                    : "Products in your shopping cart"}
                </span>
                <div
                  className={
                    "cart-details " + (this.state.cartList < 1 ? "hide" : "")
                  }
                >
                  <div className="item-headers">
                    <div className="prod-header">Product</div>
                    <div className="quantity-header">Quantity</div>
                    <div className="value-header">Value</div>
                    <div className="delete-header">Delete</div>
                  </div>
                  <Cart
                    cartList={this.state.cartList}
                    delCart={this.deleteCart}
                    currSym={this.state.currSym}
                    currTarget={this.state.currTarget}
                    calcTotal={this.calculateTotal}
                  />
                </div>

                <div
                  className={"total " + (this.state.cartList < 1 ? "hide" : "")}
                  id="total"
                >
                  <span>
                    Total:{" "}
                    <span data-curr={this.state.currSym}>
                      {this.state.currSym}
                    </span>
                    <span className="total-val value">0</span>
                  </span>
                </div>

                <button
                  className={
                    "continue " + (this.state.cartList < 1 ? "hide" : "")
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
