angular.module("starter.controllers").controller("indicadoresCtrl", indicadoresCtrl);

function indicadoresCtrl($scope, $state,$ionicPopup,loginService) {

  $scope.graph = {};
  $scope.graphB = {}; //Grafica barras
  $scope.graphB.data = [
    [16, 15, 20, 12, 16, 12,  8, 5, 7,  3,  7, 8],//COMPRAS
    [ 8,  9,  4, 12,  8, 12, 14, 9, 34, 5, 78, 5] //VENTAS
  ];
  $scope.graphB.labels = ['ENE', 'FEB', 'MAR', 'ABR', 'MAYO', 'JUn','JUL', 'AGOSTO','SEP','OCT','NOV','DIC'];    // Add labels for the X-axis
  $scope.graphB.series = ['COMPRAS', 'VENTAS'];

  $scope.graph.labels = ['ENE', 'FEB', 'MAR', 'ABR', 'MAYO', 'JUn','JUL', 'AGOSTO','SEP','OCT','NOV','DIC'];
  $scope.graph.series = ['COMPRAS', 'VENTAS'];
  $scope.graph.data = $scope.graphB.data;



  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

}

