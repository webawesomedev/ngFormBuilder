/**
* A directive for a field to edit a component's key.
*/
module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    template: function() {
      return '<div class="form-group" ng-class="{\'has-warning\': shouldWarnAboutEmbedding()}">' +
                '<div class="alert alert-warning" role="alert" ng-if="!component.isNew">' +
                'Changing the API key will cause you to lose existing submission data associated with this component.' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-lg-6 form-group">' +
                '<input type="text" ng-model="table" placeholder="Input Table Name" uib-typeahead="tblName for tblName in getTable($viewValue)" typeahead-loading="loadingTable" typeahead-no-results="noResultsTable" class="form-control">' +
                '<div ng-show="loadingTable">Loading Tables...</div>' +
                '<div ng-show="noResultsTable">No Results Found</div>' +
                '</div>' +
                '<div class="col-lg-6 form-group">' +
                '<input type="text" ng-model="field" placeholder="Input Field Name" uib-typeahead="fldName for fldName in getField($viewValue)" typeahead-loading="loadingField" typeahead-no-results="noResultsField" class="form-control">' +
                '<div ng-show="loadingField">Loading Fields...</div>' +
                '<div ng-show="noResultsField">No Results Found</div>' +
                '</div>' +
                '</div>' +
                '<label for="key" class="control-label" form-builder-tooltip="The name of this field in the API endpoint.">Property Name</label>' +
                '<input type="text" class="form-control" id="key" name="key" ng-model="component.key" valid-api-key value="{{ component.key }}" ' +
                'ng-disabled="component.source" ng-blur="onBlur()">' +
                '<p ng-if="shouldWarnAboutEmbedding()" class="help-block"><span class="glyphicon glyphicon-exclamation-sign"></span> ' +
                  'Using a dot in your Property Name will link this field to a field from a Resource. Doing this manually is not recommended because you will experience unexpected behavior if the Resource field is not found. If you wish to embed a Resource field in your form, use a component from the corresponding Resource Components category on the left.' +
                '</p>' +
              '</div>';
    },
    controller: ['$scope', '$http', 'BuilderUtils', function($scope, $http, BuilderUtils) {
      BuilderUtils.uniquify($scope.form, $scope.component);
      $scope.table = $scope.component.key.split('-')[0] || '';
      $scope.field = $scope.component.key.split('-')[1] || '';

      $scope.getTable = function(val) {
        return $http.get(apiURL + 'IScript_GetRecNames', {
          params: {
            record: val
          }
        }).then(function(response) {
          return response.data.records.map(function(item) {
            return item.text;
          })
        });
      };

      $scope.getField = function(val) {
        return $http.get(apiURL + 'IScript_GetRecFieldNames', {
          params: {
            record: $scope.table,
            field: val
          }
        }).then(function(response) {
          return response.data.fields.map(function(item) {
            return item.text;
          })
        });
      };

      $scope.$watch('table + field', function() {
        $scope.component.key = $scope.table + '-' + $scope.field;
      });

      $scope.onBlur = function() {
        $scope.component.lockKey = true;

        // If they try to input an empty key, refill it with default and let uniquify make it unique.
        if (!$scope.component.key && $scope.formComponents[$scope.component.type].settings.key) {
          $scope.component.key = $scope.formComponents[$scope.component.type].settings.key;
          $scope.component.lockKey = false; // Also unlock key
          BuilderUtils.uniquify($scope.form, $scope.component);
        }
      };

      $scope.shouldWarnAboutEmbedding = function() {
        if (!$scope.component || !$scope.component.key) {
          return false;
        }
        return !$scope.component.source && $scope.component.key.indexOf('.') !== -1;
      };
    }]
  };
};
