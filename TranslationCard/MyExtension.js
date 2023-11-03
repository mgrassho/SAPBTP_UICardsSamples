sap.ui.define("list/card/MyExtension", [
    "sap/ui/integration/Extension"
], function (Extension) {
    "use strict";

    var MyExtension = Extension.extend("MyExtension", {
        onCardReady: function () {
            this.attachAction(this._handleAction.bind(this));
            this._data = {
                textInputVisible: true,
                responseVisible: false,
                buttonVisible: true
            };
        },
        getData: function () {
            return Promise.resolve(this._data);
        },
        _handleAction: function (oEvent) {
            var oCard = this.getCard(),
                sActionType = oEvent.getParameter("type"),
                mParams = oEvent.getParameter("parameters"),
                mSubmitData = mParams.data;

            if (sActionType !== "Submit") {
                return;
            }

            oEvent.preventDefault();

            // Validation
            //if (!oCard.validateControls()) {
            //	oCard.showMessage("{i18n>ERROR_PLEASE_FILL_REQUIRED_FIELDS}", "Error");
            //	return;
            //}

            oCard.showLoadingPlaceholders("Content");

            // Submits

            var oSubmitPromise = oCard.request({
                "url": "{{destinations.myDestination}}/translation",
                "withCredentials": true,
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "parameters": {
                    "sourceLanguage": "en-US",
                    "targetLanguage": "de-DE",
                    "contentType": "text/html",
                    "encoding": "plain",
                    "strictMode": "false",
                    data: mSubmitData.text
                }
            });



            /**
            
            // this only simulates a submit
            var oSubmitPromise = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve({
                        responseText: "Dummy response"
                    });
                }, 1000);
            });
            */
            oSubmitPromise
                .then(function (oResponse) {
                    this._data = {
                        textInputVisible: true,
                        responseVisible: true,
                        buttonVisible: true,
                        response: oResponse.data
                    };

                    oCard.hideLoadingPlaceholders();
                    oCard.refreshData();
                }.bind(this))
                .catch(function (sErrorMessage) {
                    oCard.showMessage(sErrorMessage, "Error");
                });
        }
    });

    return MyExtension;
});