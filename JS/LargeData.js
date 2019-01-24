/*................................................................................................
Version       Date               Created By                        Comments
1.0.0         18 Jan 2019       Ashutosh Kumar Choudhary          Initial version

..................................................................................................*/

/*
It contains the JS code to get data from sample list. 
Before running the code make sure Sample List exist on the site.
*/

var LargeData = {

    items: [],
    getItemsRestUrlFilteredById: "{0}/_api/web/lists/getbytitle('Sample List')/items?$select=Title,Price,AvailableFrom,Count&$filter=(Id gt {1} and Id lt {2})&$orderby=Modified desc&$top=5000",
    getLastItemsRestUrl: "{0}/_api/web/lists/getbytitle('Sample List')/items?$select=Id&$orderby=Id desc&$top=1",
    maxItemInQuery: 5000,

    
	  /* 
		Function to get last item Id
     */
	getLastItemId: function () {
        return Common.getDataFromList(String.format(LargeData.getLastItemsRestUrl, _spPageContextInfo.webAbsoluteUrl)).done(function (data) {
            LargeData.tagData = data.d.results
        });
    },

    /* 
     Function to initiate get data from list
     */
    getItems: function () {

        $(".loadingDiv").show();
        console.log(new Date().toString() + " Fetching Data..");
		
        var itemRequsts = [];

        $.when(LargeData.getLastItemId()).then(function (lastItem) {
            var lastItemId = lastItem.d.results[0].Id;
            for (var i = 1; i <= lastItemId; i = i + LargeData.maxItemInQuery) {

                itemRequsts.push(Common.getDataFromList(String.format(LargeData.getItemsRestUrlFilteredById, _spPageContextInfo.webAbsoluteUrl, (i - 1), i + LargeData.maxItemInQuery))
                )
            }

            $.when.apply($, itemRequsts).done(function () {
                $.each(arguments, function (index, data) {
                    if (data != null && data != undefined && data[0] !== null && data[0] !== undefined) {
                        LargeData.items = LargeData.items.concat($.map(data[0].d.results, function (item) {
                            if (item.Price != null && item.Price != undefined && item.Price !== '') {
                                return {
                                    Title: item.Title,
                                    AvailableFrom: "<span style='display:none'>" + item.AvailableFrom + "</span>" + Common.formatDate(item.AvailableFrom),
                                    Count: item.Count,
                                    Price: item.Price,
                                };
                            }
                        }));
                    }
                });

                // Convert array of object to array of array
                LargeData.items = LargeData.items.map(function (obj) {
                    return Object.keys(obj).map(function (key) {
                        return obj[key];
                    });
                });

                console.log(new Date().toString() + " Fetching data done..");

                // Call the setup of data table
                LargeData.setupDataTable();

            });
        })
    },

    /*
      function to setup data table
    */
    setupDataTable: function () {

        console.log(new Date().toString() + " Setting data table...");
        $('#GridTable thead tr').clone(true).appendTo('#GridTable thead');
        $('#GridTable thead tr:eq(1) th').each(function (i) {
            var title = $(this).text();

            if (title.toLowerCase() != 'action') {
                $(this).html('<input type="text" style="max-width:170px" placeholder="Search ' + title + '" />');

                $('input', this).on('keyup change', function () {
                    var table = $('#GridTable').DataTable();
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                    $(".dataTables_filter").hide();
                });
            }
            else {
                $(this).html('');
            }

        });

        var table = $('#GridTable').DataTable({
            data: LargeData.items,
            deferRender: true,
            orderCellsTop: true,
            fixedHeader: false,
            searching: true,
            lengthChange: false,
            pageLength: 15,
        });

        $(".dataTables_filter").hide();

        $(".loadingDiv").hide();

        console.log(new Date().toString() + " Setting data table done.");

    }

}