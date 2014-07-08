import ko = require("knockout");

class <%= moduleClassName %> {

	// Declare properties
	
    constructor (data: any) {
		// Initialisaiton code here
    }

    public dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.        
    }
}

var module:any = new <%= moduleClassName %>();
export = module;