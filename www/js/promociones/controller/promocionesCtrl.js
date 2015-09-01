angular.module('starter.controllers').controller('promocionesCtrl', promocionesCtrl);

function promocionesCtrl($ionicModal, $scope, $window, $state, $cordovaSQLite) {

  $scope.promociones = null;

  $ionicModal.fromTemplateUrl('js/promociones/templates/detallePromocion.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modalDetalle = modal;
  });

  $scope.closeDetalle = function () {
    $scope.modalDetalle.hide();
  };

  $scope.showDetalle = function (item) {
    $scope.promocionesDetalle = item;
    $scope.modalDetalle.show();
  };



  $scope.promociones = [
    { idPromocion: '1',
      nombre: 'cerveza',
      valor: '200000',
      descuento: '20000',
      fecha: '24/07/2009'
    },
    { idPromocion: '2',
      nombre: 'papas',
      valor: '200000',
      descuento: '20000',
      fecha: '24/07/2009'
    }

  ];

}
