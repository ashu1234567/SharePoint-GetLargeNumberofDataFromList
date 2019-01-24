/*................................................................................................
Version       Date               Created By                        Comments
1.0.0         18 Jan 2019       Ashutosh Kumar Choudhary          Initial version
..................................................................................................*/
/*
It contains the JS code to create sample data in the list. 
Before running the code make sure Sample List exist on the site having these fields
- Title
- Price
- Count
-AvailableFrom
*/

var Upload = {
    rlListTitle: "Items",
    startIndex: 0,
    maximumAddItemInQuery: 500,
    maximumRowsInCSV: 100000,



    // Add data to  list
    addData: function () {

        Upload.processingStart();
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var list = web.get_lists().getByTitle(Upload.rlListTitle);


        for (var i = Upload.startIndex; i < Upload.startIndex + Upload.maximumAddItemInQuery && i < Upload.maximumRowsInCSV; i++) {

            var itemCreateInfo = new SP.ListItemCreationInformation();
            itemCreateInfo.set_folderUrl(_spPageContextInfo.siteServerRelativeUrl + '/Lists/Items/Folder' + (Math.floor(i / 5000) + 1));
            var listItem = list.addItem(itemCreateInfo);
            listItem.set_item("Title", ("Item" + i));
            listItem.set_item("Price", (Math.floor(Math.random() * (+2500 - +1)) + +1));
            listItem.set_item("Count", (Math.floor(Math.random() * (+5000 - +1)) + +100));
            listItem.set_item("AvailableFrom", new Date().toISOString());
            listItem.update();
            context.load(listItem);

        }

        context.executeQueryAsync(
            function () {
                console.log("Item added successfully. Range(" + Upload.startIndex + " - " + (Upload.startIndex + Upload.maximumAddItemInQuery) + ")");

                if (Upload.startIndex + Upload.maximumAddItemInQuery < Upload.maximumRowsInCSV) {
                    Upload.startIndex = Upload.startIndex + Upload.maximumAddItemInQuery;
                    Upload.addData()
                }
                else {
                    Upload.processingEnd();
                }
            },
            function (sender, args) {
                console.error("Error in adding items. Range(" + Upload.startIndex + " - " + (Upload.startIndex + Upload.maximumAddItemInQuery) + ")");
                Upload.processingEnd();
            }
        );
    },


    // Show loading icon and message
    processingStart: function () {
        $(".processingIcon img").show();
        $(".processingMessage").text("Processing...");
        $("button").attr("disabled", true);
    },

    // Hide loading icon and message
    processingEnd: function () {
        $(".processingIcon img").hide();
        $(".processingMessage").text("Done.");
        $("button").removeAttr("disabled");
        $('#uploadFile').val('');
    },

}


