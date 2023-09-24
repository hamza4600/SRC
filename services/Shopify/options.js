export const shopifyOptions = {
  product: {
    iframe: false,
    buttonDestination: "modal",
    styles: {
      product: {
        "@media (min-width: 601px)": {
          "max-width": "calc(25% - 20px)",
          "margin-left": "20px",
          "margin-bottom": "50px",
        },
      },
      button: {
        "visibility": "hidden",
      },
    },
    contents: {
      img: false,
      title: false,
      price: false,
      unitPrice: true,
      options: true,
      quantity: false,
      quantityInput: true,
    },
  },
  cart: {
    contents: {
      button: true,
    },
    styles: {
      button: {
        "background-color": "#1a1a1a",
        ":hover": {
          "background-color": "#2c2c2c",
        },
        ":focus": {
          "background-color": "#2c2c2c",
        }
      },
      footer: {
        "background-color": "#ffffff",
      },
    },
  },
  toggle: {
    iframe: false,
    contents: {
      count: false,
      icon: false,
      title: false,
    },
    text : {
      title: ""
    },
    styles: {
      toggle: {
        "display": "none",
      },
    },
  },
  modalProduct: {
    styles: {
      hasImage: {
        "img": {
          "max-height": "500px",
        }
      },
    },
  },
  modal: {
    styles: {
      img: {
        "max-height": "90vh",
      },
    },
  },
};