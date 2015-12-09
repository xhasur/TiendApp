angular.module('starter.controllers').controller('promocionesCtrl', promocionesCtrl);

function promocionesCtrl($ionicModal, $scope, $window, $state, $cordovaSQLite,AllResource,$http) {

  $scope.promociones = null;

  $http({
    method: 'GET',
    url: "http://192.168.1.14:8084/TiendaVirtual/api/maestro/proveedores",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .success(function (data) {
      alert("xxxxxxxxxxxxxx"+data);
      alert("Success xxx" + JSON.stringify(data));
    })
    .error(function (data) {
      //$ionicLoading.hide();
      alert("Error : " + JSON.stringify(data));
    });



  $scope.listarPromociones = function () {
    AllResource.promociones.listar(
      function(data)
      {
        if(data !=null){
          //$scope.promociones=data.listPromociones;
          alert("yyyyyyyyyyy"+data);
          alert("Success yyyy" + JSON.stringify(data));
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

  $scope.listarPromociones();

  //

  //var urlServices="http://192.168.2.226:8084/GestionVentas/";
  /*
  var data = "client_id=123&client_secret=123&grant_type=password&username=123&password=123";
  $http({
    method: 'POST',
    url: urlServices + "oauth/token",
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .success(function (data) {
    alert("token"+data);
    })
    .error(function (data) {
      $ionicLoading.hide();
      alert("Ocurrió un error tratando de inscribir el dispositivo: " + JSON.stringify(data));
    });
  //

*/
  /*
  var tokenAcess = 'Bearer ' + "162c922a-1e4c-4e13-874e-fcbd7185589b";
  $http({
    method: 'GET',
    url: urlServices + "api/utilsService/getMovimientosRutas/" + "1",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': tokenAcess
    }
  })
    .success(function (data) {
      alert("despues del token"+data);
    })
    .error(function (data) {
      //$ionicLoading.hide();
      alert("Error cnosultando los gastos e ingresos: " + JSON.stringify(data));
    });

*/
 // $scope.listarPromociones();





 // prueba();
  function prueba(){
    alert("listare promociones 1");
    AllResource.promocionesProv.listar(
      function(data)
      {
        alert("sali del servicio 1");
        if(data !=null){
          alert("sali del servicio 2");
          $scope.promociones=data.listPromociones;
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
  }



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

}
