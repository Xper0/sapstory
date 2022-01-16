sap.ui.define([
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
], function (History) {
  "use strict";
  return {
    onNavBack: function (oRouter) {
      let oHistory = History.getInstance()
      let sPreviousHash = oHistory.getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        oRouter.navTo("Home", {}, true /*no history*/);
      }

    }
  };
});