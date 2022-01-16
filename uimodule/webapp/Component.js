sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/storeapp/storeapp/model/models",
    "sap/ui/model/json/JSONModel",
    ],
    function (UIComponent, Device, models, JSONModel ) {
        "use strict";

        return UIComponent.extend("com.storeapp.storeapp.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
              let cartModel = new JSONModel({
                  entryCard: {}
                }
              )
              let prodModel = new JSONModel({})
              const url = "http://localhost:5000/products"
              // var sHeaders = {
              //   "Accept": "application/json",
              //   "Access-Control-Allow-Origin": "*",
              //   "X-Requested-With": "XMLHttpRequest",
              //   "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
              //   "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
              // };
              prodModel.loadData(url, null, true, "GET", null, false);
              this.setModel(prodModel, "myProductModel")
              this.setModel(cartModel, "myCartModel")
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);