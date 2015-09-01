angular.module('starter.controllers')

        .controller('asociarDispositivoCtrl', function ($ionicModal, $scope, $http, $cordovaSQLite, $window) {

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
                //Consulto todas las rutas
                var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                var query = "SELECT * TGDV_RUTAS";
                $cordovaSQLite.execute(db, query).then(function (res) {
                    if (res.rows.length > 0) {
                        for (i = 0; i < res.rows.length; i++) {
                            $scope.rutas.push(res.rows.item(i));
                        }
                        $scope.showRutas();
                        $scope.closeSolicitudClave();
                    }
                }, function (err) {
                    console.error(err);
                });
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
                $window.localStorage['rutaId'] = ruta.id;
//                alert(JSON.stringify(ruta));
                $scope.sincronizarInformacionDown();
                $scope.modalRutas.hide();
            };

            //Bajo toda la información del servidor con respecto al usuario
            $scope.sincronizarInformacionDown = function () {
                var rutas = [];
                var clientes = [];
                var ventas = [];
                //Verifico si las rutas existen y las guardo
                for (i = 0; i < rutas.length; i++) {
                    verificarRutas(rutas.get(i));
                }
                for (i = 0; i < clientes.length; i++) {
                    verificarClientes(clientes.get(i));
                }
                for (i = 0; i < ventas.length; i++) {
                    insertarVenta(ventas.get(i));
                }
            };

            verificarRutas = function (itemRuta) {
                var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                var querySelect = "SELECT * FROM TGDV_RUTAS WHERE CDRUTA = ?";
                $cordovaSQLite.execute(db, querySelect, itemRuta.cdruta).then(function (res) {
                    if (res.rows.length > 0) {
                        var query = "UPDATE TGDV_RUTAS SET \n\
                                    NMLIMITE_GASTOS = ?, NMLIMITE_VENTAS = ?, \n\
                                    SNESTADORUTA = ?, FEAPERTURA = ? WHERE CDRUTA = ?";
                        var valores = [
                            itemRuta.nmlimiteGastos,
                            itemRuta.nmlimiteVentas,
                            itemRuta.snestadoRuta,
                            itemRuta.feApertura,
                            itemRuta.cdruta
                        ];
                        $cordovaSQLite.execute(db, query, valores).then(function (res) {
                        }, function (err) {
                            console.error(err);
                        });
                    } else {
                        var query = "INSERT INTO TGDV_RUTAS \n\
                                    (CDRUTA, DSNOMBRE, NMLIMITE_GASTOS, NMLIMITE_VENTAS, \n\
                                    SNESTADORUTA, FEAPERTURA, DSUSUARIO)";
                        var valores = [
                            itemRuta.cdruta,
                            itemRuta.dsnombre,
                            itemRuta.nmlimiteGastos,
                            itemRuta.nmlimiteVentas,
                            itemRuta.snestadoRuta,
                            itemRuta.feApertura,
                            parseInt($window.localStorage['userLoginId'])
                        ];
                        $cordovaSQLite.execute(db, query, valores).then(function (res) {
                        }, function (err) {
                            console.error(err);
                        });
                    }
                }, function (err) {
                    console.error(err);
                });
            };

            verificarClientes = function (itemCliente) {
                var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                var querySelect = "SELECT * FROM TGDV_CLIENTE WHERE DSIDENTIFICACION = ?";
                $cordovaSQLite.execute(db, querySelect, itemCliente.dsidentificacion).then(function (res) {
                    if (!(res.rows.length > 0)) {
                        var query = "INSERT INTO TGDV_CLIENTE \n\
                                (DSIDENTIFICACION, DSNOMBRE, DSAPELLIDO, SNESTADO, DSALIAS, DSREFERENCIA, \n\
                                DSDIRECCION, DSBARRIO, DSCIUDAD, DSTELEFONO, DSCELULAR, DSCORREO, NMRUTA) \n\
                                VALUES \n\
                                (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        var valores = [
                            itemCliente.dsidentificacion, itemCliente.dsnombre,
                            itemCliente.dsapellidos,
                            itemCliente.dsapellido, itemCliente.snestado,
                            itemCliente.dsalias, itemCliente.dsreferencia,
                            itemCliente.dsdireccion, itemCliente.dsciudad,
                            itemCliente.dstelefono, itemCliente.dscelular,
                            itemCliente.dscorreo, itemCliente.nmruta.cdruta

                        ];
                        $cordovaSQLite.execute(db, query, valores).then(function (res) {
                        }, function (err) {
                            console.error(err);
                        });
                    }
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


            // Creo el modal para solicitar la clave del usuario
            $ionicModal.fromTemplateUrl('administracion/solicitudClave.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modalClave = modal;
            });

            $scope.closeSolicitudClave = function () {
                $scope.modalClave.hide();
            };

            $scope.showSolicitudClave = function () {
                $scope.modalClave.show();
            };

            $scope.validarClave = function () {
                if ($scope.valorClave.clave !== null && $scope.valorClave.clave !== undefined) {
                    var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                    //Valido si la clave es correcta
                    var query = "SELECT CDMOVIL TGDV_MOVIL_REGISTRER WHERE DSCLAVE = ?";
                    $cordovaSQLite.execute(db, query, [$scope.valorClave.clave]).then(function (res) {
                        if (res.rows.length > 0) {
                            $scope.showRutas();
                            $scope.closeSolicitudClave();
                        } else {
                            alert("La clave es incorrecta");
                        }
                    }, function (err) {
                        console.error(err);
                    });
                } else {
                    alert("Para poder ver la información debe de ingresar una clave");
                }
            };

            var data = "client_id=1234&client_secret=123&grant_type=password&username=123&password=123";
            var url = "http://localhost:8084/GestionVentas/oauth/token";

          /*  $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                    .success(function (data) {
                        alert("Success" + JSON.stringify(data));
                    })
                    .error(function (data) {
                        alert("Error" + JSON.stringify(data));
                    });
*/
            $scope.idDispositivo = "344354353SDFSDF213123DFSDF";
            $scope.visibleButtonDispositivo = true;

            $scope.mostrarRutas = function () {

            };
        });
