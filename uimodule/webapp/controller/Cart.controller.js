sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device",
  "../model/formatter",
  "../model/cart",
  "sap/m/MessageBox",
], function (Controller, JSONModel, Device, formatter, cart, MessageBox) {
  "use strict";


  let sCartModelName = "cartProducts";
  let sSavedForLaterEntries = "savedForLaterEntries";
  let sCartEntries = "cartEntries";
  return Controller.extend("com.storeapp.storeapp.controller.Cart", {
    formatter: formatter,
    cart: cart,
    onInit: function () {

      // this._oRouter = this.getOwnerComponent().getRouter();
      // this._oRouter.getRoute("Cart").attachPatternMatched(this._routePatternMatched, this);
      // // this._oRouter.getRoute("Product").attachPatternMatched(this._routePatternMatched, this);
      // var oCfgModel = new JSONModel({});
      // this.getView().setModel(oCfgModel, "cfg");
      // this._toggleCfgModel();
      let Field = this.byId("inputRange");
      Field.setProperty("min", 1);

    },
    // _routePatternMatched: function () {
    //   var oCartModel = this.getModel("cartProducts");
    //   var oCartEntries = oCartModel.getProperty("/cartEntries");
    //   //enables the proceed and edit buttons if the cart has entries
    //   //set selection of list back
    //   var oEntryList = this.byId("entryList");
    // },

    // _toggleCfgModel: function () {
    //   var oCfgModel = this.getView().getModel("cfg");
    //   var oData = oCfgModel.getData();
    //
    //   var bDataNoSetYet = !oData.hasOwnProperty("inDelete");
    //   var bInDelete = (bDataNoSetYet ? true : oData.inDelete);
    //   var sPhoneMode = (Device.system.phone ? "None" : "SingleSelectMaster");
    //   var sPhoneType = (Device.system.phone ? "Active" : "Inactive");
    //
    //   oCfgModel.setData({
    //     inDelete: !bInDelete,
    //     notInDelete: bInDelete,
    //     listMode: (bInDelete ? sPhoneMode : "Delete"),
    //     listItemType: (bInDelete ? sPhoneType : "Inactive"),
    //
    //   });
    // },
    onChangeValue: function (oEvent) {
      let productPrice = this.byId("productPrice");
      let Field = this.byId("inputRange");
      let oValue = oEvent.getParameters("change").value;
      let refreshData = oEvent.getSource().getBindingContext("cartProducts").getObject();

      productPrice.setProperty("number", refreshData.Price * refreshData.Quantity)
      let oCart = oEvent.getSource().getModel("cartProducts");
      // formatter.itemPrice(refreshData)
      if (oValue <= 1) {
        oEvent.getSource().setProperty("min", 1);
        cart._updateCartItem(refreshData, oCart);
      } else {
        cart._updateCartItem(refreshData, oCart);
      }
      // formatter.itemPrice(refreshData.Quantity)
    },

    onDeleteItem: function (oEvent) {
      this._deleteProduct(sCartEntries, oEvent);
    },
    _deleteProduct: function (sCollection, oEvent) {
      console.log(oEvent.getSource().getBindingContext("cartProducts").getObject());
      let itemProduct = oEvent.getSource().getBindingContext("cartProducts").getObject();
      let oCart = oEvent.getSource().getModel("cartProducts");
      MessageBox.confirm("Do you want delete product?", {
        icon: MessageBox.Icon.WARNING,
        actions: [
          MessageBox.Action.YES,
          MessageBox.Action.CANCEL
        ],
        onClose: function (oAction) {
          if (oAction !== MessageBox.Action.YES) {
            return;
          }
          //Вариант 1
          // let filObj =  Object.values(oCart.getData()["cartEntries"]).filter( product => product.id !== itemProduct.id);
          // oCart.setProperty("/" + sCollection, Object.assign({},  filObj))
          //Вариант 2

          let oCollectionEntries = Object.assign({}, oCart.getData()[sCollection]);
          delete oCollectionEntries[itemProduct.id]
          oCart.setProperty("/" + sCollection, Object.assign({}, oCollectionEntries));
          // oCart.setData(oCart.getData()["cartEntries"], fil)
        }
      })
    }
  });
});