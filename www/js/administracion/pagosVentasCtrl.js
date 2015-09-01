angular.module('starter.controllers')

        .controller('pagosVentasCtrl', function ($scope, $window, $state, $cordovaSQLite) {

            $scope.historialCuenta = {
                id: null,
                idServer: null,
                idVenta: null,
                valorPago: null,
                cuotas: null,
                numeroCuotasTotales: null,
                valorDeuda: null,
                descVendedor: null,
                descCliente: null,
                fechaRegistro: null,
                historialCuentaPK: null,
                valorPagoAnterior: null
            };

            $scope.guardarInformacion = function () {
                if ($scope.historialCuenta.valorPago !== null && $scope.historialCuenta &&
                        $scope.historialCuenta.cuotas) {
                    $scope.historialCuenta.fechaRegistro = new Date();
                    var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                    if ($scope.historialCuenta.id === null) {
                        //Creo el venta
                        var query = "INSERT INTO TGDV_HISTORIAL_CUENTA \n\
                                (CDACTIVIDAD, NMVENTA, NMVALOR_PAGO, NMVALOR_DEUDA, FEREGISTRO_PAGO ) \n\
                                VALUES \n\
                                (?,?,?,?,?)";
                        var valores = [
                            null, $scope.historialCuenta.idVenta, $scope.historialCuenta.valorPago,
                            $scope.historialCuenta.valorDeuda, $scope.historialCuenta.fechaRegistro
                        ];
                        $cordovaSQLite.execute(db, query, valores).then(function (res) {
                            console.log("INSERT PAGO VENTA ID -> " + res.insertId);
                            var descripcion = "Se creó un historial de pago de la venta " + $scope.historialCuenta.idVenta
                                    + " con valor " + $scope.historialCuenta.valorPago;
                            var modulo = "Registro pago";
                            $scope.registroHistorial(descripcion, modulo);
                        }, function (err) {
                            console.error(err);
                        });
                    } else {
                        //Actualizo el historial de pago
                        var query = "UPDATE TGDV_HISTORIAL_CUENTA SET \n\
                                CDACTIVIDAD = ?, NMVALOR_PAGO = ?, NMVALOR_DEUDA = ?, FEREGISTRO_PAGO = ? \n\
                                WHERE CDACTIVIDAD_MOVIL = ?";
                        var valores = [
                            $scope.historialCuenta.idServer,
                            $scope.historialCuenta.valorPago, $scope.historialCuenta.valorDeuda, 
                            $scope.historialCuenta.fechaRegistro, $scope.historialCuenta.id
                        ];
                        $cordovaSQLite.execute(db, query, valores).then(function (res) {
                            console.log("INSERT PAGO VENTA ID -> " + res.insertId);
                            var descripcion = "Se actualizó un historial de pago de la venta " + $scope.historialCuenta.idVenta
                                    + " con valor " + $scope.historialCuenta.valorPago;
                            var modulo = "Registro pago";
                            $scope.registroHistorial(descripcion, modulo);
                        }, function (err) {
                            console.error(err);
                        });
                    }
                }
                $state.go('app.infoCliente');
            };
            $scope.cancelar = function () {
                $state.go('app.infoCliente');
            };


            $scope.cambiarNumeroCuotas = function () {
                var recordSelected = JSON.parse($window.localStorage['selectedClient']);
                if (recordSelected !== null && recordSelected !== undefined &&
                        recordSelected !== "null") {
                    var valorNeto = parseInt(recordSelected.venta.nmvalorNeto);
                    var valorDeuda = valorNeto + (valorNeto * (parseInt(recordSelected.venta.nminteres) / 100));
                    var numCuotasTotales = parseInt(recordSelected.venta.nmcuotas);

                    var valorPago = (valorDeuda / numCuotasTotales);
                    var numCuotas = parseInt($scope.historialCuenta.cuotas);

                    valorPago = (valorPago * numCuotas);
                    $scope.historialCuenta.valorPago = valorPago;
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
                    //console.log("INSERT VENTA ID -> " + res.insertId);
                }, function (err) {
                    console.error(err);
                });
            };

        });