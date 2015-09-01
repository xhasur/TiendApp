angular.module('starter.controllers')

        .controller('infoBienvenidaCtrl', function ($scope) {
            var fechaActual = new Date();
            var hora = fechaActual.getHours();
            var minutos = fechaActual.getMinutes();
            var segundos = fechaActual.getSeconds();
            $scope.fechaActualSistema = fechaActual.toISOString().slice(0, 10).replace(/-/g, "/") + " " + hora + ":" + minutos + ":" + segundos;
        })

