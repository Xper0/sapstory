sap.ui.define([
  "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/m/MenuItem",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter"
  ],
  function (Controller, Fragment, MenuItem, JSONModel,MessageToast, Filter){
    return Controller.extend("com.storeapp.storeapp.controller.Home", {
      onInit: function () {
        this.oModel = new JSONModel("../localService/metadata/Product.json");
        var oView = this.getView().setModel(this.oModel);
        this.oSF = oView.byId("searchField");
      },

      onSearch: function (event) {
        console.log(event)
        var oItem = event.getParameter("suggestionItem");
        let oRouter = this.getOwnerComponent().getRouter();
        if (oItem && oItem !== "") {
          MessageToast.show("Search for: " + oItem.getText());
          oRouter.navTo("detail", {
            // detailId: window.encodeURIComponent(oItem.getBindingContext("Products").getPath().substr(1))
            detailId: oItem.getProperty("key" )
          });
        } else {
          MessageToast.show("Search is fired!");
        }
      },

      onSuggest: function (event) {
        var sValue = event.getParameter("suggestValue"),
          aFilters = [];
        if (sValue) {
          aFilters = [
            new Filter([
              // new Filter("id", function (sText) {
              //   console.log(sText)
              //   return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
              // }),
              new Filter("Name", function (sDes) {
                return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
              })
            ], false)
          ];
        }
        this.oSF.getBinding("suggestionItems").filter(aFilters);
        this.oSF.suggest();
      },
      onPress: function() {

        let oView = this.getView(),
            oButton = this.byId("button");
  console.log(this._oMenuFragment)
        if (!this._oMenuFragment) {
          this._oMenuFragment = Fragment.load({
            id: oView.getId(),
            name: "com.storeapp.storeapp.view.Category",
            controller: this
          }).then(function(oMenu) {
           console.log(oMenu)
            oMenu.openBy(oButton);
            this._oMenuFragment = oMenu;
            return this._oMenuFragment;
          }.bind(this));
        } else {
          this._oMenuFragment.openBy(oButton);
        }
      },
      onPageProduct: function (oEvent){
        var oItem = oEvent.getSource();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Products" );
      }
    })
  });