sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";
  return Controller.extend("com.storeapp.storeapp.controller.Detail", {
    onInit: function () {
      var oRouter = this.getRouter();
    },
    _onObjectMatched: function (oEvent) {
      // var oArgs, oView;
      // oArgs = oEvent.getParameter("arguments");
      // oView = this.getView();
      this.getView().bindElement({
        path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").detailId),
        model: "productses"
      });

      // oView.bindElement({
      //   path : "/Products(" + oArgs.detailId + ")",
      //   model: "productses",
      //   events : {
      //     change: this._onBindingChange.bind(this),
      //     dataRequested: function (oEvent) {
      //       oView.setBusy(true);
      //     },
      //     dataReceived: function (oEvent) {
      //       oView.setBusy(false);
      //     }
      //   }
      // })

      // this.getView().bindElement({
      //   path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").detailId),
      //   model: "Products"
      // });
    },
    _onBindingChange : function (oEvent) {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display("notFound");
      }
    },
    check: function () {
      console.log("hf")
      var oRouter = this.getRouter();
      oRouter.getRoute("detail")
      console.log(oRouter)
    },

  });
});