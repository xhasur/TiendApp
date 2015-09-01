angular.module('starter.controllers').controller('loginCtrl', loginCtrl);

  function loginCtrl($scope, $state,$ionicPopup,loginService) {

    $scope.loginData = {};


    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.verificar = function () {
      loginService.loginUser($scope.login.usuario, $scope.login.password).success(function (data) {
        $state.go('app.principal');
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error de contraseña!',
          template: 'Ingresa una contraseña valida!'
        });
      });

    }
  }
