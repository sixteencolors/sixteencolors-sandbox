var map = {
    'results': {
        create: function(options) {
            return new PackViewModel(options.data);
        }
    }
}
var PackViewModel = function(data) {
    var self = this;
    ko.mapping.fromJS(data, {}, self);
}

ko.applyBindings(function() {
    var self = this;
    self.loaded = ko.observable(false);
    self.processing = ko.observable(false);

    self.init = function() {
        $.getJSON("https://api.16colo.rs/v1/pack/blocktronics_resvolution", function(data) {
            ko.mapping.fromJS(data, map, self);
            self.loaded(true);
        });
    };

    self.init();
});