sap.ui.define(['sap/ui/base/Object'], function (baseObject) {

  //'use strict';

  return baseObject.extend('server.controller.MainHelper', {
    constructor: function constructor(oController) {
      this.oController = oController;
    },
    check: function () {
      alert("job")
    }
  })
}
)