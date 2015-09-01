angular.module('starter.controllers')

        .controller('adminVentasCtrl', function ($scope, $window, $state, $cordovaSQLite) {
            $scope.venta = {
                id: null,
                valor: null,
                fechaVenta: null,
                valorFinal: null,
                descPais: null,
                descCliente: null,
                descVendedor: null,
                periodoPago: null,
                interes: null,
                numeroCoutas: null,
                valorCouta: null,
                descRuta: null,
                estado: null
            };

            $scope.operacionValorFinal = function () {
                if ($scope.venta.valor !== undefined && $scope.venta.interes !== undefined) {
                    var valor = parseInt($scope.venta.valor);
                    var interes = parseInt($scope.venta.interes);
                    $scope.venta.valorFinal = null;
                    $scope.venta.valorFinal = (valor + (valor * (interes / 100)));
                    $scope.valorCuota();
                } else if ($scope.venta.valor !== undefined) {
                    $scope.venta.valorFinal = null;
                    $scope.venta.valorFinal = $scope.venta.valor;
                }
            };

            $scope.guardarInformacion = function () {
                //Guardo venta
                $state.go('app.infoCliente');
            };
            $scope.cancelar = function () {
                $state.go('app.infoCliente');
            };

            $scope.crearNuevoCliente = function () {
                $window.localStorage['infoClienteCall'] = "app.ventas";
                $window.localStorage['selectedClient'] = null;
                $state.go('app.infoCliente2');
            };

            $scope.valorCuota = function () {
                if ($scope.venta.valorFinal !== undefined && $scope.venta.numeroCoutas !== undefined) {
                    var valorFinal = parseInt($scope.venta.valorFinal);
                    var numeroCuotas = parseInt($scope.venta.numeroCoutas);
                    $scope.venta.valorCouta = null;
                    $scope.venta.valorCouta = (valorFinal / numeroCuotas);
                }
            };

            $scope.guardarVenta = function () {
                $scope.venta.fechaVenta = new Date();
                if ($scope.venta.descPais !== null && $scope.venta.descCliente !== null &&
                        $scope.venta.fechaVenta !== null && $scope.venta.periodoPago !== null &&
                        $scope.venta.valor !== null && $scope.venta.interes !== null &&
                        $scope.venta.numeroCoutas !== null) {
                    var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                    //Creo el venta
                    var query = "INSERT INTO TGDV_VENTA \n\
                                (NMVALOR_NETO, FEVENTA, NMDEUDA, DSCLIENTE, NMINTERES, NMTIPO_PAGO, \n\
                                NMRUTA, NMCUOTAS, SNESTADO, MOBILE) \n\
                                VALUES \n\
                                (?,?,?,?,?,?,?,?,?,?)";
                    var valores = [
                        $scope.venta.valor, $scope.venta.fechaVenta,
                        $scope.venta.valorFinal, $scope.venta.descCliente.id,
                        $scope.venta.interes, $scope.venta.periodoPago,
                        $scope.venta.descRuta.id, $scope.venta.numeroCoutas,
                        1, "S"
                    ];

                    $cordovaSQLite.execute(db, query, valores).then(function (res) {
                        console.log("INSERT VENTA ID -> " + res.insertId);
                        var descripcion = "Se creó una venta desde el dispoditivo móvil" 
                                + " con valor " + $scope.venta.valor + ", con interés " + $scope.venta.interes
                                + ", a el cliente con id " + $scope.venta.descCliente.id;
                        var modulo = "Venta";
                        $scope.registroHistorial(descripcion, modulo);
                        $state.go('app.infoCliente');
                    }, function (err) {
                        console.error(err);
                    });

                    alert("Guardar !!!");
                } else {
                    alert("Por favor ingrese los campos obligatorios");
                }
            };
            
            $scope.registroHistorial = function (descripcion, modulo) {
                var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                //Creo el movimiento
                var query = "INSERT INTO TGDV_HISTORIAL_ACCIONES \n\
                            (FEACCION, DSUSUARIO, NMRUTA, DSDESCRIPCION, DSMODULO) \n\
                            VALUES \n\
                            (?,?,?,?,?)";

                var valores = [
                    new Date(),
                    parseInt($window.localStorage['userLoginId']),
                    parseInt($window.localStorage['rutaId']),
                    descripcion,
                    modulo
                ];
                $cordovaSQLite.execute(db, query, valores).then(function (res) {
                }, function (err) {
                    console.error(err);
                });
            };
            
        });