angular.module('starter.controllers').
              controller('principalCtrl', function ($ionicModal, $scope, $window, $state, $location,$cordovaSQLite) {
  $scope.principal = {};
  $scope.principal.title="Bienvenidos "


    $scope.comprarProducto = function (item) {
      $window.localStorage['selectedClient'] = JSON.stringify(item);
      $state.go("app.promocionView", { "id":  item.id});
    };


    $scope.allImages = [
    {
      id:'1',
      src: 'img/PONDS.jpg',
      nombre:"cremaPonds",
      precio:"1000"
    },
    {
      id:'2',
      src: 'img/LUX.jpg',
      nombre:"jabonLux",
      precio:"1000"
    },
    {
       id:'3',
       src: 'img/FRUCO.jpg',
       nombre:"fruco",
       precio:"1000"
    },
      {
        id:'4',
        src:'img/DOVE.jpg',
        nombre:"fruco",
        precio:"1000"
    },
    {
        id:'5',
        src: 'img/FAB.jpg',
        nombre:"fruco",
        precio:"1000"
    },
    {
       id:'6',
       src: 'img/DOVE JABON.jpg',
       nombre:"fruco",
       precio:"1000"
    }
  ];

    $scope.zoomMin = 1;


})

.controller('PromocionViewCtrl',promocionViewCtrl)

function promocionViewCtrl ($scope, $stateParams,$state) {

  $scope.producto = {};
  $scope.producto.id=$stateParams.id;

  $scope.cancelar = function () {
    $state.go('app.principal');
  };




 }

