angular.module('starter.controllers')

        .controller('adminGastosIngresosCtrl', function ($scope, $window, $state, $cordovaSQLite) {

            $scope.dataTipoMov = [
                {id: '1', nombre: 'Gasto'},
                {id: '1', nombre: 'Ingreso'},
                {id: '1', nombre: 'Retiro'}
            ];



console.log("aca");

            $scope.movimientosDinero = {
                id: null,
                tipo: null,
                descripcion: null,
                comentarios: null,
                descRuta: null,
                valor: null,
                feRegistro: null
            };

            $scope.guardarInformacion = function () {
                if ($scope.movimientosDinero.descripcion !== null && $scope.movimientosDinero.descripcion !== null
                        && $scope.movimientosDinero.valor !== null) {
                    $scope.movimientosDinero.feRegistro = new Date();
                    var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                    //Creo el movimiento
                    var query = "INSERT INTO TGDV_MOVIMIENTO_RUTA \n\
                                (NMDESC_MOVMIENTO, DSCOMENTARIOS, NMVALOR, NMRUTA, FEREGISTRO) \n\
                                VALUES \n\
                                (?,?,?,?,?)";
                    var valores = [
                        $scope.movimientosDinero.descripcion, $scope.movimientosDinero.comentarios,
                        $scope.movimientosDinero.valor, $scope.movimientosDinero.descRuta.id,
                        $scope.movimientosDinero.feRegistro
                    ];
                    $cordovaSQLite.execute(db, query, valores).then(function (res) {
                        console.log("INSERT GASTO ID -> " + res.insertId);
                        var descripcion = "Se creó un " + $scope.movimientosDinero.tipo.descripcion 
                                + " con valor " + $scope.movimientosDinero.valor;
                        var modulo = "Gasto/Ingreso/Retiro";
                        $scope.registroHistorial(descripcion, modulo);
                        $state.go('app.infoCliente');
                    }, function (err) {
                        console.error(err);
                    });
                } else {
                    alert("Por favor ingrese los campos obligatorios");
                }
            };
            $scope.cancelar = function () {
                $state.go('app.infoCliente');
            };

            $scope.cambiarTipoMovimiento = function () {
                alert("Cambio de movimiento: " + $scope.movimientosDinero.tipo);
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