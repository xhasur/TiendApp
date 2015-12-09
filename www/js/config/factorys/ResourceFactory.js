angular.module('starter.controllers').factory('AllResource',function($resource){
    var factory = {
        proveedores:$resource('http://192.168.1.14:8084/TiendaVirtual/api/maestro/proveedores',{},{
        listar:{
          method: 'GET',
          isArray:true
        }
      })
    };
    return factory;
});
