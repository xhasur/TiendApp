angular.module('starter.controllers').controller('pedidosCtrl', pedidosCtrl);

function pedidosCtrl($ionicModal, $scope, $window, $state, $cordovaSQLite,AllResource) {

  $scope.pedido={};


  $scope.listarProveedores = function () {
    AllResource.proveedores.listar(
      function(data)
      {
        if(data !=null){
          $scope.pedido.proveedores=data;
          $scope.pedido.proveedores.unshift({cdproveedor:"",dsproveedor:"--SELECCIONE--"});
        }
      },
      function (err) {
        if(err.status=='500'){
          console.log('Error de servicio');
          alert('Error de servicio');
        }
        else{
          console.log('Error: ' + data);
          alert(data);
        }
      });

  };

  $scope.listarProveedores();

  $scope.cambioProveedor = function ($prov) {



  }


}
