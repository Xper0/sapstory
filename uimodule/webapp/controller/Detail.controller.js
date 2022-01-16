sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
  "../model/formatter",
    "../model/cart",
  ],
  function (Controller, UIComponent,History, formatter, cart){
    return Controller.extend("com.storeapp.storeapp.controller.Product", {
      formatter: formatter,
      cart: cart,
      onInit: function () {
        var oRouter =  this.getOwnerComponent().getRouter();
        oRouter.getRoute("detail").attachMatched(this._onObjectMatched, this);
      },
      _routePatternMatched: function () {
        this._setLayout("Two");
      },
      _onObjectMatched: function (oEvent) {
        let oItem, oView;
        oItem = oEvent.getParameter("arguments").detailId - 1; // Получение detailId
        oView = this.getView();
        oView.bindElement({
          path: "/" + oItem ,
          model: "myProductModel",
        })
        console.log(oView)
      },
      onNavBack: function ( ) {
        let oHistory = History.getInstance()
        let sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Products", {}, true);
        }
      },
      onAddToCart: function (oEvent) {
        let oProduct = oEvent.getSource().getBindingContext("myProductModel").getObject();  //  получение item
        let oCart = oEvent.getSource().getModel("cartProducts") //  получение модели json
        cart.addToCart(oProduct, oCart)
      }

    })
  });