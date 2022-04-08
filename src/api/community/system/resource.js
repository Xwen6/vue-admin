import request from '@/utils/request'

export default{
    list(type){
        return request({
            url: `/loginService/Resource/list?type=${type}`,
            method: 'get'
          })
    },

    getById(id){
        return request({
            url: `/loginService/Resource/getById/${id}`,
            method: 'get'
          })
    },

    add(Resource){
        return request({
            url: `/loginService/Resource/add`,
            method: 'post',
            data: Resource
        })
    },

    update(Resource){
        return request({
            url: `/loginService/Resource/update`,
            method: 'post',
            data: Resource
        })
    },

    delete(id){
        return request({
            url: `/loginService/Resource/delete/${id}`,
            method: 'delete'
          })
    },
  
    

}

