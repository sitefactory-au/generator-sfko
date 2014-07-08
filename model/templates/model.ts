import ko = require("knockout");

export class <%= modelClassName %> {

	public id;
    public name;
	
    constructor (data: any) {
		this.id = data.id;
		this.name = ko.observable(data.name);
    }

    public dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.        
    }
}
