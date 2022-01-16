sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "./BaseController",
  "../model/Historys",
  "sap/ui/core/routing/History",

], function (Controller, JSONModel, BaseController, Historys, History) {
  "use strict";
  return Controller.extend("com.storeapp.storeapp.controller.PurchaseStatistics", {
    History: Historys,
    onInit: function () {
      let oViezFrame = this.getView().byId("idVizFrameStatic")
      let oData = {
        "statistic": [
          {
            "month": "January",
            "Purchase": 300,
            "Cost": 7345
          },
          {
            "month": "February",
           "Purchase": 300,
            "Cost": 7345
          },
          {
            "month": "March",
            "Purchase": 1085,
            "Cost": 7345
          },
          {
            "month": "April",
            "Purchase": 578,
            "Cost": 7345
          },
          {
            "month": "May",
            "Purchase": 934,
            "Cost": 7345
          },
          {
            "month": "June",
            "Purchase": 245,
            "Cost": 7345
          },
          {
            "month": "July",
            "Purchase": 5000,
            "Cost": 7345
          },
          {
            "month": "August",
            "Purchase": 3500,
            "Cost": 7345
          },
          {
            "month": "September",
            "Purchase": 45
          },
          {
            "month": "October",
            "Purchase": 8754,
            "Cost": 7345
          },
          {
            "month": "November",
            "Purchase": 5435,
            "Cost": 7345
          },
          {
            "month": "December",
            "Purchase": 8566,
            "Cost": 7345
          },
        ]
      }
      let oModel = new JSONModel(this._getRandomData(oData))
      let flatData = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: {
            name: "Month",
            value: "{month}"
          },
        measures: [{
            name: "Purchase",
            value: "{Purchase}"
          },
          {
            name: "Cost",
            value: "{Cost}"
          }
          ],
        data: {
            path: "/statistic"
        }
        });
      oViezFrame.setDataset(flatData);
      oViezFrame.setModel(oModel);
      oViezFrame.setVizProperties({
        title: {
          text: "Diagram Purchase"
        },
        plotArea: {
          colorPalette: d3.scale.category20().range(),
          drawingEffect: "glossy",
          dataLabel: {
            visible: true
          }
        }
      });

      let feedSize = new  sap.viz.ui5.controls.common.feeds.FeedItem({
          "uid": "valueAxis",
          "type": "Measure",
          "values": ["Purchase", "Cost"]
        },
          ),
        feedColor = new  sap.viz.ui5.controls.common.feeds.FeedItem({
          "uid": "categoryAxis",
          "type": "Dimension",
          "values": ["Month"]
        });
      oViezFrame.addFeed(feedSize);
      oViezFrame.addFeed(feedColor);

      var oPopOver = this.getView().byId("idPopOver");
      oPopOver.connect(oViezFrame.getVizUid());

    },

    _getRandomData: function (oData) {
      oData.statistic.map( item =>
        item.Purchase = item.Purchase * getNumber());
      function getNumber() {
        return Math.ceil(Math.random() * 70);
      }
      return oData;
    },
    showDetail: function (oEvent) {
      let oViezFrame = this.getView().byId("idVizFrameStatic")
      console.log(oViezFrame.getVizProperties())
      // oViezFrame.setVizProperties({
      //   plotArea: {
      //     dataLabel: {
      //       visible: true
      //     }
      //   }
      // });
    },
    onNavBacks: function () {
      // console.log(BaseController)
      let oRouter = this.getOwnerComponent().getRouter()
      console.log(Historys)
      Historys.onNavBack(oRouter)
      // BaseController.this.onNavBack()
    },
    onNavBack: function () {
      let oHistory = History.getInstance()
      let sPreviousHash = oHistory.getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Home", {}, true);
      }
    },

  });
});