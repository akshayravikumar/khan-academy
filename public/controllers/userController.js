angular.module('codealyzerApp')
.controller("userController", function($scope, $location, $stateParams, $state, $http) {
    var editor = ace.edit("code-editor");
    editor.setOptions({
      fontSize: "12pt"
    });
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    $scope.showErrors = true;
    $scope.ready = false;

    $http.get('/api/problems/' + $stateParams.id)
       .then(
           function(response){
             // success callback
             console.log(response);
             if (response.data.error) {
                alert(response.data.error);
                return;
             }
             $scope.problem = response.data.problem;
             setup();
           }, 
           function(response){
             // failure callback
           }
        ); 

    validate = function() {
        $http.post('/validate', {source: editor.getValue(), id: $stateParams.id}, null)
           .then(
               function(response){
                 // success callback
                 console.log(response.data.errors);
                 $scope.errors = response.data.errors;
               }, 
               function(response){
                 // failure callback
               }
            ); 
    }

    setup = function() {
        $scope.ready = true;
        // it's fair to say we only need to send it to the server
        // once it doesn't have any errors client side
        editor.getSession().on("changeAnnotation", function() {
        	var annotations = editor.getSession().getAnnotations();
        	ready = true;
        	for (var i=0; i < annotations.length; i++) {
        		if (annotations[i].type === "error") {
        			return;
        		}
        	}
            validate();
        });
    }
});