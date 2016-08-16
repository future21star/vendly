(function() {
    'use strict'
    angular.module('angular-sir-trevor')
        .provider('sirTrevorService', sirTrevorServiceProvider);

    function sirTrevorServiceProvider() {
        this.$get = sirTrevorService;

        this.setDefaults = sirTrevorServiceProvider_setDefaults;
        this.setBlockOptions = sirTrevorServiceProvider_setBlockOptions;
        this.setConfig = sirTrevorServiceProvider_setConfig;

        /////

        function sirTrevorServiceProvider_setDefaults(defaults) {
            SirTrevor.setDefaults(defaults);
        }

        function sirTrevorServiceProvider_setBlockOptions(blockType, blockOptions) {
            SirTrevor.setBlockOptions(blockType, blockOptions);
        }

        function sirTrevorServiceProvider_setConfig(values) {
            angular.forEach(values, function(value, key) {
                SirTrevor.config[key] = value;
            });
        }

        sirTrevorService.$inject = [];

        function sirTrevorService() {
            return SirTrevor;
        }
    }



})();
