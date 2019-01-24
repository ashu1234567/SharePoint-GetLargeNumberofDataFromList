/*................................................................................................
Version       Date               Created By                        Comments
1.0.0         18 Jan 2019       Ashutosh Kumar Choudhary          Initial version

..................................................................................................*/

var Common = {
    // Format date to DD MMM, YYYY format
    formatDate: function (dateToFormat) {
        dateToFormat = new Date(dateToFormat);
        var day = dateToFormat.getDate();
        var year = dateToFormat.getFullYear();
        var monthIndex = dateToFormat.getMonth();

        //Declare Full month Array Variable
        var fullMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var formattedDate = day + " " + fullMonth[monthIndex] + ", " + year;
        return formattedDate;
    },
	
	// Get the data from list using rest ajax call
    getDataFromList: function (url) {
        return $.ajax({
            url: url,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose"
            },
            success: function (data) {
            },
            error: function (error) {
                console.log(error);
            }
        });
    },


}


