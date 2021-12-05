sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
  "../model/formatter"
  ],
  function (Controller, UIComponent,History, formatter){
    return Controller.extend("com.storeapp.storeapp.controller.Product", {
      formatter: formatter,
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
          model: "productses",
        })
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

    })
  });