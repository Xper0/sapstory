sap.ui.define([
  "sap/ui/core/format/NumberFormat",
  "sap/ui/core/BusyIndicator"
], function (NumberFormat, BusyIndicator) {
  "use strict";
  return {
    pictureUrl: function (sUrl) {
      if (sUrl){
        return  sap.ui.require.toUrl(sUrl);
      } else {
        return undefined;
      }
    },
    numberUnit: function (sValue) {
      if (!sValue) {
        return "";
      }
      return parseFloat(sValue).toFixed(2);
    },

    /**
     * Sums up the price for all products in the cart
     * @param {object} oCartEntries current cart entries
     * @return {string} string with the total value
     */
    totalPrice: function (oCartEntries) {
      let fTotalPrice = Object.keys(oCartEntries).reduce(
        (sum, val) => sum + (oCartEntries[val].Price * oCartEntries[val].Quantity), 0);
      let numberFormat = NumberFormat.getFloatInstance({
        maxFractionDigits: 2,
        minFractionDigits: 2,
        groupingEnabled: true,
        groupingSeparator: ".",
        decimalSeparator: ","
      });
      return numberFormat.format(fTotalPrice)
    },
    itemPrice: function (oCartEntries, Quantity) {
      console.log(oCartEntries);
      // let prod = Object.keys(oCartEntries).map( item => oCartEntries[item].Price * oCartEntries[item].Quantity)
      // let productPrice = Object.values(oItem).map( item => item.Price * item.Quantity);
      // let productPrice = Object.values(oItem).map( item => item.Price * item.Quantity );
      // console.log(productPrice)
      // let productPrice1 = Object.values(oItem).forEach( item => item.Price * item.Quantity );
      // console.log(productPrice1)
      // Object.keys(oItem).forEach( item => oItem[item].id === oItem.id ? console.log("да") : console.log("net"))
      // console.log(oItem.Price * oItem.Quantity)
      // let test = oItem.Price * oItem.Quantity
      // let oItemTotalPrice = 0
      // let itemPrice = Object.keys(oItem).reduce((sum, val) => sum + (oItem.Price * oItem.Quantity), 0);
      // console.log(itemPrice)
      // let sumItem = Object.keys(oItem).reduce((sum, val) => sum + (oItem[val].Price * oItem[val].Quantity), 0)
      // // console.log(Object.keys(oItem))
      // console.log(sumItem)
      // let fTotalPrice = Object.keys(oItem).map(val => (oItem[val].Price * oItem[val].Quantity));
      // console.log(prod)
      console.log(oCartEntries * Quantity)
     return  Number(oCartEntries) * Quantity
    },
    _updateCartCount: function (cartModel) {
      return Object.keys(cartModel).reduce((sum, val) => sum + cartModel[val].Quantity, 0)
    },
    showBusyIndicator: function (iDuration, iDelay) {
      BusyIndicator.show(iDelay);
      if (iDuration && iDuration > 0) {
        if (this._sTimeoutId) {
          clearTimeout(this._sTimeoutId);
          this._sTimeoutId = null;
        }
        this._sTimeoutId = setTimeout(function() {
          this.hideBusyIndicator();
        }.bind(this), iDuration);
      }
    },
  };
});