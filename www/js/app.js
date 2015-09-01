var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

  .run(function ($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      //Configuración de la base de datos
      var db = $cordovaSQLite.openDB("DBMACROVENTAS.db");
//                Creo tabla de clientes
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_CLIENTE" ("DSIDENTIFICACION" TEXT PRIMARY KEY NOT NULL, "DSNOMBRE" TEXT NOT NULL, "DSAPELLIDO" TEXT NOT NULL, "SNESTADO" INTEGER NOT NULL, "DSALIAS" TEXT NOT NULL, "DSREFERENCIA" TEXT, "DSDIRECCION" TEXT NOT NULL, "DSBARRIO" TEXT NOT NULL, "DSCIUDAD" TEXT NOT NULL, "DSTELEFONO" TEXT NOT NULL, "DSCELULAR" TEXT NOT NULL, "DSCORREO" TEXT, "NMRUTA" INTEGER REFERENCES "TGDV_RUTAS" ("CDRUTA"))');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_DESCRIPCION_MOVIMIENTO" ("CDDESCRIPCION" INTEGER PRIMARY KEY NOT NULL, "NMTIPO_MOVIMIENTO" INTEGER NOT NULL REFERENCES "TGDV_TIPO_MOVIMIENTO" ("CD_MOVIMIENTO"), "DSDESCRIPCION" TEXT NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_HISTORIAL_ACCIONES" ("FEACCION" TIMESTAMP NOT NULL, "DSUSUARIO" TEXT NOT NULL REFERENCES "TGDV_USUARIO" ("DSIDENTIFICACION"), "NMRUTA" INTEGER NOT NULL REFERENCES "TGDV_RUTAS" ("CDRUTA"), "DSDESCRIPCION" TEXT NOT NULL, "DSMODULO" TEXT NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_HISTORIAL_CUENTA" ("CDACTIVIDAD_MOVIL" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "CDACTIVIDAD" INTEGER, "NMVENTA" INTEGER REFERENCES "TGDV_VENTA" ("CDVENTA"), "NMVALOR_PAGO" DOUBLE NOT NULL, "NMVALOR_DEUDA" DOUBLE NOT NULL, "FEREGISTRO_PAGO" TIMESTAMP NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_MOVIL_REGISTRER" ("CDMOVIL" INT(11) PRIMARY KEY, "DSMOVIL_ID" TEXT NOT NULL, "DSCLAVE" TEXT NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_MOVIMIENTO_RUTA" ("CDMOVIMIENTO_MOVIL" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "NMDESC_MOVMIENTO" INTEGER NOT NULL REFERENCES "TGDV_DESCRIPCION_MOVIMIENTO" ("CDDESCRIPCION"), "DSCOMENTARIOS" TEXT NOT NULL, "NMVALOR" DOUBLE NOT NULL, "NMRUTA" INTEGER NOT NULL REFERENCES "TGDV_RUTAS" ("CDRUTA"), "FEREGISTRO" TIMESTAMP NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_RUTAS" ("CDRUTA" INTEGER PRIMARY KEY NOT NULL, "DSNOMBRE" TEXT NOT NULL, "NMLIMITE_GASTOS" DOUBLE, "NMLIMITE_VENTAS" DOUBLE, "SNESTADORUTA" TEXT, "FEAPERTURA" TIMESTAMP, "DSUSUARIO" TEXT NOT NULL REFERENCES "TGDV_USUARIO" ("DSIDENTIFICACION"))');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_TIPO_MOVIMIENTO" ("CD_MOVIMIENTO" INTEGER PRIMARY KEY NOT NULL, "DSNOMBRE" TEXT NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_USUARIO" ("DSIDENTIFICACION" TEXT PRIMARY KEY NOT NULL UNIQUE, "DSNOMBRE" TEXT NOT NULL, "DSAPELLIDO" TEXT NOT NULL, "DSMOVIL" TEXT REFERENCES "TGDV_MOVIL_REGISTRER" ("CDMOVIL"), "DSCORREO" TEXT NOT NULL)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "TGDV_VENTA" ("CDVENTA_MOVIL" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "NMVALOR_NETO" DOUBLE NOT NULL, "FEVENTA" DATE NOT NULL, "NMDEUDA" DOUBLE NOT NULL, "DSCLIENTE" TEXT REFERENCES "TGDV_CLIENTE" ("DSIDENTIFICACION"), "NMINTERES" DOUBLE NOT NULL, "NMTIPO_PAGO" INTEGER NOT NULL, "NMRUTA" INTEGER NOT NULL REFERENCES "TGDV_RUTAS" ("CDRUTA"), "NMCUOTAS" INTEGER NOT NULL, "SNESTADO" TEXT NOT NULL, "MOBILE" TEXT)');

    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'js/login/templates/login.html',
        controller: 'loginCtrl'
      })
      .state('app.principal', {
        url: '/principal',
        views: {
          'menuContent': {
            templateUrl: 'templates/principal.html',
            controller: 'principalCtrl'
          }
        }
      })
      .state('app.promociones', {
        url: '/promociones',
        views: {
          'menuContent': {
            templateUrl: 'js/promociones/templates/promociones.html',
            controller: 'promocionesCtrl'
          }
        }
      })
      .state('app.ingresoPedidos', {
        url: '/ingresoPedidos',
        views: {
          'menuContent': {
            templateUrl: 'js/pedidos/templates/pedidos.html',
            controller: 'pedidosCtrl'
          }
        }
      })
      .state('app.verPedidos', {
        url: '/verPedidos',
        views: {
          'menuContent': {
            templateUrl: 'js/pedidos/templates/consultaPedidos.html',
            controller: 'pedidosCtrl'
          }
        }
      })
    ;
    $urlRouterProvider.otherwise('/login');

  });


