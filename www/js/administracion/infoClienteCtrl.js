angular.module('starter.controllers')

        .controller('infoClienteCtrl', function ($scope, $state, $window, $cordovaSQLite) {
            $scope.disableTextIdentificacion = false;
            $scope.cliente = {
                id: null,
                nombres: null,
                apellidos: null,
                descRuta: null,
                fechaBaja: null,
                estado: null,
                alias: null,
                referencia: null,
                direccion: null,
                barrio: null,
                ciudad: null,
                telefono: null,
                celular: null,
                correo: null
            };
            $scope.limpiarCampos = function () {
                $scope.cliente.id = null;
                $scope.cliente.nombres = null;
                $scope.cliente.apellidos = null;
                $scope.cliente.descRuta = null;
                $scope.cliente.fechaBaja = null;
                $scope.cliente.estado = null;
                $scope.cliente.alias = null;
                $scope.cliente.referencia = null;
                $scope.cliente.direccion = null;
                $scope.cliente.barrio = null;
                $scope.cliente.ciudad = null;
                $scope.cliente.telefono = null;
                $scope.cliente.celular = null;
                $scope.cliente.correo = null;
            };

            $scope.limpiarCampos();

            //Si hay un cliente seleccionado, seteo la información
            if ($window.localStorage['selectedClient'] !== null &&
                    $window.localStorage['selectedClient'] !== undefined &&
                    $window.localStorage['selectedClient'] !== "null") {
                var recordSelected = JSON.parse($window.localStorage['selectedClient']);

                $scope.disableTextIdentificacion = true;
                $scope.cliente.id = recordSelected.dsidentificacion;
                $scope.cliente.nombres = recordSelected.dsnombre;
                $scope.cliente.apellidos = recordSelected.dsapellido;
                $scope.cliente.descRuta = recordSelected.rutaListCopy;
                $scope.cliente.alias = recordSelected.dsalias;
                $scope.cliente.direccion = recordSelected.dsdireccion;
                $scope.cliente.barrio = recordSelected.dsbarrio;
                $scope.cliente.ciudad = recordSelected.dsciudad;
                $scope.cliente.ciudad = recordSelected.dsbarrio;
                $scope.cliente.telefono = recordSelected.dstelefono;
                $scope.cliente.celular = recordSelected.dscelular;
                $scope.cliente.correo = recordSelected.dscorreo;
                $scope.cliente.referencia = recordSelected.dsreferencia;
                $scope.cliente.fechaBaja = recordSelected.febaja;
                if (recordSelected.snestado) {
                    $scope.cliente.estado = {id: '1', nombre: 'Activo'};
                } else {
                    $scope.cliente.estado = {id: '0', nombre: 'Inactivo'};
                }

            }

            $scope.guardarInformacion = function () {
                //Guardo información cliente
                var sectionCall = $window.localStorage['infoClienteCall'];
                $window.localStorage['selectedClient'] = null;
                $state.go(sectionCall);
            };
            $scope.cancelar = function () {
                var sectionCall = $window.localStorage['infoClienteCall'];
                $window.localStorage['selectedClient'] = null;
                $state.go(sectionCall);
            };

            $scope.guardarCliente = function (formulario) {
                if ($scope.cliente.id !== null && $scope.cliente.nombres !== null &&
                        $scope.cliente.apellidos !== null && $scope.cliente.direccion !== null &&
                        $scope.cliente.barrio !== null && $scope.cliente.ciudad !== null &&
                        $scope.cliente.telefono !== null && $scope.cliente.celular !== null &&
                        $scope.cliente.correo !== null && $scope.cliente.estado !== null &&
                        $scope.cliente.descRuta !== null && $scope.cliente.alias) {
                    //Verifico si el cliente existe
                    var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
                    var querySelect = "SELECT DSIDENTIFICACION FROM TGDV_CLIENTE WHERE DSIDENTIFICACION = ?";
                    $cordovaSQLite.execute(db, querySelect, [$scope.cliente.id]).then(function (res) {
                        if (res.rows.length > 0) {
                            //Actualizo el cliente
                            var query = "UPDATE TGDV_CLIENTE SET \n\
                                DSNOMBRE = ?, DSAPELLIDO = ?, SNESTADO = ?, DSALIAS = ?, DSREFERENCIA = ?, \n\
                                DSDIRECCION = ?, DSBARRIO = ?, DSCIUDAD = ?, DSTELEFONO = ?, \n\
                                DSCELULAR = ?, DSCORREO = ?, NMRUTA = ? \n\
                                WHERE DSIDENTIFICACION = ?";
                            var valores = [
                                $scope.cliente.nombres, $scope.cliente.apellidos,
                                $scope.cliente.estado, $scope.cliente.alias,
                                $scope.cliente.referencia, $scope.cliente.direccion,
                                $scope.cliente.barrio, $scope.cliente.ciudad,
                                $scope.cliente.telefono, $scope.cliente.celular,
                                $scope.cliente.correo, $scope.cliente.descRuta.id,
                                $scope.cliente.id

                            ];
                            $cordovaSQLite.execute(db, query, valores).then(function (res) {
                                console.log("UPDATE CLIENTE ID -> " + res.insertId);
                            }, function (err) {
                                console.error(err);
                            });
                        } else {
                            //Creo el cliente
                            var query = "INSERT INTO TGDV_CLIENTE \n\
                                (DSIDENTIFICACION, DSNOMBRE, DSAPELLIDO, SNESTADO, DSALIAS, DSREFERENCIA, \n\
                                DSDIRECCION, DSBARRIO, DSCIUDAD, DSTELEFONO, DSCELULAR, DSCORREO, NMRUTA) \n\
                                VALUES \n\
                                (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                            var valores = [
                                $scope.cliente.id, $scope.cliente.nombres,
                                $scope.cliente.apellidos,
                                $scope.cliente.estado, $scope.cliente.alias,
                                $scope.cliente.referencia, $scope.cliente.direccion,
                                $scope.cliente.barrio, $scope.cliente.ciudad,
                                $scope.cliente.telefono, $scope.cliente.celular,
                                $scope.cliente.correo, $scope.cliente.descRuta.id

                            ];
                            $cordovaSQLite.execute(db, query, valores).then(function (res) {
                                console.log("INSERT CLIENTE ID -> " + res.insertId);
                            }, function (err) {
                                console.error(err);
                            });
                        }
                    }, function (err) {
                        console.error(err);
                    });


                } else {
                    alert('Por favor ingrese los campos obligatorios');
                }
            };
            

        });


