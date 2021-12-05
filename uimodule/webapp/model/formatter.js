sap.ui.define([], function () {
  "use strict";
  return {
    pictureUrl: function (sUrl) {
      if (sUrl){
        return  sap.ui.require.toUrl(sUrl);
      } else {
        return undefined;
      }
    },
  };
});