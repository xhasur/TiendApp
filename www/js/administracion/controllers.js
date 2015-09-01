angular.module('starter.controllers')

  .controller('AppCtrl', function ($scope, $window, $ionicModal, $timeout, $cordovaSQLite) {



    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('administracion/rutas.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalRutas = modal;
    });

    $scope.closeRutas = function () {
      $scope.modalRutas.hide();
    };

    $scope.showRutas = function () {
      $scope.modalRutas.show();
    };

    $scope.rutas = [
      {title: 'Ruta 001', id: 1},
      {title: 'Ruta 002', id: 2},
      {title: 'Ruta 003', id: 3},
      {title: 'Ruta 004', id: 4},
      {title: 'Ruta 005', id: 5},
      {title: 'Ruta 006', id: 6}
    ];

    $scope.seleccionRuta = function (ruta) {
      alert(JSON.stringify(ruta));
      $scope.modalRutas.hide();
    };

    $scope.valorClave = {
      clave: null
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.sincronizarInformacionUp = function () {
      sincronizarClientes();
      sincronizarVentasPagos();
    };

    //Sincronizo los clientes
    sincronizarClientes = function () {
      var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
      var querySelect = "SELECT * FROM TGDV_CLIENTE";
      $cordovaSQLite.execute(db, querySelect).then(function (res) {
        if (!(res.rows.length > 0)) {
          //Sincronizo los clientes
        }
      }, function (err) {
        console.error(err);
      });
    };

    //Sincronizo las ventas y los pagos de la misma
    sincronizarVentasPagos = function () {
      var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
      var querySelectVentas = "SELECT * FROM TGDV_VENTA";
      $cordovaSQLite.execute(db, querySelectVentas).then(function (resVentas) {
        if (resVentas.rows.length > 0) {
          for (i = 0; i < resVentas.rows.length; i++) {
            //Consulto los pagos asociados a la venta
            var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
            var querySelectPagos = "SELECT * FROM TGDV_HISTORIAL_CUENTA WHERE NMVENTA = ?";
            $cordovaSQLite.execute(db, querySelectVentas).then(function (resPagos) {
              if (resPagos.rows.length > 0) {
                //Sincronizo ventas
                for (i = 0; i < resPagos.rows.length; i++) {
                  resPagos.rows.item(i).nmventa = idVentaRetornoServer;
                  //Sincronizo pagos de venta
                }
              }
            }, function (err) {
              console.error(err);
            });
          }
        }
      }, function (err) {
        console.error(err);
      });

      eliminarPagosVentas();

      //Consulto las ventas nuevamente
      var ventas = [];
      for (i = 0; i < ventas.length; i++) {
        insertarVenta(ventas.get(i));
      }
    };

    //Elimino pagos y ventas después de sincronizar
    eliminarPagosVentas = function () {
      var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
      var queryDelete = "DELETE FROM TGDV_HISTORIAL_CUENTA";
      $cordovaSQLite.execute(db, queryDelete).then(function (res) {
        queryDelete = "DELETE FROM TGDV_VENTA";
        $cordovaSQLite.execute(db, queryDelete).then(function (res) {
        }, function (err) {
          console.error(err);
        });
      }, function (err) {
        console.error(err);
      });
    };

    insertarVenta = function (itemVenta) {
      var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
      var query = "INSERT INTO TGDV_VENTA \n\
                                (NMVALOR_NETO, FEVENTA, NMDEUDA, DSCLIENTE, NMINTERES, NMTIPO_PAGO, \n\
                                NMRUTA, NMCUOTAS, SNESTADO, MOBILE) \n\
                                VALUES \n\
                                (?,?,?,?,?,?,?,?,?,?)";
      var valores = [
        itemVenta.nmvalor, itemVenta.feVenta,
        itemVenta.nmdueda, itemVenta.dscliente.dsidentificacion,
        itemVenta.nminteres, itemVenta.nmTipoPago,
        itemVenta.nmruta.cdruta, itemVenta.nmcuotas,
        itemVenta.nmruta.snestado, "N"
      ];
      $cordovaSQLite.execute(db, query, valores).then(function (res) {
      }, function (err) {
        console.error(err);
      });
    };


  })

  .controller('PlaylistsCtrl', function ($ionicModal, $scope, $window, $state, $cordovaSQLite) {

    $scope.ventaSelected = null;
    // Creo el modal para solicitar la clave del usuario
    $ionicModal.fromTemplateUrl('administracion/solicitudClave.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalClave = modal;
    });

    $scope.closeSolicitudClave = function () {
      $scope.modalClave.hide();
    };

    $scope.showSolicitudClave = function (item) {
      $scope.ventaSelected = item;
      $scope.modalClave.show();
    };

    $scope.validarClave = function () {
      if ($scope.valorClave.clave !== null && $scope.valorClave.clave !== undefined) {
        $scope.closeSolicitudClave();
        $scope.selectionItemListClient($scope.ventaSelected);
      } else {
        alert("Para poder ver la información debe de ingresar una clave");
      }
    };

    $scope.playlists = [
      {idVenta: '123452', nombre: 'Reggae', alias: 'Chill', dsidentificacion: 1, valorDeuda: '200000', valorCuota: '20000', cuotaRestantes: '5', colorDeuda: 'red', colorCuota: 'red'},
      {idVenta: '123452', nombre: 'Chill', alias: 'Chill', dsidentificacion: 2, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'green'},
      {nombre: 'Dubstep', dsidentificacion: 3, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Indie', dsidentificacion: 4, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Indie', dsidentificacion: 4, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Indie', dsidentificacion: 4, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Indie', dsidentificacion: 4, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Indie', dsidentificacion: 4, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Rap', dsidentificacion: 5, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'red'},
      {nombre: 'Cowbell', dsidentificacion: 6, valorDeuda: '200000', valorCuota: '20000', colorDeuda: 'red', colorCuota: 'green'}
    ];

    $scope.selectionItemListClient = function (item) {
      var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
      var query = "SELECT * FROM TGDV_CLIENTE WHERE DSIDENTIFICACION = ?";
      $cordovaSQLite.execute(db, query, item.dscliente).then(function (res) {
        if (res.rows.length > 0) {
          $window.localStorage['infoClienteCall'] = "app.infoCliente";
          $window.localStorage['selectedClient'] = JSON.stringify(res.rows.item(0));
        }
      }, function (err) {
        console.error(err);
      });
    };

    $scope.crearNuevoPago = function (item) {
      $window.localStorage['selectedClient'] = JSON.stringify(item);
      $state.go('app.pagosVentas');
    };
  })


//app
  .controller('principalCtrl', function ($ionicModal, $scope, $window, $state, $cordovaSQLite) {
    $scope.principal = {};
    $scope.principal.title="Bienvenidos "

  })

;
