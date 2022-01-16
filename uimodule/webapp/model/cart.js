sap.ui.define([
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/util/Storage",
  "sap/ui/model/json/JSONModel",
], function (
  MessageBox,
  MessageToast,
  Storage,
  JSONModel) {
  "use strict";

  return {
    _STORAGE_KEY: "LOCALSTORAGE_MODEL",
    _storage: new Storage(Storage.Type.local),
    /**
     * Checks for the status of the product that is added to the cart.
     * If the product is not available, a message dialog will open.
     * @public
     * @param {Object} oProduct Product that is added to the cart
     * @param oDatas
     */
    addToCart: function (oProduct, oDatas) {
      // Items to be added from the welcome view have it's content inside product object
      // if (oProduct !== undefined) {
      //   console.log("model:" +  oProduct)
      //   oProduct = oProduct;
      // }
      // switch (oProduct.Status) {
      //   case "D":
      //     //show message dialog
      //     MessageBox.show(
      //       oBundle.getText("productStatusDiscontinuedMsg"), {
      //         icon: MessageBox.Icon.ERROR,
      //         titles: oBundle.getText("productStatusDiscontinuedTitle"),
      //         actions: [MessageBox.Action.CLOSE]
      //       });
      //     break;
      //   case "O":
      //     // show message dialog
      //     MessageBox.show(
      //       oBundle.getText("productStatusOutOfStockMsg"), {
      //         icon: MessageBox.Icon.QUESTION,
      //         title: oBundle.getText("productStatusOutOfStockTitle"),
      //         actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
      //         onClose: function (oAction) {
      //           // order
      //           if (MessageBox.Action.OK === oAction) {
      //             this._updateCartItem(oBundle, oProduct, oCartModel);
      //           }
      //         }.bind(this)
      //       });
      //     break;
      //   case "A":
      //   default:
          this._updateCartItem(oProduct, oDatas);
      //     break;
      // }
    },

    /**
     * Function that updates the cart model when a product is added to the cart.
     * If the product is already in the cart the quantity is increased.
     * If not, the product is added to the cart with quantity 1.
     * @private
     * @param {Object} oBundle i18n bundle
     * @param {Object} oProductToBeAdded Product that is added to the cart
     * @param {Object} oCartModel Cart model
     */
    _updateCartItem: function (oProductToBeAdded, oCartModel) {
      // find existing entry for product
      console.log(oCartModel.getData())
      var oCollectionEntries = Object.assign({}, oCartModel.getData()["cartEntries"]);

      var oCartEntry =  oCollectionEntries[oProductToBeAdded.id];
      //
      if (oCartEntry === undefined) {
        // create new entry
        oCartEntry = Object.assign({}, oProductToBeAdded);
        oCartEntry.Quantity = 1;
        oCollectionEntries[oProductToBeAdded.id] = oCartEntry;
      } else if (oCartEntry === oProductToBeAdded){
        oCartEntry = Object.assign({}, oProductToBeAdded);
        oCartEntry.Quantity = oProductToBeAdded.Quantity;
        oCollectionEntries[oProductToBeAdded.id] = oCartEntry;
      } else {
        // update existing entry
        oCartEntry.Quantity += 1;
      }
      //update the cart model
      oCartModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
      oCartModel.refresh(true);
      // this.refresh()
      // console.log(oCartModel)
      // MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.Name] ));
    },
    // refresh: function () {
    //   console.log("dspjd")
    //   JSONModel.prototype.refresh.apply(this, arguments);
    //   console.log(  JSONModel.prototype.refresh.apply(this, arguments))
    //   this._storeData();
    // },
    // _storeData: function() {
    //   let oData = this.getData();
    //   console.log(oData)
    //   // update local storage with current data
    //   let sJSON = JSON.stringify(oData);
    //   this._storage.put(this._STORAGE_KEY, sJSON);
    // },

  };
});